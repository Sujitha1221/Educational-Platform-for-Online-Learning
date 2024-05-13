import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import background from "../../assets/bg.avif";

export default function EmailVerification() {
  const { token } = useParams();
  console.log(token);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8090/v1/users/confirm-user/${token}`
        );
        if (data?.success) {
          setVerificationMessage("Email verified successfully.");
        } else {
          setVerificationError(data?.message);
        }
      } catch (error) {
        setVerificationError("An error occurred while verifying the email.");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <>
      <div
        className="flex min-h-screen justify-center items-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${background})`,
          width: "100%",
          height: "100%",
        }}
      >
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg mt-10 mb-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Email Verification
            </h2>
            {verificationMessage && (
              <p className="mt-3 text-green-600">{verificationMessage}</p>
            )}
            {verificationError && (
              <p className="mt-3 text-red-600">{verificationError}</p>
            )}
            <div className="mt-6">
              <Link
                to="/signin"
                className="block w-full text-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Go to Login Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
