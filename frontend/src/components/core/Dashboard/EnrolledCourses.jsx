import { useEffect, useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI";
import Img from './../../common/Img';
import convertToHoursMinutes from "../../../utils/courseDuration";
import { apiConnector } from "../../../services/apiConnector";
import { getCertificateId } from "../../../services/operations/courseDetailsAPI";

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(null); // Track loading for each course

  // Fetch all users enrolled courses
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);
      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  // Generate Certificate for a specific course
  const generateCertificate = async (courseId, studentId) => {
    setLoadingCourse(courseId); // Set loading state for the selected course
    try {
      const response = await fetch(
        `https://o5s3ralth5thg2eqjgudsdulcm0pndsq.lambda-url.ap-south-1.on.aws/?courseid=${courseId}&studentid=${studentId}`,
        {
          method: "POST"
        }
      );
      console.log("res >>",response)
      if (!response.ok) {
        throw new Error("Failed to generate certificate");
      }
      if (response.status === 200) {
        const responseBody = await response.json();
        console.log("responseBody >>",responseBody)

        const certificateId = responseBody.certificate_id;
        // console.log("certificateId >>",certificateId)
        navigate(`/dashboard/certificate/${certificateId}`); // Redirect to certificate page
      } else {
        console.error("Error generating certificate:", response.body.error);
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
    } finally {
      setLoadingCourse(null); // Reset loading state
    }
  };

  // View Certificate for a specific course
  const viewCertificate = async (courseId, studentId) => {
    try {

      const response = await getCertificateId(courseId, studentId,token)
      const certificateId = response.certificateId;
      navigate(`/dashboard/certificate/${certificateId}`);
    } catch (error) {
      console.error("Error viewing certificate:", error);
    } finally {
      setLoadingCourse(null);
    }
  };

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className='h-14 w-14 rounded-lg skeleton '></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl  skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    )
  }

  // Return if data is null
  if (enrolledCourses?.length === 0) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        You have not enrolled in any course yet.
      </p>
    );
  }

  return (
    <>
      <div className="text-4xl text-richblack-5 font-boogaloo text-center sm:text-left">Enrolled Courses</div>
      <div className="my-8 text-richblack-5">
        {/* Headings */}
        <div className="flex rounded-t-2xl bg-richblack-800 ">
          <p className="w-[45%] px-5 py-3">Course Name</p>
          <p className="w-1/4 px-2 py-3">Duration</p>
          <p className="flex-1 px-2 py-3">Progress</p>
        </div>

        {/* Loading Skeleton */}
        {!enrolledCourses && (
          <div>
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
            {sklItem()}
          </div>
        )}

        {/* Course Names */}
        {enrolledCourses?.map((course, i, arr) => (
          <div
            className={`flex flex-col sm:flex-row sm:items-center border border-richblack-700 ${i === arr.length - 1 ? "rounded-b-2xl" : "rounded-none"} rounded-[10px] mt-[inherit] mb-[20px]`}
            key={i}
          >
            <div
              className="flex sm:w-[39%] cursor-pointer items-center gap-4 px-5 py-3"
              onClick={() => {
                navigate(
                  `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                );
              }}
            >
              <Img
                src={course.thumbnailImage}
                alt="course_img"
                className="h-14 w-14 rounded-lg object-cover"
              />

              <div className="flex max-w-xs flex-col gap-2">
                <p className="font-semibold">{course.courseName}</p>
                <p className="text-xs text-richblack-300">
                  {course.courseDescription.length > 50
                    ? `${course.courseDescription.slice(0, 50)}...`
                    : course.courseDescription}
                </p>
              </div>
            </div>

            {/* Duration and Progress for Small Devices */}
            <div className="sm:hidden">
              <div className="px-2 py-3">{convertToHoursMinutes(course.Duration)}</div>

              <div className="flex sm:w-2/5 flex-col gap-2 px-2 py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>

              {/* Generate Certificate Button for Small Devices */}
              {course.progressPercentage === 100 && (
                <div className="flex w-full justify-center px-5 py-3">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300 mr-2.5"
                    onClick={() => generateCertificate(course._id, user._id)}
                    disabled={loadingCourse === course._id}
                  >
                    {loadingCourse === course._id ? "Generating..." : "Generate Certificate"}
                  </button>
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
                    onClick={() => viewCertificate(course._id, user._id)}
                    disabled={loadingCourse === course._id}
                  >
                    {loadingCourse === course._id ? "Generating Certificate" : "View Certificate"}
                  </button>
                </div>
              )}
            </div>

            {/* Duration and Progress for Large Devices */}
            <div className="hidden sm:flex w-1/5 px-2 py-3">{convertToHoursMinutes(course.Duration)}</div>
            <div className="hidden sm:flex w-1/5 flex-col gap-2 px-2 py-3">
              <p>Progress: {course.progressPercentage || 0}%</p>
              <ProgressBar
                completed={course.progressPercentage || 0}
                height="8px"
                isLabelVisible={false}
              />
            </div>

            {/* Generate Certificate Button for Large Devices */}
            {course.progressPercentage === 100 && (
              <div className="hidden sm:flex w-1/5 flex-col gap-2 pl-5">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
                  onClick={() => generateCertificate(course._id, user._id)}
                  disabled={loadingCourse === course._id}
                >
                  {loadingCourse === course._id ? "Generating..." : "Generate Certificate"}
                </button>
                <button
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-md transition duration-300"
                    onClick={() => viewCertificate(course._id, user._id)}
                    disabled={loadingCourse === course._id}
                  >
                    {loadingCourse === course._id ? "Generating Certificate" : "View Certificate"}
                  </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
