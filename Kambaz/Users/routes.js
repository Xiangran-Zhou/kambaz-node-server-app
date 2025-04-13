import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  // Create a new user
  const createUser = async (req, res) => {
    const newUser = await dao.createUser(req.body);
    res.json(newUser);
  };

  // Delete a user by id
  const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const result = await dao.deleteUser(userId);
    res.json(result);
  };

  // Retrieve all users; supports filtering by role or partial name.
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await dao.findAllUsers();
    res.json(users);
  };

  // Retrieve a user by its MongoDB _id.
  const findUserById = async (req, res) => {
    const user = await dao.findUserById(req.params.userId);
    res.json(user);
  };

  // Update user and sync session.
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    await dao.updateUser(userId, userUpdates);
    let currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      currentUser = { ...currentUser, ...userUpdates };
      req.session["currentUser"] = currentUser;
    }
    res.json(currentUser);
  };

  // Sign up: create user if username is not taken and store in session.
  const signup = async (req, res) => {
    const existing = await dao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  // Sign in: store the found user in session.
  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  // Sign out: destroy the session.
  const signout = async (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  // Profile: return currentUser from session.
  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  // Retrieve courses for the enrolled user.
  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = await courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  // Create a new course and enroll the current user in it.
  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const newCourse = await courseDao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  // Enroll current user in a course.
  const enrollCourseForCurrentUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    const { courseId } = req.body;
    const newEnrollment = await enrollmentsDao.enrollUserInCourse(
      currentUser._id,
      courseId
    );
    res.json(newEnrollment);
  };

  // Find enrollments for a user.
  const findEnrollmentsForUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const enrollments = await enrollmentsDao.findEnrollmentsforUser(userId);
    res.json(enrollments);
  };

  // Routes
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
  app.post("/api/users/current/courses", createCourse);
  app.post("/api/users/enroll", enrollCourseForCurrentUser);
}
