import nodemailer from "nodemailer";
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./templates";

if (!process.env.NODEMAILER_FROM_EMAIL) {
    throw new Error('NODEMAILER_FROM_EMAIL environment variable is required');
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.GOOGLE_APP_PASS,        
    }
})

export const sendWelcomeEmail = async ({ email, name, intro }: WelcomeEmailData) =>{
    const htmlTempleate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);
    
    const mailOptions = {
        from: `"Signalist" <${process.env.NODEMAILER_FROM_EMAIL}>`,
        to: email,
        subject: "Welcome to Signalist",
        text: 'Thanks for joining to Signalist',
        html: htmlTempleate,
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Unable to send the email, ', error)
    }

}

export const sendDailySummaryEmails = async (
        { email, date, newsContent }:{email: string; date: string; newsContent: string} 
    ) : Promise<void> => {
    const htmlTempleate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);
    
    const mailOptions = {
        from: `"Signalist news" <${process.env.NODEMAILER_FROM_EMAIL}>`,
        to: email,
        subject: `Market News Summary today ${date}`,
        text: `Today's markets news summary from Signlist`,
        html: htmlTempleate,
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Unable to send the email, ', error)
    }

}
