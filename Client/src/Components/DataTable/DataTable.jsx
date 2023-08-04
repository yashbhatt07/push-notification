import React, { useEffect, useMemo, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { allAdmins, login, updateStatus } from "../API/API";

const DataTable = ({ selectedAdmins, setSelectedAdmins }) => {
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
  useEffect(() => {
    const currentAdmin = async () => {
      const loginData = await login();
      setAdmins(loginData);
    };
    currentAdmin();
  }, [admins]);

  const filteredUsersData = useMemo(
    () => admins.filter((user) => user.email !== "superadmin@gmail.com"),
    [admins]
  );

  const handleToggleStatus = (
    id,
    currentStatus,
    selectedAdmins,
    setSelectedAdmins
  ) => {
    const adminToUpdate = admins.find((admin) => admin.id === id);

    if (adminToUpdate) {
      const updatedAdmin = {
        ...adminToUpdate,
        status: !currentStatus,
      };

      // Call the API to update the status in the JSON data.
      updateStatus(id, updatedAdmin)
        .then(() => {
          setAdmins((prevState) =>
            prevState.map((admin) =>
              admin.id === id ? { ...admin, status: !currentStatus } : admin
            )
          );

          // Update the selectedAdmins state based on the updated admin's status.
          if (!currentStatus) {
            setSelectedAdmins((prevSelectedAdmins) => [
              ...prevSelectedAdmins,
              id,
            ]);
          } else {
            setSelectedAdmins((prevSelectedAdmins) =>
              prevSelectedAdmins.filter((adminId) => adminId !== id)
            );
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <Form.Label className="text-white">
        <b>Send To</b>
      </Form.Label>
      <Table striped bordered hover style={{ margin: "30px auto" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Status</th>
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
                      admin.status,
                      selectedAdmins,
                      setSelectedAdmins
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default DataTable;
