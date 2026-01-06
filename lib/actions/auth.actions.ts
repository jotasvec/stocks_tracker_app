'use server';

//import { redirect } from "next/navigation";
import { auth } from "../betterAuth/auth";
import { inngest } from "../inngest/client";
import { headers } from "next/headers";

export const signUpWithEmail = async (data: SignUpFormData) => {
    try {
        const response = await auth.api.signUpEmail({
            body: {
                email: data.email,
                password: data.password,
                name: data.fullName
            }
        });
        if(response){
            await inngest.send({
                name: 'app/user.created',
                data: {
                    email: data.email,
                    name: data.fullName,
                    country: data.country,
                    investmentGoals: data.investmentGoals,
                    riskTolerance: data.riskTolerance,
                    preferredIndustry: data.preferredIndustry,

                }
            })
        }


    } catch (e) {
        console.error('Sign Up failed :', e);
        return { success: false, error: 'Sign up failed' };
    }


}

export const signInWithEmail = async ({email, password}: SignInFormData) => {
    try {
        const response = await auth.api.signInEmail({ body: { email: email, password: password } })
        return { success: true, data: response }
    } catch (e) {
        console.error('Sign in failed :', e);
        return { success: false, error: 'Sign in failed' };
    }
}

export const signOut = async () =>{
    try {
        await auth.api.signOut({ headers: await headers()})
    } catch (e) {
        console.log('Sign Out failed', e)
        return { success: false, error: 'Sign out failed' }
    }
}