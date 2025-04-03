import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Retrieve all assignments.
// If a courseId is provided, filter assignments by course.
export function findAllAssignments(courseId) {
  const { assignments } = Database;
  if (courseId) {
    return assignments.filter((a) => a.course === courseId);
  }
  return assignments;
}

// Retrieve a single assignment by its ID.
export function findAssignmentById(assignmentId) {
  const { assignments } = Database;
  return assignments.find((a) => a._id === assignmentId);
}

// Create a new assignment.
export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

export function updateAssignment(assignmentId, updates) {
  const { assignments } = Database;
  const assignment = assignments.find((a) => a._id === assignmentId);
  if (assignment) {
    Object.assign(assignment, updates);
  }
  return assignment;
}

export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  Database.assignments = assignments.filter((a) => a._id !== assignmentId);
}
