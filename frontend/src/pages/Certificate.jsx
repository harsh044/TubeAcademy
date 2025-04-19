import React,{ useEffect, useState } from "react"
import Footer from "../components/common/Footer"
import { CertificateViewGlobal } from "../services/operations/courseDetailsAPI"
import { useParams } from 'react-router-dom';

const CertificateView = () => {
  const { certificateId } = useParams()
  console.log("certificateId >>",certificateId)
  const [courseCertificate, setCourseCertificate] = useState(null);
  
  // Fetch certificate based on certificateid and token
  const getCourseCertificate = async () => {
    try {
      const res = await CertificateViewGlobal(certificateId); // Pass certificateid and token
      setCourseCertificate(res);
    } catch (error) {
      console.log("Could not fetch certificate.");
    }
  };

  useEffect(() => {
    getCourseCertificate(); // Call the correct function here
  }, [certificateId]); // Add certificateid and token to dependencies

  // Loading Skeleton
  const sklItem = () => {
    return (
      <div className="flex border border-richblack-700 px-5 py-3 w-full">
        <div className="flex flex-1 gap-x-4 ">
          <div className="h-14 w-14 rounded-lg skeleton"></div>

          <div className="flex flex-col w-[40%] ">
            <p className="h-2 w-[50%] rounded-xl skeleton"></p>
            <p className="h-2 w-[70%] rounded-xl mt-3 skeleton"></p>
          </div>
        </div>

        <div className="flex flex-[0.4] flex-col ">
          <p className="h-2 w-[20%] rounded-xl skeleton mt-2"></p>
          <p className="h-2 w-[40%] rounded-xl skeleton mt-3"></p>
        </div>
      </div>
    );
  };

  // Return if data is null or no certificates
  if (!courseCertificate) {
    return (
      <p className="grid h-[50vh] w-full place-content-center text-center text-richblack-5 text-3xl">
        Loading.......
      </p>
    );
  }
  
  return (
    <div style={{display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <img src={courseCertificate.certificateUrl} 
        style={{margin: "auto",marginTop: "20px",marginBottom: "20px",borderRadius: "10px"}}/>
      <Footer />
    </div>
  )
}

export default CertificateView