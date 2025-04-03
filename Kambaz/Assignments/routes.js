import * as assignmentsDao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/assignments", (req, res) => {
    const { course } = req.query;
    const assignments = assignmentsDao.findAllAssignments(course);
    res.json(assignments);
  });

  app.get("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const assignment = assignmentsDao.findAssignmentById(assignmentId);
    if (!assignment) {
      res.status(404).json({ message: "Assignment not found" });
    } else {
      res.json(assignment);
    }
  });

  app.post("/api/assignments", (req, res) => {
    const assignment = req.body;
    const newAssignment = assignmentsDao.createAssignment(assignment);
    res.json(newAssignment);
  });

  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const updates = req.body;
    const updatedAssignment = assignmentsDao.updateAssignment(
      assignmentId,
      updates
    );
    if (!updatedAssignment) {
      res.status(404).json({ message: "Assignment not found" });
    } else {
      res.json(updatedAssignment);
    }
  });

  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    assignmentsDao.deleteAssignment(assignmentId);
    res.sendStatus(204);
  });
}
