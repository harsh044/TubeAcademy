import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div className=" text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white">
        We’re dedicated to transforming the learning experience. Our innovative platform blends cutting-edge technology, <HighlightText text={"expert knowledge,"} />{" "}        
        <span className="bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold">
            {" "}
            and a vibrant community to deliver an unmatched educational
        </span> 
    </div>
  )
}

export default Quote