import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.post("/api/enrollments", (req, res) => {
    const { user, course } = req.body;
    if (!user || !course) {
      return res.status(400).json({ message: "User and course are required" });
    }
    const newEnrollment = enrollmentsDao.enrollUserInCourse(user, course);
    res.json(newEnrollment);
  });

  app.delete("/api/enrollments", (req, res) => {
    const { user, course } = req.body;
    if (!user || !course) {
      return res.status(400).json({ message: "User and course are required" });
    }
    const success = enrollmentsDao.unenrollUserFromCourse(user, course);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: "Enrollment not found" });
    }
  });

  app.get("/api/enrollments", (req, res) => {
    const { user, course } = req.query;
    if (user) {
      res.json(enrollmentsDao.findEnrollmentsByUser(user));
    } else if (course) {
      res.json(enrollmentsDao.findEnrollmentsByCourse(course));
    } else {
      res.json(enrollmentsDao.findAllEnrollments());
    }
  });
}
