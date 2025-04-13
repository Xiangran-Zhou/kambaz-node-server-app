import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// Create a new user in the database.
// Ensure the incoming user does not have an _id property.
export const createUser = (user) => {
  // Always assign a new _id
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
};

// Retrieve all users from the database.
export const findAllUsers = () => model.find();

// Retrieve a user by its MongoDB _id.
export const findUserById = (userId) => model.findById(userId);

// Find a user by username.
export const findUserByUsername = (username) => model.findOne({ username });

// Find a user by username and password.
export const findUserByCredentials = (username, password) =>
  model.findOne({ username, password });

// Update an existing user.
export const updateUser = (userId, user) =>
  model.updateOne({ _id: userId }, { $set: user });

// Delete a user by its _id.
export const deleteUser = (userId) => model.deleteOne({ _id: userId });

// Filter users by the role property.
export const findUsersByRole = (role) => model.find({ role });

// Filter users by a partial match on first or last name.
export const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};
