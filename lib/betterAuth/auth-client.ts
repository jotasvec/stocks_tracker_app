import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    // baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL 
    // Usually inferred automatically in Next.js
})

export const { useSession, signIn, signOut } = authClient;