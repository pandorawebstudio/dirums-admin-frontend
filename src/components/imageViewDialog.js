import React from "react";
import { saveAs } from 'file-saver';
import { Dialog, DialogBody } from "@material-tailwind/react";
import { IoCloseSharp } from "react-icons/io5";
import { GrDownload } from "react-icons/gr";

function ImageViewDialog({ isOpen, setIsOpen, image, setImage, fullImageSet }) {

  const handlePrevClick = (curr) => {
    const index = fullImageSet.findIndex((obj) => obj.url === curr);
    const newIndex = index === 0 ? fullImageSet.length - 1 : index - 1;
    setImage(fullImageSet[newIndex]?.url)
  };

  const handleNextClick = (curr) => {
    const index = fullImageSet.findIndex((obj) => obj.url === curr);
    const newIndex = index === fullImageSet.length - 1 ? 0 : index + 1;
    setImage(fullImageSet[newIndex]?.url)
  };

  // Add a function to handle the download action
  const handleDownload = (imageUrl, fileName) => {
    if (imageUrl) {
      const downloadedFileName = `${fileName}`;
      // Fetch the image data
      fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
          // Save the blob as a file using file-saver library
          saveAs(blob, downloadedFileName);
        })
        .catch(error => console.error('Error downloading image:', error));
    }
  };
  return (
    <>
      <Dialog
        open={isOpen}
        size={"md"}
        handler={() => setIsOpen(!isOpen)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <div
          className="cursor-pointer text-black flex justify-between pt-5 px-5"
          onClick={() => setIsOpen(false)}
        >
          <IoCloseSharp size={25} color={"black"} />
          <button
            onClick={() => handleDownload(image, image)}
          >
            <GrDownload />
          </button>
        </div>
        <DialogBody className="flex justify-center">
          
          <div className="relative w-[500px] h-[500px] overflow-hidden flex justify-center">
            {fullImageSet.length > 1 && (
              <button onClick={() => handlePrevClick(image)} className="absolute cursor-pointer bg-white rounded-full left-0 transform lg:ml-2 top-[40%]">
                <svg
                  className="w-5 m-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            )}
            <img
              src={image ? image : ""}
              className="rounded-sm cursor-pointer min-w-[200px] min-h-[200px]"
              alt="imagecontent"
            />
            {fullImageSet.length > 1 && (
              <button onClick={() => handleNextClick(image)} className="absolute cursor-pointer bg-white rounded-full right-0 transform lg:mr-2 top-[40%]">
                <svg
                  className="w-5 m-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        </DialogBody>
        <div className="flex flex-row gap-x-3 w-full justify-center item-center p-5">
          {fullImageSet?.length > 1 ? (
            <>
              {fullImageSet?.map((item, ind) => (
                <div className="" key={ind}>
                  {image === item?.url ? (
                    <img
                      onClick={() => {
                        setImage(item?.url);
                      }}
                      src={item?.url}
                      alt="imageurl"
                      className="h-20 cursor-pointer w-20 rounded-sm border-2 border-gray-700 border-solid p-0.5"
                    />
                  ) : (
                    <img
                      onClick={() => {
                        setImage(item?.url);
                      }}
                      src={item?.url}
                      alt="imageurl"
                      className="h-20 cursor-pointer w-20 rounded-sm p-0.5"
                    />
                  )}
                </div>
              ))}
            </>
          ) : (
            ""
          )}
        </div>
      </Dialog>
    </>
  );
}
export default ImageViewDialog;
