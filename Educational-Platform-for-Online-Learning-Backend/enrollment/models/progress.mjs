import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProgressSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    watchedVideos: {
        type: [String], // Define watchedVideos as an array of strings
        default: []    // Set default value as an empty array
    }
});

const Progress = mongoose.model("Progress", ProgressSchema);

export default Progress;
