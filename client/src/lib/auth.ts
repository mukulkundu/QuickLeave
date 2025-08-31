import { supabase } from "./supabaseClient";

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            //   redirectTo: window.location.origin, // redirects back to your app
            redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT
        },
    });

    if (error) {
        console.error("Google sign-in error:", error.message);
        return null;
    }
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Sign-out error:", error.message);
    }
}
