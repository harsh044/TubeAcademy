import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import {
  createSubSection,
  updateCourseDetails,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import { fetchYouTubePlaylistItems, fetchVideoDuration } from "../../../../../services/operations/youtubeAPI";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.lectureVideo);
      setValue("videoUrl", modalData.videoUrl);
    }
  }, []);

  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.timeDuration !== modalData.timeDuration) {
      formData.append("timeDuration", currentValues.timeDuration);
    }
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.videoUrl !== modalData.videoUrl) {
      formData.append("videoUrl", currentValues.videoUrl);
    }
    setLoading(true);

    const result = await updateSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
    navigate(0); // Refresh the page
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      await handleEditSubsection();
      return;
    }

    const playlistId = data.lectureVideo;
    if (!playlistId) {
      toast.error("Please enter a valid Playlist ID or URL");
      return;
    }

    setLoading(true);
    try {
      const playlistItems = await fetchYouTubePlaylistItems(playlistId);

      if (!playlistItems || playlistItems.length === 0) {
        toast.error("No videos found in the playlist");
        return;
      }

      let totalDuration = 0;
      const videoPromises = playlistItems.map(async (video) => {
        const videoId = video.snippet.resourceId.videoId;

        let duration = await fetchVideoDuration(videoId);
        totalDuration += duration;
        const formData = new FormData();
        formData.append("sectionId", modalData);
        formData.append("title", video.snippet.title);
        formData.append("position", video.snippet.position);
        formData.append("timeDuration", duration);
        formData.append("description", video.snippet.description || "");
        formData.append("videoUrl", video.snippet.resourceId.videoId);
        return await createSubSection(formData, token);
      });
      const result = await Promise.all(videoPromises);

      if (result) {
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData ? { ...section, subsections: result } : section
        );

        const updatedCourse = { ...course, courseContent: updatedCourseContent };
        dispatch(setCourse(updatedCourse));

        // Update the course details on the server
        const updateResult = await updateCourseDetails({ courseId: course._id,totalDuration }, token);
        if (updateResult) {
          // Update the Redux store with the new course details
          const updatedCourse = { ...course, courseContent: updatedCourseContent, totalDuration };
          dispatch(setCourse(updatedCourse));
        }
      }
      
      setModalData(null);
      setLoading(false);
      toast.success("Playlist videos added successfully");

      navigate(`/dashboard/edit-course/${course._id}`); // Refresh the component
    } catch (error) {
      toast.error("Failed to fetch or save playlist data");
    } finally {
      setLoading(false);
      setModalData(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 py-10">
          {add && (
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-richblack-5" htmlFor="lectureVideo">
                Youtube Playlist Url {!view && <sup className="text-pink-200">*</sup>}
              </label>
              <input
                disabled={view || loading}
                id="lectureVideo"
                placeholder="Enter Lecture Video Url"
                {...register("lectureVideo", { required: true })}
                className="form-style w-full"
              />
              {errors.lectureVideo && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Lecture Video Url is required
                </span>
              )}
            </div>
          )}

          {edit && (
            <>
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
                  Lecture Title {!view && <sup className="text-pink-200">*</sup>}
                </label>
                <input
                  disabled={view || loading}
                  id="lectureTitle"
                  placeholder="Enter Lecture Title"
                  {...register("lectureTitle", { required: true })}
                  className="form-style w-full"
                />
                {errors.lectureTitle && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                    Lecture title is required
                  </span>
                )}
              </div>
            </>
          )}

          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
