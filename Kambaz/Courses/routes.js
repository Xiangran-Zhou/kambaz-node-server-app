import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {
  app.get("/api/courses", (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  });

  // Delete route to remove a course.
  app.delete("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    dao.deleteCourse(courseId);
    res.sendStatus(204);
  });

  // Update route to update an existing course.
  app.put("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const updatedCourse = dao.updateCourse(courseId, courseUpdates);
    res.json(updatedCourse);
  });

  // Retrieve modules for a course by its ID.
  app.get("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    const modules = modulesDao.findModulesForCourse(courseId);
    res.json(modules);
  });

  // NEW: Create a new module for a given course.
  app.post("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    const moduleData = { ...req.body, course: courseId };
    const newModule = modulesDao.createModule(moduleData);
    res.send(newModule);
  });
}
