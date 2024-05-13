import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CourseSchema = new Schema({  
    name:{
        type:String,
        required: true
    },

    code:{
        type:String,
        required: true,  
    },

    description:{
        type:String,
        required: true,    
    },

    credits:{
        type:Number,
        required: true,    
    }, 

    startTime:{
        type:String,
        required: true,  
    },

    endTime:{
        type:String,
        required: true,    
    },

    day: {
        type:String,
        required: true, 
    },

    videoLink: [{
        type: String,
        required: true,
    }],

    price: {
        type:String,
        required: true, 
    },

    status: {
        type:String,
        required: true, 
    },
});

const Course = mongoose.model("Course", CourseSchema);

export default Course;