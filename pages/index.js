import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  return (
    <div>
      {!session && (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}

      <div>
        {session && (
          <div>
            <p>You are signed in</p>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
