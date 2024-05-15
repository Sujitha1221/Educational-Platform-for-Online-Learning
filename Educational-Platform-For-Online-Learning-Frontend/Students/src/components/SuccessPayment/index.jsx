import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../Loading";

const SuccessPayment = () => {
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();
  const { payId } = useParams();
  const [amount, setAmount] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("auth")).token;
  const user = JSON.parse(localStorage.getItem("auth")).user;

  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  useEffect(() => {
    console.log("def", payId);
    axios.get(`http://localhost:8100/v1/payment/${payId}`).then((res) => {
      setAmount(res.data.price);
      axios
        .put(`http://localhost:8100/v1/payment/${res.data._id}/verify`)
        .then((res) => {
          axios
            .post(
              `http://localhost:8080/v1/enrollments`,
              { studentId: res.data.user, courseId: res.data.course },
              config
            )
            .then((res) => {
              axios
                .post(`http://localhost:8100/v1/payment/send-email/${user.email}`)
                .then((res) => {
                  setIsLoading(false);
                  startCountdown();
                });
            });
        });
    });
  }, []);

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      navigate("/course");
    }, countdown * 1000);
  };

  return (
    <>
      <div className="h-screen w-full flex justify-center items-center">
        <div className="w-[400px] h-[300px] border-2 rounded flex flex-col justify-center items-center">
          <div className="text-3xl font-bold text-green-600 text-center">
            Payment Success!
          </div>
          <img
            className="w-[100px]"
            src="https://static.vecteezy.com/system/resources/previews/002/743/514/large_2x/green-check-mark-icon-in-a-circle-free-vector.jpg"
            alt="Success Icon"
          />
          <div>
            You will be redirected automatically
            <div className="flex gap-2 items-center justify-center">
              Please wait
              <div className="h-4 w-4 border-2 border-gray-400s border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? <Loading /> : <></>}
    </>
  );
};

export default SuccessPayment;
