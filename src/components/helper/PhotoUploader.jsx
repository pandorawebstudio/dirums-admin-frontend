"use client";
import Image from "next/image";
import { BsFillCloudArrowUpFill } from "react-icons/bs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { X } from "lucide-react";
import { apiConnector } from "@/services/apiConnector";
import { BASE_URL } from "../../config";

const PhotoUploader = ({
  imageDivs,
  setImageDivs,
  imageFiles,
  setImageFiles,
  imageUrls = [],
  productId = "",
  mutate,
}) => {
  const handleImgDelete = async (index) => {
    const res = await apiConnector(
      "POST",
      `${BASE_URL}/dashboard/products/${productId}/api/delete-image`,
      {
        index: index,
      }
    );
    mutate();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const newDivs = Array.from(imageDivs);
    const [removed] = newDivs.splice(sourceIndex, 1);
    newDivs.splice(destinationIndex, 0, removed);

    // Update the labels based on the new positions
    const updatedDivs = newDivs.map((div, index) => {
      const heading = index === 0 ? "primary" : "optional";
      return { ...div, heading };
    });

    setImageDivs(updatedDivs);
  };

  const handleImageUpload = (index, event, deleteImage) => {
    if (deleteImage) {
      // Delete the image if the deleteImage parameter is true
      //for files
      const newFile = [...imageFiles];
      newFile.splice(index, 1);
      setImageFiles(newFile);

      //For Image
      const newDivs = [...imageDivs];
      newDivs.splice(index, 1);
      setImageDivs(newDivs);
      return;
    }

    if (event && event.target.files.length > 0) {
      const newFile = event.target.files[0];
      setImageFiles([...imageFiles, newFile]);
      const files = event.target.files;
      const newDivs = [...imageDivs];

      const loadImage = (file, reader) => {
        return new Promise((resolve) => {
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      };

      const updateDivs = async () => {
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const reader = new FileReader();
          promises.push(loadImage(file, reader));
        }

        const results = await Promise.all(promises);

        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const heading = i === 0 ? "primary" : "optional"; // Assign "primary" for the first image, "optional" for the rest

          if (index + i >= newDivs.length) {
            // Add a new div if the index is out of range
            newDivs.push({
              heading: heading,
              image: result,
            });
          } else {
            // Update the image of the existing div
            newDivs[index + i].image = result;
            newDivs[index + i].heading = heading; // Update the heading of the existing div
          }

          if (index + i === newDivs.length - 1 && newDivs.length < 8) {
            // Add a new div if the uploaded image is in the last div and the maximum limit is not reached
            newDivs.push({
              heading: "optional", // Set the heading as "optional" for the new div
              image: null,
            });
          }
        }
        // const uploadedImage = {
        //   heading: heading,
        //   image: result,
        // };
        // useStore.getState().addUploadedImages([uploadedImage]);

        setImageDivs(newDivs);
      };

      updateDivs();
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="imageDivs" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-5 flex-wrap "
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {imageUrls?.map((imageUrl, index) => {
                if (imageUrl.length > 0) {
                  return (
                    <div key={index} className="flex flex-col">
                      <li className="relative w-fit h-fit rounded-md border">
                        <Image
                          src={`https://d2wmjgcwxowcvo.cloudfront.net/${imageUrl[0].url}`}
                          alt={`Image ${index}`}
                          width={100}
                          height={100}
                          className="h-36 w-fit object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="w-7 h-7 border bg-hightlight rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-global transition-colors"
                          onClick={() => {
                            handleImgDelete(parseInt(index));
                          }}
                        >
                          <X className="w-5 h-5 hover:text-gray-600 transition-colors" />
                        </button>
                      </li>
                      <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                        {imageUrl[1].url.slice(0, 22)}...
                      </p>
                    </div>
                  );
                }
              })}
              {imageDivs.map((div, index) => (
                <Draggable
                  key={index}
                  draggableId={`imageDiv-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mt-4"
                    >
                      <div className="mt-2 relative">
                        <h2 className="text-[8px] right-5 top-2 font-bold absolute text-white bg-black px-1 rounded-full">
                          {div.heading}
                        </h2>
                        {div.image ? (
                          <div>
                            <button
                              className="w-7 h-7 border bg-hightlight rounded-full flex justify-center items-center absolute -top-5 -right-3 hover:bg-global transition-colors"
                              onClick={() =>
                                handleImageUpload(index, null, true)
                              }
                            >
                              X
                            </button>
                            <Image
                              src={div.image}
                              width={200}
                              height={200}
                              alt="Uploaded Image"
                              className="h-36 max-w-[200px] w-fit object-cover rounded-md"
                            />
                          </div>
                        ) : (
                          <div className="w-64 h-40 border border-gray-300 rounded-md flex items-center justify-center">
                            <label
                              htmlFor={`image-upload-${index}`}
                              className="cursor-pointer items-center justify-center flex flex-col"
                            >
                              <BsFillCloudArrowUpFill className="text-2xl" />
                              Upload Image
                            </label>
                            <input
                              id={`image-upload-${index}`}
                              type="file"
                              accept="image/*"
                              multiple
                              className="sr-only"
                              onChange={(e) => handleImageUpload(index, e)}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default PhotoUploader;