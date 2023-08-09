import React, { useState } from "react";
import { flexRender } from "@tanstack/react-table";
import up from "../../assets/up.png";
import down from "../../assets/down.png";
import { Table } from "react-bootstrap";

const MessageListing = ({ allMessages, data }) => {
  const [gridApi, setGridApi] = useState();
  return (
    <>
      <h5 className="t-messages">
        <b>Total Messages ({data.length})</b>
      </h5>
      <Table
        striped
        bordered
        hover
        variant="light"
        className=" overflow-auto  table-css mb-5 w-100 text-black bg-white"
        cellSpacing={0}
      >
        <thead>
          {allMessages.getHeaderGroups()?.map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers?.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={`${
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanFilter() ? (
                        <div>
                          {/* <Filter column={header.column} reactTable={reactTable} /> */}
                        </div>
                      ) : null}
                      {data.length > 0
                        ? {
                            asc: <img src={up} alt="Up Errow" width={10} />,
                            desc: (
                              <img src={down} alt="Down Errow" width={10} />
                            ),
                          }[header.column.getIsSorted() ?? ""] || null
                        : ""}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {data.length > 0 ? (
            allMessages.getRowModel().rows?.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells()?.map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                <span style={{ textAlign: "center" }}>No Data Found</span>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
};

export default MessageListing;
