import React, { useState, useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function Grid() {
  const gridRef = useRef(null);
  const [columnDefs, setColumnDefs] = useState([
    { field: "make", checkboxSelection: true },
    { field: "model" },
    { field: "price" },
  ]);

  const defaultColDef = {
    sortable: true,
    filter: true,
    editable: true,
  };

  //   const [rowData, setRowData] = useState([
  //     { make: "Toyota", model: "Celica", price: 35000 },
  //     { make: "Ford", model: "Mondeo", price: 32000 },
  //     { make: "Porsche", model: "Boxster", price: 72000 },
  //     { make: "BMW", model: "X5", price: 72000 },
  //   ]);

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/row-data.json")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));

    // return () => {
    //   cleanup;
    // };
  }, []);

  const handleButtonClick = () => {
    const selectedNodes = gridRef.current.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    const selectedDataStringPresentation = selectedData
      .map((node) => node.make + " " + node.model)
      .join(", ");
    console.log(`Selected nodes: ${selectedDataStringPresentation}`);
  };

  const handleChange = (e) => {
    //console.log("handleChange, value:", e.value);
    console.log("handleChange, data:", e.data);
    console.log("handleChange, row index:", e.rowIndex);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Get Selected Rows</button>
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          rowSelection="multiple"
          ref={gridRef}
          defaultColDef={defaultColDef}
          onCellValueChanged={handleChange}
        />
      </div>
    </div>
  );
}

export default Grid;
