import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "antd/dist/reset.css";
import CommonLayout from "../layouts/CommonLayout";
import SignIn from "../layouts/CommonLayout/SignIn";
import AdminLayout from "../layouts/AdminLayout";
import CourseLayout from "../layouts/CourseLayout";
import UserManagementLayout from "../layouts/UserManagementLayout";
import InstructorLayout from "../layouts/InstructorLayout";
import EnrollmentLayout from "../layouts/EnrollmentLayout";
import NotFoundPage from "../layouts/NotFoundLayout";
import UserProfileLayout from "../layouts/UserProfileLayout.jsx";
import CourseStatusLayout from "../layouts/CourseStatusLayout";import ListPayment from "../layouts/PaymentManagement/ListPayment.jsx";

const FrontendRoutes = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/admin" />
            <Route path="/payment/view-payment" element={<ListPayment />} />
          </Route>

          <Route element={<InstructorLayout />}>
            <Route path="/instructor" />
          </Route>

          <Route element={<CommonLayout />}>
            <Route path="/" element={<SignIn />} />
            <Route path="signup" />
          </Route>
          <Route element={<UserProfileLayout />}>
            <Route path="/profile" />
            <Route path="/forgot" />
            <Route path="/reset-password/:id/:token" />
          </Route>

          <Route element={<UserManagementLayout />}>
            <Route path="view-admins" />
            <Route path="view-students" />
            <Route path="view-instructors" />
            <Route path="add-instructors" />
          </Route>

          <Route path="course" element={<CourseLayout />}>
            <Route path="view-course" />
            <Route path="add-course" />
            <Route path="view-course-details/:id" />
            <Route path="update-course/:id" />
          </Route>

          <Route path="course-status" element={<CourseStatusLayout />}>
            <Route path="view-course" />
            <Route path="view-course-details/:id" />
          </Route>

          <Route path="enrollment" element={<EnrollmentLayout />}>
            <Route path="view-course-enrollment" />
            <Route path="view-student-enrollment" />
          </Route>

          <Route exact path="/*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default FrontendRoutes;