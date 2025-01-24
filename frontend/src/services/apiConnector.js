import axios from "axios"


export const axiosInstance = axios.create({});


// // ================ Logout ================
// export function logout(navigate) {
//     return (dispatch) => {
//       dispatch(setToken(null))
//       dispatch(setUser(null))
//       dispatch(resetCart())
//       localStorage.removeItem("token")
//       localStorage.removeItem("user")
//       toast.success("Logged Out")
//       navigate("/")
//     }
//   }
  
// Add an interceptor to handle token expiration
// axiosInstance.interceptors.response.use(
//   (response) => response, // Pass through successful responses
//   (error) => {
//     // Check for token expiration
//     if (error.response?.status === 401) {
//       const message = error.response.data?.message;

//       if (error.response.status.data?.error === "jwt expired" || error.response.statusText === "Unauthorized") {
//         // Clear token from localStorage or cookies
//         localStorage.removeItem("token");

//         // Redirect to login page
//         // Show a notification (optional)
//         toast.error("Session expired. Please log in again.");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error); // Pass other errors to the caller
//   }
// );

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}