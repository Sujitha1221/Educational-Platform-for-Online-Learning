import React from "react";
import { Route, Routes } from "react-router-dom";
import SideNav from "../../components/SideNav";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import ViewCourse from "./ViewCourse";
import CourseStatusDetails from "./CourseStatusDetails";

const CourseStatusLayout = () => {
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
                <Route path="view-course-details/:id" element={<CourseStatusDetails />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseStatusLayout;
