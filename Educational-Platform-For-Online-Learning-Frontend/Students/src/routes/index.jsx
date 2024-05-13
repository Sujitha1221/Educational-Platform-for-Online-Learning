import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "../components/SigninLayout";
import Header from "../components/HeaderLayout/index";
import Footer from "../components/FooterLayout";
import Home from "../components/HomeLayout";
import SignUp from "../components/SignupLayout";
import NotFoundPage from "../components/NotFound";
import UserProfile from "../components/UserProfileLayout";
import Course from "../components/CourseLayout";
import MyCourse from "../components/MyCourseLayout";
// eslint-disable-next-line react/prop-types

import ForgotPassword from "../components/ForgotPasswordLayout";
import ResetPassword from "../components/ResetPasswordLayout";
import EmailVerification from "../components/EmailVerificationLayout";
import SuccessPayment from "../components/SuccessPayment";
import PaymentHistory from "../components/PaymentHistory";

const PrivateRoute = ({ Component }) => {
  const isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));
  return isLoggedIn ? <Component /> : <Navigate to="/login" />;
};

const FrontendRoutes = () => {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/signin" element={<SignIn />} />
          <Route exact path="/header" element={<Header />} />
          <Route exact path="/footer" element={<Footer />} />
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/profile" element={<UserProfile />} />
          <Route exact path="/course/:courseId" element={<Course />} />

          {/* <Route path="/course" element={<PrivateRoute Component={Course} />} /> */}
          <Route exact path="/course" element={<Course />} />
          <Route exact path="/my-course/:courseId" element={<MyCourse />} />

          <Route exact path="/forgot" element={<ForgotPassword />} />
          <Route
            exact
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/email-verification/:token"
            element={<EmailVerification />}
          />
          {/* <Route path="/course" element={<PrivateRoute Component={Course} />} /> */}
          <Route exact path="/*" element={<NotFoundPage />} />
          <Route path="/payment-success/:payId" element={<SuccessPayment />} />
          <Route path="/history" element={<PaymentHistory />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default FrontendRoutes;
