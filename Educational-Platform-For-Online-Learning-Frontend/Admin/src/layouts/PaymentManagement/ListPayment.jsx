import React, { useState, useEffect } from "react";
import axios from "axios";

const ListPayment = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8100/v1/payment/`
        );
        setPayments(response.data.reverse());
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const searchPayment = (payment) => {
    return (
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(payment.date)
        .toLocaleDateString()
        .includes(searchTerm.toLowerCase()) ||
      payment.time.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getCourseName = (id) => {
    axios.get(`http://localhost:8070/v1/courses/${id}`).then((res) => {
      return `${res.data.code} - ${res.data.name}`;
    });
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Payment History</h2>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-1 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full overflow-hidden overflow-x-auto">
          <div className="w-full">
            <div className="bg-slate-700 text-white uppercase font-semibold text-sm py-2 px-4">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-2">Payment ID</div>
                <div className="col-span-3">User ID</div>
                <div className="col-span-3">Course ID</div>
                <div className="col-span-1">Amount</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Time</div>
              </div>
            </div>
            {payments.filter(searchPayment).map((payment, index) => (
              <div
                key={payment.id}
                className={`text-gray-800 border-b border-gray-200 py-2 px-4 ${index % 2 == 0 ? 'bg-gray-200' : 'bg-gray-50'}`}
              >
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-2">{payment.id}</div>
                  <div className="col-span-3">{payment.user}</div>
                  <div className="col-span-3">{payment.course}</div>
                  <div className="col-span-1">${payment.amount}</div>
                  <div className="col-span-2">
                    {new Date(payment.date).toLocaleDateString()}
                  </div>
                  <div className="col-span-1">{payment.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListPayment;
