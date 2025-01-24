// import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
// import rzpLogo from "../../assets/Logo/rzp_logo.png"
// import { setPaymentLoading } from "../../slices/courseSlice";
// import { resetCart } from "../../slices/cartSlice";


const { SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

// ================ buyCourse ================ 
// export async function buyCourse(token, coursesId) {
//     const toastId = toast.loading("Loading...");

//     try {
//         //load the script
//         // initiate the order
//         const orderResponse = await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API,
//             { coursesId },
//             {
//                 Authorization: `Bearer ${token}`,
//             })
//         // console.log("orderResponse... ", orderResponse);
//         if (!orderResponse.data.success) {
//             throw new Error(orderResponse.data.message);
//         }


//         // options
//         const options = {
//             handler: function (response) {
//                 //send successful mail
//                 sendPaymentSuccessEmail(response,coursesId, token);
//                 //verifyPayment
//                 // verifyPayment({ ...response, coursesId }, token, navigate, dispatch);
//             }
//         }

//     }
//     catch (error) {
//         console.log("PAYMENT API ERROR.....", error);
//         toast.error(error.response?.data?.message);
//         // toast.error("Could not make Payment");
//     }
//     toast.dismiss(toastId);
// }


// ================ send Payment Success Email ================
export async function sendPaymentSuccessEmail(token,coursesId) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {coursesId}, {
            Authorization: `Bearer ${token}`
        })
    }
    catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}


// ================ verify payment ================
// async function verifyPayment(bodyData, token, navigate, dispatch) {
//     const toastId = toast.loading("Verifying Payment....");
//     dispatch(setPaymentLoading(true));

//     try {
//         const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
//             Authorization: `Bearer ${token}`,
//         })

//         if (!response.data.success) {
//             throw new Error(response.data.message);
//         }
//         toast.success("payment Successful, you are addded to the course");
//         navigate("/dashboard/enrolled-courses");
//         dispatch(resetCart());
//     }
//     catch (error) {
//         console.log("PAYMENT VERIFY ERROR....", error);
//         toast.error("Could not verify Payment");
//     }
//     toast.dismiss(toastId);
//     dispatch(setPaymentLoading(false));
// }