
import EnrollmentController from "../controllers/enrollmentController.mjs";
import express from "express";

const EnrollmentRouter = express.Router();

EnrollmentRouter.post("/" ,EnrollmentController.enrollStudentInCourse);
EnrollmentRouter.post("/checkValidity" ,EnrollmentController.checkEnrollmentValiditity);
EnrollmentRouter.get("/viewEnrollment/:courseId", EnrollmentController.viewStudentEnrollments);
EnrollmentRouter.get("/viewCourse/:studentId",EnrollmentController.viewStudentEnrolledCourses);
EnrollmentRouter.delete('/:enrollmentId',EnrollmentController.removeStudentEnrollment);
EnrollmentRouter.get("/", EnrollmentController.getAllEnrollments);
EnrollmentRouter.get('/:id',EnrollmentController.getEnrollmentbyId);
EnrollmentRouter.post('/getEnrollmentId',EnrollmentController.getEnrollmentId);

export default EnrollmentRouter;
