"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";

import {
  Button,
  ButtonGroup,
  Checkbox,
  Input,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
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
import {DebounceInput} from 'react-debounce-input';
import qs from 'qs'

export default function ProductForm({ editData, inventoryUrl, productUrl }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [variations, setVariations] = useState([]);
  const [variationId, setVariationId] = useState("");
  const [variationName, setVariationName] = useState("");
  const [variationBox, setVariationBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [variationBreakdownOpen, setVariationBreakdownOpen] = useState(false);
  const [variationSale, setVariationSale] = useState(false);
  const [searchVariation, setSearchVariation] = useState([]);

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
        creators: "",
        images: [],
        imageUrls: [],
        parentCategory: "",
        category: "",
        title: "",
        description: "",
        price: "",
        hasVariant: false,
        madeOnOrder: false,
        reproducableDays: "",
        creator: "",
        type: "",
        scope: "",
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
            saleStartDate: "",
            saleEndDate: "",
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

  const handleNext = () => {
    !isLastStep && images?.length > 0
      ? setActiveStep((cur) => cur + 1)
      : setError("images", {
          message: "Please Upload atleast 1 product image",
        });
  };
  const handlePrev = () => {
    !isFirstStep && setActiveStep((cur) => cur - 1);
  };

  const addNewCategory = (value) => {
    fetch(`${BASE_URL}/dashboard/products/create/api/category-request`, {
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
        // handleOpen(!open);
        // setValue("newCateogry", "");
        // router.push('/dashboard/products?message=new category request');
      });
  };

  const handleStartDateChange = (selectedDate) => {
    setStartDate(selectedDate);
    setValue1("startDate", selectedDate);
  };

  const handleEndDateChange = (selectedDate) => {
    setEndDate(selectedDate);
    setValue1("endDate", selectedDate);
  };

  const [data, setData] = useState([]);
  const [creators, setCreators] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [category, setCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hasVariant, setHasVariant] = useState(false);
  const [madeOnOrder, setIsMadeOnOrder] = useState(false);
  const [reproducableDays, setReproducableDays] = useState("");
  const [creator, setCreator] = useState("");
  const [type, setType] = useState("");
  const [scope, setScope] = useState("worldwide");
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
  const handleOpen = () => setOpen(!open);

  const [inputValue, setInputValue] = useState("");
  const [inputValue2, setInputValue2] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState("");
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);
  const [vendorsListOpen, setVendorsListOpen] = useState(false);
  const [vendor, setVendor] = useState("");
  const [vendorName, setVendorName] = useState("");


  function handleAddTag(event) {
    if (event.key === "Enter" && inputValue2) {
      setTags([...tags, inputValue2]);
      setInputValue2("");
    }
  }

  function handleDeleteTag(tagToDelete) {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  }

  function handleSuggestionClick(suggestion) {
    setTags([...tags, suggestion]);
    setInputValue2("");
  }

  const handleInputChange = (event) => {
    setVariationBox(true);
    const { value } = event.target;

    if (value == variationName) setVariationBox(false);
    setInputValue(value);
    setSelectedEntry("");
  };

  const fetchCategories = (e) => {
    if (e) {
      fetch(`${API_URL}/api/category?where[name][contains]=${e}&limit=0`)
        .then((res) => res.json())
        .then((data) => setData(data.docs));
    }
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;
    if (value.startsWith("Add New: ")) {
      const newEntry = value.replace("Add New: ", "");
      // Add code here to save the new entry to your database.
      alert(`New entry added: ${newEntry}`);
      // You would typically make an AJAX request to the server to save the new entry.
      // For this example, we'll just show an alert.
    } else {
      setSelectedEntry(value);
    }
  };

  useEffect(() => {
    if (searchVariation)
      setEntries(
        searchVariation?.filter((entry) =>
          entry.name.toLowerCase().includes(inputValue?.toLowerCase())
        )
      );
  }, [searchVariation]);

  const handleFetchBlob = async (imageUrl, name) => {
    try {
      const response = await fetch(imageUrl); // Replace with your file URL
      const blobResponse = await response.blob();
      const blob = new Blob([blobResponse], { type: blobResponse.type });
      // console.log(blob);
      // Create a URL for the blob
      const blobURL = new File([blob], name, { type: blobResponse.type });
      // console.log("image Blob: ", blobURL);
      setImages((prev) => [...prev, blobURL]);
      setValue1("images", blobURL, { shouldDirty: true });
      // console.log(getValues());
    } catch (error) {
      console.error("Error fetching or creating blob:", error);
    }
  };

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

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file size is greater than 2MB
      if (file.size > 2 * 1024 * 1024) {
        new Compressor(file, {
          quality: 0.6,
          maxHeight: 700,
          auto: true, // Automatically adjust the width
          success(result) {
            setImages((prev) => [...prev, result]);
            setImageUrls((prev) => [...prev, URL.createObjectURL(result)]);
          },
          error(err) {
            console.error("Error compressing file:", err);
          },
        });
      } else {
        // If the file is already smaller than 2MB, use it as is
        setImages((prev) => [...prev, file]);
        setImageUrls((prev) => [...prev, URL.createObjectURL(file)]);
      }
    }
  };

  useEffect(() => {
    if (editData) {
      fetchCategories(editData?.category?.name);
      setParentCategory(editData?.category?.parent?.id);
      setCategory(editData?.category?.id);
      setValue1("category", editData?.category?.id);
      setValue1("type", editData?.productType);
      setCategoryName(editData?.category?.name);
      setTitle(editData?.title);
      setDescription(editData?.description);
      setPrice(editData?.price);
      setYear(editData?.created);
      setIsMadeOnOrder(editData?.madeToOrder);
      setReproducableDays(editData?.reproducableDays);
      setCreator(editData?.creator?.id);
      setType(editData?.productType);
      setScope(editData?.publishScope);
      setOriginCountry(editData?.originCountry);
      setVariationName(editData?.variation?.name);
      setVariationId(editData?.variation?.id);
      setQuantity(editData?.inventory?.quantity);
      setImageUrls(editData?.images?.map((prop) => prop.image.url));
      setVendor(editData?.vendor?.id)
      editData?.attributes
        ?.filter((item) => item != null)
        .map((prop) => {
          setAttributes((prev) => [
            ...prev,
            { name: prop.name, value: prop.value },
          ]);
        });

        editData?.tags?.map((prop) => {
          setTags((prev) => [
            ...prev,
            prop.name,
          ]);
        });

      if (editData?.saleInfo) {
        setIsSale(true);
        setSalePrice(editData?.saleInfo?.salePrice);
        setStartDate(new Date(editData?.saleInfo?.saleStart));
        setEndDate(new Date(editData?.saleInfo?.saleEnd));
        setValue1("startDate", new Date(editData?.saleInfo?.saleStart));
        setValue1("endDate", new Date(editData?.saleInfo?.saleEnd));
      }
      

      editData?.images?.map((prop) => {
        handleFetchBlob(prop.image.url, prop.image.filename);
      });
      // setValue1('images', editData?.images?.map((prop) => prop.image.url))
    }
  }, [editData]);

  useEffect(() => {
    if (editData?.has_variants == true) {
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
  if (data?.length == 0) {
    fetch(`${BASE_URL}/dashboard/products/create/api`)
      .then((res) => res.json())
      .then((data) => {
        // setData(data.message.docs);
        if (data.is_individual == false) {
          fetch(`${BASE_URL}/dashboard/products/create/api/creator`)
            .then((res) => res.json())
            .then((data) => {
              setCreators(data.message.docs);
            });
        }
      });
  }

},[data])

useEffect(() => {
  if(vendorName!=""){
  setIsLoading(true);

  const query = {
        or: [
          {
        firstName: {
          contains: vendorName,
        },
      },
      {
        lastName: {
          contains: vendorName,
        },
      }
        ]
    // This query could be much more complex
    // and QS would handle it beautifully
  };
  
    const stringifiedQuery = qs.stringify(
      {
        where: query, // ensure that `qs` adds the `where` property, too!
        limit: 0,
      },
      {
        addQueryPrefix: true
      }
    )
    if(isLoading){
    fetch(`${API_URL}/api/users${stringifiedQuery}`)
      .then((res) => res.json())
      .then((data) => {
        // setData(data.message.docs);
        setVendorsList(data.docs)
        setIsLoading(false)
      });
    }

  }
},[vendorName])

  const removeImages = (image) => {
    const index = imageUrls.indexOf(image);
    setImages((images) =>
      images.filter((item, valueIndex) => valueIndex !== index)
    );
    setImageUrls((images) => images.filter((item) => item !== image));
  };

  const submit = () => {
    setIsLoading(true);
    if (editData) {
      if (hasVariant == false) {
        fetch(`${inventoryUrl}`, {
          method: "PATCH",
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quantity: quantity,
            inventoryId: editData?.inventory?.id,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.message?.doc?.id ?? data.message.id) {
              const fd = new FormData();
              fd.append("title", title);
              fd.append("description", description);
              fd.append("price", price);
              fd.append("category", category);
              fd.append("productType", type);
              fd.append("scope", scope);
              fd.append("created", year);
              fd.append("originCountry", originCountry);
              fd.append("vendor", vendor);
              {
                creator && fd.append("creator", creator);
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
                images.map((item, index) => {
                  if (typeof item == "object") {
                    fd.append(`demoimages`, item);
                  }
                });
              }
              {
                attributes.map((item, index) => {
                  if (item.name) {
                    fd.append(`attributes.${index}.name`, item.name);
                    fd.append(`attributes.${index}.value`, item.value);
                  }
                });
              }
              {
                tags.map((item, index) => {
                  if (item) {
                    fd.append(`tags.${index}.name`, item);
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
                method: "PATCH",
                body: fd,
              })
                .then((res) => res.json())
                .then((data) => {
                  router.push("/dashboard/products");
                  setIsLoading(false);
                });
            }
          });
      } else {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        fd.append("category", category);
        fd.append("productType", type);
        fd.append("scope", scope);
        fd.append("created", year);
        fd.append("originCountry", originCountry);
        fd.append("vendor", vendor);

        {
          creator && fd.append("creator", creator);
        }
        {
          madeOnOrder && fd.append("madeToOrder", madeOnOrder);
        }
        {
          reproducableDays && fd.append("reproducableDays", reproducableDays);
        }
        {
          images.map((item, index) => {
            if (typeof item == "object") {
              fd.append(`demoimages`, item);
            }
          });
        }
        {
          attributes.map((item, index) => {
            if (item.name) {
              fd.append(`attributes.${index}.name`, item.name);
              fd.append(`attributes.${index}.value`, item.value);
            }
          });
        }
        {
          tags.map((item, index) => {
            if (item) {
              fd.append(`tags.${index}.name`, item);
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
                    fd.append(`variants.${index}.saleStart`, item.saleStart);
                }
                {
                  item.saleStart &&
                    fd.append(`variants.${index}.saleEnd`, item.saleEnd);
                }
                fd.append(
                  `variants.${index}.status`,
                  item.quantity > 0 ? "inStock" : "outOfStock"
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
          method: "PATCH",
          body: fd,
        })
          .then((res) => res.json())
          .then((data) => {
            router.push("/dashboard/products");
            setIsLoading(false);
          });
      }
    } else {
      if (hasVariant == false) {
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
              fd.append("description", description);
              fd.append("price", price);
              fd.append("category", category);
              fd.append("productType", type);
              fd.append("scope", scope);
              fd.append("created", year);
              fd.append("originCountry", originCountry);
              fd.append("vendor", vendor);

              {
                creator && fd.append("creator", creator);
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
                images.map((item, index) => {
                  if (typeof item == "object") {
                    fd.append(`demoimages`, item);
                  }
                });
              }
              {
                attributes.map((item, index) => {
                  if (item.name) {
                    fd.append(`attributes.${index}.name`, item.name);
                    fd.append(`attributes.${index}.value`, item.value);
                  }
                });
              }
              {
                tags.map((item, index) => {
                  if (item) {
                    fd.append(`tags.${index}.name`, item);
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
                  router.push("/dashboard/products");
                  setIsLoading(false);
                });
            }
          });
      } else {
        const fd = new FormData();
        fd.append("title", title);
        fd.append("description", description);
        fd.append("category", category);
        fd.append("productType", type);
        fd.append("scope", scope);
        fd.append("created", year);
        fd.append("originCountry", originCountry);
        fd.append("vendor", vendor);

        {
          creator && fd.append("creator", creator);
        }
        {
          madeOnOrder && fd.append("madeToOrder", madeOnOrder);
        }
        {
          reproducableDays && fd.append("reproducableDays", reproducableDays);
        }
        {
          images.map((item, index) => {
            if (typeof item == "object") {
              fd.append(`demoimages`, item);
            }
          });
        }
        {
          attributes.map((item, index) => {
            if (item.name) {
              fd.append(`attributes.${index}.name`, item.name);
              fd.append(`attributes.${index}.value`, item.value);
            }
          });
        }

        {
          tags.map((item, index) => {
            if (item) {
              fd.append(`tags.${index}.name`, item);
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
                    fd.append(`variants.${index}.saleStart`, item.saleStart);
                }
                {
                  item.saleStart &&
                    fd.append(`variants.${index}.saleEnd`, item.saleEnd);
                }
                fd.append(
                  `variants.${index}.status`,
                  item.quantity > 0 ? "inStock" : "outOfStock"
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
            router.push("/dashboard/products");
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

  return (
    <>
      <Sidebar>
        <div className="w-full md:px-24 py-4">
          <div className="md:block hidden">
            {!hasVariant && (
              <Stepper
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
              >
                <Step
                  onClick={(e) => {
                    isLoading ? e.preventDefault() : setActiveStep(0);
                  }}
                >
                  <UserIcon className="h-5 w-5" />
                  <div className="absolute -bottom-[4.5rem] w-max text-center">
                    <Typography
                      variant="h6"
                      color={activeStep === 0 ? "blue-gray" : "gray"}
                    >
                      Step 1
                    </Typography>
                    <Typography
                      color={activeStep === 0 ? "blue-gray" : "gray"}
                      className="font-normal"
                    >
                      Select categories of your product.
                    </Typography>
                  </div>
                </Step>
                <Step
                  onClick={(e) => {
                    isLoading ? e.preventDefault() : setActiveStep(1);
                  }}
                >
                  <CogIcon className="h-5 w-5" />
                  <div className="absolute -bottom-[4.5rem] w-max text-center">
                    <Typography
                      variant="h6"
                      color={activeStep === 1 ? "blue-gray" : "gray"}
                    >
                      Step 2
                    </Typography>
                    <Typography
                      color={activeStep === 1 ? "blue-gray" : "gray"}
                      className="font-normal"
                    >
                      Basic details for your product.
                    </Typography>
                  </div>
                </Step>

                <Step
                  onClick={(e) => {
                    isLoading ? e.preventDefault() : setActiveStep(3);
                  }}
                >
                  <BuildingLibraryIcon className="h-5 w-5" />
                  <div className="absolute -bottom-[4.5rem] w-max text-center">
                    <Typography
                      variant="h6"
                      color={activeStep === 3 ? "blue-gray" : "gray"}
                    >
                      Step 3
                    </Typography>
                    <Typography
                      color={activeStep === 3 ? "blue-gray" : "gray"}
                      className="font-normal"
                    >
                      Enter the price of your product.
                    </Typography>
                  </div>
                </Step>
              </Stepper>
            )}

            {hasVariant && (
              <Stepper
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
              >
                <Step
                  onClick={(e) => {
                    isLoading ? e.preventDefault() : setActiveStep(0);
                  }}
                >
                  <UserIcon className="h-5 w-5" />
                  <div className="absolute -bottom-[4.5rem] w-max text-center">
                    <Typography
                      variant="h6"
                      color={activeStep === 0 ? "blue-gray" : "gray"}
                    >
                      Step 1
                    </Typography>
                    <Typography
                      color={activeStep === 0 ? "blue-gray" : "gray"}
                      className="font-normal"
                    >
                      Select categories of your product.
                    </Typography>
                  </div>
                </Step>
                <Step
                  onClick={(e) => {
                    isLoading ? e.preventDefault() : setActiveStep(1);
                  }}
                >
                  <CogIcon className="h-5 w-5" />
                  <div className="absolute -bottom-[4.5rem] w-max text-center">
                    <Typography
                      variant="h6"
                      color={activeStep === 1 ? "blue-gray" : "gray"}
                    >
                      Step 2
                    </Typography>
                    <Typography
                      color={activeStep === 1 ? "blue-gray" : "gray"}
                      className="font-normal"
                    >
                      Basic details for your product.
                    </Typography>
                  </div>
                </Step>
              </Stepper>
            )}
          </div>
          {activeStep == 0 && (
            <div className="mb-4 md:mt-28 flex flex-col gap-6">
              <label className="font-bold text-sm">
                Select the product type
              </label>
              <ButtonGroup
                className="gap-3 mb-5 flex"
                variant="outlined"
                {...register("type", {
                  required: {
                    value: true,
                    message: "Please select your product type",
                  },
                })}
              >
                <Button
                  className={
                    type == "physical"
                      ? "border border-black rounded-sm bg-black text-white w-full"
                      : "border border-black rounded-sm bg-transparent text-black w-full"
                  }
                  onClick={() => {
                    setType("physical");
                    setValue1("type", "physical");
                  }}
                >
                  {"Physical"}
                </Button>

                <Button
                  className={
                    type == "digital"
                      ? "border border-black rounded-sm bg-black text-white w-full"
                      : "border border-black rounded-sm bg-transparent text-black w-full"
                  }
                  onClick={() => {
                    setType("digital");
                    setValue1("type", "digital");
                  }}
                >
                  {"Digital"}
                </Button>
              </ButtonGroup>
              {errors?.type?.message && (
                <p className="text-sm text-red-500">{errors?.type?.message}</p>
              )}
              <label className="font-bold text-sm">
                Upload the product images
              </label>
              <input
                type="file"
                className="hidden"
                id="file"
                // onChange={(e) => {
                //   setImages((prev) => [...prev, ...e.target.files]);
                //   Array(...e.target.files).map((prop) =>
                //     setImageUrls((prev) => [...prev, URL.createObjectURL(prop)])
                //   );

                // }}
                onChange={handleFileUpload}
              />
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
                <div className="w-28 h-28 rounded-md shadow relative">
                  <img
                    src={imageUrls?.[0] ?? "/images/primary.svg"}
                    className={imageUrls?.[0] && "object-cover h-28"}
                  />
                  {!imageUrls?.[0] && (
                    <Typography className="text-sm text-center -mt-6 font-medium">
                      Primary
                    </Typography>
                  )}
                  {imageUrls?.[0] && (
                    <XCircleIcon
                      className="w-6 h-6 absolute -right-2 -top-3 bg-black text-white rounded-full cursor-pointer"
                      onClick={() => {
                        setImageUrls(
                          imageUrls.filter((_, index) => index !== 0)
                        );
                        setImages(images.filter((item, index) => index !== 0));
                      }}
                    />
                  )}
                </div>
                <div className="w-28 h-28 rounded-md shadow relative">
                  <img
                    src={imageUrls?.[1] ?? "/images/top.svg"}
                    className={imageUrls?.[1] && "object-cover h-28"}
                  />
                  {!imageUrls?.[1] && (
                    <Typography className="text-sm text-center -mt-6 font-medium">
                      Top
                    </Typography>
                  )}
                  {imageUrls?.[1] && (
                    <XCircleIcon
                      className="w-6 h-6 absolute -right-2 -top-3 bg-black text-white rounded-full cursor-pointer"
                      onClick={() => {
                        setImageUrls(
                          imageUrls.filter((_, index) => index !== 1)
                        );
                        setImages(images.filter((item, index) => index !== 1));
                      }}
                    />
                  )}
                </div>
                <div className="w-28 h-28 rounded-md shadow relative">
                  <img
                    src={imageUrls?.[2] ?? "/images/back.svg"}
                    className={imageUrls?.[2] && "object-cover h-28"}
                  />
                  {!imageUrls?.[2] && (
                    <Typography className="text-sm text-center -mt-6 font-medium">
                      Back
                    </Typography>
                  )}
                  {imageUrls?.[2] && (
                    <XCircleIcon
                      className="w-6 h-6 absolute -right-2 -top-3 bg-black text-white rounded-full cursor-pointer"
                      onClick={() => {
                        setImageUrls(
                          imageUrls.filter((_, index) => index !== 2)
                        );
                        setImages(images.filter((item, index) => index !== 2));
                      }}
                    />
                  )}
                </div>
                <div
                  className="w-28 h-28 rounded-md shadow relative"
                  onClick={() => document.getElementById("file").click()}
                >
                  <img
                    src={imageUrls?.[3] ?? "/images/zoom.svg"}
                    className={imageUrls?.[3] && "object-cover h-28"}
                  />
                  {!imageUrls?.[3] && (
                    <Typography className="text-sm text-center -mt-6 font-medium">
                      Details
                    </Typography>
                  )}
                  {imageUrls?.[3] && (
                    <XCircleIcon
                      className="w-6 h-6 absolute -right-2 -top-3 bg-black text-white rounded-full cursor-pointer"
                      onClick={() => {
                        setImageUrls(
                          imageUrls.filter((_, index) => index !== 3)
                        );
                        setImages(images.filter((item, index) => index !== 3));
                      }}
                    />
                  )}
                </div>
                <div
                  className="w-28 h-28 rounded-md shadow relative"
                  onClick={() => document.getElementById("file").click()}
                >
                  <img
                    src={imageUrls?.[4] ?? "/images/variations.svg"}
                    className={imageUrls?.[4] && "object-cover h-28"}
                  />
                  {!imageUrls?.[4] && (
                    <Typography className="text-sm text-center -mt-6 font-medium">
                      Variations
                    </Typography>
                  )}
                  {imageUrls?.[4] && (
                    <XCircleIcon
                      className="w-6 h-6 absolute -right-2 -top-3 bg-black text-white rounded-full cursor-pointer"
                      onClick={() => {
                        setImageUrls(
                          imageUrls.filter((_, index) => index !== 4)
                        );
                        setImages(images.filter((item, index) => index !== 4));
                      }}
                    />
                  )}
                </div>
              </div>
              {errors?.images?.message && (
                <p className="text-sm text-red-500">
                  {errors?.images?.message}
                </p>
              )}
              <label className="font-bold text-sm">
                What do you want to upload?
              </label>
              <Input
                label="Select category"
                onFocus={() => setCategory("")}
                {...register("category", {
                  required: { value: true, message: "Category is required" },
                })}
                onInput={(e) => {
                  fetchCategories(e.target.value);
                  setCategoryName(e.target.value);
                  setShowResults(true);
                }}
                value={categoryName}
              />
              {errors?.category?.message && (
                <p className="text-sm text-red-500">
                  {errors?.category?.message}
                </p>
              )}
              {showResults && category == "" && (
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
                      <PlusIcon className="w-4 h-4" /> Add new category{" "}
                      <span className="font-medium">{categoryName}</span>
                    </Typography>
                  )}
                </div>
              )}

              {category && (
                <>
                  <div className="bg-gray-50 rounded-md p-3 border border-black">
                    <Checkbox
                      label="My product have multiple variants (Size, color, etc.)?"
                      defaultChecked={hasVariant}
                      onChange={() => {
                        setHasVariant(!hasVariant);
                        hasVariant == false ? (
                        append({
                          name: "",
                          price: "",
                          quantity: "",
                          salePrice: null,
                          saleStartDate: "",
                          saleEndDate: "",
                        })
                        ):
                        fields[fields.length -1].name == "" && remove(fields.length - 1)
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
                                      e.target.value
                                    );
                                  }}
                                />
                                {errors?.variations?.[index]?.[ "name"] && (
                                      <p className="text-sm text-red-500">
                                        {
                                          errors?.variations?.[index]?.[
                                            "name"
                                          ]?.message
                                        }
                                      </p>
                                    )}
                                    </div>
                                <div>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    label="Price"
                                    defaultValue={prop.price}
                                    {...register(`variations.${index}.price`, {
                                      required: {
                                        value: true,
                                        message: "Price is required",
                                      },
                                      validate: (value) => parseInt(value) > 0  || "Price cannot be 0"
                                    })}
                                    onBlur={(e) => {
                                      {
                                        handleVariantChange(
                                          index,
                                          "price",
                                          e.target.value
                                        );
                                      }
                                    }}
                                  />
                                  
                                  <Typography
                                    className="text-blue-500 cursor-pointer text-sm font-medium mb-2"
                                    onClick={() =>
                                      setVariationBreakdownOpen(
                                        !variationBreakdownOpen
                                      )
                                    }
                                  >
                                    Price Breakdown
                                  </Typography>
                                  
                                  {errors?.variations?.[index]?.["price"] && (
                                      <p className="text-sm text-red-500">
                                        {
                                          errors?.variations?.[index]?.["price"]?.message
                                        }
                                      </p>
                                    )}
                                </div>
                                <div>
                                <Input
                                  type="number"
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
                                      e.target.value
                                    );
                                  }}
                                />
                                {errors?.variations?.[index]?.["quantity"] && (
                                  <p className="text-sm text-red-500">
                                    {
                                      errors?.variations?.[index]?.["quantity"]?.message
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
                                      !variants[index]?.isSale
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
                                            0 < parseInt(value) < parseInt(variants[index]?.price) ||
                                            "Variation sale price should not be more than or equal to the variation original price",
                                        }
                                      )}
                                      onBlur={(e) =>
                                        handleVariantChange(
                                          index,
                                          "salePrice",
                                          e.target.value
                                        )
                                      }
                                    />

                                    {errors?.variations?.[index]?.[ "salePrice"] && (
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
                                        name="startDate"
                                        selected={variants?.[index]?.saleStart}
                                        {...register(
                                          `variations.${index}.saleStart`,
                                          {
                                            required: {
                                              value: true,
                                              message:
                                                "variation sale start date is required",
                                            },
                                          }
                                        )}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            index,
                                            "saleStart",
                                            e
                                          )
                                        }
                                        className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-3 rounded-md border-blue-gray-200"
                                        placeholderText={`Select sale end date (Eg. ${new Date(
                                          new Date().setHours(
                                            new Date().getHours() + 24
                                          )
                                        ).toLocaleDateString()})`}
                                        peekNextMonth
                                        maxDate={addMonths(new Date(), 12)}
                                        dropdownMode="select"
                                        minDate={addDays(new Date(), 1)} // Optional: To prevent selecting future dates
                                        dateFormat="dd/MM/yyyy" // Optional: Customize the date format
                                      />
                                      {errors?.variations?.[index]?.[ "saelStart"] && (
                                      <p className="text-sm text-red-500">
                                        {
                                          errors?.variations?.[index]?.[
                                            "saleStart"
                                          ]?.message
                                        }
                                      </p>
                                    )}
                                    </div>
                                    <div>
                                      <DatePicker
                                        name="endDate"
                                        selected={variants?.[index]?.saleEnd}
                                        {...register(
                                          `variations.${index}.saleEnd`,
                                          {
                                            required: {
                                              value: true,
                                              message:
                                                "variation sale end date is required",
                                            },
                                          }
                                        )}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            index,
                                            "saleEnd",
                                            e
                                          )
                                        }
                                        className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border text-sm px-3 py-3 rounded-md border-blue-gray-200"
                                        placeholderText={`Select sale end date (Eg. ${new Date(
                                          new Date().setHours(
                                            new Date().getHours() + 24
                                          )
                                        ).toLocaleDateString()})`}
                                        peekNextMonth
                                        maxDate={addMonths(new Date(), 12)}
                                        dropdownMode="select"
                                        minDate={addDays(
                                          new Date(
                                            variants?.[index]?.saleStart
                                          ),
                                          1
                                        )} // Optional: To prevent selecting future dates
                                        dateFormat="dd/MM/yyyy" // Optional: Customize the date format
                                      />
                                      {errors?.variations?.[index]?.[ "saleEnd"] && (
                                      <p className="text-sm text-red-500">
                                        {
                                          errors?.variations?.[index]?.[
                                            "saleEnd"
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
                            saleStart: "",
                            saleEnd: "",
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
                              saleStart: "",
                              saleEnd: "",
                            },
                          ]);
                        }}
                      >
                        <PlusIcon className="w-4 h-4" /> Add Variation
                      </Button>
                    )}
                  </div>
                  {data
                    ?.filter((item) => item.id === category)
                    ?.map((prop) => (
                      <div key={prop.id}>
                        {prop?.attributes?.map((attribute, index) => (
                          <div key={index}>
                            {attribute?.attribute?.type === "input" &&
                            attribute?.attribute?.isAdmin == false ? (
                              <>
                                <Typography className="font-bold">
                                  {attribute.attribute.name}
                                </Typography>
                                <div className="grid lg:grid-cols-3 grid-cols-1 gap-3">
                                  {attribute.attribute.values.map(
                                    (prop1, valueIndex) => (
                                      <Input
                                        label={prop1.name}
                                        type={prop1.valueType}
                                        defaultValue={
                                          editData &&
                                          attributes?.filter(
                                            (item) => item.name === prop1.name
                                          ).length > 0 &&
                                          attributes?.filter(
                                            (item) => item.name === prop1.name
                                          )[0].value
                                        }
                                        key={valueIndex}
                                        {...register(
                                          `attributes.${valueIndex}.${prop1.name}`,
                                          {
                                            required: true,
                                          }
                                        )}
                                        onBlur={(e) =>
                                          setAttributes((prev) => [
                                            ...prev.filter(
                                              (item) => item.name !== prop1.name
                                            ),
                                            {
                                              name: prop1.name,
                                              value: e.target.value,
                                            },
                                          ])
                                        }
                                        error={
                                          errors?.attributes?.[valueIndex]?.[
                                            prop1.name
                                          ]
                                            ? true
                                            : false
                                        }
                                      />
                                    )
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                <Typography className="font-bold">
                                  {attribute.attribute.name}
                                </Typography>
                                <select
                                  className="peer mb-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
                                  {...register(
                                    `attributes.${index}.${attribute.attribute.name}`,
                                    {
                                      required: true,
                                    }
                                  )}
                                  defaultValue={
                                    editData &&
                                    attributes?.filter(
                                      (item) =>
                                        item.name === attribute.attribute.name
                                    ).length > 0 &&
                                    attributes?.filter(
                                      (item) =>
                                        item.name === attribute.attribute.name
                                    )[0].value
                                  }
                                  onChange={(e) => {
                                    setAttributes((prev) =>
                                      prev.filter(
                                        (item) =>
                                          item.name !== attribute.attribute.name
                                      )
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
                                      ? "true"
                                      : "false"
                                  }
                                >
                                  <option value="">
                                    Select {attribute.attribute.name}
                                  </option>
                                  {attribute.attribute.values.map(
                                    (prop1, valueIndex) => (
                                      <option
                                        key={valueIndex}
                                        value={prop1.name}
                                      >
                                        {prop1.name}
                                      </option>
                                    )
                                  )}
                                </select>
                                <p className="text-sm font-bold text-red-500">
                                  {categoryError}
                                </p>
                              </>
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
          )}

          {activeStep == 1 && (
            <div className="flex flex-col gap-6 md:mt-28">
              <DebounceInput
              placeholder="Vendor"
                  name="vendors"
                  minLength={4}
                  debounceTimeout={2000}
                  className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
                  {...register("vendors", { required: false })}
                  onInput={(e) => {
                    setVendorName(e.target.value);
                    setVendorsListOpen(true)
                  }}
                  value={editData?.vendor?.firstName+" "+editData?.vendor?.lastName}
                />
                {vendorsListOpen && (
                  <div className="h-20 overflow-auto shadow rounded w-full p-2">
                    {vendorsList?.length > 0 ? (
                      <>
                  {vendorsList?.map((prop, index) => (
                      <Typography className="tex-sm p-2 cursor-pointer" onClick={() => {setVendor(prop.id); setVendorName(prop.firstName+" "+prop.lastName); setVendorsListOpen(false)}}>{prop.firstName+" "+prop.lastName}</Typography>
                  ))}
                  </>
                    ):
                    <Typography className="tex-sm p-2 font-bold">No vendor found</Typography>

                  }
                  </div>
)}

              {creators?.length > 0 && (
                <select
                  name="creator"
                  {...register("creator", { required: false })}
                  onChange={(e) => {
                    setCreator(e.target.value);
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
              )}
              <Input
                size="lg"
                label="Enter your product name"
                error={errors?.title?.message ? true : false}
                onInput={(e) => setTitle(e.target.value)}
                defaultValue={title}
                {...register("title", {
                  required: {
                    value: true,
                    message: "Product title is required",
                  },
                })}
              />
              {errors?.title?.message && (
                <p className="text-sm text-red-500">{errors?.title?.message}</p>
              )}
              <Textarea
                size="lg"
                label="Enter your product description (Optional)"
                defaultValue={description}
                onInput={(e) => setDescription(e.target.value)}
              />

              <label className="font-bold text-sm">
                Select where your product should be visible
              </label>
              <div className="flex gap-x-10">
                <Radio
                  name="scope"
                  label="Worldwide"
                  value={"worldwide"}
                  defaultChecked={scope == "worldwide" ? true : false}
                  onChange={(e) => setScope(e.target.value)}
                />
                <Radio
                  name="scope"
                  label="India"
                  value={"india"}
                  defaultChecked={scope == "india" ? true : false}
                  onChange={(e) => setScope(e.target.value)}
                />
              </div>
              {errors?.scope?.message && (
                <p className="text-sm text-red-500">{errors?.scope?.message}</p>
              )}
              <Input
                size="lg"
                label="Enter your product origin country"
                onInput={(e) => setOriginCountry(e.target.value)}
                defaultValue={originCountry}
                {...register("originCountry", {
                  required: {
                    value: true,
                    message: "Product origin country is required",
                  },
                })}
              />
              {errors?.orginCountry?.message && (
                <p className="text-sm text-red-500">
                  {errors?.orginCountry?.message}
                </p>
              )}

              <Input
                size="lg"
                type="number"
                maxLength={4}
                label="Enter your product creation year"
                onInput={(e) => setYear(e.target.value)}
                defaultValue={year}
                {...register("year", {
                  required: {
                    value: true,
                    message: "Product creation year is required",
                  },
                  maxLength: {
                    value: 4,
                    message: 'Year more than 4 digits are not allowed',
                  },
                  validate: (value) => parseInt(value) <= parseInt(new Date().getFullYear()) || 'Year cannot exceed the current year'
                })}
              />
              {errors?.year?.message && (
                <p className="text-sm text-red-500">{errors?.year?.message}</p>
              )}
              <Switch
                label="Is this product made on order?"
                onClick={() => setIsMadeOnOrder(!madeOnOrder)}
                defaultChecked={madeOnOrder}
              />
              {madeOnOrder && (
                <>
                  <Input
                    size="lg"
                    type="number"
                    label="Enter the number of days it will take to make this product"
                    error={errors?.reproducableDays?.message ? true : false}
                    onInput={(e) => setReproducableDays(e.target.value)}
                    defaultValue={reproducableDays}
                    {...register("reproducableDays", {
                      required: {
                        value: true,
                        message: "Product production time is required",
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
<div className="my-3 md:w-1/2 w-full overflow-ellipsis">
                    {tags?.map((tag, index) => (
                      <span
                        className="bg-gray-500 text-white text-xs font-helvetica px-3 py-1 ml-3 mb-3 rounded-full"
                        key={index}
                      >
                        {tag}{" "}
                        <button
                          className="ml-2"
                          onClick={() => handleDeleteTag(tag)}
                        >
                          X
                        </button>
                      </span>
                    ))}
                  </div>
                  <Input
                    type="text"
                    label="Enter your tags and press enter"
                    value={inputValue2}
                    onChange={(event) => setInputValue2(event.target.value)}
                    onKeyUp={handleAddTag}
                  />
                  {inputValue2 && (
                    <div className="bg-slate-100 p-3 md:w-1/2 w-full shadow-md">
                      {suggestions
                        .filter((suggestion) => !tags.includes(suggestion))
                        .filter((suggestion) =>
                          suggestion.startsWith(inputValue2)
                        )
                        .map((suggestion, index) => (
                          <div
                            key={index}
                            className="p-2 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </div>
                        ))}
                    </div>
                  )}
            </div>
          )}


          {!hasVariant && activeStep == 2 && (
            <div className="flex flex-col gap-6 md:mt-28">
              <div>
                <Typography
                  className="text-blue-500 cursor-pointer"
                  onClick={() => setBreakdownOpen(!breakdownOpen)}
                >
                  Price breakdown
                </Typography>
                <Input
                  size="lg"
                  type="number"
                  disabled={isLoading}
                  label="Enter your product price"
                  error={errors?.price?.message ? true : false}
                  onInput={(e) => setPrice(e.target.value)}
                  defaultValue={price}
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
                    size="lg"
                    type="number"
                    disabled={isLoading}
                    label="Enter your product sale price"
                    error={errors?.salePrice?.message ? true : false}
                    defaultValue={salePrice}
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
                      setSalePrice(e.target.value);
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
                          new Date().setHours(new Date().getHours() + 24)
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
                size="lg"
                type="number"
                disabled={isLoading}
                label="Enter your product quantity"
                error={errors?.quantity?.message ? true : false}
                onInput={(e) => setQuantity(e.target.value)}
                defaultValue={quantity}
                {...register("quantity", {
                  required: {
                    value: true,
                    message: "Product quantity is required",
                  },
                })}
              />
              {errors?.quantity?.message && (
                <p className="text-sm text-red-500 mt-2">
                  {errors?.quantity?.message}
                </p>
              )}
            </div>
          )}
          <div className="mt-32 flex justify-between">
            <Button
              onClick={handlePrev}
              disabled={isFirstStep == true ? isFirstStep : isLoading}
            >
              Prev
            </Button>
            <Button
              onClick={
                isLastStep ? handleSubmit(submit) : handleSubmit(handleNext)
              }
            >
              {isLoading ? (
                <Spinner className="mx-auto h-4 w-4" />
              ) : (
                <>{isLastStep ? "Submit" : "Next"}</>
              )}
            </Button>
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
          <Button variant="outlined" color="red" onClick={handleOpen}>
            close
          </Button>
          <Button
            variant="gradient"
            color="black"
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
            Price breakdown{" "}
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
          <table className="w-full min-w-max table-auto text-left">
            <thead className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50">
              <th>Dirums' commission</th>
              <th>GST on commission (18%)</th>
              <th>Your share</th>
            </thead>
            <tbody>
              {!isSale ? (
                <>
                  <td className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(
                      parseInt(
                        parseInt(parseInt(price) - parseInt(price * 0.33)) *
                          0.18
                      )
                    )}
                  </td>
                  <td className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(
                      parseInt(parseInt(price) - parseInt(price * 0.33)) -
                        parseInt(
                          parseInt(parseInt(price) - parseInt(price * 0.33)) *
                            0.18
                        )
                    )}
                  </td>
                  <td className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(parseInt(price) - parseInt(price * 0.33))}
                  </td>
                </>
              ) : (
                <>
                  <td className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(parseInt(salePrice) - parseInt(salePrice * 0.33))}
                  </td>
                  <td className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(
                      parseInt(
                        parseInt(
                          parseInt(salePrice) - parseInt(salePrice * 0.33)
                        ) * 0.18
                      )
                    )}
                  </td>
                  <td className="font-medium">
                    {new Intl.NumberFormat("en-IN", {
                      currency: "INR",
                      style: "currency",
                      maximumFractionDigits: 0,
                    }).format(
                      parseInt(
                        parseInt(salePrice) - parseInt(salePrice * 0.33)
                      ) -
                        parseInt(
                          parseInt(
                            parseInt(salePrice) - parseInt(salePrice * 0.33)
                          ) * 0.18
                        )
                    )}
                  </td>
                </>
              )}
            </tbody>
          </table>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            color="red"
            onClick={() => setBreakdownOpen(!breakdownOpen)}
          >
            close
          </Button>
        </DialogFooter>
      </Dialog>

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
                      }).format(
                        parseInt(prop.price) - parseInt(prop.price * 0.33)
                      )}
                    </td>
                    <td className="font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        currency: "INR",
                        style: "currency",
                        maximumFractionDigits: 0,
                      }).format(
                        parseInt(
                          parseInt(
                            parseInt(prop.price) - parseInt(prop.price * 0.33)
                          ) * 0.18
                        )
                      )}
                    </td>
                    <td className="font-medium">
                      {new Intl.NumberFormat("en-IN", {
                        currency: "INR",
                        style: "currency",
                        maximumFractionDigits: 0,
                      }).format(
                        parseInt(
                          parseInt(prop.price) - parseInt(prop.price * 0.33)
                        ) -
                          parseInt(
                            parseInt(
                              parseInt(prop.price) - parseInt(prop.price * 0.33)
                            ) * 0.18
                          )
                      )}
                    </td>
                  </tr>
                );
              })}

              {/* } */}
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
    </>
  );
}
