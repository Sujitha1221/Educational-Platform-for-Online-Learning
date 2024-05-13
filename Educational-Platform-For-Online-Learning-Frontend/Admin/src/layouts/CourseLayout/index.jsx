import React from "react";
import { Route, Routes } from "react-router-dom";
import SideNav from "../../components/SideNav";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import ViewCourse from "./ViewCourse";
import AddCourse from "./AddCourse";
import UpdateCourse from "./UpdateCourse";
import CourseDetails from "./CourseDetails";

const CourseLayout = () => {
  return (
    <>
    <Header />
      <div className="flex sticky top-0 left-0">
        <SideNav />
        <div className="flex flex-col flex-1">
          <div className="overflow-y-scroll pt-10 ml-10 mr-10">
            <Outlet />
            <Routes>
              <Route>
                <Route path="view-course" element={<ViewCourse />} />
                <Route path="add-course" element={<AddCourse />} />
                <Route path="update-course/:id" element={<UpdateCourse />} />
                <Route path="view-course-details/:id" element={<CourseDetails />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseLayout;
