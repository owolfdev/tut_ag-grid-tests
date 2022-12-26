import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Home() {
  const gridRef = useRef();

  const [rowData, setRowData] = useState([
    { make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxster", price: 72000 },
  ]);

  const [columnDefs, setColumnDefs] = useState([
    { field: "make", checkboxSelection: true },
    { field: "model" },
    { field: "price" },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  const cellClickedListener = useCallback((e) => {
    console.log("cellClicked", e);
  });

  useEffect(() => {
    console.log("rowData", rowData);
  }, [rowData]);

  useEffect(() => {
    console.log("columnDefs", columnDefs);
  }, [columnDefs]);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  const handleClearSelection = () => {
    gridRef.current.api.deselectAll();
  };

  //for loop to get the selected rows
  const handleGetSelectedRows = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => node.make + " " + node.model)
      .join(", ");
    console.log(`Selected nodes: ${selectedDataStringPresentation}`);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400 }}>
      <button onClick={handleClearSelection}>Clear Selection</button>
      <button onClick={handleGetSelectedRows}>Log Selected Rows</button>
      <AgGridReact
        ref={gridRef}
        onCellClicked={cellClickedListener}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        //animateRows={true}
      ></AgGridReact>
    </div>
  );
}
