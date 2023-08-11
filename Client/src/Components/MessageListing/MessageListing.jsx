import React, { useState } from "react";
import { flexRender } from "@tanstack/react-table";
import up from "../../assets/up.png";
import down from "../../assets/down.png";
import { Table } from "react-bootstrap";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
// import { DateRangePicker } from "react-date-range";
import moment from "moment";
// import { AdminColumnFilter } from "../AdminColumnFilter";
import Searching from "../Searching/Searching";
import SearchingAdmin from "../SearchingAdmin";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FilterColumns } from "../FilterColumns";
import MessagePagination from "../MessagePagination/MessagePagination";

const MessageListing = ({
  allMessages,
  data,
  messages,
  setMessages,
  TotalMessages,
  globalFilter,
  setGlobalFilter,
  columns,
}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  // const selectionRange = {
  //   startDate: startDate,
  //   endDate: endDate,
  //   key: "selection",
  // };

  const handleSelect = (date) => {
    console.log(
      "🚀 ~ file: MessageListing.jsx:37 ~ handleSelect ~ date:",
      date
    );
    const startMomentDate = moment(date.startDate);
    console.log(
      "🚀 ~ file: MessageListing.jsx:39 ~ handleSelect ~ startMomentDate:",
      startMomentDate
    );
    const endMomentDate = moment(date.endDate);

    const outputFormat = "MMMM Do YYYY";

    let startDateFormat = startMomentDate.format(outputFormat);

    let endDateFormat = endMomentDate.format(outputFormat);

    const filtered = TotalMessages.filter((msg) => {
      const messageData = msg.sentAt;
      console.log(
        "🚀 ~ file: MessageListing.jsx:50 ~ filtered ~ messageData:",
        messageData
      );

      return messageData >= startDateFormat && messageData <= endDateFormat;
    });

    setStartDate(date.startDate);
    setEndDate(date.endDate);
    setMessages(filtered);
  };

  return (
    <>
      <div>
        <h5 className="t-messages">
          <b>Total Messages ({data.length})</b>
        </h5>
        {/* <SearchingAdmin
          value={globalFilter ?? ""}
          placeholder="Search all columns"
          onChange={(value) => setGlobalFilter(String(value))}
          columns={columns}
          allMessages={allMessages}
        /> */}

        {/* <DateRangePicker ranges={[selectionRange]} onChange={handleSelect} /> */}
      </div>
      <div style={{ width: "100%", textAlign: "right", margin: "0 0 10px 0" }}>
        <DatePicker
          style={{ width: "140px" }}
          selected={startDate}
          onChange={(date) => handleSelect({ startDate: date, endDate })}
          selectsStart
          startDate={startDate}
          endDate={endDate}
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => handleSelect({ startDate, endDate: date })}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
        />
      </div>

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
                      {data.length > 0
                        ? {
                            asc: <img src={up} alt="Up Errow" width={12} />,
                            desc: (
                              <img src={down} alt="Down Errow" width={12} />
                            ),
                          }[header.column.getIsSorted() ?? ""] || null
                        : ""}
                      {(header.column.getCanFilter() &&
                        header.id === "title") ||
                      header.id === "description" ? (
                        <div>
                          <FilterColumns
                            column={header.column}
                            TotalAdmins={allMessages}
                          />
                        </div>
                      ) : null}
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
      <MessagePagination allMessages={allMessages} />
    </>
  );
};

export default MessageListing;
