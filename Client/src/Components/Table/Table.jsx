import React, { useEffect, useMemo, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { allAdmins } from "../API/API";

const DataTable = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsData = await allAdmins();
      setAdmins(adminsData);
    };
    fetchAdmins();
  }, []);

  const filteredUsersData = useMemo(
    () => admins.filter((user) => user.email !== "superadmin@gmail.com"),
    []
  );

  return (
    <Table striped bordered hover style={{ margin: "auto", width: "600px" }}>
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
                id="custom-switch"
                defaultChecked={admin.status === false ? true : false}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default DataTable;
