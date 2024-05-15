import Stripe from 'stripe';
import dotenv from 'dotenv';
import Payment from '../models/payment.model.mjs';
import logger from '../utils/logger.mjs';
import nodemailer from 'nodemailer';

dotenv.config();

//stirpe secret key
const stripe = new Stripe(process.env.STRIPE_SECRET);


//generate payemnt id
const getNextPaymentId = async () => {
  const lastPayment = await Payment.findOne({}, {}, { sort: { 'id': -1 } });
  if (lastPayment) {
    const lastId = parseInt(lastPayment.id.slice(3));
    const nextId = 'PAY' + ('0000' + (lastId + 1)).slice(-4);
    return nextId;
  } else {
    return 'PAY0001';
  }
};

//email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});


//payment controller
const PaymentController = {

  //make payment
  makePayment: async (req, res) => {
    const { course, user } = req.body;

    //stripe payload
    const product = {
      price_data: {
        currency: "usd",
        product_data: {
          name: `${course.code} - ${course.name}`,
          images: ["https://cdn-icons-png.flaticon.com/512/171/171322.png"],
        },
        unit_amount: Math.round(course.price * 100),
      },
      quantity: 1,
    };


    //payment payload
    const payment = new Payment({
      id: await getNextPaymentId(),
      user: user,
      course: course._id,
      amount: course.price,
      time: new Date().toLocaleTimeString(),
      verified: false
    });

    //save transaction
    const savedPayment = await payment.save();

    //stripe session
    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items: [product],
        mode: "payment",
        success_url: `http://localhost:4000/payment-success/${savedPayment._id}`,
        cancel_url: "http://localhost:4000/"
    })

    res.json({ id: session.id });
  },


  //retrieve payment by id
  getById: async (req, res) => {
    const paymentId = req.params.id;

    try {
      const payment = await Payment.findById(paymentId);
      res.json(payment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  //erify payment
  verifyPayment: async (req, res) => {
    const paymentId = req.params.id;

    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      payment.verified = true;
      await payment.save();

      res.json(payment);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  //retrieve all payments
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.find({ verified: true });
      res.json(payments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  
  //retrieve payment of a specific user
  getPaymentsByUser: async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const payments = await Payment.find({ user: userId, verified: true });
      res.json(payments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  //send payment confirmation email
  sendPaymentSuccessEmail: async (req, res) => {
    const email = req.params.email;
  
    //mail body
    try { 
      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Payment Successful',
        html: `Dear customer,<br/><br/> your payment has been successfully processed.<br/><br/>Thank you.<br/>LearnHub`,
      };

      //send email
      await transporter.sendMail(mailOptions);
  
      res.json({ message: 'Email sent successfully' });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export default PaymentController;
