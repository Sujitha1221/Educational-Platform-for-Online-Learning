import Course from "../models/course.mjs";
import logger from "../utils/logger.mjs";

export const CreateCourse = async (req, res) => {
    const {name, code, description, credits, startTime, endTime, day, videoLink, price} = req.body;

    if(name == "" || !name) {
        logger.info("Name cannot be null");
        return res.status(400).json({ status: "Name cannot be null" });
    } else if(code == "" || !code) {
        logger.info("Code cannot be null");
        return res.status(400).json({ status: "Code cannot be null" });
    } else if(description == "" || !description) {
        logger.info("Description cannot be null");
        return res.status(400).json({ status: "Description cannot be null" });
    } else if(credits == "" || !credits) {
        logger.info("Credits cannot be null");
        return res.status(400).json({ status: "Credits cannot be null" });
    } else if(isNaN(credits)){
        logger.info("Credits have to be a number");
        return res.status(400).json({ status: "Credits have to be a number" });
    } else if(startTime == "" || !startTime) {
        logger.info("Start time cannot be null");
        return res.status(400).json({ status: "Start time cannot be null" });
    } else if(endTime == "" || !endTime) {
        logger.info("End time cannot be null");
        return res.status(400).json({ status: "End time cannot be null" });
    } else if(day == "" || !day) {
        logger.info("Day cannot be null");
        return res.status(400).json({ status: "Day cannot be null" });
    } else if(videoLink == "" || !videoLink) {
        logger.info("Video link cannot be null");
        return res.status(400).json({ status: "Video link cannot be null" });
    } else if(startTime >= endTime) {
        logger.info("Invalid time");
        return res.status(400).json({ status: "Invalid input" });
    } else if(price == "" || !price) {
        logger.info("Price cannot be null");
        return res.status(400).json({ status: "Video link cannot be null" });
    } else if(isNaN(price)) {
        logger.info("Price should be a number");
        return res.status(400).json({ status: "Price should be a number" });
    }
    const course = await Course.findOne({code});
    if (course) {
        logger.info("Course already exists");
        return res.status(409).json({ status: "Course already exists" });
    }
    

    Course.create({name, code, description, credits, startTime, endTime, day, videoLink, price, status:"Pending"})
    .then((Course) => {
        logger.info("Course created successfully");
        return res.status(200).json(Course);
    })
    .catch((err) => {
        logger.error(`Error in CreateCourse ${err}`);
        return res.status(500).json({ status: "Error", err });
      })
}

export const GetCourse = (req, res) => {
    let objId = req.params.id;

    Course.findById(objId)
    .then((Course) => {
        logger.info("Course found successfully");
        return res.status(200).json(Course);
    })
    .catch((err) => {
        logger.error(`Error in GetCourse ${err}`);
        return res.status(500).json({ status: "Error", err });
    });
}

export const DeleteCourse = (req, res) => {
    let objId = req.params.id;

    Course.findByIdAndDelete(objId)
    .then(() => {
        logger.info("Course deleted successfully");
        return res.status(200).json({ status: "Success", objId });
    })
    .catch((err) => {
        logger.error(`Error in DeleteCourse ${err}`);
        return res.status(500).json({ status: "Error", err });
    });
}

export const GetAllCourse = (req, res) => {
    Course.find()
    .then(Course => {
        logger.info("All course found successfully");
        return res.status(200).json(Course);
    })
    .catch((err) => {
        logger.error(`Error in GetAllCourse ${err}`);
        return res.status(500).json({ status: "Error", err });
    });
}

export const UpdateCourse = async (req, res) => {
    let objId = req.params.id;
    const {name, code, description, credits, startTime, endTime, day, videoLink, price} = req.body;

    if(name == null || !name) {
        logger.info("Name cannot be null");
        return res.status(400).json({ status: "Name cannot be null" });
    } else if(code == null || !code) {
        logger.info("Code cannot be null");
        return res.status(400).json({ status: "Code cannot be null" });
    } else if(description == null || !description) {
        logger.info("Description cannot be null");
        return res.status(400).json({ status: "Description cannot be null" });
    } else if(credits == null || !credits) {
        logger.info("Credits cannot be null");
        return res.status(400).json({ status: "Credits cannot be null" });
    } else if(isNaN(credits)){
        logger.info("Credits have to be a number");
        return res.status(400).json({ status: "Credits have to be a number" });
    } else if(startTime == "" || !startTime) {
        logger.info("Start time cannot be null");
        return res.status(400).json({ status: "Start time cannot be null" });
    } else if(endTime == "" || !endTime) {
        logger.info("End time cannot be null");
        return res.status(400).json({ status: "End time cannot be null" });
    } else if(day == "" || !day) {
        logger.info("Day cannot be null");
        return res.status(400).json({ status: "Day cannot be null" });
    } else if(videoLink == "" || !videoLink) {
        logger.info("Video link cannot be null");
        return res.status(400).json({ status: "Video link cannot be null" });
    } else if(price == "" || !price) {
        logger.info("Price cannot be null");
        return res.status(400).json({ status: "Video link cannot be null" });
    } else if(isNaN(price)) {
        logger.info("Price should be a number");
        return res.status(400).json({ status: "Price should be a number" });
    }
    
    const course = await Course.findOne({code});
    if (course && course.code != code) {
        logger.info("Course already exists");
        return res.status(409).json({ status: "Course already exists" });
    }

    Course.findById(objId)
    .then((Course) => {
        Course.name = name;
        Course.code = code;
        Course.description = description;
        Course.credits = credits;
        Course.startTime = startTime;
        Course.endTime = endTime;
        Course.day = day;
        Course.videoLink = videoLink;
        Course.price = price;
        Course.save()
        .then(Course => {
            logger.info("Course updated successfully");
            return res.status(200).json(Course);
        })
        .catch((err) => {
            logger.error(`Error in UpdateCourse ${err}`);
            return res.status(500).json({ status: "Error", err });
        });  
    })
    .catch((err) => {
        logger.error(`Error in GetCourse ${err}`);
        return res.status(500).json({ status: "Error", err });
    });
}

export const UpdateCourseStatus = async (req, res) => {
    let objId = req.params.id;
    const {status} = req.body;

    Course.findById(objId)
    .then((Course) => {
        Course.status = status;
        Course.save()
        .then(Course => {
            logger.info("Course updated successfully");
            return res.status(200).json(Course);
        })
        .catch((err) => {
            logger.error(`Error in UpdateCourse ${err}`);
            return res.status(500).json({ status: "Error", err });
        });  
    })
    .catch((err) => {
        logger.error(`Error in GetCourse ${err}`);
        return res.status(500).json({ status: "Error", err });
    });
}

export const AssignFaculty = async (req, res) => {
    let objId = req.params.id;
    const {faculty} = req.body;
    
    if(faculty == null) {
        logger.info("Faculty cannot be null");
        return res.status(400).json({ status: "Faculty cannot be null" });
    }

    Course.findById(objId)
    .then((Course) => {
        Course.faculty = faculty;
        
        Course.save()
        .then(Course => {
            logger.info("Course updated successfully (Assign Faculty)");
            return res.status(200).json(Course);
        })
        .catch((err) => {
            logger.error(`Error in AssignFaculty ${err}`);
            return res.status(500).json({ status: "Error", err });
        });  
    })
    .catch((err) => {
        logger.error(`Error in GetCourse ${err}`);
        return res.status(500).json({ status: "Error", err });
    });
}

export const GetAllAcceptedCourse = (req, res) => {
    Course.find({ status: "Accepted" }) 
    .then(courses => {
        logger.info("All accepted courses found successfully");
        return res.status(200).json(courses);
    })
    .catch((err) => {
        logger.error(`Error in GetAllAcceptedCourse: ${err}`);
        return res.status(500).json({ status: "Error", error: err.message });
    });
}

export const getVisibleVideos = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            res.status(404).json({ error: "Course not found" });
            return;
        }

        const { startTime, endTime, day, videoLink } = course;

        // Get current time and day in Sri Lanka's time zone
        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false, timeZone: "Asia/Colombo" });

        function getFullDayName(abbreviatedDay) {
            switch (abbreviatedDay) {
                case 'Sun':
                    return 'Sunday';
                case 'Mon':
                    return 'Monday';
                case 'Tue':
                    return 'Tuesday';
                case 'Wed':
                    return 'Wednesday';
                case 'Thu':
                    return 'Thursday';
                case 'Fri':
                    return 'Friday';
                case 'Sat':
                    return 'Saturday';
                default:
                    return null; // Handle invalid input
            }
        }
        const currentDay = getFullDayName(new Date().toLocaleDateString('en-US', { weekday: 'short' }));

        if (day !== currentDay) {
            res.status(400).json({ error: `Course is not scheduled for today (${currentDay})` });
            return;
        }

        // Convert course start and end times to Sri Lanka's time zone
        const start = new Date(`2022-01-01T${startTime}`).toLocaleTimeString("en-US", { hour12: false, timeZone: "Asia/Colombo" });
        console.log(start)
        const end = new Date(`2022-01-01T${endTime}`).toLocaleTimeString("en-US", { hour12: false, timeZone: "Asia/Colombo" });
        console.log(end)

        // Check if current time is after the end time of the course
        if (currentTime > end) {
            res.status(400).json({ error: "Course time has ended. Videos are no longer available." });
            return;
        }

        // Check if current time is within the time range of the course
        if (currentTime < start || currentTime > end) {
            res.status(400).json({ error: "Course is not currently in session." });
            return;
        }

        res.status(200).json({ videos: videoLink });
    } catch (error) {
        console.error("Error fetching visible videos:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}