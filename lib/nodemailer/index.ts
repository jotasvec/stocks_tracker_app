import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./templates";

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
        from: `"Signalist" <cureteylor1@gmail.com>`,
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

