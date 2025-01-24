import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { handleCertificateView } from "../../../services/operations/courseDetailsAPI";
import { toast } from "react-hot-toast"; // Import toast
import { ShareIcon } from "@heroicons/react/24/outline";

export default function CourseCertificate() {
  const { token } = useSelector((state) => state.auth);
  const { certificateid } = useParams(); // Get certificateid from URL params
  const navigate = useNavigate();

  const [courseCertificate, setCourseCertificate] = useState(null);

  // Fetch certificate based on certificateid and token
  const getCourseCertificate = async () => {
    try {
      const res = await handleCertificateView(certificateid, token); // Pass certificateid and token
      setCourseCertificate(res);
    } catch (error) {
      console.log("Could not fetch certificate.");
    }
  };

  useEffect(() => {
    getCourseCertificate(); // Call the correct function here
  }, [certificateid, token]); // Add certificateid and token to dependencies

  // Copy certificate link to clipboard
  const handleCopyLink = () => {
    if (certificateid) {
      navigator.clipboard.writeText(`http://localhost:5173/certificate/${certificateid}`)
        .then(() => {
          toast.success("Link copied to clipboard!"); // Show toast success message
        })
        .catch((err) => {
          toast.error("Failed to copy link."); // Show toast error message
          console.error("Failed to copy link: ", err);
        });
    }
  };

  // Return if data is null or no certificates
  if (!courseCertificate) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        Could not fetch the certificate.
      </p>
    );
  }

  return (
    <div className="certificate-container mt-2.5 sm:mt-0">
      {/* Display the certificate image */}
      <img
        src={courseCertificate.certificateUrl}
        alt="Certificate"
        className="certificate-image"
      />

      <div className="flex flex-col items-start space-y-4 mt-4">
        {/* Download Button */}
        <a
          href={courseCertificate.certificateUrl}
          download="certificate.png" // You can specify a custom name for the file
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-md inline-block"
        >
          Download Certificate
        </a>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded shadow-md inline-flex items-center"
        >
          <ShareIcon className="h-5 w-5 text-white mr-2" />
          Share
        </button>
      </div>
    </div>
  );
}
