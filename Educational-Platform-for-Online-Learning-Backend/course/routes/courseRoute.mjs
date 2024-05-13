import { Router } from "express";
import { CreateCourse, GetCourse, DeleteCourse, GetAllCourse, UpdateCourse, AssignFaculty, getVisibleVideos, UpdateCourseStatus, GetAllAcceptedCourse } from "../controllers/courseController.mjs";

const route = Router();

route.get('/accepted-course', GetAllAcceptedCourse);
route.post('/', CreateCourse);
route.get('/:id', GetCourse);
route.delete('/:id', DeleteCourse);
route.get('/', GetAllCourse);
route.put('/:id', UpdateCourse);
route.put('/assign-faculty/:id', AssignFaculty);
route.put('/update-status/:id', UpdateCourseStatus);
route.get('/video/:id',getVisibleVideos);

export default route;