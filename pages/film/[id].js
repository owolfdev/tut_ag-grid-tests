import React, { useEffect } from "react";
import { useRouter } from "next/router";

function Event() {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    console.log("id", id);
  }, []);
  return <div>Event: {id}</div>;
}

export default Event;
