import { combineReducers } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import authReducer from "../slices/authSlice"; // Ensure LOGOUT is correctly imported
import cartReducer from "../slices/cartSlice";
import courseReducer from "../slices/courseSlice";
import profileReducer from "../slices/profileSlice";
import viewCourseReducer from "../slices/viewCourseSlice";
import sidebarSlice from "../slices/sidebarSlice";

// Helper function to check token expiration
// const isTokenExpired = () => {
//   const token = localStorage.getItem("token");
//   if (!token) return true; // No token, consider it expired

//   try {
//     const { exp } = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
//     return Date.now() >= exp * 1000; // Check if the current time exceeds expiration
//   } catch (error) {
//     console.error("Invalid token:", error);
//     return true; // Treat invalid tokens as expired
//   }
// };

// // Middleware to handle token expiration
// const tokenExpirationMiddleware = (store) => (next) => (action) => {
//   // Avoid processing further if the action is already LOGOUT
//   if (action.type === LOGOUT) {
//     return next(action);
//   }

//   // Check if the token is expired
//   if (isTokenExpired()) {
//     // Clear the local storage and state
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     // Show toast notification
//     toast.error("Session expired. Please log in again.");

//     // Dispatch logout action with a serializable type
//     store.dispatch({ type: LOGOUT });

//     // Redirect to login page
//     window.location.href = "/login";
//     return; // Stop further processing of the current action
//   }

//   return next(action); // Pass the action to the next middleware/reducer
// };

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  course: courseReducer,
  cart: cartReducer,
  viewCourse: viewCourseReducer,
  sidebar: sidebarSlice,
});

// export { rootReducer, tokenExpirationMiddleware };
export { rootReducer };