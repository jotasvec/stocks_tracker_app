import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendDailySummaryEmails, sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { getNews } from "../actions/finnhub.actions";
import { formatDateToday } from "../utils";

export const sendSignUpEmail = inngest.createFunction(
    { id: 'sign-up-email' },
    { event: 'app/user.created' },
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Invenstments : ${event.data.InvenstmentsGoals}
            - Risk Tolerance : ${event.data.riskTolerance}
            - Preferred Industry : ${event.data.preferredIndustry}
        `
        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)
        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents:[{
                    role: 'user',
                    parts: [{ text: prompt }] 
                }]
            }
        });

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) || 'Thanks for joining Signalist. '

            const { data: { name, email } } = event;

            // Email logic
            return await sendWelcomeEmail({
                email, name, intro: introText

            });

        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
    { id: 'daily-news-summary' },
    [
        { event: 'app/send.daily.news' },
        { cron: 'TZ=Europe/Paris 0 12 * * *' },
    ],
    async ({ step }) => {
        // Step 1: Get all users
        const users = await step.run('get-all-users', getAllUsersForNewsEmail)

        if(!users || users.length === 0) return { success: false, message: 'No users found for new emails.' }

        // Step 2: Fetch personalized news
        const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: User; articles: MarketNewsArticle[] }> = [];
            for (const user of users as User[]){
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    // Enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    // If still empty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });

                } catch (error) {
                    console.error('daily-news: error, preparing user news', user.id, error);
                    perUser.push({ user, articles: [] });

                }
            }
            return perUser;
        })

        // Step 3: Summarize the news via AI
        const userNewsSummaries: { user: User; newsContent: string | null }[] = [];
        
        if (!results) return { success: false, message: "Failed to generate results" };
        
        for (const { user, articles } of results){
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));
                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                    body: {
                        contents:[{
                            role: 'user',
                            parts: [{ text: prompt }] 
                        }]
                    }
                });
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'
            
            userNewsSummaries.push({ user, newsContent })
            
            } catch (error) {
                console.error('daily-news: error, preparing user news', user.id, error);
                userNewsSummaries.push({ user, newsContent: null })
            }
        }
        
        
        // Step 4: Send emails
        await step.run('send-news-emails', async () => {
            await Promise.all(
                userNewsSummaries.map( async ({ user, newsContent}) => {
                    if(!newsContent) return false;
                    // Email logic
                    return await sendDailySummaryEmails({
                        email: user.email, 
                        date: formatDateToday, 
                        newsContent: newsContent
                    });
                })
            )

        })

        return {
            success: true,
            message: 'Daily news summary emails sent successfully'
        }
    }
)