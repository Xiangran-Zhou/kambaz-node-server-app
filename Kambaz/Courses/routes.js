import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  // Retrieve all courses.
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  });

  // Create a new course and enroll the author.
  app.post("/api/courses", async (req, res) => {
    const course = req.body;
    const newCourse = await dao.createCourse(course);
    const currentUser = req.session["currentUser"];
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    }
    res.json(newCourse);
  });

  // Delete a course.
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  });

  // Update an existing course.
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  });

  // Retrieve modules for a course by its ID.
  app.get("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const modules = await modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  // Create a new module for a given course.
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    const { courseId } = req.params;
    const moduleData = { ...req.body, course: courseId };
    const newModule = await modulesDao.createModule(moduleData);
    res.send(newModule);
  });

  // ---------------------------------------------------------------------
  // NEW: Retrieve users enrolled in a specific course (cid).
  // ---------------------------------------------------------------------
  app.get("/api/courses/:cid/users", async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  });
}
