import * as enrollmentsDao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.post("/api/enrollments", async (req, res) => {
    const { user, course } = req.body;
    if (!user || !course) {
      return res.status(400).json({ message: "User and course are required" });
    }
    try {
      const newEnrollment = await enrollmentsDao.enrollUserInCourse(
        user,
        course
      );
      res.json(newEnrollment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error enrolling user" });
    }
  });

  app.delete("/api/enrollments", async (req, res) => {
    const { user, course } = req.body;
    if (!user || !course) {
      return res.status(400).json({ message: "User and course are required" });
    }
    try {
      const result = await enrollmentsDao.unenrollUserFromCourse(user, course);
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

  // This GET route checks for query parameters. If none provided, it returns all enrollments.
  app.get("/api/enrollments", async (req, res) => {
    try {
      const { user, course } = req.query;
      if (user) {
        const enrollments = await enrollmentsDao.findCoursesForUser(user);
        res.json(enrollments);
      } else if (course) {
        const enrollments = await enrollmentsDao.findUsersForCourse(course);
        res.json(enrollments);
      } else {
        const allEnrollments = await enrollmentsDao.findAllEnrollments();
        res.json(allEnrollments);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving enrollments" });
    }
  });
}
