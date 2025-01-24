import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import Img from './../../common/Img';
import { sendPaymentSuccessEmail } from "../../../services/operations/studentFeaturesAPI"


function CourseDetailsCard({ course, setConfirmationModal }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const { _id: courseId } = course;

  // Buy Course handler
  const handleBuyCourse = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.ADMIN) {
      toast.error("You are an Admin. You are not enrolled in this course.")
      return
    }

    if (token) {
      const coursesId = course._id;
      sendPaymentSuccessEmail(token, coursesId, navigate, dispatch);
      navigate("/dashboard/enrolled-courses");
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  const handleGoToCourse = () => {
    if (user && course?.studentsEnrolled.includes(user?._id)) {
      navigate("/dashboard/enrolled-courses");
    } else {
      // toast.error("You are not enrolled in this course.");
      // Call the buy course handler
      handleBuyCourse();
    }
  };

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.ADMIN) {
      toast.error("You are an Admin. You are not cart this course.")
      return
    }
    if (!user) {
      toast.error("You need to log in to add courses to your cart.");
      return;
    }
    dispatch(addToCart(course)); // Dispatch the action to add to cart
    // toast.success("Course added to cart!");
  };

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-2xl bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <Img
          src={course.thumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton outline-none"
              onClick={handleGoToCourse}
            >
              Go To Course
            </button>
            <button
              className="yellowButton outline-none"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>

          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
              onClick={() => {
                copy(window.location.href);
                toast.success("Link copied to clipboard");
              }}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseDetailsCard;
