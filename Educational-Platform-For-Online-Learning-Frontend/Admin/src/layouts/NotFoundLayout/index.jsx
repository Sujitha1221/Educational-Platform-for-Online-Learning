import React from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router

const NotFoundPage = () => {
  return (
    <>
      <div className="flex sticky top-0 left-0">
        <div className="flex flex-col flex-1">
          <div className="overflow-y-scroll">
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
              <p className="text-lg">
                Sorry, the page you are looking for does not exist.
              </p>
              <Link to="/">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                  Go to Login Page
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
