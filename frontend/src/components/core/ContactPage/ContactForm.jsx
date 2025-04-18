import React from "react";
import ContactUsForm from "./ContactUsForm";

const ContactForm = () => {
  return (
    <div className="border border-richblack-600 text-richblack-300 rounded-xl p-7 lg:p-14 flex gap-3 flex-col">
      <h1 className="text-4xl leading-10 font-semibold text-richblack-5">
      Have an idea? We have the expertise. Let's collaborate and bring it to life!
      </h1>
      <p className="">
        Tell us about yourself and your ideas—we’re eager to hear what’s on your mind!
      </p>

      <div className="mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;