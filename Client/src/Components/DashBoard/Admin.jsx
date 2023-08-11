import { socket } from "./SuperAdmin";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EditById, getNotification, allAdmins } from "../API/API";
import profile from "../../assets/DummyProfile.webp";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { EditSchema } from "../Schema/Schema";
import NavBar from "../Navbar/NavBar";
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
  // flexRender,
} from "@tanstack/react-table";
import MessageListing from "../MessageListing/MessageListing";
import { EditModal } from "../EditModal";

const Admin = () => {
  // const columnHelper = createColumnHelper();

  const params = useParams();
  const current = JSON.parse(localStorage.getItem(params.id + "__onLogin"));
  console.log("🚀 ~ file: Admin.jsx:29 ~ Admin ~ current:", current);

  const [currentUser, setCurrentUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  console.log("🚀 ~ file: Admin.jsx:27 ~ Admin ~ currentUser:", currentUser);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(EditSchema),
    defaultValue: currentUser,
  });

  // const [editData, setEditData] = useState({
  //   firstName: "",
  //   lastNamee: "",
  //   email: "",
  // });
  // console.log("🚀 ~ file: Admin.jsx:34 ~ Admin ~ editData:", editData);

  const [showEditModal, setShowEditModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [TotalMessages, setTotalMessages] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [show, setShow] = useState(false);
  const closeHandler = () => {
    setShowEditModal(false);
    setCurrentUser(currentUser);
    // window.location.reload();
  };

  const showHandler = () => setShowEditModal(true);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setNotificationCount(0);
    setShow(true);
  };

  useEffect(() => {
    if (current) {
      setCurrentUser({
        firstName: current.firstname,
        lastName: current.lastname,
        email: current.email,
        id: current.id,
      });

      setValue("firstname", current.firstname);
      setValue("lastname", current.lastname);
      setValue("email", current.email);
    }
  }, [setValue]);
  console.log(currentUser);
  useEffect(() => {
    getNotification()
      .then((TotelData) => {
        console.log("🚀 ~ file: Admin.jsx:23 ~ .then ~ data:", TotelData);
        if (TotelData != undefined) {
          setMessages(TotelData);
          setTotalMessages(TotelData);
        }
      })
      .catch((e) => {
        console.log(e);
      });

    socket.on("receive_message", (data) => {
      let id = params.id;
      console.log(id);
      const onLogin = JSON.parse(localStorage.getItem(id + "__onLogin"));
      console.log("🚀 ~ file: Admin.jsx:87 ~ socket.on ~ onLogin:", onLogin);

      if (onLogin.status === true) {
        toast.success(`title:${data.title},message:${data.description}`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          theme: "light",
        });
      }

      setMessages((prevMessages) => [...prevMessages, data]);
      setTotalMessages((prevMessages) => [...prevMessages, data]);
      setNotificationCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [socket]);

  const submitHandler = (data, event) => {
    event.preventDefault();

    const userId = current.id;
    const updatedData = { ...current, ...data };
    console.log(
      "🚀 ~ file: Admin.jsx:119 ~ submitHandler ~ updatedData:",
      updatedData
    );

    allAdmins()
      .then((admin) => {
        console.log("🚀 ~ file: Admin.jsx:122 ~ .then ~ admin:", admin);
        const isEmailUnique = admin.every(
          (adminData) =>
            adminData.id === userId ||
            (adminData.email !== updatedData.email &&
              adminData.firstname !== updatedData.firstname &&
              adminData.lastname !== updatedData.lastname)
        );

        if (!isEmailUnique) {
          toast.error("something is already exists for another admin.", {
            position: "top-center",
            autoClose: 3000,
            closeOnClick: true,
            theme: "light",
          });
          return;
        }
        localStorage.setItem(
          params.id + "__onLogin",
          JSON.stringify(updatedData)
        );
        toast.success("You Data Is Updated", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          theme: "light",
        });

        EditById(userId, updatedData)
          .then((res) => {
            console.log("Updated data:", res);
          })
          .catch((err) => {
            console.error("Error updating data:", err);
          });
        closeHandler();
      })
      .catch((error) => {
        console.error("Error fetching admin data:", error);
      });
  };

  const data = useMemo(() => messages, [messages]);
  console.log("🚀 ~ file: Admin.jsx:187 ~ Admin ~ data:", data);

  const columns = [
    {
      header: "#",
      accessorKey: "id",
      id: "id",
    },
    {
      header: "TITLE",
      accessorKey: "title",
      id: "title",
    },
    {
      header: "DESCRIPTION",
      accessorKey: "description",
      id: "description",
    },
    {
      header: "AT",
      accessorKey: "sentAt",
      enableSorting: false,
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

  const allMessages = useReactTable({
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
      <NavBar
        showHandler={showHandler}
        notificationCount={notificationCount}
        handleShow={handleShow}
        profile={profile}
      />
      {/* <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav
            className="me-auto"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              flexDirection: "row",
            }}
          >
            {" "}
            <span>
              <i className="fa-solid fa-bell spacing" onClick={handleShow}>
                {notificationCount > 0 && (
                  <span className="notification-badge">
                    {notificationCount}
                  </span>
                )}
              </i>
            </span>
            <Link to="/logout" reloadDocument style={{ marginRight: "5px" }}>
              <Button className="btn-dark" style={{ margin: " 9px 0 0 0" }}>
                {" "}
                Logout
              </Button>
            </Link>
            <img src={profile} width={50} alt="profile" onClick={showHandler} />
          </Nav>
        </Container>
      </Navbar> */}
      {/* <h3 style={{ color: "white", marginTop: "20px" }}>
        {current.id === 1
          ? "Admin 1"
          : current.id === 2
          ? "Admin 2"
          : current.id === 3
          ? "Admin 3"
          : current.id === 4
          ? "Admin 4"
          : current.id === 5
          ? "Admin 5"
          : "Admin"}
      </h3> */}
      <MessageListing
        allMessages={allMessages}
        data={data}
        messages={messages}
        setMessages={setMessages}
        TotalMessages={TotalMessages}
        globalFilter={globalFilter}
        setGlobalFilter={setColumnFilters}
        columns={columns}
      />
      <ToastContainer />
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {messages.length > 0 ? (
            [...messages].reverse().map((message, index) => (
              <div key={index}>
                <strong>{`Title: ${message.title}`}</strong>
                <p>{`Message: ${message.description}`}</p>
              </div>
            ))
          ) : (
            <p>No messages</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* <Offcanvas show={showEditModal} onHide={closeHandler} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {current.id === 1
              ? "Admin 1"
              : current.id === 2
              ? "Admin 2"
              : current.id === 3
              ? "Admin 3"
              : current.id === 4
              ? "Admin 4"
              : current.id === 5
              ? "Admin 5"
              : "Admin"}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSubmit(submitHandler)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                {...register("firstname")}
              />
              <span className="text-danger"> {errors.firstname?.message}</span>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last name"
                {...register("lastname")}
              />
              <span className="text-danger"> {errors.lastname?.message}</span>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="email"
                {...register("email")}
              />
              <span className="text-danger"> {errors.email?.message}</span>
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
            <Button
              variant="primary"
              className="mx-2"
              type="button"
              onClick={closeHandler}
            >
              Cancel
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas> */}
      <EditModal
        showEditModal={showEditModal}
        closeHandler={closeHandler}
        handleSubmit={handleSubmit}
        submitHandler={submitHandler}
        register={register}
        errors={errors}
      />
    </>
  );
};

export default Admin;
