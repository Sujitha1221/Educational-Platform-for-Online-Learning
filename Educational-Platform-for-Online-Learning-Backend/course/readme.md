[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MhkFIDKy)

## Setup Instructions

1. **Node.js Installation**: Ensure you have Node.js installed on your machine. The required version is 18.16.1 or higher. You can download it from [the official Node.js website](https://nodejs.org/).

2. **Clone the Repository**: Clone this repository to your local machine using the following command:
```
git clone https://github.com/sliitcsse/assignment-01-IT21204302.git
```

3. **Install Dependencies**: Navigate into the project directory and install the dependencies using npm:
```
cd assignment-01-IT21204302
```
```
npm install
```

4. **Environment Variables**: Create a `.env` file in the root directory of the project and set any necessary environment variables. You can use the provided `.env.example` file as a template.

5. **To Run the Application**: Execute the following command:
```
npm start
```

## API Endpoint Documentation

### Authentication Endpoints

- **POST /login**: Login.

### User Endpoints

- **GET /user**: Retrieve a list of all users.
- **GET /user/{userId}**: Retrieve details of a specific user.
- **POST /user**: Create a new user.
- **PUT /user/{userId}**: Update details of a specific user.
- **DELETE /user/{userId}**: Delete a specific user.

### Role Endpoints

- **GET /role**: Retrieve a list of all user roles.
- **GET /role/{roleId}**: Retrieve details of a specific user role.
- **POST /role**: Create a new user role.
- **PUT /role/{roleId}**: Update details of a specific user role.
- **DELETE /role/{roleId}**: Delete a specific user role.

### Course Endpoints

- **GET /course**: Retrieve a list of all courses.
- **GET /course/{courseId}**: Retrieve details of a specific course.
- **POST /course**: Create a new course.
- **PUT /course/{courseId}**: Update details of a specific course.
- **DELETE /course/{courseId}**: Delete a specific course.
- **PUT /course/assign-faculty/{courseId}**: Assign faculty to a course.
- **POST /course/announcements**: Send announcements to enrolled students.

### Timetable Endpoints

- **GET /timetable**: Retrieve a list of all timetables.
- **GET /timetable/{timetableId}**: Retrieve details of a specific timetable.
- **POST /timetable**: Create a new timetable.
- **PUT /timetable/{timetableId}**: Update details of a specific timetable.
- **DELETE /timetable/{timetableId}**: Delete a specific course.
- **GET /timetable/course/{courseId}**: Retrieve timetable for a specific course.

### Room and Resource Endpoints

- **GET /roomAndResource**: Retrieve a list of all room and resources.
- **GET /roomAndResource/{roomAndResourceId}**: Retrieve details of a specific room and resource.
- **POST /roomAndResource**: Create a new room and resource.
- **PUT /roomAndResource/{roomAndResourceId}**: Update details of a specific room and resource.
- **DELETE /roomAndResource/{roomAndResourceId}**: Delete a specific room and resource.

### Booking Endpoints

- **GET /booking**: Retrieve a list of all bookings.
- **GET /booking/{bookingId}**: Retrieve details of a specific booking.
- **POST /booking**: Create a new booking.
- **PUT /booking/{bookingId}**: Update details of a specific booking.
- **DELETE /booking/{bookingId}**: Delete a specific booking.

### Enrollment Endpoints

- **GET /enrollment**: Retrieve a list of all enrollments.
- **GET /enrollment/{enrollmentId}**: Retrieve details of a specific enrollment.
- **POST /enrollment**: Create a new enrollment.
- **DELETE /enrollment/{enrollmentId}**: Delete a specific enrollment.
- **GET /enrollment/student/{studentId}**: Retrieve enrollment for a specific student.
- **GET /enrollment/course/{courseId}**: Retrieve enrollment for a specific course.

## Running Tests

### Unit Tests

To run unit tests, use the following command:
```
npm test
```

### Integration Tests

Before running integration tests, make sure to set up your environment variables. Add an access token to the `TEST_ACCESS_TOKEN` variable in the `.env` file.
To run integration tests, use the following command:
```
npm test
```

## Performance Testing

### Using Artillery.io

To perform performance testing using Artillery.io, follow these steps:

1. **Navigate to Test Directory**: Open your terminal and navigate to the directory where your test scripts are located. For example:
```
cd test
```
2. **To Run the Application**: Execute the following command:
```
artillery run PerformanceTesting.yml
```


## Importing and Loading Postman Collection

1. **Import Collection**: In the Postman application, click on the "Import" button located in the top left corner.

2. **Run Requests**: To run a request, simply click on the "Send" button located on the request window.