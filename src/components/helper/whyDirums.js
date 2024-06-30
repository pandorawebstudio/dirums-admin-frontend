import React from "react";

const WhyDirums = () => {
  return (
    <div className=" w-full   flex items-center justify-center my-10 font-helvetica">
      <div className=" w-5/6 md:w-2/3 flex items-center justify-center   ">
        <div className=" flex flex-col md:flex-row  w-full items-center shadow-2xl gap-10   font-medium  rounded-md p-14">
          {/* Left */}
          <aside className=" flex flex-row   w-full items-start justify-center font-helvetica">
            <div className="flex-col flex gap-10 items-center   justify-start w-full">
              <div className=" flex items-center gap-5 justify-start w-full">
                <img src={"/images/user.svg"} alt="" className=" text-6xl text-[#BA8249]" />
                <p className=" font-helvetica">
                  Create your artist account instantly
                </p>
              </div>

              <div className=" flex items-center gap-5 justify-start w-full">
                <img src={"/images/upload.svg"} alt="" className=" text-6xl text-[#BA8249]" />
                <p>Upload unlimited number of Artworks.</p>
              </div>

              <div className=" flex items-center gap-5 justify-start w-full">
                <img src={"/images/mockup.svg"} alt="" className=" text-6xl text-[#BA8249]" />
                <p>Get professional mockups for your artworks.</p>
              </div>
            </div>
          </aside>
          {/* Right */}
          <aside className=" flex md:pl-10 md:border-l-2 md:border-[#D9D9D9]  w-full flex-row gap-10 items-center justify-center font-helvetica">
            <div className="flex-col flex gap-10 items-center justify-center ">
              <div className=" flex items-center gap-5 justify-start w-full">
                <img
                  src={"/images/worldwide.svg"}
                  alt=""
                  className=" text-6xl text-[#BA8249]"
                />
                <p>Reach worldwide customer base.</p>
              </div>

              <div className=" flex items-center gap-5 justify-start w-full">
                <img src={"/images/design.svg"} alt="" className=" text-6xl text-[#BA8249]" />
                <p>Get a free dedicated online gallery of the artist.</p>
              </div>

              <div className=" flex items-center gap-5 justify-start w-full">
                <img
                  src={"/images/marketing.svg"}
                  alt=""
                  className=" text-6xl text-[#BA8249]"
                />
                <p>Free marketing and promotion for artists / artworks. </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WhyDirums;
