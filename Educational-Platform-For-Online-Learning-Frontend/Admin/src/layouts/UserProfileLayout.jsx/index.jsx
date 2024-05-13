import React from "react";
import { Route, Routes } from "react-router-dom";
import UserProfile from "./UserProfile";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

const UserProfileLayout = () => {
  return (
    <>
      <Routes>
        <Route>
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default UserProfileLayout;
