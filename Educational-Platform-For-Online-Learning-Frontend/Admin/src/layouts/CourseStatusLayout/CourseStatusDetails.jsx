import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "axios";

const CourseStatusDetails = () => {
  const { id } = useParams();

  const [course, setCourse] = useState([]);

  useEffect(() => {
    function getCourse() {
      axios
        .get(
          `http://localhost:8070/v1/courses/${id}`
        )
        .then((res) => {
          setCourse(res.data);
        })
        .catch((err) => {
          console.error("Error : " + err.message);
        });
    }
    getCourse();
  }, []);

  function acceptCourse(e) {
    e.preventDefault();

    axios
      .put(`http://localhost:8070/v1/courses/update-status/${id}`, {
        status: "Accepted"
      })
      .then((res) => {
        if (res.data != null)
          window.location.replace("/course-status/view-course");
      })
      .catch((err) => {
        console.error("Error : " + err.message);
      });
  }

  function rejectCourse(e) {
    e.preventDefault();

    axios
      .put(`http://localhost:8070/v1/courses/update-status/${id}`, {
        status: "Rejected"
      })
      .then((res) => {
        if (res.data != null)
          window.location.replace("/course-status/view-course");
      })
      .catch((err) => {
        console.error("Error : " + err.message);
      });
  }

  return (
    <>
      <div className="flex flex-col align-items w-full min-h-[85vh]">
        <div className="px-[20px] h-[64px] font-bold text-xl w-full flex justify-center items-center gap-[20px]">
          View Course
        </div>
        <div className="flex justify-center grid grid-cols-2 gap-4 p-10">
          <div class="p-4 flex justify-center">
            <TextField
              label="Name"
              name="name"
              InputProps={{ readOnly: true }}
              defaultValue=" "
              value={course.name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="p-4 flex justify-center">
            <TextField
              label="Code"
              name="code"
              InputProps={{ readOnly: true }}
              defaultValue=" "
              value={course.code}
              onChange={(e) => setCode(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="col-span-2 p-4">
            <TextField
              label="Description"
              name="description"
              InputProps={{ readOnly: true }}
              defaultValue=" "
              value={course.description}
              onChange={(e) => setDescription(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="p-4 flex justify-center">
            <TextField
              label="Credits"
              type="number"
              name="credits"
              InputProps={{ readOnly: true }}
              defaultValue="3"
              value={course.credits}
              onChange={(e) => setCredits(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="p-4 flex justify-center">
            <TextField
              label="Start Time"
              type="time"
              name="startTime"
              InputProps={{ readOnly: true }}
              defaultValue="00:00"
              value={course.startTime}
              onChange={(e) => setStartTime(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="p-4 flex justify-center">
            <TextField
              label="End Time"
              name="endTime"
              type="time"
              InputProps={{ readOnly: true }}
              defaultValue="00:00"
              value={course.endTime}
              onChange={(e) => setEndTime(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="p-4 flex justify-center">
          <select
              value={course.day}
              onChange={(e) => setDay(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div class="p-4 flex justify-center">
            <TextField
              label="Price"
              type="number"
              name="price"
              InputProps={{ readOnly: true }}
              defaultValue="0"
              value={course.price}
              onChange={(e) => setPrice(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="col-span-2 p-4">
            <ul>
              {course.videoLink &&
                course.videoLink.map((link, index) => (
                    <TextField
                    label="Video Link"
                    InputProps={{ readOnly: true }}
                    defaultValue=" "
                    value={link}
                    variant="outlined"
                    style={{ width: "100%" , marginBottom: "10px" }}
                  />
                ))}
            </ul>
          </div>
          <div class="col-span-2 flex justify-center pt-5">
            <button
              type="submit"
              onClick={acceptCourse}
              className="bg-transparent text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white font-semibold  py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Accept
            </button>
            <button
              type="submit"
              onClick={rejectCourse}
              className="bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white font-semibold ml-10  py-2 px-4 border border-red-500 hover:border-transparent rounded"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseStatusDetails;