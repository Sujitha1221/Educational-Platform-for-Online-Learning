import React from "react";
import SideNav from "../../components/SideNav";
import Header from "../../components/Header";
import { Outlet, Route, Routes } from "react-router-dom";
import AllAdmins from "./AllAdmins";
import AllInstructors from "./AllInstructors";
import AllStudents from "./AllStudents";
import AddInstructors from "./AddInstructors";

const UserManagementLayout = () => {
  return (
    <>
      <Header />
      <div className="flex sticky top-0 left-0">
        <SideNav />
        <div className="flex flex-col flex-1">
          <div className="overflow-y-scroll">
            <Outlet />
            <Routes>
              <Route>
                <Route path="view-admins" element={<AllAdmins />} />
                <Route path="view-instructors" element={<AllInstructors />} />
                <Route path="view-students" element={<AllStudents />} />
                <Route path="add-instructors" element={<AddInstructors />} />
              </Route>
            </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagementLayout;
