import React, { useEffect } from "react";
import { useRouter } from "next/router";

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  useSession,
  useSupabaseClient,
  useUser,
} from "@supabase/auth-helpers-react";

function Event() {
  const router = useRouter();
  const { filmId } = router.query;
  const supabase = useSupabaseClient();

  useEffect(() => {
    console.log("id", filmId);
  }, [filmId]);

  const {
    data: film,
    status: filmStatus,
    refetch: refetchFilm,
  } = useQuery({
    queryKey: ["film"],
    queryFn: getFilm,
    enabled: !!filmId,
  });

  const {
    data: profile,
    status: profileStatus,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: !!film,
  });

  useEffect(() => {
    console.log("profile:", profile);
  }, [profile]);

  async function getProfile() {
    console.log("data?.filmmaker", film?.filmmaker);
    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select()
        .eq("id", film?.filmmaker)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log("data from supabase getProfile:", data);
        return data;
      } else {
        console.log("no data");
        return data;
      }
    } catch (error) {
      console.log("error from get profile", error);
    } finally {
      //console.log("finally");
    }
  }

  async function getFilm() {
    try {
      let { data, error, status } = await supabase
        .from("films_duplicate")
        .select()
        .eq("id", filmId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log("data from supabase getFilm:", data);
        return data;
      } else {
        console.log("no data");
        return data;
      }
    } catch (error) {
      console.log("error from get profile", error);
    } finally {
      //console.log("finally");
    }
  }

  const handleBounce = () => {
    router.push("/basic-grid-supabase");
  };
  return (
    <div>
      <div>Event: {filmId}</div>
      <br />
      <button onClick={handleBounce}>Home</button>
      <br />
      <br />
      <div>
        <strong>Id: </strong>
        {filmId}
      </div>
      <div>
        <strong>Title:</strong> {film?.title}
      </div>
      <div>
        <strong>Event:</strong> {film?.event}
      </div>
      <div>
        <strong>Filmmaker:</strong> {profile?.username}
      </div>
      <div>
        <strong>Filmmkaker Origin:</strong> {profile?.origin}
      </div>
      <div>
        <strong>Link to Film:</strong> {film?.link}
      </div>
      <div>
        <strong>Synopsis:</strong> {film?.synopsis}
      </div>
      <div>
        <strong>Credits:</strong> {film?.credits}
      </div>
      <div></div>
      <div>
        <strong>Awards ({film?.awards?.length}):</strong>{" "}
        {film?.awards?.map((award) => {
          return (
            <div key={award.award}>
              {award.event}: {award.award}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Event;

// accepted: false;
// awards: null;
// created_at: "2022-12-25T05:16:13.605573+00:00";
// credits: "";
// dateOfCompletion: "2021-04-02";
// event: "Pakistan 2023";
// filmmaker: "3cb45868-087e-4178-8200-f75ebd3fd5d7";
// genre: null;
// id: 293;
// link: "https://drive.google.com/file/d/1kbHlU7nr0CLkXtHmjmGSpL12jWGvfpdl/view?usp=sharing";
// rejected: true;
// synopsis: "Children should pass a long way to reach schools in Talesh city mountains.";
// title: "Film 6 Boy";
