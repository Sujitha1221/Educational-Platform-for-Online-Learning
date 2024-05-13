const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserById,
  loginUser,
  updateUser,
  deleteUser,
  getAllAdmins,
  getAllStudents,
  getAllInstructors,
  forgotPassword,
  changePassword,
  verifyUser,
  addInstructor,
  checkUserRole,
} = require("../controllers/userController");
const {
  validateToken,
  verifyUserRole,
} = require("../middleware/validateTokenHandler");

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/user/:id", validateToken, getUserById);

router.get("/all-admins", validateToken, verifyUserRole("admin"), getAllAdmins);
router.get(
  "/all-students",
  validateToken,
  verifyUserRole("admin"),
  getAllStudents
);
router.get(
  "/all-instructors",
  validateToken,
  verifyUserRole("admin"),
  getAllInstructors
);
router.put("/:id", validateToken, updateUser);
router.delete("/:id", validateToken, deleteUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id/:token", changePassword);
router.get("/confirm-user/:token", verifyUser);
router.post(
  "/add-instructor",
  validateToken,
  verifyUserRole("admin"),
  addInstructor
);
router.get("/check-role/:role", validateToken, checkUserRole);

module.exports = router;
