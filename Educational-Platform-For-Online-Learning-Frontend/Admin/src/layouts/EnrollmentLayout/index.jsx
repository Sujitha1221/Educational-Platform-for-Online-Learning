import React from "react";
import { Route, Routes } from "react-router-dom";
import SideNav from "../../components/SideNav";
import Header from "../../components/Header";
import { Outlet } from "react-router-dom";
import ViewCourseEnrollments from "./ViewCourseEnrollments";
import ViewStudentEnrollments from "./ViewStudentEnrollments";

const EnrollmentLayout = () => {
  return (
    <>
    <Header />
      <div className="flex sticky top-0 left-0">
        <SideNav />
        <div className="flex flex-col flex-1">
          
          <div className="p-[20px] overflow-y-scroll pt-10 ml-10 mr-10">
            <Outlet />
            <Routes>
              <Route>
                <Route
                  path="view-course-enrollment"
                  element={<ViewCourseEnrollments />}
                />

                <Route
                  path="view-student-enrollment"
                  element={<ViewStudentEnrollments />}
                />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrollmentLayout;
