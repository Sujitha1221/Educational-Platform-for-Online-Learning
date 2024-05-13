import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ViewCourseEnrollments = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false); // State for unenroll modal visibility
  const role = JSON.parse(localStorage.getItem("auth")).user.role;
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    axios
      .get("http://localhost:8070/v1/courses")
      .then((res) => {
        setCourses(res.data);
      })
      .catch((err) => {
        console.error("Error fetching courses: ", err.message);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchAllEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchStudentDetails = async (studentId) => {
    try {
      const storedData = localStorage.getItem("auth");

      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;
      const studentResponse = await axios.get(
        `http://localhost:8090/v1/users/user/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(studentResponse);
      return studentResponse.data.user;
    } catch (error) {
      console.error("Error fetching student details: ", error.message);
      return null;
    }
  };


  const fetchAllEnrollments = async () => {
    try {
      const enrollmentsResponse = await axios.get(
        "http://localhost:8080/v1/enrollments"
      );
      const enrollments = enrollmentsResponse.data;

      if (Array.isArray(enrollments) && enrollments.length > 0) {
        const studentsPromises = enrollments.map(async (enrollment) => {
          const studentId = enrollment.student;
          const studentDetails = await fetchStudentDetails(studentId);
          return { ...studentDetails, enrollmentId: enrollment._id };
        });

        const students = await Promise.all(studentsPromises);
        setStudents(students);
      } else {
        setStudents([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all enrollments: ", error.message);
      setLoading(false);
    }
  };

  

  const fetchStudentEnrollments = async (courseId) => {
    try {
      const enrollmentsResponse = await axios.get(
        `http://localhost:8080/v1/enrollments/viewEnrollment/${courseId}`
      );
      const enrollments = enrollmentsResponse.data;

      if (Array.isArray(enrollments) && enrollments.length > 0) {
        const studentsPromises = enrollments.map(async (enrollment) => {
          const studentId = enrollment.student;
          const studentDetails = await fetchStudentDetails(studentId);
          return { ...studentDetails, enrollmentId: enrollment._id };
        });

        const students = await Promise.all(studentsPromises);
        setStudents(students);
      } else {
        // If there are no enrollments, set students state to an empty array
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching student enrollments: ", error.message);
    }
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
    if (event.target.value === "") {
      fetchAllEnrollments();
    } else {
      fetchStudentEnrollments(event.target.value);
    }
  };

  const handleDelete = async (enrollmentId) => {
    try {
      // Call API to delete enrollment
      await axios.delete(
        `http://localhost:8080/v1/enrollments/${enrollmentId}`
      );
      // Refresh student enrollments
      fetchStudentEnrollments(selectedCourse);
      // Close the modal after unenrollment
      setShowUnenrollModal(false);
    } catch (error) {
      console.error("Error deleting enrollment: ", error.message);
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

  // Function to handle opening unenroll modal
  const openUnenrollModal = (student) => {
    setSelectedStudent(student);
    setShowUnenrollModal(true);
  };

  // Function to handle closing unenroll modal
  const closeUnenrollModal = () => {
    setShowUnenrollModal(false);
  };

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold mb-8">Course Enrollments</h1>
      </div>
      <div
        style={{ marginBottom: "20px" }}
        className="flex justify-center mb-10"
      >
        <select
          onChange={handleCourseChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            cursor: "pointer",
            minWidth: "200px",
          }}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      <TableContainer component={Paper} style={{ marginTop: "40px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Enrollment ID</StyledTableCell>
              <StyledTableCell>Student ID</StyledTableCell>
              <StyledTableCell align="right">Full Name</StyledTableCell>
              <StyledTableCell align="right">Email</StyledTableCell>
              <StyledTableCell align="right">Contact</StyledTableCell>
                <StyledTableCell align="right">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <StyledTableRow key={student.enrollmentId}>
                <StyledTableCell>{student.enrollmentId}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {student._id}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {student.fullName}
                </StyledTableCell>
                <StyledTableCell align="right">{student.email}</StyledTableCell>
                <StyledTableCell align="right">
                  {student.contact}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {/* Conditionally render delete button based on user role */}
                  {role !== "admin" && (
                    <button
                      className="bg-red-600 text-white border-red-600 hover:bg-cyan-600 hover:text-white font-semibold  py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      onClick={() => openUnenrollModal(student)}
                    >
                      <DeleteIcon />
                    </button>
                  )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Confirmation Modal */}
      {showUnenrollModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Are you sure you want to unenroll {selectedStudent.fullName}?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={closeUnenrollModal}
                className="text-gray-500 mr-4"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedStudent.enrollmentId)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Unenroll
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewCourseEnrollments;