import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import DataGrid from "../components/DataGrid";
import Stats from "../components/Stats";

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
            <div className="flex gap-3 mb-5 bg-gray-200">
              {" "}
              <p>You are signed in</p>
              <button
                className="border border-black  rounded px-2"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>{" "}
            <Stats />
            <DataGrid />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
