import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "Access world-class learning",
    highlightText: "Anytime, Anywhere.",
    description:
      "Our platform offers top-tier educational content to empower learners globally, making knowledge accessible to all.",
    BtnText: "Learn More",
    BtnLink: "/login",
  },
  {
    order: 1,
    heading: "Industry-Aligned Curriculum Tailored for Career Success",
    description:
      "Save time and money with tubeacademy! Our curriculum is designed for simplicity and aligns perfectly with industry demands, ensuring you gain practical, job-ready skills.",
  },
  {
    order: 2,
    heading: "Our Approach to Learning",
    description:
      "With our approach, you can explore new skills, track your progress, and learn at your own pace—all through the power of curated video content.",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "Boost your career with industry-recognized certifications from Tube Academy. Our certifications validate your skills and knowledge, helping you stand out in a competitive job market.",
  },
  {
    order: 4,
    heading: "Ready to Work",
    description:
      "Unlock your potential with our initiative designed to build in-demand skills and practical knowledge. Gain confidence, expertise, and stand out in today’s competitive job market!",
  },
];

const LearningGrid = () => {

  return (
    <div className="grid mx-auto w-[350px] lg:w-fit grid-cols-1 lg:grid-cols-4 mb-12">
      {LearningGridArray.map((card, i) => {
        return (
          <div
            key={i}
            className={`${i === 0 && "lg:col-span-2 lg:h-[294px]"}  ${card.order % 2 === 1
                ? "bg-richblack-700 h-[294px]"
                : card.order % 2 === 0
                  ? "bg-richblack-800 h-[294px]"
                  : "bg-transparent"
              } ${card.order === 3 && "lg:col-start-2"}  `}
          >
            {card.order < 0 ? (
              <div className="lg:w-[90%] flex flex-col gap-3 pb-10 lg:pb-0">
                <div className="text-4xl font-semibold ">
                  {card.heading}
                  <HighlightText text={card.highlightText} />
                </div>
                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>

                <div className="w-fit mt-2">
                  <CTAButton active={true} linkto={card.BtnLink}>
                    {card.BtnText}
                  </CTAButton>
                </div>
              </div>
            ) : (
              <div className="p-8 flex flex-col gap-8">
                <h1 className="text-richblack-5 text-lg">{card.heading}</h1>

                <p className="text-richblack-300 font-medium">
                  {card.description}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LearningGrid;