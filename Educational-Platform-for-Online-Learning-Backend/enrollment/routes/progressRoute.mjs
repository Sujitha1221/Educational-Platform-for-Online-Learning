
import ProgressController from "../controllers/progressController.mjs";
import express from "express";

const ProgressRouter = express.Router();

ProgressRouter.post("/watchedVideos" ,ProgressController.markVideoAsWatched);
ProgressRouter.post("/viewProgress", ProgressController.getCourseCompletionPercentage);
ProgressRouter.post("/viewWatchedVideos", ProgressController.getWatchedVideos);


export default ProgressRouter;
