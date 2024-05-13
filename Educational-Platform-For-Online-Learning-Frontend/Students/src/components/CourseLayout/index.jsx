import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimeline } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const Course = () => {
  const [Courses, setAllCourses] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const studentId = JSON.parse(localStorage.getItem("auth")).user.id;
  const navigate = useNavigate();

  useEffect(() => {
    function getAllCourses() {
      axios
        .get("http://localhost:8070/v1/courses/accepted-course")
        .then((res) => {
          setAllCourses(res.data);
        })
        .catch((err) => {
          console.error("Error : " + err.message);
        });
    }

    function getEnrolledCourses(studentId) {
      axios
        .get(`http://localhost:8080/v1/enrollments/viewCourse/${studentId}`)
        .then((res) => {
          if (res.data.success) {
            setEnrolledCourses(res.data.enrollments);
          } else {
            console.error("Error: " + res.data.message);
          }
        })
        .catch((err) => {
          console.error("Error : " + err.message);
        });
    }

    getAllCourses();
    getEnrolledCourses(studentId);
  }, [studentId]);

  const isEnrolled = (courseId) => {
    return enrolledCourses.some((enrollment) => enrollment.course === courseId);
  };

  const handleEnroll = async (studentId, courseId, Course) => {
    try {
      const storedData = localStorage.getItem("auth");
      const parsedData = JSON.parse(storedData);
      const token = parsedData.token;

      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // Make POST request with token in headers
      const response = await axios.post(`http://localhost:8080/v1/enrollments/checkValidity`, { studentId, courseId }, config);
      const data = response.data;
      if (data.message !== "Student can enroll to the course") {
        setErrorMessage(data.message);
        setErrorModal(true);
      } else {
        makePayment(Course); 
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Function to close error modal
  const closeErrorModal = () => {
    setErrorModal(false);
  };

  const makePayment = async (course) => {
    const stripe = await loadStripe(
      "pk_test_51PEw69DhclR3HwIvaYzKXCiBKSqxGN4ZqMbZPbBIfcEonSvQtOe98au9frLAenPikTiwJldBFwskG5kJVmkvSz11009b2dycpp"
    );

    console.log(course);

    axios
      .post("http://localhost:8100/v1/payment", { course, user: JSON.parse(localStorage.getItem("auth")).user.id })
      .then((res) => {
        stripe.redirectToCheckout({
          sessionId: res.data.id,
        });
      })
      .catch((err) => {
        alert("Payment Failed");
        console.log(err)
      });
  };

  return (
    <>
      {errorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50"></div>
          <div className="bg-white p-8 rounded-lg z-50">
            <h2 className="text-xl font-semibold mb-4">Error</h2>
            <p className="text-red-500">{errorMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeErrorModal}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div class="bg-white py-24 sm:py-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:mx-0">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Embark on Your Learning Journey Today !
            </h2>
            <p class="mt-2 text-lg leading-8 text-gray-600">
              Start your course today and take the first step towards shaping
              your educational path. Whether you're looking to acquire new
              skills, deepen your knowledge, or pursue a passion, beginning your
              course journey opens doors to endless opportunities. Embrace the
              power of learning and pave the way for a brighter future. Seize
              the moment and let your education lead the way!
            </p>
          </div>

          <div className="block w-full  flex justify-center mt-6">
            <input
              type="search"
              id="default-search"
              onChange={(e) => setSearchKey(e.target.value)}
              className="block w-100 mt-3 p-4 pl-10 text-sm text-black border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search"
            />
          </div>
          <div class="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {Courses.filter((key) => {
              const code = (key.code || "").toLowerCase();
              const name = (key.name || "").toLowerCase();
              return (
                code.includes(searchKey.toLowerCase()) ||
                name.includes(searchKey.toLowerCase())
              );
            }).map((Course) => (
              <article key={Course._id} class="flex max-w-xl flex-col items-start justify-between border border-gray-300 p-6">
                <div class="flex items-center gap-x-4 text-xs">
                  <h6 class="relative z-10 rounded-full bg-gray-200 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    {Course.code}
                  </h6>
                </div>
                <div class="group relative">
                  <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <a href="#">
                      <span class="absolute inset-0"></span>
                      {Course.name}
                    </a>
                  </h3>
                  <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {Course.description}
                  </p>
                </div>
                <div class="relative mt-8 flex items-center gap-x-4">
                  <FontAwesomeIcon
                    class="h-10 w-10 rounded-full bg-gray-50"
                    icon={faTimeline}
                    style={{ color: "rgb(100 116 139)" }}
                  />
                  <div class="text-sm leading-6">
                    <p class="font-semibold text-gray-900">
                      <span class="absolute inset-0"></span>
                      {Course.day}
                    </p>
                    <p class="text-gray-600">
                      {Course.startTime} - {Course.endTime}
                    </p>
                  </div>

                  <h6 class="relative z-10 rounded-full bg-gray-200 ml-20 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">
                    ${Course.price}
                  </h6>
                </div>
                <div class="mt-10 flex items-center justify-between gap-x-6">
                  {isEnrolled(Course._id) ? (
                    <button
                      disabled
                      class="rounded-md bg-red-500 cursor-not-allowed px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm"
                    >
                      Enrolled
                    </button>
                  ) : (
                    <button onClick={() => handleEnroll(studentId, Course._id,Course)} class="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                      Enroll Now <span aria-hidden="true">&rarr;</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Course;