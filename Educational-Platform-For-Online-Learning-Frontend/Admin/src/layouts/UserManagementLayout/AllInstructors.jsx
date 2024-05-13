import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import ConfirmationModal from "../CommonLayout/ConfirmationModal";
import { toast } from "react-toastify";

const AllInstructors = () => {
  const [Instructors, setAllInstructors] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const navigate = useNavigate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [instructorIdToDelete, setInstructorIdToDelete] = useState(null);

  useEffect(() => {
    function getAllCourses() {
      const userData = JSON.parse(localStorage.getItem("auth"));
      const token = userData.token;
      axios
        .get("http://localhost:8090/v1/users/all-instructors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAllInstructors(res.data.instructors);
        })
        .catch((err) => {
          console.error("Error : " + err.message);
        });
    }
    getAllCourses();
  }, []);

  const addNewInstructor = () => {
    navigate("/add-instructors");
  };

  const deleteInstructor = async (id) => {
    setShowConfirmationModal(true);
    setInstructorIdToDelete(id);
  };

  const confirmDelete = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("auth"));
      const token = userData.token;
      const { data } = await axios.delete(
        `http://localhost:8090/v1/users/${instructorIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data?.success) {
        toast.success("Instructor deleted successfully.");
        setAllInstructors(
          Instructors.filter(
            (instructor) => instructor._id !== instructorIdToDelete
          )
        );
        setShowConfirmationModal(false);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while deleting the instructor.");
      }
    }
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#1d93bc",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Instructors</h1>
        <button
          onClick={addNewInstructor}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Instructor
        </button>
      </div>
      <input
        type="search"
        id="default-search"
        onChange={(e) => setSearchKey(e.target.value)}
        className="block w-full mt-3 p-4 pl-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Search"
      />

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Full Name</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Contact No</StyledTableCell>
              <StyledTableCell align="right">Actions</StyledTableCell>{" "}
            </TableRow>
          </TableHead>
          <TableBody>
            {Instructors.filter((key) => {
              const fullName = (key.fullName || "").toLowerCase();
              const email = (key.email || "").toLowerCase();
              const contact = (key.contact || "").toString().toLowerCase();
              return (
                fullName.includes(searchKey.toLowerCase()) ||
                email.includes(searchKey.toLowerCase()) ||
                contact.includes(searchKey.toLowerCase())
              );
            }).map((Admin) => (
              <StyledTableRow key={Admin._id}>
                <StyledTableCell>{Admin.fullName}</StyledTableCell>
                <StyledTableCell align="right">{Admin.email}</StyledTableCell>
                <StyledTableCell align="right">{Admin.contact}</StyledTableCell>
                <StyledTableCell align="right">
                  <button
                    onClick={() => deleteInstructor(Admin._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Delete
                  </button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showConfirmationModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this instructor? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default AllInstructors;
