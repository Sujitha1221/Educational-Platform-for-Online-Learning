import React, { Fragment, useState, useEffect } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Person2Icon from "@mui/icons-material/Person2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../UserProfileLayout/confirmationModel";
import axios from "axios";

const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Payment History", href: "/history" },
  { name: "Sign out" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function PaymentPage() {
  window.location.replace("/payment");
}

export default function Header() {
  const { isLoggedIn, logout } = useAuth();
  let navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingEnrolledCourses, setLoadingEnrolledCourses] = useState(false);
  const [activeTab, setActiveTab] = useState(); // State to manage active tab


  useEffect(() => {
    if (isLoggedIn) {
      fetchEnrolledCourses();
    }
  }, [isLoggedIn]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoadingEnrolledCourses(true);
      const studentId = JSON.parse(localStorage.getItem("auth")).user.id;
      console.log(studentId);
      const response = await axios.get(
        `http://localhost:8080/v1/enrollments/viewCourse/${studentId}`
      );
      
      // Check if response has the expected structure
      if (!response.data || !response.data.enrollments || !Array.isArray(response.data.enrollments)) {
        throw new Error("Invalid response format");
      }
  
      const enrollments = response.data.enrollments;
  
      const courseIds = enrollments.map((item) => item.course);
      const courseNamePromises = courseIds.map(async (courseId) => {
        const courseResponse = await axios.get(
          `http://localhost:8070/v1/courses/${courseId}`
        );
        return courseResponse.data.name;
      });
      const courseNames = await Promise.all(courseNamePromises);
      const enrolledCoursesWithNames = enrollments.map((item, index) => ({
        courseId: item.course,
        courseName: courseNames[index],
      }));
      setEnrolledCourses(enrolledCoursesWithNames);
      setLoadingEnrolledCourses(false);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      setLoadingEnrolledCourses(false);
    }
  };
  

  const handleSignOut = () => {
    setShowConfirm(true);
  };

  const handleConfirmSignOut = () => {
    try {
      toast.success("You've logged out successfully");
      localStorage.removeItem("auth");
      localStorage.removeItem("isLoggedIn");
      logout();
      navigate("/signin");
      setShowConfirm(false);
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleCancelSignOut = () => {
    setShowConfirm(false);
  };

  const handleTabClick = (name, href) => {
    setActiveTab(name);
    navigate(href); // Navigate to the specified URL
  };

  // Modify the navigation array to include the enrolled courses dropdown under the "My Courses" tab
  const navigation = [
    { name: "Home", href: "/", current: activeTab === "Home" },

    {
      name: "Courses",
      href: "/course",
      current: activeTab === "Courses",
    },
    { name: "Contact", href: "/signIn", current: activeTab === "Contact" },
    { name: "About Us", href: "#", current: activeTab === "About Us" },
    {
      name: "My Courses",
      dropdown: activeTab === "My Courses" && enrolledCourses.length > 0 && (
        <div className="origin-top-left absolute mt-20 left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1 "
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {enrolledCourses.map((course) => (
              <a
                key={course.courseId}
                href={`/my-course/${course.courseId}`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {course.courseName}
              </a>
            ))}
          </div>
        </div>
      ),
      current: activeTab === "My Courses",
    },
  ];


  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-10xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-white text-2xl font-semibold italic">
                      <FontAwesomeIcon className="mr-[10px]" icon={faBook} />
                      LearnHub
                      
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <div key={item.name} className="relative">
                            <button
                              onClick={() =>
                                handleTabClick(item.name, item.href)
                              }
                              className={classNames(
                                item.current
                                  ? "bg-gray-900 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                "rounded-md px-3 py-2 text-sm font-medium"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </button>
                            {item.dropdown && (
                              <div className="absolute z-10 -top-12 left-0">
                                {item.dropdown}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block relative">
                    <div className="ml-4 flex items-center">
                      <button
                        type="button"
                        onClick={PaymentPage}
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Cart</span>
                        <ShoppingCartIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                          onClick={PaymentPage}
                        />
                      </button>
                      {isLoggedIn ? (
                        <Menu as="div" className="relative ml-3">
                          <div>
                            <Menu.Button className="relative flex max-w-xs items-center hover:bg-white hover:text-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                              <span className="absolute -inset-1.5" />
                              <span className="sr-only">Open user menu</span>
                              <Person2Icon
                                className="hover:text-gray-800"
                                style={{
                                  color: "gray",
                                  height: "26px",
                                  width: "26px",
                                }}
                                aria-hidden="true"
                              ></Person2Icon>
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              {userNavigation.map((item) => (
                                <Menu.Item key={item.name}>
                                  {({ active }) => (
                                    <a
                                      href={item.href}
                                      onClick={
                                        item.name === "Sign out"
                                          ? handleSignOut
                                          : null
                                      }
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      {item.name}
                                    </a>
                                  )}
                                </Menu.Item>
                              ))}
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      ) : (
                        <a
                          href="/signin"
                          className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Log in / Register
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={() => handleTabClick(item.name)} // Handle tab click
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-700 pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Person2Icon></Person2Icon>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>

      {showConfirm && (
        <ConfirmationModal
          message="Are you sure you want to logout your account?"
          onConfirm={handleConfirmSignOut}
          onCancel={handleCancelSignOut}
        />
      )}
    
    </>
  );
}