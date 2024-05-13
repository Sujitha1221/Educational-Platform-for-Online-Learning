import Enrollment from "../models/enrollment.mjs";
import logger from "../utils/logger.mjs";
import nodemailer from "nodemailer";
import axios from "axios";
import { Vonage } from "@vonage/server-sdk"; // Import Vonage correctly

// Initialize Vonage
const vonage = new Vonage({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET,
});

const EnrollmentController = {
  checkEnrollmentValiditity: async (req, res) => {
    try {
      const { studentId, courseId } = req.body;
      let valid = false;

      // Retrieve the token from the request headers
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];

      // Set up the config object with headers
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      // Make the request to get user details including the student's role
      const studentResponse = await axios.get(
        `http://user:8090/v1/users/user/${studentId}`,
        config
      );
      const student = studentResponse.data.user;

      if (student.role !== "student") {
        return res.status(201).json({ message: "Student not found" });
      }

      const courseResponse = await axios.get(
        `http://course:8070/v1/courses/${courseId}`
      );
      const course = courseResponse.data;

      if (!student || !course) {
        return res.status(201).json({ message: "Student or course not found" });
      }

      // Check if student is already enrolled in the course
      const existingEnrollment = await Enrollment.findOne({
        student: studentId,
        course: courseId,
      });
      if (existingEnrollment) {
        return res.status(201).json({
          message: "Student is already enrolled in the course",
        });
      }

      // Check for day and time clashes with existing enrollments
      const newCourseStartTime = new Date(`2022-01-01T${course.startTime}`);
      const newCourseEndTime = new Date(`2022-01-01T${course.endTime}`);
      const newCourseDay = course.day;

      const studentEnrollments = await Enrollment.find({ student: studentId });
      for (const enrollment of studentEnrollments) {
        const enrolledCourse = await axios.get(
          `http://course:8070/v1/courses/${enrollment.course}`
        );
        const enrolledCourseStartTime = new Date(
          `2022-01-01T${enrolledCourse.data.startTime}`
        );
        const enrolledCourseEndTime = new Date(
          `2022-01-01T${enrolledCourse.data.endTime}`
        );
        const enrolledCourseDay = enrolledCourse.data.day;

        // Check for day clash
        if (newCourseDay === enrolledCourseDay) {
          // Check for time clash
          if (
            (newCourseStartTime > enrolledCourseStartTime &&
              newCourseStartTime < enrolledCourseEndTime) ||
            (newCourseEndTime > enrolledCourseStartTime &&
              newCourseEndTime < enrolledCourseEndTime) ||
            (newCourseStartTime <= enrolledCourseStartTime &&
              newCourseEndTime >= enrolledCourseEndTime)
          ) {
            valid = true;
          }
        }
      }
      if (valid) {
        return res.status(201).json({
          message:
            "Time clash! You are already enrolled in a course at this time.",
        });
      } else {
        return res.status(201).json({
          message: "Student can enroll to the course",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to check validity", error });
      logger.error(error);
    }
  },

  // Method to enroll a student in course
  enrollStudentInCourse: async (req, res) => {
    try {
      const { studentId, courseId } = req.body;

      // Retrieve the token from the request headers
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];

      // Set up the config object with headers
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      // Make the request to get user details including the student's role
      const studentResponse = await axios.get(
        `http://user:8090/v1/users/user/${studentId}`,config
      );
      const student = studentResponse.data.user;

      const courseResponse = await axios.get(
        `http://course:8070/v1/courses/${courseId}`
      );
      const course = courseResponse.data;

      // Create new enrollment
      const enrollment = new Enrollment({
        student: studentId,
        course: courseId,
      });
      await enrollment.save();

      res.status(201).json({
        message: "Student enrolled in course successfully",
        enrollment,
      });
      logger.info(`Student enrolled in course successfully`);

      // Call the static method to send email notification
      await EnrollmentController.sendEmailNotification(
        student.email,
        course.name
      );

      const phoneNumber = "94" + student.contact.toString();

      // Call the static method to send SMS notification
      await EnrollmentController.sendSMSNotification(
        phoneNumber,
        `You have been enrolled in the course "${course.name}"`
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to enroll student in course", error });
      logger.error(error);
    }
  },

  // Method to view student enrollments in a course
  viewStudentEnrollments: async (req, res) => {
    try {
      const courseId = req.params.courseId;

      // Check if student and course exist
      const courseResponse = await axios.get(
        `http://course:8070/v1/courses/${courseId}`
      );
      const course = courseResponse.data;

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Find enrollments for the specified course
      const enrollments = await Enrollment.find({ course: courseId });

      if (enrollments.length === 0) {
        return res
          .status(200)
          .json({ message: "No enrollments for this course" });
      }

      res.status(200).json(enrollments);
      logger.info(
        `Student enrollments for course ${courseId} fetched successfully`
      );
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to fetch student enrollments", error });
      logger.error(error);
    }
  },

  // Method to view courses in which a student is enrolled
  viewStudentEnrolledCourses: async (req, res) => {
    try {
      const studentId = req.params.studentId;

      // Find enrollments for the specified student
      const enrollments = await Enrollment.find({
        student: studentId,
      });

      if (enrollments.length === 0) {
        return res
          .status(200)
          .json({ message: "Student is not enrolled in any courses" });
      }

      res.status(200).json({
        success: true,
        message: "All enrollments of the student",
        enrollments,
      });
      logger.info(
        `Courses enrolled by student ${studentId} fetched successfully`
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error,
        message: "Error while getting enrolmments for Student",
      });
    }
  },
  getEnrollmentId: async (req, res) => {
    try {
      const { courseId, userId } = req.body;

      // Check if student and course exist
      const courseResponse = await axios.get(
        `http://course:8070/v1/courses/${courseId}`
      );
      const course = courseResponse.data;

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Find enrollment for the specified user and course
      const enrollment = await Enrollment.findOne({
        course: courseId,
        user: userId,
      });

      if (!enrollment) {
        return res
          .status(404)
          .json({ message: "Enrollment not found for this user and course" });
      }

      res.status(200).json({ enrollmentId: enrollment._id });
      logger.info(
        `Enrollment ID for user ${userId} and course ${courseId} fetched successfully`
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch enrollment ID", error });
      logger.error(error);
    }
  },

  // Method to remove student enrollment from a course
  removeStudentEnrollment: async (req, res) => {
    try {
      const enrollmentId = req.params.enrollmentId;

      // Find the enrollment to get the student and course information
      const enrollment = await Enrollment.findById(enrollmentId);
      if (!enrollment) {
        return res.status(404).send({ message: "Enrollment not found" });
      }

      // Remove enrollment
      await Enrollment.findByIdAndDelete(enrollmentId);

      res
        .status(200)
        .send({ message: "Student enrollment removed successfully" });
      logger.info(`Student enrollment ${enrollmentId} removed successfully`);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "Failed to remove student enrollment", error });
      logger.error(error);
    }
  },

  // Method to get all enrollments
  getAllEnrollments: async (req, res) => {
    try {
      const enrollments = await Enrollment.find();
      res.status(200).json(enrollments);
      logger.info(`All enrollments fetched`);
    } catch (error) {
      logger.error(`Error getting all enrollments: ${error}`);
      res.status(500).json({ message: "Error getting all enrollments" });
    }
  },

  // Method to get Enrollment details by ID
  getEnrollmentbyId: async (req, res) => {
    let id = req.params.id; // Get the ID from the request parameter

    await Enrollment.findOne({ _id: `${id}` }) // Compare the ID with the requested ID and return the details
      .then((enrollment) => {
        res
          .status(200)
          .send({ status: "Enrollment Details fetched", enrollment }); // Send response as a JSON object and a status
        logger.info("Enrollment Details fetched");
      })
      .catch((err) => {
        logger.error(err.message);

        res.status(500).send({
          status: "Error with fetching Enrollment details",
          error: err.message,
        }); // Send error message
      });
  },
};

// Static method to send email notification
EnrollmentController.sendEmailNotification = async (
  studentEmail,
  courseName
) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
    tls: {
      // Allow self-signed certificates
      rejectUnauthorized: false,
    },
  });

  // Define email content
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: studentEmail,
    subject: "Course Enrollment Notification",
    html: `
              <p>Dear Student,</p>
              <p>You have been enrolled for the course "${courseName}".</p>
              <p>Regards,</p>
              <p>LearnHub</p>
          `,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    logger.error("Error sending email: ", error);
  }
};

EnrollmentController.sendSMSNotification = async (sendTo, body) => {
  try {
    const from = "LearnHub";
    const to = sendTo;
    const text = body;

    await vonage.sms
      .send({ to, from, text })
      .then((resp) => {
        console.log("Message sent successfully");
        console.log(resp);
      })
      .catch((err) => {
        console.log("There was an error sending the messages.");
        console.error(err);
      });
  } catch (error) {
    console.error("Error sending SMS:", error);
    logger.error("Error sending SMS:", error);
  }
};

export default EnrollmentController;
