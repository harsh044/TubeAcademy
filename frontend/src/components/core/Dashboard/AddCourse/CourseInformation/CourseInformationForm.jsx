import { useState, useEffect} from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { fetchYouTubePlaylistData,fetchYouTubeInstructorData } from "../../../../../services/operations/youtubeAPI" // You need to implement this function
import { fetchCourseCategories,addCourseDetails,editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import { MdNavigateNext } from "react-icons/md"

export default function CourseInformationForm() {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [playlistId, setPlaylistId] = useState("") // State to store the playlist ID
  const [youtubeData, setYouTubeData] = useState(null) // State to store fetched YouTube data
  const [categories, setCategories] = useState([]);

  // Handle the playlist ID input change
  const handlePlaylistIdChange = (e) => {
    setPlaylistId(e.target.value)
  }

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseCategories();
        if (Array.isArray(data)) {
          setCategories(data); // Assuming setCategories updates the state
        } else {
          toast.error("Invalid categories data");
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
  
    if (editCourse) {
      // console.log("editCourse ", editCourse)
      setValue("instructorName", course.instructorName)
      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("totalDuration", 0)
      setValue("courseCategory", course.category)
      setValue("thumbnailImage", course.thumbnailImage)
    }

    fetchCategories();
  }, []);

  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      currentValues.instructorName !== course.instructorName ||
      currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.thumbnailImage !== course.thumbnailImage) {
      return true
    }
    return false
  }
  // Fetch playlist data from YouTube API
  const handleFetchPlaylistData = async () => {
    if (!playlistId) {
      toast.error("Please enter a valid Playlist ID or URL")
      return
    }
    setLoading(true)
    try {
      const data = await fetchYouTubePlaylistData(playlistId) // You need to implement this function
      const instructorlogo = await fetchYouTubeInstructorData(data.channelId)
      
      // You need to implement this function
      // setYouTubeData(data)
      // Populate the fields with the fetched data
      setValue("instructorName", data.instructorName)
      setValue("instructorLogo", instructorlogo.instructorlogo)
      setValue("courseTitle", data.title)
      setValue("courseShortDesc", data.description)
      setValue("totalDuration", 0)
      setValue("courseCategory", data.category) // Assuming you have a category in the API data
      setValue("thumbnailImage", data.thumbnailImage)
    } catch (error) {
      toast.error("Failed to fetch playlist data")
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission
  const onSubmit = async (data) => {
    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log('data -> ',data)
        formData.append("courseId", course._id)
        if (currentValues.instructorName !== course.instructorName) {
          formData.append("instructorName", data.instructorName)
        }
        if (currentValues.instructorLogo !== course.instructorLogo) {
          formData.append("instructorLogo", data.instructorLogo)
        }
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc)
        }
        if (currentValues.totalDuration !== course.totalDuration) {
          formData.append("totalDuration", data.totalDuration)
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory)
        }

        if (currentValues.thumbnailImage !== course.thumbnailImage) {
          formData.append("thumbnailImage", data.thumbnailImage)
        }
        if (currentValues.status !== course.status) {
          formData.append("status", data.status)
        }

        // send data to backend
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }
    
    const formData = new FormData()
    formData.append("instructorName", data.instructorName)
    formData.append("courseName", data.courseTitle)
    formData.append("instructorLogo", data.instructorLogo)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("totalDuration", 0)
    formData.append("category", data.courseCategory) // Assuming you have a category in the API data
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("thumbnailImage", data.thumbnailImage)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      {/* Playlist ID / URL */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="playlistId">
          YouTube Playlist ID/URL
        </label>
        <input
          id="playlistId"
          placeholder="Enter Playlist ID or URL"
          value={playlistId}
          onChange={handlePlaylistIdChange}
          className="form-style w-full"
        />
      </div>

      {/* Fetch Playlist Data Button */}
      <div className="flex justify-start gap-x-2">
        <button
          type="button"
          onClick={handleFetchPlaylistData}
          disabled={loading}
          className="flex items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold text-richblack-900 bg-richblack-300 hover:bg-richblack-900 hover:text-richblack-300 duration-300"
        >
          Fetch Playlist Data
        </button>
      </div>

      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="instructorName">
        instructor Name<sup className="text-pink-200">*</sup>
        </label>
        <input
          id="instructorName"
          placeholder="Enter instructor name"
          {...register("instructorName", { required: true })}
          className="form-style w-full"
        />
        {errors.instructorName && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Instructor Name is required
          </span>
        )}
      </div>

      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full ]"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2 ">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full cursor-pointer"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            categories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Thumbnail Image */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Thumbnail <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="thumbnail"
          placeholder="Enter Thumbnail url"
          {...register("thumbnailImage", { required: true })}
          className="form-style w-full"
        />
        {errors.thumbnail && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Thumbnail is required
          </span>
        )}
      </div>

      {/* Course Instructor logo Image */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="instructorLogo">
          Instructor Logo <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="instructorLogo"
          placeholder="Enter Thumbnail url"
          {...register("instructorLogo", { required: true })}
          className="form-style w-full"
        />
        {errors.thumbnail && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Instructor Logo is required
          </span>
        )}
      </div>

      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md py-[8px] px-[20px] font-semibold
              text-richblack-900 bg-richblack-300 hover:bg-richblack-900 hover:text-richblack-300 duration-300`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}