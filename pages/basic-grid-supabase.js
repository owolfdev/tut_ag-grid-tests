import React, { useState, useEffect } from "react";
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
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AnimateShowChangeCellRenderer } from "ag-grid-community";
//import Router from "next/router";
import { useRouter } from "next/router";

function App() {
  const [films, setFilms] = useState([]);
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const CheckboxComponentForAccepted = (params) => {
    // console.log("params for", params.data.id, ":", params);
    console.log("films", films);
    return (
      <div>
        <input
          type="checkbox"
          id={params.data.id}
          name="accepted"
          onChange={handleCheckAccepted}
          checked={params.data.accepted}
        />
      </div>
    );
  };

  const CheckboxComponentForRejected = (params) => {
    // console.log("params for", params.data.id, ":", params);
    console.log("films", films);
    return (
      <div>
        <input
          type="checkbox"
          id={params.data.id}
          name="accepted"
          onChange={handleCheckRejected}
          checked={params.data.rejected}
        />
      </div>
    );
  };

  const ComponentForWinner = (params) => {
    // console.log("params for", params.data.id, ":", params);
    console.log("data", params.data);
    return <div>{params.data.awards && params.data.awards.length}</div>;
  };

  const ComponentForId = (params) => {
    // console.log("params for", params.data.id, ":", params);

    return (
      <button id={params.data.id} onClick={handleEditFilm}>
        Edit: {params.data.id}
      </button>
    );
  };

  const defaultColumns1 = [
    { field: "title", checkboxSelection: true },
    { field: "id" },
    { field: "accepted", cellRenderer: CheckboxComponentForAccepted },
    { field: "rejected", cellRenderer: CheckboxComponentForRejected },
  ];

  const defaultColumns2 = [
    { field: "title", checkboxSelection: true },
    { field: "id" },
  ];

  const titleColumn = { field: "title", checkboxSelection: true };
  const id = { field: "id", cellRenderer: ComponentForId };
  const acceptedColumn = {
    field: "accepted",
    cellRenderer: CheckboxComponentForAccepted,
  };
  const rejectedColumn = {
    field: "rejected",
    cellRenderer: CheckboxComponentForRejected,
  };
  const awardsColumn = { field: "awards", cellRenderer: ComponentForWinner };

  const [columnDefs, setColumnDefs] = useState([
    titleColumn,
    id,
    acceptedColumn,
    rejectedColumn,
    awardsColumn,
  ]);

  //ag-grid settings

  const defaultColDef = {
    resizable: true,
    editable: true,
    filter: true,
    filterParams: {
      buttons: ["reset"],
    },
    sortable: true,
  };

  const handleCellValueChanged = (event) => {
    const { data } = event;
  };
  //

  const { data, status, refetch } = useQuery({
    queryKey: ["films"],
    queryFn: getFilms,
  });

  useEffect(() => {
    console.log("data:", data);
    data && setFilms([...data]);
  }, [data]);

  useEffect(() => {
    //console.log("films:", films);
  }, [films]);

  async function getFilms() {
    try {
      let { data, error, status } = await supabase
        .from("films_duplicate")
        .select()
        .order("id", { ascending: false });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        //console.log("data from supabase getFilms:", data, data.length);

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

  const handleCheckAccepted = (event) => {
    console.log(event.target.checked);
    console.log(event.target.id);
    supabase
      .from("films_duplicate")
      .update({ accepted: event.target.checked, rejected: false })
      .eq("id", event.target.id)
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  const handleCheckRejected = (event) => {
    console.log(event.target.checked);
    console.log(event.target.id);
    supabase
      .from("films_duplicate")
      .update({
        rejected: event.target.checked,
        accepted: false,
      })
      .eq("id", event.target.id)
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  const handleShowColumn = (event) => {
    console.log(event.target.checked);
    if (event.target.checked) {
      setColumnDefs([...columnDefs, { field: event.target.name }]);
    } else {
      setColumnDefs(
        columnDefs.filter((column) => column.field !== event.target.name)
      );
    }
  };

  const handleCellClicked = (event) => {
    console.log("event", event);
    //router.push(`/film/${event.data.id}`);
  };

  const handleEditFilm = (event) => {
    console.log("event", event.target.id);
    router.push(`/film/${event.target.id}`);
  };

  return (
    <div>
      <div>
        <input
          type="checkbox"
          id="showIdColumn"
          name="id"
          onChange={handleShowColumn}
          checked={columnDefs.some((column) => column.field === "id")}
        />
        <label htmlFor="showIdColumn">Show id column</label>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={handleCellValueChanged}
          onCellClicked={handleCellClicked}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default App;
