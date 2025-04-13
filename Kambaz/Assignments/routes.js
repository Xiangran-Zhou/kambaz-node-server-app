// src/Kambaz/Assignments/routes.js
import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  // GET all assignments (optionally filtered by course)
  app.get("/api/assignments", async (req, res) => {
    try {
      const { course } = req.query;
      let assignments;
      if (course) {
        assignments = await assignmentsDao.findAssignmentsForCourse(course);
      } else {
        // If no course filter is provided, fetch all assignments.
        // (Assuming passing an empty string returns all assignments.)
        assignments = await assignmentsDao.findAssignmentsForCourse("");
      }
      res.json(assignments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving assignments" });
    }
  });

  // GET a single assignment by its ID
  app.get("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      // Ensure you have a DAO method for finding one by ID.
      const assignment = await assignmentsDao.findAssignmentById(assignmentId);
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving assignment" });
    }
  });

  // POST: Create a new assignment
  app.post("/api/assignments", async (req, res) => {
    try {
      const assignment = req.body;
      const newAssignment = await assignmentsDao.createAssignment(assignment);
      res.json(newAssignment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating assignment" });
    }
  });

  // PUT: Update an assignment by its ID
  app.put("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const assignmentUpdates = req.body;
      const status = await assignmentsDao.updateAssignment(
        assignmentId,
        assignmentUpdates
      );
      res.send(status);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating assignment" });
    }
  });

  // DELETE: Remove an assignment by its ID
  app.delete("/api/assignments/:assignmentId", async (req, res) => {
    try {
      const { assignmentId } = req.params;
      const status = await assignmentsDao.deleteAssignment(assignmentId);
      res.send(status);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting assignment" });
    }
  });
}
