import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import img1 from "../../assets/img-7.jpg";
import img3 from "../../assets/img-3.jpg";
import img4 from "../../assets/img-4.jpg";
import img5 from "../../assets/img-5.jpg";
import img6 from "../../assets/img-6.webp";
import { toast } from "react-toastify";

const MyCourse = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [error, setError] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0); // State to keep track of current slide
  const [showUnenrollModal, setShowUnenrollModal] = useState(false); // State for unenroll modal visibility
  const [showErrorModal, setShowErrorModal] = useState(false); // State for error modal visibility
  const [watchedVideos, setWatchedVideos] = useState([]); // State to store watched videos


  const studentId = JSON.parse(localStorage.getItem("auth")).user.id;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/v1/courses/${courseId}`
        );
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchVisibleVideos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8070/v1/courses/video/${courseId}`
        );
        setVisibleVideos(response.data.videos);
        setError(null);
      } catch (error) {
        setError(error.response.data.error);
        setShowErrorModal(true);
      }
    };

    fetchVisibleVideos();
  }, [courseId]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const studentId = JSON.parse(localStorage.getItem("auth")).user.id;
        const response = await axios.post(
          `http://localhost:8080/v1/progress/viewProgress`,
          {
            userId: studentId,
            courseId: courseId,
          }
        );
        setCompletionPercentage(response.data.percentage);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [courseId]);

  useEffect(() => {
    // Start the interval to change slides automatically
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 5); // Assuming you have 5 slides
    }, 5000); // Change slides every 5 seconds

    // Clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchWatchedVideos = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8080/v1/progress/viewWatchedVideos`,
          {
            userId: studentId,
            courseId: courseId,
          }
        );
        setWatchedVideos(response.data.watchedVideos);
      } catch (error) {
        console.error("Error fetching watched videos:", error);
      }
    };

    fetchWatchedVideos();
  }, [courseId, studentId]);

  // Function to mark video as watched
  const markAsWatched = async (videoId) => {
    try {
      const studentId = JSON.parse(localStorage.getItem("auth")).user.id;
      await axios.post(`http://localhost:8080/v1/progress/watchedVideos`, {
        userId: studentId,
        courseId: courseId,
        videoId: videoId,
      });
    } catch (error) {
      console.error("Error marking video as watched:", error);
    }
  };

  // Function to handle unenrollment
  const handleUnenroll = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/v1/enrollments/getEnrollmentId`,
        {
          userId: studentId,
          courseId: courseId,
        }
      );

      const enrollmentId = response.data.enrollmentId;

      await axios.delete(
        `http://localhost:8080/v1/enrollments/${enrollmentId}`
      );
      toast.success("Unenrolled successfully.");
      window.location.replace("/");

      console.log("Successfully unenrolled from course:", courseId);
    } catch (error) {
      console.error("Error unenrolling from course:", error);
    }
  };

  // Function to handle opening unenroll modal
  const openUnenrollModal = () => {
    setShowUnenrollModal(true);
  };

  // Function to handle closing unenroll modal
  const closeUnenrollModal = () => {
    setShowUnenrollModal(false);
  };

  // Function to handle closing error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="mt-10 px-4">
      {course && (
        <div className="text-center items-center">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {course.name} - {course.code}
            </h2>
            {/* Unenroll button */}
            <button
              onClick={openUnenrollModal}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Unenroll from Course
            </button>
          </div>

          {/* Image container */}
          <div
            id="default-carousel"
            className="relative w-full mt-10"
            data-carousel="slide"
          >
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
              <div
                className={
                  currentSlide === 0 ? "duration-10 ease-in-out" : "hidden"
                }
                data-carousel-item
              >
                <img
                  src={img1}
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className={
                  currentSlide === 1 ? "duration-10 ease-in-out" : "hidden"
                }
                data-carousel-item
              >
                <img
                  src={img4}
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className={
                  currentSlide === 2 ? "duration-10 ease-in-out" : "hidden"
                }
                data-carousel-item
              >
                <img
                  src={img3}
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className={
                  currentSlide === 3 ? "duration-10 ease-in-out" : "hidden"
                }
                data-carousel-item
              >
                <img
                  src={img5}
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
              <div
                className={
                  currentSlide === 4 ? "duration-10 ease-in-out" : "hidden"
                }
                data-carousel-item
              >
                <img
                  src={img6}
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                  alt="..."
                />
              </div>
            </div>
          </div>

          <p className="text-3xl mt-4">{course.description}</p>

          {/* Display visible videos */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {visibleVideos.length > 0
              ? visibleVideos.map((video, index) => (
                <div key={index} className="bg-gray-100 p-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Video {index + 1}
                </h3>
                <div className="flex items-center">
                  <a
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    onClick={() => markAsWatched(video)} // Call markAsWatched function on click
                  >
                    {video}
                  </a>
                  <input
                      type="checkbox"
                      className="ml-3"
                      checked={watchedVideos.includes(video)}
                      readOnly
                    />                </div>
              </div>
              
                ))
              : null}
          </div>

          {/* Progress bar */}
          <div className="mt-10 flex justify-center">
            <div className="bg-gray-100 p-4 w-80 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                Course Completion Percentage - {completionPercentage}%{" "}
              </h3>
              <div className="bg-gray-200 rounded-full h-2 dark:bg-gray-700 relative">
                <div
                  className="bg-green-500 h-full rounded-full absolute left-0"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Unenroll modal */}
          {showUnenrollModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">
                  Are you sure you want to unenroll from this course?
                </h2>
                <div className="flex justify-end">
                  <button
                    onClick={closeUnenrollModal}
                    className="text-gray-500 mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUnenroll}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Unenroll
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error modal */}
          {showErrorModal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Error</h2>
                <p className="text-red-500">{error}</p>
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
        </div>
      )}
    </div>
  );
};

export default MyCourse;