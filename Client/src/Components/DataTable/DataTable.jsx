import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { allAdmins, updateStatus } from "../API/API";
import up from "../../assets/up.png";
import down from "../../assets/down.png";

import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Searching from "../Searching/Searching";
import { rankItem } from "@tanstack/match-sorter-utils";

const DataTable = () => {
  const columnHelper = createColumnHelper();

  const [admins, setAdmins] = useState([]);
  console.log("🚀 ~ file: DataTable.jsx:7 ~ DataTable ~ admins:", admins);
  localStorage.setItem("admins", JSON.stringify(admins));

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsData = await allAdmins();
      setAdmins(adminsData);
    };
    fetchAdmins();
  }, []);

  const filteredUsersData = useMemo(
    () => admins.filter((user) => user.email !== "superadmin@gmail.com"),
    [admins]
  );

  // const handleToggleStatus = (id, currentStatus) => {
  //   const adminToUpdate = admins.find((admin) => admin.id === id);

  //   if (adminToUpdate) {
  //     const updatedAdmin = {
  //       ...adminToUpdate,
  //       status: !currentStatus,
  //     };

  //     updateStatus(id, updatedAdmin)
  //       .then(() => {
  //         setAdmins((prevState) =>
  //           prevState.map((admin) =>
  //             admin.id === id ? { ...admin, status: !currentStatus } : admin
  //           )
  //         );
  //         const onLoginData = JSON.parse(localStorage.getItem(id + "_onLogin"));
  //         console.log(
  //           "🚀 ~ file: DataTable.jsx:63 ~ .then ~ onLoginData:",
  //           onLoginData
  //         );
  //         if (onLoginData) {
  //           onLoginData.status = !currentStatus;
  //           localStorage.setItem(id + "__onLogin", JSON.stringify(onLoginData));
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // };
  const data = useMemo(() => filteredUsersData, [filteredUsersData]);
  console.log("🚀 ~ file: Admin.jsx:187 ~ Admin ~ data:", data);

  const columns = [
    {
      header: "#",
      accessorKey: "id",
    },
    {
      header: "First Name",
      accessorKey: "firstname",
    },
    {
      header: "Last Name",
      accessorKey: "lastname",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Send To",
      accessorKey: "sendTo",
      enableSorting: false,
      ...columnHelper.accessor((row) => row.isVerified, {
        id: "sendto",
        cell: () => {
          const handleToggleStatus = (id, currentStatus) => {
            const adminToUpdate = admins.find((admin) => admin.id === id);

            if (adminToUpdate) {
              const updatedAdmin = {
                ...adminToUpdate,
                status: !currentStatus,
              };

              updateStatus(id, updatedAdmin)
                .then(() => {
                  setAdmins((prevState) =>
                    prevState.map((admin) =>
                      admin.id === id
                        ? { ...admin, status: !currentStatus }
                        : admin
                    )
                  );
                  const onLoginData = JSON.parse(
                    localStorage.getItem(id + "_onLogin")
                  );
                  console.log(
                    "🚀 ~ file: DataTable.jsx:63 ~ .then ~ onLoginData:",
                    onLoginData
                  );
                  if (onLoginData) {
                    onLoginData.status = !currentStatus;
                    localStorage.setItem(
                      id + "__onLogin",
                      JSON.stringify(onLoginData)
                    );
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          };
          return (
            <Form.Check
              type="switch"
              id={`custom-switch-`}
              checked={data.status}
              onChange={() =>
                handleToggleStatus(
                  data.id,
                  data.status
                  // selectedAdmins,
                  // setSelectedAdmins
                )
              }
            />
          );
        },
      }),
    },
    {
      header: "ACTIONS",
      accessorKey: "actions",
    },
  ];
  function fuzzyFilter(row, columnId, value, addMeta) {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank,
    });
    return itemRank.passed;
  }

  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const TotalAdmins = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugHeaders: true,
    debugColumns: false,
    debugTable: true,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
  });
  return (
    <>
      <Searching
        value={globalFilter ?? ""}
        onChange={(value) => setGlobalFilter(String(value))}
        placeholder="Search all columns"
        columns={columns}
        TotalAdmins={TotalAdmins}
      />
      <Form.Label className="text-white">
        <b>Send To</b>
      </Form.Label>
      <Table
        striped
        bordered
        hover
        variant="light"
        className=" overflow-auto  table-css mb-5 w-100 text-black bg-white"
        cellSpacing={0}
      >
        <thead>
          {TotalAdmins.getHeaderGroups()?.map((headerGroup) => (
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
            TotalAdmins.getRowModel().rows?.map((row) => (
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
      {/* <Table striped bordered hover style={{ margin: "30px auto" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsersData.map((admin, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{admin.firstname}</td>
              <td>{admin.lastname}</td>
              <td>{admin.email}</td>

              <td>
                <Form.Check
                  type="switch"
                  id={`custom-switch-${index}`}
                  checked={admin.status}
                  onChange={() =>
                    handleToggleStatus(
                      admin.id,
                      admin.status
                      // selectedAdmins,
                      // setSelectedAdmins
                    )
                  }
                />
              </td>
              <td>
                <Button type="button">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}
    </>
  );
};

export default DataTable;
