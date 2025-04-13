import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export function findAssignmentsForCourse(courseId) {
  return model.find({ course: courseId });
}
export function createAssignment(assignment) {
  return model.create({ ...assignment, _id: uuidv4() });
}
export function deleteAssignment(assignmentId) {
  return model.deleteOne({ _id: assignmentId });
}
export function updateAssignment(assignmentId, assignmentUpdates) {
  if (!assignmentUpdates) {
    return;
  }
  return model.updateOne({ _id: assignmentId }, assignmentUpdates);
}
