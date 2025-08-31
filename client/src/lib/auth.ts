import { supabase } from "./supabaseClient";


export async function signInWithGoogle() {
    // console.log('clicked on sigin btn');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            //   redirectTo: window.location.origin, // redirects back to your app
            // redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT
            redirectTo: `${window.location.origin}/auth/callback`, 
        },
    });

    if (error) {
        console.error("Google sign-in error:", error.message);
        return null;
    }
    // else{
    //     console.log("successfully loggedin");
    //     console.log(data);
        
        
    // }
    return data;
}

export async function signOut() {
    // console.log('signout started');
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Sign-out error:", error.message);
    }
    // else{
    //     console.log("successfully loggedout");
    // }
}
