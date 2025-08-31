import { supabase } from "./supabaseClient";

export async function signInWithGoogle() {
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
                prompt: 'consent' // Forces Google to show account selection
            }
        },
    });
    
    if (error) {
        console.error("❌ Google sign-in error:", error.message);
        return null;
    }
    
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("❌ Sign-out error:", error.message);
    } else {
        // console.log("✅ Successfully signed out");
    }
}