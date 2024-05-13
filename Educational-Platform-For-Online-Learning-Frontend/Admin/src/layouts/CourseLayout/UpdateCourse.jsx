import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import axios from "axios";

const UpdateCourse = () => {
  const { id } = useParams();

  const [objId, setObjId] = useState();
  const [course, setCourse] = useState();
  const [name, setName] = useState();
  const [code, setCode] = useState();
  const [description, setDescription] = useState();
  const [credits, setCredits] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [day, setDay] = useState();
  const [errors, setErrors] = useState("");
  const [videoLink, setVideoLink] = useState([""]);
  const [price, setPrice] = useState();

   const addVideoLink = () => {
    setVideoLink([...videoLink, ""]);
  };

  const removeVideoLink = (index) => {
    const updatedLinks = [...videoLink];
    updatedLinks.splice(index, 1);
    setVideoLink(updatedLinks);
  };

  const handleVideoLinkChange = (index, value) => {
    const updatedLinks = [...videoLink];
    updatedLinks[index] = value;
    setVideoLink(updatedLinks);
  };

  useEffect(() => {
    function getCourse() {
      axios
        .get(
          `http://localhost:8070/v1/courses/${id}`
        )
        .then((res) => {
          console.log(res.data.videoLink);
          setObjId(res.data._id);
          setCourse(res.data);
          setCode(res.data.code);
          setName(res.data.name);
          setDescription(res.data.description);
          setCredits(res.data.credits);
          setStartTime(res.data.startTime);
          setEndTime(res.data.endTime);
          setDay(res.data.day);
          setVideoLink(res.data.videoLink);
          setPrice(res.data.price);
        })
        .catch((err) => {
          setErrors(err.response.data.status);
          console.error("Error : " + err.message);
        });
    }
    getCourse();
  }, []);

  function updateCourse(e) {
    e.preventDefault();

    axios
      .put(`http://localhost:8070/v1/courses/${id}`, {
        name,
        code,
        description,
        credits,
        startTime,
        endTime,
        day,
        videoLink,
        price,
      })
      .then((res) => {
        if (res.data != null)
          window.location.replace("/course/view-course");
      })
      .catch((err) => {
        console.error("Error : " + err.message);
      });
  }

  return (
    <>
      <div className="flex flex-col align-items w-full min-h-[85vh]">
        <div className="px-[20px] h-[64px] font-bold text-xl w-full flex justify-center items-center gap-[20px]">
          Update Course
        </div>
        <div className="flex justify-center grid grid-cols-2 gap-4 p-10">
          <div class="p-4 flex justify-center">
            <TextField
              label="Name"
              name="name"
              defaultValue=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="p-4 flex justify-center">
            <TextField
              label="Code"
              name="code"
              defaultValue=" "
              value={code}
              onChange={(e) => setCode(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="col-span-2 p-4">
            <TextField
              label="Description"
              name="description"
              defaultValue=" "
              value={description}
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
              defaultValue="0"
              value={credits}
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
              defaultValue="00:00"
              value={startTime}
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
              defaultValue="00:00"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="p-4 flex justify-center">
          <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              style={{ width: "100%" }}
            >
              <option value="Monday" selected>Monday</option>
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
              defaultValue="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              variant="outlined"
              style={{ width: "100%" }}
            />
          </div>
          <div class="col-span-2 p-4">
              <div className="p-4">
                {videoLink.map((link, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <TextField
                      label={`Video Link ${index + 1}`}
                      value={link}
                      onChange={(e) => handleVideoLinkChange(index, e.target.value)}
                      variant="outlined"
                      style={{ width: "calc(100% - 100px)", marginRight: "10px" }}
                    />
                    <button
                      onClick={() => removeVideoLink(index)}
                      className="bg-transparent text-red-600 font-semibold py-2 px-3 border border-red-600 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  onClick={addVideoLink}
                  className="bg-transparent text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                >
                  Add Video Link
                </button>
              </div>
            </div>


          <div class="col-span-2 flex justify-center pt-5"> 
          {errors ? (
            <div className="w-full justify-center text-center px-[20px] py-[10px] border-2 border-red-700 bg-red-100 text-red-700 rounded text-xs">
              {errors ? errors : ""}
            </div>
          ) : (
            <></>
          )}
          </div>
          <div class="col-span-2 flex justify-center pt-5">
            <button
              type="submit"
              onClick={updateCourse}
              className="bg-transparent text-cyan-600 border-cyan-600 hover:bg-cyan-600 hover:text-white font-semibold  py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Update Course
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateCourse;
