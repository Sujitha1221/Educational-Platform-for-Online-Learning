import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";

const ViewStudentEnrollments = () => {
  const [students, setStudents] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const storedData = localStorage.getItem("auth");
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
  
      const response = await axios.get(
        "http://localhost:8090/v1/users/all-students",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const studentUsers = response.data.students;
  
      const studentEnrollmentsPromises = studentUsers.map(async (student) => {
        const enrollmentsResponse = await axios.get(
          `http://localhost:8080/v1/enrollments/viewCourse/${student._id}`
        );
        const enrollments = enrollmentsResponse.data.enrollments;
  
        let enrolledCourses;
        if (enrollments && enrollments.length === 0) {
          enrolledCourses = [{ name: "Student has not enrolled in any courses", completionPercentage: "" }];
        } else if (enrollments) {
          const courseInfoPromises = enrollments.map(async (enrollment) => {
            const courseResponse = await axios.get(
              `http://localhost:8070/v1/courses/${enrollment.course}`
            );
            const course = courseResponse.data;
            const progressResponse = await axios.post(
              "http://localhost:8080/v1/progress/viewProgress",
              {
                userId: student._id,
                courseId: enrollment.course,
              }
            );
            const completionPercentage = progressResponse.data.percentage;
            return {
              name: course.name,
              completionPercentage: completionPercentage,
            };
          });
          enrolledCourses = await Promise.all(courseInfoPromises);
        } else {
          enrolledCourses = [{ name: "Student has not enrolled in any courses", completionPercentage: "" }];
        }
  
        return {
          studentId: student._id,
          name: student.fullName,
          enrolledCourses: enrolledCourses,
        };
      });
      const studentEnrollments = await Promise.all(studentEnrollmentsPromises);
      setStudents(studentEnrollments);
    } catch (error) {
      console.error("Error fetching student enrollments: ", error.message);
    }
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
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold mb-5">Student Enrollments</h1>
      </div>
      <div className="flex justify-center">
        <InputBase
          type="search"
          id="default-search"
          onChange={(e) => setSearchKey(e.target.value)}
          className="block mt-3 p-3 mb-5 pl-8 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search"
          value={searchKey}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
        />
      </div>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Student ID</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Enrolled Courses</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students
              .filter((key) => {
                const name = (key.name || "").toLowerCase();
                return name.includes(searchKey.toLowerCase());
              })
              .map((student) => (
                <StyledTableRow key={student.studentId}>
                  <StyledTableCell>{student.studentId}</StyledTableCell>
                  <StyledTableCell>{student.name}</StyledTableCell>
                  <StyledTableCell>
                    {student.enrolledCourses.map((course, index) => (
                      <div key={index}>
                        {course.name} - {course.completionPercentage}%
                      </div>
                    ))}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ViewStudentEnrollments;
