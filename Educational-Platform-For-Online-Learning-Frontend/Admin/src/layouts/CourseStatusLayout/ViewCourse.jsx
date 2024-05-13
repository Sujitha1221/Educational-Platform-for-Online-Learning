/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";

const ViewCourse = () => {
  const [Courses, setAllCourses] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    function getAllCourses() {
      axios
        .get("http://localhost:8070/v1/courses")
        .then((res) => {
          setAllCourses(res.data);
        })
        .catch((err) => {
          console.error("Error : " + err.message);
        });
    }
    getAllCourses();
  }, []);

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
    <>
      <div className="flex justify-center">
      <h1 className="text-4xl font-bold mb-8">All Courses</h1>
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
              <StyledTableCell>Code</StyledTableCell>
              <StyledTableCell align="right">Name</StyledTableCell>
              <StyledTableCell align="right">Description</StyledTableCell>
              <StyledTableCell align="right">Credits</StyledTableCell>
              <StyledTableCell align="right">Day</StyledTableCell>
              <StyledTableCell align="right">Start Time</StyledTableCell>
              <StyledTableCell align="right">End Time</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
              <StyledTableCell align="right"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Courses
              .filter((key) => {
                const code = (key.code || "").toLowerCase();
                const name = (key.name || "").toLowerCase();
                return (
                  code.includes(searchKey.toLowerCase()) ||
                  name.includes(searchKey.toLowerCase()) 
                );
              })
              .map((Course) => (
                <StyledTableRow key={Course._id}>
                  <StyledTableCell component="th" scope="row">
                    {Course.code}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {Course.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {Course.description}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {Course.credits}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {Course.day}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {Course.startTime}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {Course.endTime}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {Course.status}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Link
                      to={{
                        pathname: `/course-status/view-course-details/${Course._id}`,
                      }}
                    >
                      <button className="bg-transparent text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white font-semibold  py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                        <VisibilityIcon />
                      </button>
                    </Link>
                  </StyledTableCell>  
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ViewCourse;
