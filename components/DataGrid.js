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
  const [data, setData] = useState([]);
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const CheckboxComponentForAccepted = (params) => {
    // console.log("params for", params.data.id, ":", params);
    // console.log("films", films);
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
    //console.log("films", films);
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
    // console.log("data", params.data);
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

  const titleColumn = { field: "title", checkboxSelection: true };
  const idColumn = { field: "id", cellRenderer: ComponentForId };
  const acceptedColumn = {
    field: "accepted",
    cellRenderer: CheckboxComponentForAccepted,
  };
  const rejectedColumn = {
    field: "rejected",
    cellRenderer: CheckboxComponentForRejected,
  };
  const awardsColumn = {
    field: "awards",
    cellRenderer: ComponentForWinner,
  };
  const filmmakerColumn = {
    field: "filmmaker",
    headerName: "Filmmaker Id",
  };
  const nameColumn = { field: "name", headerName: "Filmmaker Name" };

  useEffect(() => {
    setDisplayedColumns(sortColumnDefs(columnDefs));
  }, []);

  const [columnDefs, setColumnDefs] = useState([
    titleColumn,
    idColumn,
    acceptedColumn,
    rejectedColumn,
    awardsColumn,
    filmmakerColumn,
    nameColumn,
  ]);

  const [displayedColumns, setDisplayedColumns] = useState([]);

  const sortColumnDefs = (columnDefs) => {
    return columnDefs.sort((a, b) => a.id - b.id);
  };

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

  const {
    data: filmsData,
    status: filmsStatus,
    refetch: filmsRefetch,
  } = useQuery({
    queryKey: ["films"],
    queryFn: getFilms,
  });

  const {
    data: profilesData,
    status: profilesStatus,
    refetch: profilesRefetch,
  } = useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
  });

  useEffect(() => {
    // console.log("data:", data);
    let filmAndProfileData = [];

    filmsData &&
      profilesData &&
      filmsData?.map((film) => {
        const profile = profilesData.filter((profile) => {
          return profile.id === film.filmmaker;
        });
        console.log("profile:", profile);
        const filmAndProfile = {
          ...film,
          name: profile[0].username,
          email: profile[0].email,
          origin: profile[0].origin,
          organization: profile[0].organization,
        };
        filmAndProfileData.push(filmAndProfile);
      });
    setData([...filmAndProfileData]);

    // filmsData &&
    //   filmsData?.map((film) => {
    //console.log("filmmaker:", film.filmmaker);
    // getProfileForFilm(film.filmmaker)
    //   .then((profile) => {
    //     //console.log("profile:", profile);
    //     const filmAndProfile = {
    //       ...film,
    //       name: profile[0].username,
    //       email: profile[0].email,
    //       origin: profile[0].origin,
    //       organization: profile[0].organization,
    //     };
    //     filmAndProfileData.push(filmAndProfile);
    //   })
    //   .then(() => {
    //     setData([...filmAndProfileData]);
    //   });
  }, [filmsData]);

  useEffect(() => {
    //console.log("films:", films);
    console.log("data:", data);
  }, [data]);

  useEffect(() => {
    console.log("filmsData", filmsData);
  }, [filmsData]);

  async function getFilms() {
    console.log("get Films!!!");
    try {
      let { data, error, status } = await supabase
        .from("films_duplicate")
        .select();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log("data from supabase getFilms:", data, data.length);
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

  async function getProfileForFilm(filmmaker_id) {
    try {
      let { data, error, status } = await supabase
        .from("profiles")
        .select()
        .eq("id", filmmaker_id);

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

  async function getProfiles() {
    try {
      let { data, error, status } = await supabase.from("profiles").select();

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
    // console.log(event.target.checked);
    // console.log(event.target.id);
    supabase
      .from("films_duplicate")
      .update({ accepted: event.target.checked, rejected: false })
      .eq("id", event.target.id)
      .then((response) => {
        // console.log("response", response);
      })
      .catch((error) => {
        // console.log("error", error);
      })
      .finally(() => {
        refetch();
      });
  };

  const handleCheckRejected = (event) => {
    // console.log(event.target.checked);
    // console.log(event.target.id);
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
    switch (event.target.id) {
      case "id":
        if (event.target.checked) {
          console.log("id checked");
          setDisplayedColumns(sortColumnDefs([...displayedColumns, idColumn]));
        } else {
          console.log("id unchecked");
          setDisplayedColumns(
            sortColumnDefs([
              ...displayedColumns.filter((column) => column.field !== "id"),
            ])
          );
        }
        break;
      case "accepted":
        if (event.target.checked) {
          console.log("accepted checked");
          setDisplayedColumns(
            sortColumnDefs([...displayedColumns, acceptedColumn])
          );
        } else {
          console.log("accepted unchecked");
          setDisplayedColumns(
            sortColumnDefs([
              ...displayedColumns.filter(
                (column) => column.field !== "accepted"
              ),
            ])
          );
        }
        break;
      case "rejected":
        if (event.target.checked) {
          console.log("rejected checked");
          setDisplayedColumns(
            sortColumnDefs([...displayedColumns, rejectedColumn])
          );
        } else {
          console.log("rejected unchecked");
          setDisplayedColumns(
            sortColumnDefs([
              ...displayedColumns.filter(
                (column) => column.field !== "rejected"
              ),
            ])
          );
        }
        break;
      case "awards":
        if (event.target.checked) {
          console.log("awards checked");
          setDisplayedColumns(
            sortColumnDefs([...displayedColumns, awardsColumn])
          );
        } else {
          console.log("rejected unchecked");
          setDisplayedColumns(
            sortColumnDefs([
              ...displayedColumns.filter((column) => column.field !== "awards"),
            ])
          );
        }
        break;
      case "filmmaker":
        if (event.target.checked) {
          setDisplayedColumns(
            sortColumnDefs([...displayedColumns, filmmakerColumn])
          );
        } else {
          setDisplayedColumns(
            sortColumnDefs([
              ...displayedColumns.filter(
                (column) => column.field !== "filmmaker"
              ),
            ])
          );
        }
        break;
      case "name":
        if (event.target.checked) {
          setDisplayedColumns(
            sortColumnDefs([...displayedColumns, nameColumn])
          );
        } else {
          setDisplayedColumns(
            sortColumnDefs([
              ...displayedColumns.filter((column) => column.field !== "name"),
            ])
          );
        }
        break;
      default:
        console.log("default");
    }
  };

  useEffect(() => {
    //console.log("columnDefs:", columnDefs);
  }, [columnDefs]);

  useEffect(() => {
    setColumnDefs([...displayedColumns]);
  }, [displayedColumns]);

  const handleCellClicked = (event) => {
    //console.log("event", event);
    //router.push(`/film/${event.data.id}`);
  };

  const handleEditFilm = (event) => {
    //console.log("event", event.target.id);
    router.push(`/film/${event.target.id}`);
  };

  const ColumnSwitches = () => {
    return (
      <div className="flex gap-3">
        <div>Show columns: </div>
        <div className="flex gap-1">
          {" "}
          <input
            type="checkbox"
            id="id"
            name="id"
            onChange={handleShowColumn}
            checked={columnDefs.some((column) => column.field === "id")}
          />
          <label htmlFor="id">id</label>
        </div>
        <div className="flex gap-1">
          <input
            type="checkbox"
            id="accepted"
            name="accepted"
            onChange={handleShowColumn}
            checked={columnDefs.some((column) => column.field === "accepted")}
          />
          <label htmlFor="accepted">accepted</label>
        </div>{" "}
        <div className="flex gap-1">
          <input
            type="checkbox"
            id="rejected"
            name="rejected"
            onChange={handleShowColumn}
            checked={columnDefs.some((column) => column.field === "rejected")}
          />
          <label htmlFor="rejected">rejected</label>
        </div>
        <div className="flex gap-1">
          <input
            type="checkbox"
            id="awards"
            name="awards"
            onChange={handleShowColumn}
            checked={columnDefs.some((column) => column.field === "awards")}
          />
          <label htmlFor="awards">awards</label>
        </div>
        <div className="flex gap-1">
          <input
            type="checkbox"
            id="filmmaker"
            name="filmmaker"
            onChange={handleShowColumn}
            checked={columnDefs.some((column) => column.field === "filmmaker")}
          />
          <label htmlFor="filmmaker">filmmaker id</label>
        </div>
        <div className="flex gap-1">
          <input
            type="checkbox"
            id="name"
            name="name"
            onChange={handleShowColumn}
            checked={columnDefs.some((column) => column.field === "name")}
          />
          <label htmlFor="name">filmmaker name</label>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="mb-4">
        <ColumnSwitches />
      </div>
      <div className="mb-4">{filmsData?.status && filmsData?.status}</div>
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={handleCellValueChanged}
          onCellClicked={handleCellClicked}
          pagination={true}
          paginationPageSize={100}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default App;
