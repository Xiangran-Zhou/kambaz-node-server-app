import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// Create a new module document in the database.
export function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  return model.create(newModule);
}

// Retrieve all modules for a given course.
export function findModulesForCourse(courseId) {
  return model.find({ course: courseId });
}

// Delete a module by its ID.
export function deleteModule(moduleId) {
  return model.deleteOne({ _id: moduleId });
}

// Update a module by its ID.
export function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
}
