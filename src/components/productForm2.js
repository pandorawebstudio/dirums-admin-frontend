"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { saveAs } from 'file-saver';
import { GrDownload } from "react-icons/gr";
import { IoCloseSharp } from "react-icons/io5";
import {
  Button,
  ButtonGroup,
  Checkbox,
  Input,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Option,
  Radio,
  Select,
  Step,
  Stepper,
  Switch,
  Textarea,
  Typography,
  Spinner,
  input,
  Card,
  CardHeader,
  CardBody,
  Alert,
} from "@material-tailwind/react";
import {
  BuildingLibraryIcon,
  CameraIcon,
  CogIcon,
  PlusIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import addMonths from "date-fns/addMonths";
import addDays from "date-fns/addDays";
import uuid4 from "uuid4";
import "react-datepicker/dist/react-datepicker.css";
import { API_URL, BASE_URL } from "../config";
import moment from "moment";
import Compressor from "compressorjs";
import { FileUploader } from "react-drag-drop-files";
import { FaSquare, FaImage, FaPortrait, FaCircle } from "react-icons/fa";
import { PiImageSquareFill } from "react-icons/pi";
import { IoPersonCircle } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
const fileTypes = ["JPG", "PNG", "GIF"];
// import dynamic from "next/dynamic";
import Sidebar from "./sidebar";
import Tiptap from './Tiptap'
import slugify from "react-slugify";

export default function ProductForm({ editData, inventoryUrl, productUrl }) {
  const [fileURLs, setFileURLs] = useState([]);
  const [isLastStep, setIsLastStep] = React.useState(true);
  const [variations, setVariations] = useState([]);
  const [variationId, setVariationId] = useState("");
  const [variationName, setVariationName] = useState("");
  const [variationBox, setVariationBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [variationBreakdownOpen, setVariationBreakdownOpen] = useState(false);
  const [searchVariation, setSearchVariation] = useState([]);
  const [isOpen, setIsOpen] = useState({ imageOpen: false, image: '' });
  const [data, setData] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [parentCategory, setParentCategory] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hasVariant, setHasVariant] = useState(false);
  const [madeOnOrder, setIsMadeOnOrder] = useState(false);
  const [reproducableDays, setReproducableDays] = useState("");
  const [type, setType] = useState("physical");
  const [isSale, setIsSale] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [originCountry, setOriginCountry] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [year, setYear] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [open, setOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [allParentCategory, setAllParentCategory] = useState([]);
  const [allParentCategoryLoading, setAllParentCategoryLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [parentSelect, setParentSelect] = useState("");
  const [accordianOpen, setAccordianOpen] = useState(parentSelect ? parentSelect : "");
  const [selectedCategoryLoading, setSelectedCategoryLoading] = useState(false);
  const [newCategoryRequest, setNewCategoryRequest] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [isNewCategory, setisNewCategory] = useState(false);
  const [newCategoryInputLoader, setNewCategoryInputLoader] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState("");
  const [orientation, setOrientation] = useState("");
  const isFirstClick = useRef(true);
  const [upload, setUpload] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [hasCreator, setHasCreator] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [isIndividual, setIsIndividual] = useState(false);
  const [creatorNames, setCreatorNames] = useState([]);
  const [tags, setTags] = useState(Array.isArray(editData?.tags) ? editData.tags : (typeof editData?.tags === 'string' ? editData.tags.split(',') : []));

  const handleOpen = () => setOpen(!open);
  // const [scope, setScope] = useState("worldwide");
  // const Editor = dynamic(() => import("./Editor"), { ssr: false });

  const handleNewVariationInput = async (item) => {
    const res = await fetch(`${BASE_URL}/dashboard/products/api/variations`, {
      method: "POST",
      body: JSON.stringify({ name: item }),
    });
    const data = await res.json();
    setVariationId(data.message.doc.id);
    setVariationName(data.message.doc.name);
    setVariationBox(false);
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    control,
    setValue: setValue1,
    getValues,
    clearErrors,
  } = useForm({
    defaultValues: [
      {
        creatorName: "",
        images: [],
        imageUrls: [],
        parentCategory: "",
        category: "",
        title: "",
        imgAlt: "",
        slug: "",
        tags: [],
        description: "",
        price: "",
        hasVariant: false,
        madeOnOrder: false,
        reproducableDays: "",
        type: "",
        // scope: "",
        isSale: false,
        startDate: "",
        endDate: "",
        originCountry: "",
        salePrice: "",
        quantity: "",
        attributes: [],
        variations: [
          {
            name: "",
            price: "",
            quantity: "",
            backOrder: false,
            status: "",
            salePrice: "",
            saleStartDate: new Date(),
            saleEndDate: new Date(),
          },
        ],
      },
    ],
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "variations",
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue,
  } = useForm();

  const addNewCategory = (value) => {
    if (newCategoryInput) {
      setNewCategoryInputLoader(true);
      fetch(`${BASE_URL}/signup/products/create/api/category-request`, {
        method: "POST",
        body: JSON.stringify({
          name: newCategoryInput,
        }),
      })
        .then((res) => res?.json())
        .then((data) => {
          setNewCategoryInputLoader(false);
          setCategory(data.doc.id);
          setisNewCategory(true);
          setCategoryName(data.doc.name);
          setShowResults(false);
          setNewCategoryRequest(false);
        });
    } else {
      fetch(`${BASE_URL}/signup/products/create/api/category-request`, {
        method: "POST",
        body: JSON.stringify({
          name: value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setCategory(data.doc.id);
          setCategoryName(data.doc.name);
          setShowResults(false);
        });
    }
  };

  const handleStartDateChange = (selectedDate) => {
    setStartDate(selectedDate);
    setValue1("startDate", selectedDate);
  };

  const handleEndDateChange = (selectedDate) => {
    setEndDate(selectedDate);
    setValue1("endDate", selectedDate);
  };

  const orientationIcons = {
    square: { icon: <PiImageSquareFill />, name: "Square" },
    landscape: { icon: <FaImage />, name: "Landscape" },
    portrait: { icon: <FaPortrait />, name: "Portrait" },
    circle: { icon: <IoPersonCircle />, name: "Circle" },
  };

  const buttonStyle = {
    fontSize: "3em",
    margin: "23px",
  };

  const containerStyle = {
    display: "flex",
  };

  const radioContainerStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  };

  const radioLabelStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  };

  const radioInputStyle = {
    marginRight: "5px",
  };

  const radioStyle = {
    marginTop: "20px",
  };

  const handleInputChange = (event) => {
    setVariationBox(true);
    const { value } = event.target;

    if (value == variationName) setVariationBox(false);
    setInputValue(value);
    setSelectedEntry("");
  };

  const handleRequestCategoryDialog = () => {
    setNewCategoryRequest(!newCategoryRequest);
  };

  const CUSTOM_ANIMATION = {
    mount: { scale: 1 },
    unmount: { scale: 0.9 },
  };

  function AccordianIcon({ id, open }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="#000000"
        className={`${id === open ? "rotate-180" : ""} h-5 w-5 duration-500 transition-transform`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    );
  }

  const handleAccordian = (id) => {
    setAccordianOpen(accordianOpen === id ? 0 : id);
  };

  // const fetchSelectedParentCategory = async () => {
  //   setSelectedCategoryLoading(true);
  //   await fetch(`${API_URL}/api/category?limit=50`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const filteredItems = data?.docs?.filter(
  //         (item) => item?.parent?.id == parentSelect,
  //       );

  //       if (filteredItems) {
  //         setSelectedCategory(filteredItems.map((item) => ({ ...item })));
  //         setSelectedCategoryLoading(false);
  //       }
  //     });
  // };

  // useEffect(() => {
  //   if (parentSelect) {
  //     fetchSelectedParentCategory();
  //   }
  // }, [parentSelect]);

  const fetchAllCategory = async () => {
    // if(parentSelect) {
    //   setSelectedCategoryLoading(true)
    // } else {
    //   // setAllParentCategoryLoading(true);
    // }
    if(parentSelect) {
      setSelectedCategoryLoading(true)
    }
    // console.log(parentSelect);
    // setCategoryName("");
    setisNewCategory(false);
    const query = {
      'parent.id' : parentSelect
    }
    await fetch(`${API_URL}/api/category?parent=${query}&limit=0`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.docs)
        if(parentSelect) {
          const filteredItems = data?.docs?.filter(
            (item) => item?.parent?.id == parentSelect,
          );
  
          if (filteredItems) {
            setSelectedCategory(filteredItems.map((item) => ({ ...item })));
            setSelectedCategoryLoading(false);
          }
        } else {
          const filteredItems = data?.docs?.filter(
            (item) => !item.parent && item.status !== "pending",
          );
  
          if (filteredItems) {
            setAllParentCategory(filteredItems.map((item) => ({ ...item })));
            setSelectedCategoryLoading(false)
          }
        }
      });
  };

  useEffect(() => {
    fetchAllCategory();
  }, [parentSelect]);

  const fetchCategories = (e) => {
    setAttributes([]);
    if (e) {
      fetch(`${API_URL}/api/category?where[name][contains]=${e}`)
        .then((res) => res.json())
        .then((data) => {
          setData(data.docs);
        });
    }
  };

  useEffect(() => {
    if (searchVariation)
      setEntries(
        searchVariation?.filter((entry) =>
          entry.name.toLowerCase().includes(inputValue?.toLowerCase()),
        ),
      );
  }, [searchVariation]);

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [field]: value,
    };
    setVariants(updatedVariants);

    const updatedVariations = [...variations];
    updatedVariations[index] = {
      ...updatedVariations[index],
      [field]: value,
    };
    setVariations(updatedVariations);
  };

  const removeVariant = (index) => {
    setVariants((prevVariations) => {
      const updatedVariations = [...prevVariations];
      updatedVariations.splice(index, 1);
      return updatedVariations;
    });
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (images.length > 7) {
      setSuccess(true);
      setSuccessMessage("You can only upload maximum eight images")
      // console.log("returning");
      return;
    }
    // Clear previous errors for the 'images' field
    clearErrors("images");
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file size is greater than 2MB
      if (file.size > 2 * 1024 * 1024) {
        new Compressor(file, {
          quality: 0.6,
          maxHeight: 700,
          auto: true,
          success(result) {
            setImages((prev) => [...prev, result]);
            setImageUrls((prev) => [...prev, URL.createObjectURL(result)]);
            setValue1("images", result);
          },
          error(err) {
            console.error("Error compressing file:", err);
            // Set error for 'images' field
            setError("images", {
              type: "manual",
              message: "Error compressing file.",
            });
          },
        });
      } else {
        setImages((prev) => [...prev, file]);
        setImageUrls((prev) => [...prev, URL.createObjectURL(file)]);
      }
    }
  };

  const handleRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleFetchBlob = async (imageUrl, name, index) => {
    try {
      // console.log(imageUrl, "images index are displayed");
      const response = await fetch(imageUrl); // Replace with your file URL
      const blobResponse = await response.blob();
      const blob = new Blob([blobResponse], { type: blobResponse.type });
      // Create a URL for the blob
      const blobURL = new File([blob], name, { type: blobResponse.type });
      console.log(blobURL, "filename are displayed");
      // setImages((prev) => [...prev, blobURL]);
      // Update state at the correct index
      setImages(prevImages => {
        const updatedImages = [...prevImages];
        updatedImages[index] = blobURL;
        return updatedImages;
      });
    } catch (error) {
      console.error("Error fetching or creating blob:", error);
    }
  };

  useEffect(() => {
    console.log(images)
  }, [images])

  const [flag, setFlag] = useState(false);
  if (editData && !flag) {
    setFlag(true);
    fetchCategories(editData?.category?.name);
    setParentCategory(editData?.category?.parent?.id);
    setCategory(editData?.category?.id);
    setValue1("category", editData?.category?.id);
    setCategoryName(editData?.category?.name);
    setTitle(editData?.title);
    setValue1("title", editData?.title);
    setImgAlt(editData?.imgAlt);
    setValue1("imgAlt", editData?.imgAlt);
    setSlug(editData?.slug);
    setValue1("imgAlt", editData?.slug);
    if (typeof editData?.tags === 'string') {
      setTags(editData.tags.split(','));
    } else {
      setTags([]);
    }
    setValue1("tags", editData?.tags);
    setDescription(editData?.description);
    setPrice(editData?.price);
    setValue1("price", editData?.price);
    setYear(editData?.created);
    setValue1("year", editData?.created);
    setIsMadeOnOrder(editData?.madeToOrder);
    setReproducableDays(editData?.reproducableDays);
    setCreatorName(editData?.creatorName);
    if (editData?.creatorName) {
      setHasCreator(true);
    }
    setValue1("creatorName", editData?.creatorName)
    setIsIndividual(editData?.vendor?.is_individual);
    setType(editData?.productType);
    setValue1("type", editData?.productType);
    setValue1(editData?.productType);
    // setScope(editData?.publishScope);
    setOriginCountry(editData?.originCountry);
    setValue1("originCountry", editData?.originCountry);
    setVariationName(editData?.variation?.name);
    setVariationId(editData?.variation?.id);
    setQuantity(editData?.inventory?.quantity);
    setValue1("quantity", editData?.inventory?.quantity);
    const imageUrls = [];
    for (let i = 0; i < editData?.images?.length; i++) {
      const prop = editData?.images[i];
      imageUrls.push(prop.image?.url);
      handleFetchBlob(prop.image?.url, prop.image?.filename, i); // Pass index
    }
    setImageUrls(imageUrls);
    if (editData?.saleInfo) {
      setIsSale(true);
      setSalePrice(editData?.saleInfo?.salePrice);
      setStartDate(new Date(editData?.saleInfo?.saleStart));
      setEndDate(new Date(editData?.saleInfo?.saleEnd));
      setValue1("startDate", new Date(editData?.saleInfo?.saleStart));
      setValue1("endDate", new Date(editData?.saleInfo?.saleEnd));
    }
    editData?.attributes
      ?.filter((item) => item != null)
      .forEach((prop) => {
        setAttributes((prev) => [
          ...prev,
          { name: prop.name, value: prop.value },
        ]);
      });

    // editData?.images?.forEach((prop, index) => {
    //   // console.log(index, "images index are displayed");
    //   // console.log(prop?.image.filename, "filename are displayed");
    //   handleFetchBlob(prop.image.url, prop.image.filename);
    // });

    // if(editData?.images?.length > 0) {
    //   // for(let i = 0; i < editData?.images?.length; i++) {{
    //   //   handleFetchBlob(editData?.images[i]?.url, editData?.images?.filename);
    //   // }}
    // }
    
    // console.log(images);
    // setValue1('images', editData?.images?.map((prop) => prop.image.url))
  }

  // editData has variant
  useEffect(() => {
    if (editData?.has_variants == true) {
      console.log("edited product data");
      setHasVariant(editData?.has_variants);
      editData?.variants?.map((prop) => {
        setVariants((prev) => [
          ...prev,
          {
            name: prop.name,
            price: prop.price,
            quantity: prop.quantity,
            isSale: prop.salePrice ? true : false,
            salePrice: prop.salePrice,
            saleStart: prop.saleStart,
            saleEnd: prop.saleEnd,
          },
        ]);
        append({
          name: prop.name,
          price: prop.price,
          quantity: prop.quantity,
          isSale: false,
          salePrice: prop.salePrice,
          saleStart: prop.saleStart,
          saleEnd: prop.saleEnd,
        });
      });
    }
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/dashboard/products/api/${editData?.vendor?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.message.docs.length > 0) {
          setCreatorNames(data.message.docs);
        }
      })
      .catch((err )=> {
        throw err;
      })
  }, []);

  const submit = () => {
    if (images?.length < 1) {
      setError("images", {
        type: "manual",
        message: "Please upload atleast one image",
      });
      return false;
    }
    setIsLoading(true);
    console.log("form-submitted")
    if (editData) {
      if (!hasVariant) {
        console.log("without variant edit");
        fetch(`${inventoryUrl}`, {
          method: "PATCH",
          body: JSON.stringify({
            quantity: quantity,
            inventoryId: editData?.inventory?.id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            const inventoryId = data?.message?.doc?.id ?? data.message.id;
            if (inventoryId) {
              const fd = new FormData();
              fd.append("title", title);
              fd.append("imgAlt", imgAlt);
              fd.append("slug", slug);
              fd.append("tags", tags);
              fd.append("description", description);
              fd.append("price", price);
              fd.append("category", category);
              fd.append("productType", type);
              // fd.append("scope", scope);
              fd.append("created", year);
              fd.append("originCountry", originCountry);
              if (creatorName) fd.append("creatorName", creatorName);
              if (madeOnOrder) fd.append("madeToOrder", madeOnOrder);
              fd.append("has_variants", hasVariant);
              if (reproducableDays) fd.append("reproducableDays", reproducableDays);
              if (isSale) {
                fd.append("salePrice", salePrice);
                fd.append("saleStart", startDate);
                fd.append("saleEnd", endDate);
              }
              console.log(images);
              images.forEach((item, index) => {
                if (typeof item === "object") {
                  // console.log(item, "images items");
                  fd.append(`demoimages`, item);
                }
              });

              attributes.forEach((item, index) => {
                if (item.name) {
                  fd.append(`attributes.${index}.name`, item.name);
                  fd.append(`attributes.${index}.value`, item.value);
                }
              });

              fd.append("inventory", inventoryId);
              // fd.append("status", "pending");
              // fd.append("edited", true);

              fetch(`${productUrl}`, {
                method: "PATCH",
                body: fd,
              })
              .then((res) => res.json())
              .then((data) => {
                console.log(data);
                setIsLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if(data.code === 500) {
                  console.log(data.message.errors[0].message);
                  setUploadError(true);
                  setSubmitMessage("Product Form not updated due to technical issue, Please try again later!");
                }
                setUpload(true);
                setSubmitMessage("Product Form uploaded successfully !");
                router.back("/dashboard");
                // window.location.reload();
              })
              .catch((error) => {
                setIsLoading(false);
                setUploadError(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setSubmitMessage("Product Form not updated due to technical issue, Please try again !");
              });
            }
          });
      } else {
        console.log("with variant edit");
        const fd = new FormData();
        fd.append("title", title);
        fd.append("imgAlt", imgAlt);
        fd.append("slug", slug);
        fd.append("description", description);
        fd.append("category", category);
        fd.append("productType", type);
        // fd.append("scope", scope);
        fd.append("created", year);
        fd.append("originCountry", originCountry);
        {
          creatorName && fd.append("creatorName", creatorName);
        }
        {
          madeOnOrder && fd.append("madeToOrder", madeOnOrder);
        }
        {
          reproducableDays && fd.append("reproducableDays", reproducableDays);
        }
        {
          images.forEach((item, index) => {
            if (typeof item == "object") {
              fd.append(`demoimages`, item);
            }
          });
        }
        {
          attributes.forEach((item, index) => {
            if (item.name) {
              fd.append(`attributes.${index}.name`, item.name);
              fd.append(`attributes.${index}.value`, item.value);
            }
          });
        }
        fd.append("variation", variationId);
        {
          variants
            ?.filter((item) => item.name != undefined)
            .map((item, index) => {
              if (item.name != "") {
                const sku = uuid4();
                fd.append(`variants.${index}.name`, item.name);
                fd.append(`variants.${index}.price`, item.price);
                fd.append(`variants.${index}.quantity`, item.quantity);
                {
                  item.salePrice &&
                    fd.append(`variants.${index}.salePrice`, item.salePrice);
                }
                {
                  item.saleStart &&
                    fd.append(
                      `variants.${index}.saleStart`,
                      item.saleStartDate,
                    );
                }
                {
                  item.saleStart &&
                    fd.append(`variants.${index}.saleEnd`, item.saleEndDate);
                }
                fd.append(
                  `variants.${index}.status`,
                  item.quantity > 0 ? "inStock" : "outOfStock",
                );
                fd.append(`variants.${index}.sku`, sku);
              }
            });
        }
        fd.append("has_variants", hasVariant);

        {
          isSale && fd.append("salePrice", salePrice);
        }
        {
          isSale && fd.append("saleStart", startDate);
        }
        {
          isSale && fd.append("saleEnd", endDate);
        }

        // fd.append("status", "pending");
        // fd.append("edited", true);

        fetch(`${productUrl}`, {
          method: "PATCH",
          body: fd,
        })
          .then((res) => res.json())
          .then((data) => {
            // router.back("/dashboard");
            window.location.reload();
            setIsLoading(false);
          });
      }
    } else {
      if (hasVariant == false) {
        console.log("without variant not edit");
        fetch(`${inventoryUrl}`, {
          method: "POST",
          body: JSON.stringify({
            quantity: quantity,
            inventoryId: editData?.inventory.id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.message?.doc?.id ?? data.message.id) {
              const fd = new FormData();
              fd.append("title", title);
              fd.append("imgAlt", imgAlt);
              fd.append("description", description);
              fd.append("price", price);
              fd.append("category", category);
              fd.append("productType", type);
              // fd.append("scope", scope);
              fd.append("created", year);
              fd.append("originCountry", originCountry);
              {
                creatorName && fd.append("creatorName", creatorName);
              }
              {
                madeOnOrder && fd.append("madeToOrder", madeOnOrder);
              }
              fd.append("has_variants", hasVariant);
              {
                reproducableDays &&
                  fd.append("reproducableDays", reproducableDays);
              }
              {
                images.forEach((item, index) => {
                  if (typeof item == "object") {
                    fd.append(`demoimages`, item);
                  }
                });
              }
              {
                attributes.forEach((item, index) => {
                  if (item.name) {
                    fd.append(`attributes.${index}.name`, item.name);
                    fd.append(`attributes.${index}.value`, item.value);
                  }
                });
              }

              {
                isSale && fd.append("salePrice", salePrice);
              }
              {
                isSale && fd.append("saleStart", startDate);
              }
              {
                isSale && fd.append("saleEnd", endDate);
              }

              fd.append("inventory", data.message.doc.id);

              fetch(`${productUrl}`, {
                method: "POST",
                body: fd,
              })
                .then((res) => res.json())
                .then((data) => {
                  // router.back("/dashboard");
                  window.location.reload();
                  setIsLoading(false);
                });
            }
          });
      } else {
        console.log("with variant not edit");
        const fd = new FormData();
        fd.append("title", title);
        fd.append("imgAlt", imgAlt);
        fd.append("description", description);
        fd.append("category", category);
        fd.append("productType", type);
        // fd.append("scope", scope);
        fd.append("created", year);
        fd.append("originCountry", originCountry);
        {
          creatorName && fd.append("creatorName", creatorName);
        }
        {
          madeOnOrder && fd.append("madeToOrder", madeOnOrder);
        }
        {
          reproducableDays && fd.append("reproducableDays", reproducableDays);
        }
        {
          images.forEach((item, index) => {
            if (typeof item == "object") {
              fd.append(`demoimages`, item);
            }
          });
        }
        {
          attributes.forEach((item, index) => {
            if (item.name) {
              fd.append(`attributes.${index}.name`, item.name);
              fd.append(`attributes.${index}.value`, item.value);
            }
          });
        }

        fd.append("variation", variationId);
        {
          variants
            ?.filter((item) => item.name != undefined)
            .map((item, index) => {
              if (item.name != "") {
                const sku = uuid4();
                fd.append(`variants.${index}.name`, item.name);
                fd.append(`variants.${index}.price`, item.price);
                fd.append(`variants.${index}.quantity`, item.quantity);
                {
                  item.salePrice &&
                    fd.append(`variants.${index}.salePrice`, item.salePrice);
                }
                {
                  item.saleStartDate &&
                    fd.append(
                      `variants.${index}.saleStart`,
                      item.saleStartDate,
                    );
                }
                {
                  item.saleEndDate &&
                    fd.append(`variants.${index}.saleEnd`, item.saleEndDate);
                }
                fd.append(
                  `variants.${index}.status`,
                  item.quantity > 0 ? "inStock" : "outOfStock",
                );
                fd.append(`variants.${index}.sku`, sku);
              }
            });
        }
        fd.append("has_variants", hasVariant);

        {
          isSale && fd.append("salePrice", salePrice);
        }
        {
          isSale && fd.append("saleStart", startDate);
        }
        {
          isSale && fd.append("saleEnd", endDate);
        }

        fetch(`${productUrl}`, {
          method: "POST",
          body: fd,
        })
          .then((res) => res.json())
          .then((data) => {
            // router.back("/dashboard");
            window.location.reload();
            setIsLoading(false);
          });
      }
    }
  };

  useEffect(() => {
    if (images?.length > 0) {
      clearErrors("images");
    }
  }, [images]);

  const desiredSequence = [
    "Art & Collectibles",
    "Home & Living",
    "Clothing",
    "Footwear",
    "Jewellery & Accessories",
    "Lamps & Lighting",
    "Toys & Entertainments",
  ];

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

  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags(prevTags => [...prevTags, newTag]);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      // Remove the last tag when Backspace is pressed and input is empty
      setTags(prevTags => prevTags.slice(0, prevTags.length - 1));
    } else if (e.key !== 'Enter') {
      const inputValueLowerCase = inputValue.toLowerCase();
      const suggestedTag = tags.find(tag => tag.toLowerCase().includes(inputValueLowerCase));
      if (suggestedTag && !tags.includes(suggestedTag)) {
        setInputValue(suggestedTag);
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <>
      <Sidebar>
        <div className="w-full py-4">
          <Alert
            className="absolute right-3 top-3 w-fit flex items-center"
            open={upload}
            animate={{
              mount: { y: 0 },
              unmount: { y: 100 },
            }}
            action={
              <Button
                variant="text"
                color="white"
                size="sm"
                className="!absolute right-1"
                onClick={() => {
                  setUpload(false);
                  setSubmitMessage('');
                }}
              >
                <XCircleIcon className="w-6 h-6" />
              </Button>
            }
            color='green'
          >
            {submitMessage}
          </Alert>
          <Alert
            className="absolute right-3 top-3 w-fit flex items-center"
            open={uploadError}
            animate={{
              mount: { y: 0 },
              unmount: { y: 100 },
            }}
            action={
              <Button
                variant="text"
                color="white"
                size="sm"
                className="!absolute right-1"
                onClick={() => {
                  setUploadError(false)
                  setSubmitMessage('');
                }}
              >
                <XCircleIcon className="w-6 h-6" />
              </Button>
            }
            color='red'
          >
            {submitMessage}
          </Alert>
          <Card>
            <CardBody>
              <Typography className="font-bold uppercase">
                Basic details
              </Typography>
              <hr className="h-[1px] bg-gray-700 w-full mb-8" />
              {/* product upload section */}
              <div>
                  <Typography className="mb-4 flex flex-col gap-6">
                    <label className="font-bold">Upload the product images:</label>
                  </Typography>
                  <input
                    type="file"
                    className="hidden"
                    id="file"
                    error={errors?.images?.message ? true : false}
                    onChange={handleFileUpload}
                  />
                  <Alert
                    className="absolute right-3 top-3 w-fit flex items-center"
                    open={success}
                    animate={{
                      mount: { y: 0 },
                      unmount: { y: 100 },
                    }}
                    action={
                      <Button
                        variant="text"
                        color="white"
                        size="sm"
                        className="!absolute right-1"
                        onClick={() => setSuccess(false)}
                      >
                        <XCircleIcon className="w-6 h-6" />
                      </Button>
                    }
                    color="green"
                  >
                    {successMessage}
                  </Alert>
                  {errors?.images?.message && (
                    <p className="text-sm text-red-500">
                      {errors?.images?.message}
                    </p>
                  )}
                  <div className="flex flex-wrap md:gap-3 gap-2 mb-5 w-full">
                    <div
                      className="w-28 h-28 cursor-pointer flex flex-col justify-center items-center rounded-md shadow"
                      onClick={() => document.getElementById("file").click()}
                    >
                      <CameraIcon className="w-6 h-6" />
                      <Typography className="text-sm text-center font-medium">
                        Add Photo
                      </Typography>
                    </div>
                    {Array.from({ length: 8 }, (_, index) => (
                      <>
                        <div
                          key={index}
                          className={
                            index < 8 ? 'w-28 h-28 rounded-md shadow relative cursor-pointer' : ''
                          }
                        >
                          <div
                            onClick={() => {
                              if (!imageUrls?.[index]) {
                                document.getElementById("file").click();
                              } else {
                                setIsOpen({ imageOpen: true, image: imageUrls?.[index] })
                              }
                            }}
                            className="w-28 h-28 flex justify-center"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          >
                            <img
                              src={
                                imageUrls?.[index] ??
                                `/images/${index === 0 ? "primary" : index === 1 ? "top" : index === 2 ? "back" : index === 3 ? "zoom" : index === 4 ? "variations" : index === 5 ? "top" : index === 6 ? "back" : index === 7 && "variations" }.svg`
                              }
                              className={imageUrls?.[index] ? "object-contain w-25 h-28" : ""}
                            />
                          </div>
                          {!imageUrls?.[index] && (
                            <Typography className="text-sm text-center -mt-6 font-medium">
                              {index === 0
                                ? "Primary"
                                : index === 1
                                  ? "Top"
                                  : index === 2
                                    ? "Back"
                                    : index === 3
                                      ? "Details"
                                      : index === 4
                                        ? "Variations"
                                        : index === 5
                                          ? "Top"
                                          : index === 6
                                            ? "Back" : index === 7
                                            && "Variations"}
                            </Typography>
                          )}
                          {imageUrls?.[index] && (
                            <>
                              <XCircleIcon
                                className="w-6 h-6 absolute -right-2 -top-3 bg-black text-white rounded-full cursor-pointer"
                                onClick={() => {
                                  setImageUrls(imageUrls.filter((_, i) => i !== index));
                                  setImages(images.filter((_, i) => i !== index));
                                }}
                              />
                              <div className="flex justify-between">
                                <button
                                  onClick={() => {
                                    console.log(images[index].name);
                                    handleDownload(imageUrls[index], imageUrls[index].split('/').pop())
                                  }}
                                >
                                  <GrDownload />
                                </button>
                                <select
                                  onChange={(e) => {
                                    const newIndex = parseInt(e.target.value);
                                    // console.log("index--->",index, "newIndex--->", newIndex)
                                    console.log(images);
                                    const updatedImages = [...images];
                                    const updatedImageUrls = [...imageUrls];

                                    // Swap images
                                    const tempImage = updatedImages[index];
                                    updatedImages[index] = updatedImages[newIndex];
                                    updatedImages[newIndex] = tempImage;
                                    console.log(updatedImages);
                                    // Swap imageUrls
                                    const tempImageUrl = updatedImageUrls[index];
                                    updatedImageUrls[index] = updatedImageUrls[newIndex];
                                    updatedImageUrls[newIndex] = tempImageUrl;

                                    // Update states
                                    setImages(updatedImages);
                                    setImageUrls(updatedImageUrls);
                                    // console.log(images);
                                  }}
                                  value={index}
                                >
                                  {Array.from({ length: images?.length }, (_, i) => (
                                    <option key={i} value={i}>
                                      {i}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                {imageUrls?.[index] && hoveredIndex === index && (
                                  <div>
                                    {images[index]?.name}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        {/* <ImageDraggableItem
                          key={index}
                          index={index}
                          imageUrl={imageUrls?.[index]}
                          onDrop={handleDrop}
                          setImageUrls={setImageUrls}
                          imageUrls={imageUrls}
                          setImages={setImages}
                        /> */}
                      </>
                    ))}
                   
                  </div>
                  <div className="flex flex-wrap gap-5 items-center my-3">
                    {fileURLs?.map((image, index) => (
                      <div key={index} className="flex flex-col gap-2 items-center">
                        <img src={image} className="w-32 h-32 object-contain" />
                        <Button
                          size="sm"
                          color="red"
                          variant="text"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemove(index)
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
              </div>
              <div className="flex flex-col gap-4 my-4 overflow-hidden">
                <label className="font-bold text-sm">Product name:</label>
                <Input
                  // size="lg"
                  label="Enter your product name *"
                  disabled={isLoading}
                  error={errors?.title?.message ? true : false}
                  onInput={(e) => {
                    setTitle(e.target.value);
                    // setSlug(slugify(e.target.value))
                  }}
                  defaultValue={title}
                  {...register("title", {
                    required: {
                      value: true,
                      message: "Product name is required",
                    },
                  })}
                />
                {errors?.title?.message && (
                  <p className="text-sm text-red-500">{errors?.title?.message}</p>
                )}
                <label className="font-bold text-sm">Slug of product:</label>
                <Input
                  // size="lg"
                  label="Enter your slug of product *"
                  disabled={isLoading}
                  value={slug} 
                  error={errors?.slug?.message ? true : false}
                  onInput={(e) => setSlug(e.target.value)}
                  defaultValue={slug}
                // {...register("slug", {
                //   required: {
                //     value: true,
                //     message: "slug of the product is required",
                //   },
                // })}
                />
                {errors?.slug?.message && (
                  <p className="text-sm text-red-500">{errors?.slug?.message}</p>
                )}

                <label className="font-bold text-sm">Image Alt Tag:</label>
                <Input
                  // size="lg"
                  label="Enter your image alt tag"
                  disabled={isLoading}
                  error={errors?.imgAlt?.message ? true : false}
                  onInput={(e) => {
                    setImgAlt(e.target.value)
                  }}
                  defaultValue={imgAlt}
                // {...register("imgAlt", {
                //   required: {
                //     value: true,
                //     message: "Image Alt tag required",
                //   },
                // })}
                />
                {errors?.imgAlt?.message && (
                  <p className="text-sm text-red-500">{errors?.imgAlt?.message}</p>
                )}

                <div>
                  <label className="font-bold text-sm">Tags of product:</label>
                  <div className="flex flex-row space-x-4 my-4">
                    {tags.filter(tag => tag.trim() !== '').map((tag, index) => ( 
                      <div className="relative" key={index}>
                        <Button variant="outlined" size="sm">
                          {tag}
                        </Button>
                        <button className="remove-tag" onClick={() => handleRemoveTag(tag)}>
                          <XCircleIcon
                            className="w-6 h-6 absolute -right-2 -top-3 bg-black text-white rounded-full cursor-pointer"
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Input
                    label="Enter your tag name"
                    disabled={isLoading}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full"
                    placeholder="Enter your tags of product"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  {/* Suggestions */}
                  {inputValue && (
                    <div className="my-4 mx-2">
                      {tags?.filter(tag => tag.toLowerCase().includes(inputValue.toLowerCase())).map((suggestedTag, index) => (
                        <div className="suggested-tag" key={index} onClick={() => setInputValue(suggestedTag)}>
                          {suggestedTag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>


                <label className="font-bold text-sm">
                  Product description (Optional):
                </label>

                {description && (
                  <Tiptap
                    content={description}
                    onChange={(newContent) => {
                      setDescription(newContent);
                    }}
                  />
                )}

                {!description && (
                  <Tiptap
                    content={description}
                    onChange={(newContent) => {
                      setDescription(newContent);
                    }}
                  />
                )}

                <div>
                  <span className="font-semibold">Choose the category: </span>
                  <div className="flex flex-col md:flex-row justify-start overflow-x-auto gap-x-1 item-center flex-wrap">
                    {/* {allParentCategoryLoading ? (
                      <div className="w-full h-[100px] flex flex-col justify-center items-center">
                        <Spinner className="w-6 h-6" />
                        <Typography>
                          Please wait while the Category load
                        </Typography>
                      </div>
                    ) : ( */}
                      <>
                        {desiredSequence.map((categoryName, index) => {
                          // Find the category object corresponding to the current category name
                          const item = allParentCategory.find(item => item.name === categoryName);

                          // If the category object is found, render it
                          if (item) {
                            const isSecondRow = index >= 20;
                            return (
                              <React.Fragment key={item.id}>
                                <div className={isSecondRow ? "md:hidden block sm:px-10 px-0" : "md:block hidden"}>
                                  {parentSelect == item.id ? (
                                    <div
                                      onClick={() => {
                                        setParentSelect(
                                          parentSelect == item.id ? 0 : item.id,
                                        );
                                        setSelectedCategory([]);
                                      }}
                                      className="bg-[#000000] px-3 rounded-md py-2 flex flex-row gap-2 my-2"
                                    >
                                      <button className="text-white whitespace-nowrap capitalize font-medium">
                                        {item?.name}
                                      </button>
                                      <div className="flex jutify-center item-center pt-1 transition-transform duration-500 rotate-180">
                                        <IoIosArrowDown
                                          color={"white"}
                                          className=""
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      onClick={() => {
                                        if(!isLoading) setParentSelect(item.id); 
                                        // console.log(item, "skjdfdkjf");
                                      }}
                                      className="bg-[#D9D9D9] px-3 rounded-md py-2 flex flex-row gap-2 my-2"
                                    >
                                      <button className="text-black whitespace-nowrap capitalize font-medium">
                                        {item?.name}
                                      </button>
                                      <div className="flex jutify-center item-center pt-1 transition-transform duration-500 rotate-360">
                                        <IoIosArrowDown className="" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="md:hidden block sm:px-10 px-0">
                                  <Accordion
                                    open={accordianOpen === item.id}
                                    animate={CUSTOM_ANIMATION}
                                    icon={
                                      <AccordianIcon
                                        id={item.id}
                                        open={accordianOpen}
                                      />
                                    }
                                  >
                                    <AccordionHeader
                                      className="bg-[#EAEAEA] text-black px-10 my-2 rounded-md"
                                      onClick={() => {
                                        setParentSelect(item.id);
                                        handleAccordian(item.id);
                                      }}
                                    >
                                      <span className="text-base text-black font-semibold capitalize">
                                        {item?.name}
                                      </span>
                                    </AccordionHeader>
                                    <AccordionBody className="py-1">
                                      {!selectedCategoryLoading ? (
                                        <div className="w-full h-full grid justify-between cursor-pointer item-start grid-cols-2">
                                          <>
                                            {selectedCategory?.length > 0 ? (
                                              <>
                                                {selectedCategory
                                                  .map((data, id) => {
                                                    return (
                                                      <div
                                                        key={data?.id}
                                                        onClick={() => {
                                                          setCategory(data?.id);
                                                          setCategoryName(
                                                            data?.name,
                                                          );
                                                          fetchCategories(
                                                            data?.name,
                                                          );
                                                          // setShowResults(false);
                                                          setParentSelect("");
                                                          setSelectedCategory([]);
                                                          setAccordianOpen("");
                                                          setisNewCategory(false);
                                                        }}
                                                        className="px-4 m-1 text-center cursor-pointer py-2 bg-[#F8F8F8] rounded-md hover:bg-black hover:text-white md:text-base font-medium text-base text-black"
                                                      >
                                                        {data?.name}
                                                      </div>
                                                    );
                                                  })}
                                              </>
                                            ) : (
                                              <div className="flex flex-row justify-center item-center h-[50px] w-full text-black font-medium text-base">
                                                <span>no sub category</span>
                                              </div>
                                            )}
                                          </>
                                        </div>
                                      ) : (
                                        <div className="w-full h-[100px] flex flex-col justify-center items-center">
                                          <Spinner className="w-6 h-6" />
                                          <Typography>
                                            Please wait while we fetch data
                                          </Typography>
                                        </div>
                                      )}
                                    </AccordionBody>
                                  </Accordion>
                                </div>
                              </React.Fragment>
                            );
                          }
                          return null;
                        })}
                      </>
                    {/* )} */}
                  </div>
                  <div className="md:block hidden">
                    {!selectedCategoryLoading ? (
                      <div className="py-5 w-full h-full grid gap-3 justify-between cursor-pointer item-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {
                          <>
                            {selectedCategory?.length > 0 ? (
                              <>
                                {selectedCategory
                                  .map((item, id) => {
                                    return (
                                      <div
                                        key={item?.id}
                                        onClick={() => {
                                          setCategory(item?.id);
                                          fetchCategories(item?.name);
                                          setCategoryName(item?.name);
                                          setParentSelect("");
                                          setSelectedCategory([]);
                                          setisNewCategory(false);
                                        }}
                                        className="px-4 text-center py-2 border-2 border-solid border-black cursor-pointer bg-transparent font-semibold text-base text-black"
                                      >
                                        {item?.name}
                                      </div>
                                    );
                                  })}
                              </>
                            ) : (
                              <>
                                {parentSelect ? (
                                  <div className="flex flex-row justify-center capitalize item-center h-[50px] w-full text-black font-medium text-base">
                                    no sub category
                                  </div>
                                ) : (
                                  ""
                                )}
                              </>
                            )}
                          </>
                        }
                      </div>
                    ) : (
                      <div className="w-full h-[100px] flex flex-col justify-center items-center">
                        <Spinner className="w-6 h-6" />
                        <Typography>Please wait while we fetch data</Typography>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between item-center">
                  <div className="flex flex-row align-center item-center">
                    {categoryName ? (
                      <>
                        <span className="font-semibold text-black md:text-base text-sm">
                          {isNewCategory
                            ? "Requested Category: "
                            : "Selected Category: "}
                        </span>
                        <p className="font-semibold">
                          &nbsp;
                          {categoryName}
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="text-sm md:text-base">
                    Didn't find the category looking for ?&nbsp;
                    <button
                      onClick={() => {
                        setNewCategoryRequest(true);
                      }}
                      className="md:px-3 px-1.5 py-1 w-fit md:py-1.5 border-2 md:text-base text-sm border-solid bg-transparent shadow-sm rounded-md text-black ms-0 mt-1.5 md:mt-0 md:ms-2"
                    >
                      Request Category
                    </button>
                  </div>
                </div>
                {errors?.category?.message && (
                  <p className="text-sm text-red-500">
                    {errors?.category?.message}
                  </p>
                )}
                {showResults && (
                  <div className="bg-white rounded h-auto max-h-56 overflow-auto p-3 shadow -mt-4">
                    {data?.length > 0 ? (
                      <>
                        {data?.map((prop) => (
                          <Typography
                            className="font-medium cursor-pointer"
                            onClick={() => {
                              setCategory(prop.id);
                              setCategoryName(prop.name);
                              setShowResults(false);
                            }}
                          >
                            {prop.name}
                          </Typography>
                        ))}
                      </>
                    ) : (
                      <Typography
                        className="font-normal cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          addNewCategory(categoryName);
                        }}
                      >
                        <PlusIcon className="w-4 h-4" /> Add new category
                        <span className="font-medium">{categoryName}</span>
                      </Typography>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {/* First Div */}
                  <div>
                    {/* displaying old categories and attribute should be removed in fulture */}
                    <div className="border-2 p-2">
                      <p className="text-red-400 underline">
                        Note: Below is the old categories
                      </p>
                      <p className="space-x-1">
                        <span className="font-bold">Category Name:</span>
                        <span>{editData?.categoryName}</span>
                        <ul>
                          {editData?.old_attributes.map((attribute, index) => (
                            <li key={index} className="space-x-1">
                              <span className="font-bold">{attribute.name}:</span>
                              <span>{attribute.value}</span>
                            </li>
                          ))}
                        </ul>
                      </p>
                    </div>
                    {/* displaying new attributes */}
                    {attributes.length > 0 && (
                      <div className="border-2 p-2">
                        <p className="text-green-400 underline">
                          New attributes
                        </p>
                        <p>
                          <p><span className="font-bold">Category Name:</span>{" "}{categoryName}</p>
                          <ul>
                            {editData?.attributes?.map((attribute, index) => (
                              <li key={index} className="space-x-1">
                                <span className="font-bold">{attribute.name}:</span>
                                <span>{attribute.value}</span>
                              </li>
                            ))}
                          </ul>
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Second Div */}
                  <div className="overflow-auto h-[600px]">
                    {category && (
                      <>
                        {data
                          ?.filter((item) => item.id === category)
                          ?.map((prop) => (
                            <div key={prop.id}>
                              {prop?.attributes?.map((attribute, index) => (
                                <div key={index}>
                                  {attribute?.attribute?.type === "select" &&
                                    (
                                      <>
                                        <Typography className="font-bold capitalize ">
                                          {attribute.attribute.name} *
                                        </Typography>

                                        <select
                                          label={`Select ${attribute.attribute.name}`}
                                          disabled={isLoading}
                                          className="peer mb-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
                                          {...register(
                                            `attributes.${index}.${attribute.attribute.name}`,
                                            {
                                              required: {
                                                value: true,
                                                message: `${attribute.attribute.name} is required`,
                                              },
                                            },
                                          )}
                                          defaultValue={
                                            editData &&
                                            attributes?.filter(
                                              (item) =>
                                                item.name ===
                                                attribute.attribute.name,
                                            ).length > 0 &&
                                            attributes?.filter(
                                              (item) =>
                                                item.name ===
                                                attribute.attribute.name,
                                            )[0].value
                                          }
                                          onChange={(e) => {
                                            // console.log(e.target.value, "attribute");
                                            setAttributes((prev) =>
                                              prev.filter(
                                                (item) =>
                                                  item.name !==
                                                  attribute.attribute.name,
                                              ),
                                            );
                                            setAttributes((prev) => [
                                              ...prev,
                                              {
                                                name: attribute.attribute.name,
                                                value: e.target.value,
                                              },
                                            ]);
                                          }}
                                          error={
                                            errors[
                                              `attributes.${index}.${attribute.attribute.name}`
                                            ]
                                              ? true
                                              : false
                                          }
                                        >
                                          <option value="">
                                            --
                                          </option>
                                          {attribute.attribute.values.map(
                                            (prop1, valueIndex) => (
                                              <option
                                                key={valueIndex}
                                                value={prop1.name}
                                              >
                                                {prop1.name}
                                              </option>
                                            ),
                                          )}
                                        </select>
                                        {/* Display the error message */}
                                        {errors?.attributes?.[index]?.[
                                          attribute.attribute.name
                                        ]?.message && (
                                            <p className="text-sm text-red-500">
                                              {
                                                errors?.attributes?.[index]?.[
                                                  attribute.attribute.name
                                                ]?.message
                                              }
                                            </p>
                                          )}
                                      </>
                                    )}

                                  {attribute?.attribute?.type === "input" &&
                                    (
                                      <>
                                        <Typography className="font-bold">
                                          {attribute.attribute.name} *
                                        </Typography>
                                        <div>
                                          {attribute.attribute.values.map(
                                            (prop1, valueIndex) => (
                                              <div className="mt-2">
                                                <Input
                                                  label={prop1.name}
                                                  type={prop1.valueType}
                                                  disabled={isLoading}
                                                  defaultValue={
                                                    editData &&
                                                      attributes?.filter(
                                                        (item) =>
                                                          item.name === prop1.name,
                                                      ).length > 0 &&
                                                      attributes?.filter(
                                                        (item) =>
                                                          item.name === prop1.name,
                                                      )[0].value ? attributes?.filter(
                                                        (item) =>
                                                          item.name === prop1.name,
                                                      )[0].value : ""
                                                  }
                                                  key={valueIndex}
                                                  {...register(
                                                    `attributes.${valueIndex}.${prop1.name}`,
                                                    {
                                                      required: {
                                                        value: true,
                                                        message: `${prop1.name} is required`,
                                                      },
                                                    },
                                                  )}
                                                  onBlur={(e) =>
                                                    setAttributes((prev) => [
                                                      ...prev.filter(
                                                        (item) =>
                                                          item.name !== prop1.name,
                                                      ),
                                                      {
                                                        name: prop1.name,
                                                        value: e.target.value,
                                                      },
                                                    ])
                                                  }
                                                  error={
                                                    errors?.attributes?.[
                                                      valueIndex
                                                    ]?.[prop1.name]
                                                      ? true
                                                      : false
                                                  }
                                                />
                                                {errors?.attributes?.[valueIndex]?.[
                                                  prop1.name
                                                ]?.message && (
                                                    <p className="text-sm text-red-500">
                                                      {
                                                        errors?.attributes?.[
                                                          valueIndex
                                                        ]?.[prop1.name]?.message
                                                      }
                                                    </p>
                                                  )}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                        <div></div>
                                      </>
                                    )}

                                  {attribute?.attribute?.type === "checkbox" && attribute?.attribute?.isAdmin === false && (
                                    <>
                                      <Typography className="font-bold">
                                        {attribute.attribute.name}
                                      </Typography>
                                      {attribute.attribute.values.map((prop1, valueIndex) => {
                                        // Get the existing values for the attribute
                                        const existingValues = attributes.find(item => item.name === attribute.attribute.name)?.value || [];

                                        return (
                                          <Checkbox
                                            label={prop1.name}
                                            disabled={isLoading}
                                            {...register(
                                              `attributes.${index}.${attribute.attribute.name}.${prop1.name}`,
                                              { required: false }
                                            )}
                                            // Check if the value exists in the existing values array
                                            defaultChecked={existingValues.includes(prop1.name)}
                                            onChange={(e) => {
                                              const isChecked = e.target.checked;
                                              const value = prop1.name;
                                              const attributeName = attribute.attribute.name;

                                              // Update the attributes state based on the checkbox status
                                              setAttributes(prevAttributes => {
                                                let updatedAttributes = [...prevAttributes];

                                                // Find the attribute in the updatedAttributes array
                                                const existingAttributeIndex = updatedAttributes.findIndex(item => item.name === attributeName);
                                                const existingAttribute = updatedAttributes[existingAttributeIndex];

                                                // If checkbox is checked, add/remove the value to/from the attribute
                                                if (isChecked) {
                                                  // If attribute already exists, update its value
                                                  if (existingAttribute) {
                                                    if (Array.isArray(existingAttribute.value)) {
                                                      updatedAttributes[existingAttributeIndex] = {
                                                        ...existingAttribute,
                                                        value: [...existingAttribute.value, value],
                                                      };
                                                    } else {
                                                      // If the existing value is not an array, create a new array
                                                      updatedAttributes[existingAttributeIndex] = {
                                                        ...existingAttribute,
                                                        value: [existingAttribute.value, value],
                                                      };
                                                    }
                                                  } else {
                                                    // If attribute doesn't exist, create a new one
                                                    updatedAttributes.push({ name: attributeName, value: [value] });
                                                  }
                                                } else {
                                                  // If checkbox is unchecked, remove the value from the attribute
                                                  if (existingAttribute && Array.isArray(existingAttribute.value)) {
                                                    updatedAttributes[existingAttributeIndex] = {
                                                      ...existingAttribute,
                                                      value: existingAttribute.value.filter(item => item !== value),
                                                    };
                                                    // If attribute value becomes empty, remove the attribute from the state
                                                    if (updatedAttributes[existingAttributeIndex].value.length === 0) {
                                                      updatedAttributes.splice(existingAttributeIndex, 1);
                                                    }
                                                  } else if (existingAttribute && typeof existingAttribute.value === 'string') {
                                                    // If the value is a string, split it by commas and remove the value
                                                    updatedAttributes[existingAttributeIndex] = {
                                                      ...existingAttribute,
                                                      value: existingAttribute.value.split(',').filter(item => item !== value),
                                                    };
                                                    // If attribute value becomes empty, remove the attribute from the state
                                                    if (updatedAttributes[existingAttributeIndex].value.length === 0) {
                                                      updatedAttributes.splice(existingAttributeIndex, 1);
                                                    }
                                                  }
                                                }

                                                return updatedAttributes;
                                              });
                                              // console.log(attributes);
                                            }}
                                          />
                                        );
                                      })}
                                      <p className="text-sm font-bold text-red-500">
                                        {categoryError}
                                      </p>
                                    </>
                                  )}


                                  {attribute?.attribute?.type === "string" && attribute?.attribute?.name === "Orientation" && attribute?.attribute?.isAdmin === false && (
                                    <>
                                      <Typography className="font-bold mt-2">
                                        Artwork Orientation *
                                      </Typography>
                                      <div style={containerStyle}>
                                        {Object.keys(orientationIcons).map((key) => (
                                          <div key={key} style={{ textAlign: "center" }}>
                                            <button
                                              disabled={isLoading}
                                              {...register(`attributes.${attribute.attribute.name}`, {
                                                required: {
                                                  value: !attributes.find(attr => attr.name === "Orientation")?.value,
                                                  message: "Artwork orientation is required",
                                                },
                                              })}
                                              onClick={() => {
                                                setOrientation(key);
                                                if (isFirstClick.current) {
                                                    setAttributes((prev) => [
                                                        ...prev.filter(item => item.name !== attribute.attribute.name),
                                                        {
                                                            name: attribute.attribute.name,
                                                            value: orientationIcons[key].name,
                                                        },
                                                    ]);
                                                    isFirstClick.current = false;
                                                    setValue1(`attributes.${attribute.attribute.name}`, orientationIcons[key].name);
                                                } else {
                                                    // Clear background color of previously selected orientation
                                                    const prevOrientation = attributes.find(attr => attr.name === "Orientation")?.value;
                                                    if (prevOrientation && prevOrientation !== orientationIcons[key].name) {
                                                        const updatedAttributes = attributes.map(attr => {
                                                            if (attr.name === "Orientation") {
                                                                return { ...attr, value: orientationIcons[key].name };
                                                            }
                                                            return attr;
                                                        });
                                                        setAttributes(updatedAttributes);
                                                    }
                                                }
                                            }}
                                              style={{
                                                ...buttonStyle,
                                                // color: orientation === key ? "lightgray" : "",
                                                zIndex: orientation === key ? 1 : 0,
                                                color: attributes.find(attr => attr.name === "Orientation")?.value === orientationIcons[key].name ? "lightgray" : "",
                                              }}
                                            >
                                              {orientationIcons[key].icon}
                                            </button>
                                            <p
                                              style={{
                                                fontWeight: orientation === key ? "bold" : "normal",
                                              }}
                                            >
                                              {orientationIcons[key].name}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="mt-2">
                                        {errors?.attributes?.[attribute.attribute.name]?.message && (
                                          <p className="text-sm text-red-500">
                                            {errors?.attributes?.[attribute.attribute.name]?.message}
                                          </p>
                                        )}
                                      </div>
                                    </>
                                  )}


                                  {attribute?.attribute?.type === "radio" && attribute?.attribute?.isAdmin === false && (
                                    <div>
                                      <Typography className="font-bold" style={radioStyle}>
                                        Is the artwork signed by the artist? *
                                      </Typography>
                                      <div style={radioContainerStyle}>
                                        {attribute.attribute.values.map((prop1, valueIndex) => (
                                          <div key={valueIndex}>
                                            <div>
                                              <label style={radioLabelStyle}>
                                                <input
                                                  type="radio"
                                                  disabled={isLoading}
                                                  style={radioInputStyle}
                                                  {...register(`attributes.${attribute.attribute.name}`, {
                                                    required: {
                                                        value: !attributes.find(attr => attr.name === "Signed")?.value,
                                                        message: "Select anyone",
                                                    },
                                                  })}                
                                                  value={prop1?.name}
                                                  defaultChecked={attributes.find(attr => attr.name === "Signed")?.value === prop1.name}
                                                  onChange={() => {
                                                    setAttributes((prev) => [
                                                      ...prev.filter(item => item.name !== attribute.attribute.name),
                                                      {
                                                          name: attribute.attribute.name,
                                                          value: prop1.name,
                                                      },
                                                    ]);
                                                  }}
                                                />
                                                {prop1.name}                                              
                                              </label>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                      <div className="mt-2">
                                        {errors?.attributes?.[attribute.attribute.name]?.message && (
                                          <p className="text-sm text-red-500">
                                            {errors?.attributes?.[attribute.attribute.name]?.message}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}
                      </>
                    )}
                    {categoryError && (
                      <p className="text-sm font-bold text-red-500">
                        {categoryError}
                      </p>
                    )}
                  </div>
                </div>
                
              </div>
            </CardBody>
          </Card>

          <Card className="my-10">
            <CardBody>
              <Typography className="font-bold uppercase">
                Additional details
              </Typography>
              <hr className="h-[1px] bg-gray-700 w-full mb-8" />
              <div className="flex flex-col gap-6">

                {/* {creators?.length > 0 && (
                  <select
                    name="creator"
                    {...register("creator", { required: false })}
                    onChange={(e) => {
                      setCreatorName(e.target.value);
                      setValue1("creator", e.target.value);
                    }}
                    className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
                    defaultValue={creator}
                  >
                    <option value="">Select a creator</option>
                    {creators?.map((prop, index) => (
                      <option value={prop.id} key={index}>
                        {prop.name}
                      </option>
                    ))}
                  </select>
                )} */}

                {/* <label className="font-bold text-sm">
                  Select where your product should be visible
                </label>
                <div className="flex gap-x-10">
                  <Radio
                    name="scope"
                    label="Worldwide"
                    value={"worldwide"}
                    checked={scope === "worldwide" ? true : false}
                    defaultChecked={scope === "worldwide" ? true : false}
                    onChange={(e) => setScope(e.target.value)}
                  />
                  <Radio
                    name="scope"
                    label="India"
                    value={"india"}
                    checked={scope === "india" ? true : false}
                    defaultChecked={scope === "india" ? true : false}
                    onChange={(e) => setScope(e.target.value)}
                  />
                </div> */}
                {/* {errors?.scope?.message && (
                  <p className="text-sm text-red-500">{errors?.scope?.message}</p>
                )} */}

                {!isIndividual && (
                  <div className="border-2 p-2 space-y-4">
                    <Checkbox
                      id="checkbox"
                      color="black"
                      label="Do you want to provide the creator's name ?"
                      onChange={(e) => {
                        setHasCreator(e.target.checked);
                      }}
                      defaultChecked={true}
                      disabled={isLoading}
                    />
                    {hasCreator && (
                      <div className="space-y-4">
                        <Input
                          label="Enter your creator's name"
                          disabled={isLoading}
                          className="border border-gray-300 rounded-md px-3 py-2 w-full"
                          placeholder="Enter your creator's name"
                          defaultValue={creatorName}
                          value={creatorName}
                          {...register("creatorName", {
                            required: {
                              value: true,
                              message: "Creator name is required",
                            },
                          })}
                          onChange={(e) => {
                            setCreatorName(e.target.value);
                            setValue1("creatorName", e.target.value);
                          }}
                        />
                        {errors?.creatorName?.message && (
                          <p className="text-sm text-red-500">
                            {errors?.creatorName?.message}
                          </p>
                        )}
                        {/* Suggestions */}
                        {/* {inputValue && (
                          <div className="my-4 mx-2 cursor-pointer">
                            {tags?.filter(tag => tag.toLowerCase().includes(inputValue.toLowerCase())).map((suggestedTag, index) => (
                              <div className="suggested-tag" key={index} onClick={() => setInputValue(suggestedTag)}>
                                {suggestedTag}
                              </div>
                            ))}
                          </div>
                        )} */}
                        <Select
                          label="select creator name"
                          onChange={(value) => {
                            console.log(value);
                            setCreatorName(value);
                          }}
                          disabled={isLoading}
                        >
                          {creatorNames.map((value, index) => (
                            <Option key={index} value={value.name}>
                              {value.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                    )}
                  </div>
                )}
                

                <Input
                  // size="lg"
                  label="Enter your product origin country *"
                  disabled={isLoading}
                  onInput={(e) => setOriginCountry(e.target.value)}
                  defaultValue={originCountry}
                  {...register("originCountry", {
                    required: {
                      value: true,
                      message: "Product origin country is required",
                    },
                  })}
                />
                {errors?.originCountry?.message && (
                  <p className="text-sm text-red-500">
                    {errors?.originCountry?.message}
                  </p>
                )}
                <Input
                  // size="lg"
                  type="string"
                  label="Enter your product creation year *"
                  disabled={isLoading}
                  onInput={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value) || value === "") {
                      setYear(value);
                    }
                  }}
                  defaultValue={year}
                  value={year}
                  maxLength={4}
                  min={0}
                  {...register("year", {
                    required: {
                      value: true,
                      message: "Product creation year is required",
                    },
                    maxLength: {
                      value: 4,
                      message: "Year more than 4 digits are not allowed",
                    },
                    validate: (value) => {
                      const inputValue = parseInt(value);
                      const currentYear = new Date().getFullYear();

                      return (
                        (inputValue >= 1900 && inputValue <= currentYear) ||
                        `Year must be between 1900 and ${currentYear}`
                      );
                    },
                  })}
                />
                {errors?.year?.message && (
                  <p className="text-sm text-red-500">{errors?.year?.message}</p>
                )}
                <Switch
                  label="Is this product made on order?"
                  onClick={() => setIsMadeOnOrder(!madeOnOrder)}
                  defaultChecked={editData?.madeToOrder}
                />
                {madeOnOrder && (
                  <>
                    <Input
                      // size="md sm:lg"
                      type="string"
                      label="Enter the number of days it will take to make this product"
                      disabled={isLoading}
                      error={errors?.reproducableDays?.message ? true : false}
                      // onInput={(e) => setReproducableDays(e.target.value)}
                      maxLength={2}
                      onInput={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value) || value === "") {
                          setReproducableDays(value);
                        }
                      }}
                      defaultValue={reproducableDays}
                      value={reproducableDays}
                      {...register("reproducableDays", {
                        required: {
                          value: true,
                          message: "Product production time is required",
                        },
                        maxLength: {
                          value: 2,
                          message:
                            "production time is limited to maximum 99 days",
                        },
                      })}
                    />
                    {errors?.reproducableDays?.message && (
                      <p className="text-sm text-red-500">
                        {errors?.reproducableDays?.message}
                      </p>
                    )}
                  </>
                )}
              </div>
            </CardBody>
          </Card>
          {category && (
            <Card>
              <CardBody>
                <div className="bg-gray-50 rounded-md p-3 border border-black">
                  <Checkbox
                    label="My product have multiple variants (Size, color, etc.)?"
                    defaultChecked={hasVariant}
                    checked={hasVariant}
                    onChange={() => {
                      setHasVariant(!hasVariant);
                      hasVariant == false
                        ? append({
                          name: "",
                          price: "",
                          quantity: "",
                          salePrice: null,
                          saleStartDate: "",
                          saleEndDate: "",
                        })
                        : fields[fields.length - 1].name == "" &&
                        remove(fields.length - 1);
                    }}
                  />
                  {hasVariant && (
                    <>
                      <Typography className="font-bold text-lg">
                        Enter your variations
                      </Typography>

                      <Input
                        label="Variation type"
                        defaultValue={variationName}
                        onChange={handleInputChange}
                        autoFocus={true}
                      />
                      {variationBox ? (
                        <div className="shadow max-h-36 z-[999] bg-white overflow-y-auto rounded-md">
                          {/* {entries?.map((item, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              handleVariationInput(item);
                            }}
                            className="p-2 text-xs text-slate-600 capitalize cursor-pointer border-b"
                          >
                            <p>{item.name}</p>
                          </div>
                        ))} */}
                          {inputValue.trim() !== "" &&
                            !entries.includes(inputValue) && (
                              <div
                                onClick={() => {
                                  handleNewVariationInput(inputValue);
                                }}
                                className="p-2 text-xs text-slate-600 capitalize cursor-pointer border-b"
                              >
                                <p className="flex gap-1">
                                  <PlusIcon className="w-4 h-4 font-bold" />
                                  {`Add new variation`} <b>{inputValue}</b>
                                </p>
                              </div>
                            )}
                        </div>
                      ) : null}

                      <div>
                        {fields?.map((prop, index) => (
                          <>
                            <div className="grid gap-3 lg:grid-cols-3 grid-cols-1 relative mt-3">
                              <div>
                                <Input
                                  label="variation name"
                                  {...register(`variations.${index}.name`, {
                                    required: {
                                      value: true,
                                      message: "Name is required",
                                    },
                                  })}
                                  defaultValue={prop.name}
                                  autoFocus={false}
                                  onBlur={(e) => {
                                    handleVariantChange(
                                      index,
                                      "name",
                                      e.target.value,
                                    );
                                  }}
                                />
                                {errors?.variations?.[index]?.["name"] && (
                                  <p className="text-sm text-red-500">
                                    {
                                      errors?.variations?.[index]?.["name"]
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                              <div>
                                <Input
                                  type="string"
                                  label="Price"
                                  defaultValue={prop.price}
                                  {...register(`variations.${index}.price`, {
                                    required: {
                                      value: true,
                                      message: "Price is required",
                                    },
                                    validate: (value) =>
                                      parseInt(value) > 0 || "Price cannot be 0",
                                  })}
                                  onBlur={(e) => {
                                    {
                                      handleVariantChange(
                                        index,
                                        "price",
                                        e.target.value,
                                      );
                                    }
                                  }}
                                />

                                <Typography
                                  className="text-global cursor-pointer text-sm font-medium mb-2"
                                  onClick={() =>
                                    setVariationBreakdownOpen(
                                      !variationBreakdownOpen,
                                    )
                                  }
                                >
                                  Price Breakdown
                                </Typography>
                                {errors?.variations?.[index]?.["price"] && (
                                  <p className="text-sm text-red-500">
                                    {
                                      errors?.variations?.[index]?.["price"]
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                              <div>
                                <Input
                                  type="string"
                                  min={0}
                                  label="Quantity"
                                  defaultValue={prop.quantity}
                                  {...register(`variations.${index}.quantity`, {
                                    required: {
                                      value: true,
                                      message: "Quantity is required",
                                    },
                                  })}
                                  onBlur={(e) => {
                                    handleVariantChange(
                                      index,
                                      "quantity",
                                      e.target.value,
                                    );
                                  }}
                                />
                                {errors?.variations?.[index]?.["quantity"] && (
                                  <p className="text-sm text-red-500">
                                    {
                                      errors?.variations?.[index]?.["quantity"]
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                              <Switch
                                label="Is this variation on sale?"
                                onClick={() =>
                                  handleVariantChange(
                                    index,
                                    "isSale",
                                    !variants[index]?.isSale,
                                  )
                                }
                                defaultChecked={variants[index]?.isSale}
                              />
                            </div>
                            <div className="grid gap-3 lg:grid-cols-3 grid-cols-1 relative mb-3 mt-2">
                              {variants[index]?.isSale && (
                                <>
                                  <div>
                                    <Input
                                      type="number"
                                      label="Enter Sale price"
                                      defaultValue={prop.salePrice}
                                      {...register(
                                        `variations.${index}.salePrice`,
                                        {
                                          required: {
                                            value: true,
                                            message:
                                              "variation sale price is required",
                                          },
                                          validate: (value) =>
                                            0 <
                                            parseInt(value) <
                                            parseInt(variants[index]?.price) ||
                                            "Variation sale price should not be more than or equal to the variation original price",
                                        },
                                      )}
                                      onBlur={(e) =>
                                        handleVariantChange(
                                          index,
                                          "salePrice",
                                          e.target.value,
                                        )
                                      }
                                    />

                                    {errors?.variations?.[index]?.[
                                      "salePrice"
                                    ] && (
                                        <p className="text-sm text-red-500">
                                          {
                                            errors?.variations?.[index]?.[
                                              "salePrice"
                                            ]?.message
                                          }
                                        </p>
                                      )}
                                  </div>
                                  <div>
                                    <DatePicker
                                      name="saleStartDate"
                                      selected={variants?.[index]?.saleStartDate}
                                      {...register(
                                        `variations.${index}.saleStartDate`,
                                        {
                                          required: {
                                            value: true,
                                            message:
                                              "variation sale start date is required",
                                          },
                                        },
                                      )}
                                      onChange={(e) => {
                                        handleVariantChange(
                                          index,
                                          "saleStartDate",
                                          e,
                                        );
                                        setValue1(
                                          `variations.${index}.saleStartDate`,
                                          e,
                                        );
                                      }}
                                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-3 rounded-md border-blue-gray-200"
                                      placeholderText={`Select sale end date (Eg. ${new Date(
                                        new Date().setHours(
                                          new Date().getHours() + 24,
                                        ),
                                      ).toLocaleDateString()})`}
                                      peekNextMonth
                                      maxDate={addMonths(new Date(), 12)}
                                      dropdownMode="select"
                                      minDate={addDays(new Date(), 1)} // Optional: To prevent selecting future dates
                                      dateFormat="dd/MM/yyyy" // Optional: Customize the date format
                                    />
                                    {errors?.variations?.[index]?.[
                                      "saleStartDate"
                                    ] && (
                                        <p className="text-sm text-red-500">
                                          {
                                            errors?.variations?.[index]?.[
                                              "saleStartDate"
                                            ]?.message
                                          }
                                        </p>
                                      )}
                                  </div>
                                  <div>
                                    <DatePicker
                                      name="saleEndDate"
                                      selected={variants?.[index]?.saleEndDate}
                                      {...register(
                                        `variations.${index}.saleEndDate`,
                                        {
                                          required: {
                                            value: true,
                                            message:
                                              "variation sale end date is required",
                                          },
                                        },
                                      )}
                                      onChange={(e) => {
                                        handleVariantChange(
                                          index,
                                          "saleEndDate",
                                          e,
                                        );

                                        setValue1(
                                          `variations.${index}.saleEndDate`,
                                          e,
                                        );
                                      }}
                                      className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-3 rounded-md border-blue-gray-200"
                                      placeholderText={`Select sale end date (Eg. ${new Date(
                                        new Date().setHours(
                                          new Date().getHours() + 24,
                                        ),
                                      ).toLocaleDateString()})`}
                                      peekNextMonth
                                      maxDate={addMonths(new Date(), 12)}
                                      dropdownMode="select"
                                      minDate={addDays(
                                        new Date(
                                          variants?.[index]?.saleStartDate,
                                        ),
                                        1,
                                      )} // Optional: To prevent selecting future dates
                                      dateFormat="dd/MM/yyyy" // Optional: Customize the date format
                                    />
                                    {errors?.variations?.[index]?.[
                                      "saleEndDate"
                                    ] && (
                                        <p className="text-sm text-red-500">
                                          {
                                            errors?.variations?.[index]?.[
                                              "saleEndDate"
                                            ]?.message
                                          }
                                        </p>
                                      )}
                                  </div>
                                </>
                              )}
                            </div>
                            <Button
                              type="button"
                              className="bg-red-500 w-fit block"
                              onClick={() => {
                                if (index == 0 && fields.length == 1) {
                                  setHasVariant(!hasVariant);
                                }
                                remove(index);
                                removeVariant(index);
                              }}
                            >
                              Remove
                            </Button>
                            <hr className="my-3" />
                          </>
                        ))}
                      </div>
                    </>
                  )}
                  {/* add sale */}
                  {hasVariant && (
                    <Button
                      type="button"
                      className="my-4 flex justify-center items-center"
                      onClick={() => {
                        append({
                          name: "",
                          price: "",
                          quantity: "",
                          salePrice: null,
                          saleStartDate: "",
                          saleEndDate: "",
                        });
                        setVariants((prevVariant) => [
                          ...prevVariant,
                          {
                            name: "",
                            price: "",
                            quantity: "",
                            backOrder: false,
                            status: "",
                            salePrice: "",
                            saleStartDate: "",
                            saleEndDate: "",
                          },
                        ]);
                      }}
                    >
                      <PlusIcon className="w-4 h-4" /> Add Variation
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {!hasVariant && (
            <Card className="my-10">
              <CardBody>
                <Typography className="font-bold uppercase">
                  Price and Inventory
                </Typography>
                <hr className="h-[1px] bg-gray-700 w-full mb-8" />
                <div className="flex flex-col gap-6 overflow-hidden">
                  <div>
                    <Typography
                      className="text-global cursor-pointer"
                      onClick={() => setBreakdownOpen(!breakdownOpen)}
                    >
                      Price breakdown
                    </Typography>
                    <Input
                      // size="md sm:lg"
                      type="string"
                      disabled={isLoading}
                      label="Enter your product price *"
                      error={errors?.price?.message ? true : false}
                      // onInput={(e) => setPrice(e.target.value)}
                      onInput={(e) => {
                        const value = e.target.value;
                        if (/^[0-9]*$/.test(value) || value === "") {
                          setPrice(value);
                        }
                      }}
                      defaultValue={price}
                      value={price}
                      {...register("price", {
                        required: {
                          value: true,
                          message: "Product price is required",
                        },
                      })}
                    />
                    {errors?.price?.message && (
                      <p className="text-sm text-red-500 mt-2">
                        {errors?.price?.message}
                      </p>
                    )}
                  </div>
                  <Switch
                    label="Is this product on sale?"
                    onClick={() => setIsSale(!isSale)}
                    disabled={isLoading}
                    defaultChecked={isSale}
                  />
                  {isSale && (
                    <>
                      <Input
                        // size="md sm:lg"
                        type="string"
                        disabled={isLoading}
                        label="Enter your product sale price *"
                        error={errors?.salePrice?.message ? true : false}
                        defaultValue={salePrice}
                        value={salePrice}
                        {...register("salePrice", {
                          required: {
                            value: true,
                            message: "Product sale price is required",
                          },
                          validate: (value) =>
                            parseInt(value) < parseInt(price) ||
                            "Sale price should not be more than or equal to the original price",
                        })}
                        onInput={(e) => {
                          const value = e.target.value;
                          if (/^[0-9]*$/.test(value) || value === "") {
                            setSalePrice(value);
                          }
                        }}
                      />
                      {errors?.salePrice?.message && (
                        <p className="text-sm text-red-500 mt-2">
                          {errors?.salePrice?.message}
                        </p>
                      )}
                      <label className="font-bold text-sm">
                        Enter sale start and end date
                      </label>
                      <div className="grid grid-cols-2 w-full gap-3">
                        <div className="w-full">
                          <DatePicker
                            name="startDate"
                            selected={startDate}
                            {...register("startDate", {
                              required: {
                                value: true,
                                message: "Sale start date is required",
                              },
                            })}
                            onChange={handleStartDateChange}
                            className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-3 rounded-md border-blue-gray-200"
                            placeholderText={`Select sale start date (Eg. ${new Date().toLocaleDateString()})`}
                            peekNextMonth
                            dropdownMode="select"
                            minDate={new Date()} // Optional: To prevent selecting future dates
                            dateFormat="dd/MM/yyyy" // Optional: Customize the date format
                          />
                          {errors?.startDate?.message && (
                            <p className="text-sm text-red-500 mt-2">
                              {errors?.startDate?.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <DatePicker
                            name="endDate"
                            selected={endDate}
                            {...register("endDate", {
                              required: {
                                value: true,
                                message: "Sale end date is required",
                              },
                            })}
                            onChange={handleEndDateChange}
                            className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-3 rounded-md border-blue-gray-200"
                            placeholderText={`Select sale end date (Eg. ${new Date(
                              new Date().setHours(new Date().getHours() + 24),
                            ).toLocaleDateString()})`}
                            peekNextMonth
                            maxDate={addMonths(new Date(), 12)}
                            dropdownMode="select"
                            minDate={addDays(new Date(startDate), 1)} // Optional: To prevent selecting future dates
                            dateFormat="dd/MM/yyyy" // Optional: Customize the date format
                          />
                          {errors?.endDate?.message && (
                            <p className="text-sm text-red-500 mt-2">
                              {errors?.endDate?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <Input
                    // size="md sm:lg"
                    type="string"
                    disabled={isLoading}
                    label="Enter your available product quantity *"
                    error={errors?.quantity?.message ? true : false}
                    //   onInput={(e) => setQuantity(e.target.value)}
                    onInput={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*$/.test(value) || value === "") {
                        setQuantity(value);
                      }
                    }}
                    defaultValue={quantity}
                    value={quantity}
                    {...register("quantity", {
                      required: {
                        value: true,
                        message: "Product quantity is required",
                      },
                    })}
                  />
                  {errors?.quantity?.message && (
                    <p className="text-sm text-red-500">
                      {errors?.quantity?.message}
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
          <div className="flex justify-between">
            <div className="mt-5 mb-5">
              <Button
                // onClick={() => {
                //   // console.log(getValues());
                // }
                onClick={handleSubmit(submit)}
                disabled={isLoading}
                className="submitButton"
                style={{ width: "120px" }}
              >
                {isLoading ? (
                  <Spinner className="mx-auto h-4 w-4" />
                ) : (
                  <>{isLastStep ? "Submit" : "Next"}</>
                )}
              </Button>
            </div>
            <div className="mt-5 mb-5 float-left">
              <Button
                onClick={() => {
                  router.back("/dashboard");
                }}
                className="submitButton"
                style={{ width: "120px" }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Sidebar>

      <Dialog open={open} handler={handleOpen}>
        <div className="flex items-center justify-between">
          <DialogHeader>Add new category</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={handleOpen}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody divider>
          <div className="grid gap-6">
            <Input
              label="Enter new category name"
              name="newCateogry"
              {...register2("newCateogry", { required: true })}
              error={errors2?.newCateogry?.message ? true : false}
            />
            {errors2?.newCateogry?.message && (
              <p className="text-sm text-red-500">
                {errors2?.newCateogry?.message}
              </p>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" onClick={handleOpen}>
            close
          </Button>
          <Button
            variant="gradient"
            color="teal"
            onClick={handleSubmit2(addNewCategory)}
          >
            Request new category
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={breakdownOpen}
        handler={() => setBreakdownOpen(!breakdownOpen)}
      >
        <div className="flex items-center justify-between">
          <DialogHeader>
            Price breakdown
            {isSale
              ? `of sale price ${new Intl.NumberFormat("en-IN", {
                currency: "INR",
                style: "currency",
                maximumFractionDigits: 0,
              }).format(salePrice)}`
              : `of price ${new Intl.NumberFormat("en-IN", {
                currency: "INR",
                style: "currency",
                maximumFractionDigits: 0,
              }).format(price)}`}
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={() => setBreakdownOpen(!breakdownOpen)}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody divider>
          <table className="w-full min-w-max table-auto text-left flex flex-cols-1">
            <thead className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 py-4 px-2 transition-colors hover:bg-blue-gray-50 w-full flex-auto">
              <tr>Dirums&apos; commission</tr>
              <tr>GST on commission (18%)</tr>
              <tr>Your share</tr>
            </thead>
            <tbody className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 flex flex-col">
              {!isSale ? (
                <>
                  <tr className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(parseInt(price * 0.33))}
                  </tr>
                  <tr className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(
                      parseInt(parseInt(parseInt(price * 0.33)) * 0.18),
                    )}
                  </tr>
                  <tr className="font-medium">
                    {price ?
                      (
                        new Intl.NumberFormat("en-IN", {
                          currency: "INR",
                          style: "currency",
                          maximumFractionDigits: 0,
                        }).format(
                          parseInt(
                            parseInt(price) -
                            (parseInt(price * 0.33) +
                              parseInt(parseInt(price * 0.33)) * 0.18),
                          ),
                        )
                      )
                      : (
                        new Intl.NumberFormat("en-IN", {
                          currency: "INR",
                          style: "currency",
                          maximumFractionDigits: 0,
                        }).format(
                          parseInt(
                            parseInt(0) -
                            (parseInt(0 * 0.33) +
                              parseInt(parseInt(0 * 0.33)) * 0.18),
                          ),
                        )
                      )
                    }
                  </tr>
                </>
              ) : (
                <>
                  <tr className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(parseInt(salePrice * 0.33))}
                  </tr>
                  <tr className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(
                      parseInt(parseInt(parseInt(salePrice * 0.33)) * 0.18),
                    )}
                  </tr>
                  <tr className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(
                      parseInt(
                        parseInt(salePrice) -
                        (parseInt(salePrice * 0.33) +
                          parseInt(parseInt(salePrice * 0.33)) * 0.18),
                      ),
                    )}
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            onClick={() => setBreakdownOpen(!breakdownOpen)}
          >
            close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* request for new category dialog starts  */}
      <Dialog
        open={newCategoryRequest}
        handler={handleRequestCategoryDialog}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader>Request for new Category.</DialogHeader>
        <DialogBody>
          <Input
            label="mention your category"
            onChange={(e) => {
              setNewCategoryInput(e.target.value);
            }}
            value={newCategoryInput}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="outlined"
            onClick={handleRequestCategoryDialog}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          {!newCategoryInputLoader ? (
            <Button variant="outlined" onClick={addNewCategory}>
              <span>Confirm</span>
            </Button>
          ) : (
            <Button variant="gradient" color="green">
              <Spinner className="mx-auto h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </Dialog>
      {/* request for new category dialog ends  */}

      {/* price breakdown table */}
      <Dialog
        open={variationBreakdownOpen}
        handler={() => setVariationBreakdownOpen(!variationBreakdownOpen)}
      >
        <div className="flex items-center justify-between">
          <DialogHeader>Price breakdown of variation prices</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={() => setVariationBreakdownOpen(!variationBreakdownOpen)}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody divider>
          <table className="w-full min-w-max table-auto text-left">
            <thead className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
              <th>Variation</th>
              <th>Dirums' commission</th>
              <th>GST on commission (18%)</th>
              <th>Your share</th>
            </thead>
            <tbody>
              {/* {!isSale ? (
                <>
              <td className="font-medium">{new Intl.NumberFormat('en-IN', {currency: 'INR', style: 'currency', maximumFractionDigits: 0}).format(parseInt(parseInt(parseInt(price) - parseInt(price * 0.33)) * .18))}</td>
              <td className="font-medium">{new Intl.NumberFormat('en-IN', {currency: 'INR', style: 'currency', maximumFractionDigits: 0}).format(parseInt(parseInt(price) - parseInt(price * 0.33)) - parseInt(parseInt(parseInt(price) - parseInt(price * 0.33)) * .18))}</td>
              <td className="font-medium">{new Intl.NumberFormat('en-IN', {currency: 'INR', style: 'currency', maximumFractionDigits: 0}).format(parseInt(price) - parseInt(price * 0.33))}</td>
              </>
              ): */}
              {variants?.map((prop, index) => {
                return (
                  <tr key={index}>
                    <td className="font-medium text-center">{prop.name}</td>
                    <td className="font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        currency: "INR",
                        style: "currency",
                        maximumFractionDigits: 0,
                      }).format(parseInt(prop.price * 0.33))}
                    </td>
                    <td className="font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        currency: "INR",
                        style: "currency",
                        maximumFractionDigits: 0,
                      }).format(
                        parseInt(parseInt(parseInt(prop.price * 0.33)) * 0.18),
                      )}
                    </td>
                    <td className="font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        currency: "INR",
                        style: "currency",
                        maximumFractionDigits: 0,
                      }).format(
                        parseInt(
                          parseInt(prop.price) -
                          (parseInt(prop.price * 0.33) +
                            parseInt(parseInt(prop.price * 0.33)) * 0.18),
                        ),
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            color="red"
            onClick={() => setVariationBreakdownOpen(!variationBreakdownOpen)}
          >
            close
          </Button>
        </DialogFooter>
      </Dialog>

      {/* product showing bigger dialog box */}
      <Dialog
        open={isOpen.imageOpen}
        size={"md"}
        handler={() => setIsOpen({ imageOpen: !isOpen.imageOpen, image: '' })}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <div
          className="cursor-pointer text-black flex justify-end pt-5 px-5"
          onClick={() => setIsOpen({ imageOpen: !isOpen.imageOpen, image: '' })}
        >
          <IoCloseSharp size={25} color={"black"} />
        </div>
        <DialogBody className="w-full h-full flex items-center justify-center">
          <img
            src={isOpen.image ? isOpen.image : ""}
            className="rounded-sm cursor-pointer object-contain w-[700px] h-[500px] md:h-[640px]"
            alt="product-image"
          />
        </DialogBody>
      </Dialog>
    </>
  );
}
