import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  const newEnrollment = { _id: uuidv4(), user: userId, course: courseId };
  enrollments.push(newEnrollment);
  return newEnrollment;
}

export function unenrollUserFromCourse(userId, courseId) {
  const { enrollments } = Database;
  const initialLength = enrollments.length;
  Database.enrollments = enrollments.filter(
    (enrollment) =>
      !(enrollment.user === userId && enrollment.course === courseId)
  );
  return Database.enrollments.length < initialLength;
}

export function findAllEnrollments() {
  return Database.enrollments;
}

export function findEnrollmentsByUser(userId) {
  return Database.enrollments.filter(
    (enrollment) => enrollment.user === userId
  );
}

export function findEnrollmentsByCourse(courseId) {
  return Database.enrollments.filter(
    (enrollment) => enrollment.course === courseId
  );
}
