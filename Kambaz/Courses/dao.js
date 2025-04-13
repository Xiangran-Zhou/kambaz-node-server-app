import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// Retrieve all courses from the MongoDB "courses" collection.
export async function findAllCourses() {
  return await model.find();
}

// (Optional) Retrieve courses for an enrolled user.
// Placeholder: adjust filtering logic as needed.
export async function findCoursesForEnrolledUser(userId) {
  return await model.find();
}

// Create a new course document in the database.
export function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return model.create(newCourse);
}

// Delete a course by its ID.
export function deleteCourse(courseId) {
  return model.deleteOne({ _id: courseId });
}

// Update a course document with the provided updates.
export function updateCourse(courseId, courseUpdates) {
  return model.updateOne({ _id: courseId }, { $set: courseUpdates });
}
