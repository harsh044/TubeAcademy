import React, { useEffect, useState } from "react";
import Footer from "../components/common/Footer";
import Course_Slider from "../components/core/Catalog/Course_Slider";
import Loading from "../components/common/Loading";
import { getAllCourses } from "../services/operations/courseDetailsAPI";

function AllCourses() {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getAllCourses(); // Fetch all courses
        setAllCourses(res || []); // Ensure res is an array
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <Loading />
      </div>
    );
  }

  if (!loading && allCourses.length === 0) {
    return (
      <div className="text-white text-4xl flex justify-center items-center mt-[20%]">
        No Courses Found
      </div>
    );
  }

  return (
    <>
      {/* Section 1 */}
      <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Explore All Courses</div>
        <div className="my-4">
          <Course_Slider Courses={allCourses} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AllCourses;
