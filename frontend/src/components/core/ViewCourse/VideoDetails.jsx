import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { setCourseViewSidebar } from "../../../slices/sidebarSlice";

import { HiMenuAlt1 } from "react-icons/hi";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } = useSelector(
    (state) => state.viewCourse
  );

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef(null);
  const playerInstance = useRef(null);
  const { courseViewSidebar } = useSelector((state) => state.sidebar);

  useEffect(() => {
    if (!courseSectionData.length) return;

    const filteredSection = courseSectionData.find(
      (course) => course._id === sectionId
    );

    if (!filteredSection) return;

    const sortedSubSections = filteredSection.subSection
      ?.slice()
      .sort((a, b) => a.position - b.position);

    const currentSubSection = sortedSubSections.find(
      (data) => data._id === subSectionId
    );

    if (currentSubSection) setVideoData(currentSubSection);
    setPreviewSource(courseEntireData.thumbnailImage);
  }, [courseSectionData, courseEntireData, sectionId, subSectionId]);

  useEffect(() => {
    if (!videoData?.videoUrl) return;

    const initializePlayer = () => {
      if (playerInstance.current) {
        // Destroy the existing player before creating a new one
        playerInstance.current.destroy();
      }

      // Create a new YouTube player instance
      playerInstance.current = new window.YT.Player(playerRef.current, {
        videoId: videoData.videoUrl,
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };

    const onPlayerStateChange = async (event) => {
      if (event.data === window.YT.PlayerState.ENDED) {
        await handleLectureCompletion(); // Mark the lecture as complete
        goToNextVideo(); // Navigate to the next video
      }
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }
  }, [videoData]);

  const goToNextVideo = () => {
    setIsLoading(true);

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    if (currentSectionIndex === -1) return;

    const sortedSubSections = courseSectionData[currentSectionIndex].subSection
      ?.slice()
      .sort((a, b) => a.position - b.position);

    const currentSubSectionIndex = sortedSubSections.findIndex(
      (data) => data._id === subSectionId
    );

    if (currentSubSectionIndex < sortedSubSections.length - 1) {
      const nextSubSectionId =
        sortedSubSections[currentSubSectionIndex + 1]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else if (currentSectionIndex < courseSectionData.length - 1) {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;

      const nextSortedSubSections = courseSectionData[ 
        currentSectionIndex + 1 
      ].subSection
        ?.slice()
        .sort((a, b) => a.position - b.position);

      if (nextSortedSubSections?.length) {
        const nextSubSectionId = nextSortedSubSections[0]._id;
        navigate(
          `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
        );
      }
    } else {
      console.log("Course completed!");
    }

    setIsLoading(false); // Remove timeout, directly set loading to false
  };

  const handleLectureCompletion = async () => {
    if (!completedLectures.includes(subSectionId)) {
      await markLectureAsComplete(
        { courseId: courseId, subsectionId: subSectionId },
        token
      );
      dispatch(updateCompletedLectures(subSectionId));
    }
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      <div
        className="sm:hidden text-white absolute left-7 top-3 cursor-pointer"
        onClick={() => dispatch(setCourseViewSidebar(!courseViewSidebar))}
      >
        <HiMenuAlt1 size={33} />
      </div>

      {isLoading ? (
        <p>Loading next video...</p>
      ) : !videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <div
          className="relative w-full overflow-auto rounded-md"
          style={{ maxHeight: "900px" }}
        >
          <div ref={playerRef} className="rounded-md"></div>
        </div>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
    </div>
  );
};

export default VideoDetails;
