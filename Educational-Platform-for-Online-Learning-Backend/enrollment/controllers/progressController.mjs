import Progress from "../models/progress.mjs";
import axios from "axios";
import logger from "../utils/logger.mjs";

const ProgressController = {
  markVideoAsWatched: async (req, res) => {
    try {
      const { userId, courseId, videoId } = req.body;
      let progress = await Progress.findOne({ userId, courseId });

      if (!progress) {
        progress = new Progress({ userId, courseId, watchedVideos: [videoId] });
        await progress.save();
        return res.status(201).json({
          message: "Marked video successfully",
          progress,
        });
      }

      // Check if the video has already been watched
      if (progress.watchedVideos.includes(videoId)) {
        return res.status(200).json({
          message: "Video is already marked as watched",
          progress,
        });
      }

      progress.watchedVideos.push(videoId);
      await progress.save();
      return res.status(201).json({
        message: "Marked video successfully",
        progress,
      });
    } catch (error) {
      logger.error("Error marking video as watched:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },

  getCourseCompletionPercentage: async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      const progress = await Progress.findOne({ userId, courseId });
      if (!progress) return 0;

      const courseResponse = await axios.get(
        `http://course:8070/v1/courses/${courseId}`
      );
      const course = courseResponse.data;
      if (!course) throw new Error("Course not found");

      const totalVideos = course.videoLink.length;

      const percentage = (
        (progress.watchedVideos.length / totalVideos) *
        100
      ).toFixed(2);
      res.status(201).json({
        message: "Percentage returned successfully",
        percentage,
      });
    } catch (error) {
      logger.error("Error calculating course completion percentage:", error);
      throw error;
    }
  },

  getWatchedVideos: async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      const progress = await Progress.findOne({ userId, courseId });
      if (!progress) {
        return res.status(404).json({
          message: "No progress found for the user and course.",
          watchedVideos: [],
        });
      }

      const watchedVideos = progress.watchedVideos;
      return res.status(200).json({
        message: "Watched videos fetched successfully.",
        watchedVideos,
      });
    } catch (error) {
      logger.error("Error fetching watched videos:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};

export default ProgressController;
