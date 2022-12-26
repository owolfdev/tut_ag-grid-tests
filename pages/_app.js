import React, { useState } from "react";
import "../styles/globals.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabase}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
      </SessionContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default MyApp;
