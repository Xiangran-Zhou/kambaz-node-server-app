import * as userDao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  const createUser = async (req, res) => {
    const newUser = await userDao.createUser(req.body);
    res.json(newUser);
  };

  const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const result = await userDao.deleteUser(userId);
    res.json(result);
  };

  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;
    if (role) {
      const users = await userDao.findUsersByRole(role);
      res.json(users);
      return;
    }
    if (name) {
      const users = await userDao.findUsersByPartialName(name);
      res.json(users);
      return;
    }
    const users = await userDao.findAllUsers();
    res.json(users);
  };

  const findUserById = async (req, res) => {
    const user = await userDao.findUserById(req.params.userId);
    res.json(user);
  };

  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    const updatedUser = await userDao.updateUser(userId, userUpdates);
    let currentUser = req.session["currentUser"];
    if (currentUser && currentUser._id === userId) {
      currentUser = { ...currentUser, ...userUpdates };
      req.session["currentUser"] = currentUser;
    }
    res.json(currentUser);
  };

  const signup = async (req, res) => {
    const existing = await userDao.findUserByUsername(req.body.username);
    if (existing) {
      res.status(400).json({ message: "Username already taken" });
      return;
    }
    const currentUser = await userDao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  const signin = async (req, res) => {
    const { username, password } = req.body;
    const currentUser = await userDao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  const signout = async (req, res) => {
    req.session.destroy(() => {
      res.sendStatus(200);
    });
  };

  const profile = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };

  const findCoursesForUser = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    if (currentUser.role === "ADMIN") {
      const courses = await courseDao.findAllCourses();
      res.json(courses);
      return;
    }
    let { uid } = req.params;
    if (uid === "current") {
      uid = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(uid);
    res.json(courses);
  };

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

  // ADD THE DELETE ROUTE FOR UNENROLLMENT:
  app.delete("/api/users/:userId/courses/:courseId", async (req, res) => {
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        return res.sendStatus(401);
      }
      userId = currentUser._id;
    }
    try {
      const result = await enrollmentsDao.unenrollUserFromCourse(
        userId,
        courseId
      );
      if (result.deletedCount && result.deletedCount > 0) {
        res.sendStatus(204);
      } else {
        res.status(404).json({ message: "Enrollment not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error unenrolling user" });
    }
  });

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
    const enrollments = await userDao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  };

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/:uid/courses", findCoursesForUser);
  app.get("/api/users/:userId/enrollments", findEnrollmentsForUser);
  app.post("/api/users/current/courses", createCourse);
  app.post("/api/users/enroll", enrollCourseForCurrentUser);
}
