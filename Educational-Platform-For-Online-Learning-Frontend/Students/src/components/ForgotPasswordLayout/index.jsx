import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import background from "../../assets/background-img.jpg";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8090/v1/users/forgot-password",
        {
          email,
        }
      );
      if (data?.success) {
        toast.success("Otp sent to your email");
        navigate("/signin");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred sending otp.");
      }
    }
  };

  let navigate = useNavigate();
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
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center text-black text-2xl font-semibold italic">
              <FontAwesomeIcon className="mr-[10px]" icon={faBook} />
              LearnHub
            </div>
            <h2 className="mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Forgot Password?
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="mt-6 space-y-6" action="#" method="POST">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email Address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block p-5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    value={email}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                <div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex w-full justify-center rounded-md bg-gray-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Send
                  </button>
                </div>
              </div>
            </form>

            <p className="mt-5 text-center text-sm text-gray-500">
              Remember your password?
              <span className="mr-3"></span>{" "}
              <a
                href="/signin"
                className="font-semibold leading-6 text-gray-800 hover:text-black"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
