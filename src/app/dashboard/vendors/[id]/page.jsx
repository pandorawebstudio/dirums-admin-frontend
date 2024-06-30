"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../../../../config";
import Sidebar from "../../../../components/sidebar";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Switch,
  DialogBody,
  Dialog,
  DialogHeader,
  Spinner,
  DialogFooter,
  Select,
  Option,
  Textarea,
  Alert,
} from "@material-tailwind/react";
import { PencilIcon, PlusIcon, XCircleIcon } from "@heroicons/react/24/solid";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import ImageViewDialog from "../../../../components/imageViewDialog";
import { IoEyeOutline } from "react-icons/io5";
import Link from "next/link";
import ReactPaginate from "react-paginate";

const Page = ({ params }) => {
  const [data, setData] = useState([]);
  const [productdata, setProductsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(false);
  const [bank, setBank] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [approvalProductId, setApprovalProductId] = useState("");
  const [approvalState, setApprovalState] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [image, setImage] = useState("");
  const [fullImageSet, setFullImageSet] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [approvalLogs, setApprovalLogs] = useState([]);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [productApprovalId, setProductApprovalId] = useState(null);
  const [profilePicture, setProfilePicture] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const TABLE_HEAD = ["Image", "Name", "Category", "Approval", "AP-Logs", "Created", "Updated", "Edit"];

  const handleOpen = () => setOpen(!open);
  const addressOpen = () => setAddress(!address);
  const bankOpen = () => setBank(!bank);

  const productsFetch = () => {
    setProductLoading(true);
    fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api/product?page=${page}`)
      .then(res => res.json())
      .then((data) => {
        setProductsData(data.message.docs)
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setPrevPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
        setProductLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setProductLoading(false);
      });
  }

  const userData = () => {
    fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.message);
        setProfilePicture(data?.message?.profilePicture?.url);
      })
      .catch(error => {
        console.error('Error fetching vendor data:', error);
      });
  }

  useEffect(() => {
    if (data?.length === 0) {
      userData();
      productsFetch();
    }
  }, []);

  useEffect(() => {
    productsFetch();
  }, [page]);

  const editApprovalDetails = (values) => {
    setProductsData([]);
    setIsLoading(true)
    fetch(`${BASE_URL}/dashboard/products/api/approval`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product: approvalProductId,
        status: approvalState,
        customerMessage: values.customerMessage,
        message: values.message,
        role: values.role,
      })
    })
      .then((res) => res.json())
      .then((data) => {
        userData();
        productsFetch();
        setApprovalDialog(!approvalDialog);
        setSuccessMessage(data.message.message)
        setIsLoading(false)
        setSuccess(true);
        setValue4("customerMessage", "");
        setValue4("message", "");
        setValue4("role", "");
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      })
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      file: null,
      facebook: data?.facebook,
      instagram: data?.instagram,
      youtube: data?.youtube,
      linkedIn: data?.linkedIn,
      pinterest: data?.pinterest
    },
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue: setValue2,
  } = useForm({
    defaultValues: {
      address: data?.address?.address,
      state: data?.address?.state,
      city: data?.address?.city,
      postalCode: data?.address?.postalCode,
    },
  });
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
    setValue: setValue3,
  } = useForm({
    defaultValues: {
      accountNumber: "",
      bankName: "",
      branchName: "",
      ifscCode: "",
      upiId: "",
    },
  });

  const {
    register: register4,
    handleSubmit: handleSubmit4,
    formState: { errors: errors4 },
    setValue: setValue4,
  } = useForm({
    defaultValues: {
      customerMessage: "",
      message: "",
      role: ""
    },
  });

  const editBasicDetails = (values) => {
    setIsLoading(true);
    fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api`, {
      method: "PATCH",
      body: JSON.stringify({
        _id: data?.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        profilePicture: data.profilePicture?.id || '',
        bank: data.bank?.id || '',
        phoneNumber: values.phoneNumber,
        facebook: values.facebook,
        instagram: values.instagram,
        youtube: values.youtube,
        linkedIn: values.linkedIn,
        pinterest: values.pinterest
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        userData();
        productsFetch();
        setOpen(!open);
        setSuccessMessage("Profile details updated successfully");
        setSuccess(true);
        setIsLoading(false);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      });
  };

  const editAddressDetails = (values) => {
    setIsLoading(true);
    fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api/address`, {
      method: "PATCH",
      body: JSON.stringify({
        _id: data?.address?.id,
        address: values.address,
        state: values.state,
        city: values.city,
        postalCode: values.postalCode,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api`)
          .then((res) => res.json())
          .then((data) => {
            userData();
            productsFetch();
            setAddress(!address);
            setIsLoading(false);
            setSuccessMessage("Address updated successfully");
            setSuccess(true);
            setTimeout(() => {
              setSuccess(false);
            }, 3000);
          });
      });
  };

  const editBankDetails = (values) => {
    setIsLoading(true);
    if (data?.bank?.id) {
      fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api/bank`, {
        method: "PATCH",
        body: JSON.stringify({
          _id: data?.bank?.id,
          accountNumber: values.accountNumber,
          bankName: values.bankName,
          branchName: values.branchName,
          ifscCode: values.ifscCode,
          upiId: values.upiId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {

          fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api`)
            .then((res) => res.json())
            .then((data) => {
              userData();
              productsFetch();
              setData(data.message);
              setBank(!bank);
              setIsLoading(false);
              setSuccessMessage("Bank details updated successfully");
              setSuccess(true);
              setTimeout(() => {
                setSuccess(false);
              }, 3000);
            });
        });
    } else {
      fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api/bank`, {
        method: "POST",
        body: JSON.stringify({
          accountNumber: values.accountNumber,
          bankName: values.bankName,
          branchName: values.branchName,
          ifscCode: values.ifscCode,
          upiId: values.upiId,
        }),
      })
        .then((res) => res.json())
        .then((data) => {

          fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api`)
            .then((res) => res.json())
            .then((data) => {
              userData();
              productsFetch();
              setBank(!bank);
              setIsLoading(false);
              setSuccessMessage("Bank Details created successfully");
              setSuccess(true);
              setTimeout(() => {
                setSuccess(false);
              }, 3000);
            });
        });
    }
  };

  useEffect(() => {
    if (data?.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data]);

  const handleImageDialog = (image) => {
    setImage(image);
    setIsOpen(true);
  };

  const handleImageArr = (imaArr) => {
    if (imaArr.length > 1) {
      let newArr = [];
      imaArr.map((item) => {
        newArr.push(item.image);
      });
      setFullImageSet(newArr);
    } else {
      setFullImageSet([]);
    }
  };

  const fetchProductApproval = (productId, page) => {
    setApprovalLogs([]);
    setApprovalLoading(true);
    fetch(`${BASE_URL}/dashboard/vendors/${productId}/api/approval?productId=${productId}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setApprovalLoading(false);
        setApprovalLogs(data.message.docs);
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setNextPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
      })
      .catch(error => {
        console.log(error.error)
      })
  }

  const prevLogsPages = (productId) => {
    setApprovalLoading(true);
    fetch(`${BASE_URL}/dashboard/vendors/${productId}/api/approval?productId=${productId}&page=${prevPage}`)
      .then((res) => res.json())
      .then((data) => {
        setApprovalLogs(data.message.docs);
        setApprovalLoading(false);
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setPrevPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
      });
  };

  const nextLogsPages = (productId) => {
    setApprovalLoading(true);
    fetch(`${BASE_URL}/dashboard/vendors/${productId}/api/approval?productId=${productId}&page=${nextPage}`)
      .then((res) => res.json())
      .then((data) => {
        setApprovalLogs(data.message.docs);
        setApprovalLoading(false);
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setPrevPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
      });
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Show the selected image immediately
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureUpload = () => {
    if (selectedFile) {
      setIsLoading(true)
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("email", data?.email);
      formData.append("bank", data?.bank);

      fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api/profile`, {
        method: "PATCH",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          // if(data.code === 500){
          //   setErrorMessage(data.error);
          //   setErrorAlert(true);
          //   setIsLoading(false);
          //   setTimeout(() => {
          //     setErrorAlert(false);
          //   }, 3000);
          // }
          setSuccessMessage("Profile picture updated successfully");
          setSuccess(true);
          userData();
          productsFetch();
          setIsLoading(false);
          setTimeout(() => {
            setSuccess(false);
          }, 3000);
        })
      } else {
        setErrorMessage("Failed to update profile picture");
        setErrorAlert(true);
        setTimeout(() => {
          setErrorAlert(false);
        }, 3000);
      }
  };

  return (
    <>
      <Sidebar>
        {isOpen ? (
          <ImageViewDialog
            image={image}
            setImage={setImage}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            fullImageSet={fullImageSet}
          />
        ) : (
          ""
        )}
        <div className="grid grid-rows-[300px_1fr] max-w-[1600px] mx-auto w-11/12">
          <div className="flex h-full w-full items-center justify-center relative">
            <Avatar
              src={profilePicture}
              alt={data?.firstName}
              className="rounded-ful w-16 h-16  md:w-44 md:h-44 border overflow-hidden"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-picture-upload"
              onChange={handleProfilePictureChange}
            />
            <label
                onClick={() => document.getElementById("profile-picture-upload").click()}
                className="mt-36"
              >
                <IconButton variant="outlined" size="sm">
                  <PencilIcon className="h-4 w-4" />
                </IconButton>
            </label>
            <div className="absolute bottom-0 mb-4 mr-4">
              
              <Button onClick={handleProfilePictureUpload} disabled={!profilePicture}>
                {isLoading ? (
                  <Spinner className="mx-auto h-4 w-4" />
                ) : ("Upload")}
              </Button>
            </div>
          </div>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Vendor Details */}
          <div className="p-5 shadow-md rounded-md relative">
            <p className="ml-2 font-semibold text-lg">
              Vendor Personal Details
            </p>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto mt-8">
              <strong className="text-sm md:text-base">Name</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.firstName + " " + data?.lastName}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto mt-8">
              <strong className="text-sm md:text-base">Customer Id</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.oldUserId}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Phone Number</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.phoneNumber}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Email</strong>
              <p className="text-xs md:text-sm">{data?.email}</p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Date of birth</strong>
              <p className="capitalize text-xs md:text-sm">
                {" "}
                {new Date(data?.dob).toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Account Type</strong>
              <p className="capitalize text-xs md:text-sm">{data?.role}</p>
            </div>
            {/* <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
                <strong className="text-sm md:text-base">Username</strong>
                <p className="capitalize text-xs md:text-sm">
                  {vendorData?.userName}
                </p>
              </div> */}
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Created At</strong>
              <p className="capitalize text-xs md:text-sm">
                {new Date(data?.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Last Updated At</strong>
              <p className="capitalize text-xs md:text-sm">
                {new Date(data?.updatedAt).toLocaleString()}
              </p>
            </div>
            <div className="border-2 text-center">
              <label className="font-bold underline">Social Media</label>
              <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
                <strong className="text-sm md:text-base">Facebook</strong>
                <p className="text-xs md:text-sm">
                  {data?.facebook}
                </p>
              </div>
              <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
                <strong className="text-sm md:text-base">Instagram</strong>
                <p className="text-xs md:text-sm">
                  {data?.instagram}
                </p>
              </div>
              <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
                <strong className="text-sm md:text-base">Youtube</strong>
                <p className="text-xs md:text-sm">
                  {data?.youtube}
                </p>
              </div>
              <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
                <strong className="text-sm md:text-base">LinkedIn</strong>
                <p className="text-xs md:text-sm">
                  {data?.linkedIn}
                </p>
              </div>
              <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
                <strong className="text-sm md:text-base">Pinterest</strong>
                <p className="text-xs md:text-sm">
                  {data?.pinterest}
                </p>
              </div>
            </div> 
            <div className="mt-2 flex justify-center">
              <div>
                <Button onClick={handleOpen}>Edit Personal Details</Button>
              </div>
            </div>

            {/* <Button
                className="mt-5"
                onClick={() => {
                  document.getElementById("vendor-personal-dialog").click();
                }}
              >
                Edit Details
              </Button> */}
          </div>
          {/* Vendor Details End */}

          {/* Address Details */}
          <div className="p-5 shadow min-h-[380px] relative">
            <p className="ml-2 font-semibold text-lg">Address Details</p>
            <div className="max-w-[800px] mx-auto mt-8">
              <div className="flex justify-between items-center border-b p-2">
                <strong className="text-sm md:text-base">Address</strong>
                <p className="capitalize text-xs md:text-sm text-right ml-4">
                  {data?.address?.address}
                </p>
              </div>
              <div className="flex justify-between items-center border-b p-2">
                <strong className="text-sm md:text-base">City</strong>
                <p className="capitalize text-xs md:text-sm ml-4">
                  {data?.address?.city}
                </p>
              </div>
              <div className="flex justify-between items-center border-b p-2">
                <strong className="text-sm md:text-base">State</strong>
                <p className="capitalize text-xs md:text-sm ml-4">
                  {data?.address?.state}
                </p>
              </div>
              <div className="flex justify-between items-center border-b p-2">
                <strong className="text-sm md:text-base">Postal Code</strong>
                <p className="capitalize text-xs md:text-sm ml-4">
                  {data?.address?.postalCode}
                </p>
              </div>
              <div className="flex justify-between items-center border-b p-2">
                <strong className="text-sm md:text-base">Country</strong>
                <p className="capitalize text-xs md:text-sm ml-4">
                  {data?.address?.country}
                </p>
              </div>
            </div>
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <div>
                <Button onClick={addressOpen}>Edit address</Button>
              </div>
            </div>
          </div>
          {/* Address Details End */}

          {/* Bank Details */}
          <div className="p-5 shadow min-h-[400px] relative">
            <p className="ml-2 font-semibold text-lg">Bank Details</p>

            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto mt-8">
              <strong className="text-sm md:text-base">Account Number</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.bank?.accountNumber}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Bank Name</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.bank?.bankName}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Ifsc Code</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.bank?.ifscCode}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Branch Name</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.bank?.branchName}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">UPI Id</strong>
              <p className="capitalize text-xs md:text-sm">{data?.bank?.upi}</p>
            </div>
            <div className="absolute bottom-5 left-0 right-0 flex justify-center">
              <div>
                <Button onClick={bankOpen}>Edit Bank</Button>
              </div>
            </div>
            {/* <Button className="absolute bottom-5 left-5">Edit Details</Button> */}
          </div>
          {/* Bank Details End */}
        </div>

        <Card className="mt-12">
          <CardBody className="overflow-scroll p-0 rounded-none">
            <Typography variant="h5" color="blue-gray" className="flex justify-center underline">
              Products list
            </Typography>
            {productLoading ? (
              <div className="flex justify-center animate-pulse">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      {TABLE_HEAD.map((head, index) => (
                        <th key={index} className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }, (_, index) => (
                      <tr key={index}>
                        <td className="p-4 border-b border-blue-gray-100">{'---'}</td>
                        <td className="p-4 border-b border-blue-gray-100">{'---'}</td>
                        <td className="p-4 border-b border-blue-gray-100">
                          {'---'} / {'---'}
                        </td>
                        <td className="p-4 border-b border-blue-gray-100">
                          {'---'}
                        </td>
                        <td className="p-4 border-b border-blue-gray-100">
                          {'---'}
                        </td>
                        <td className="p-4 border-b border-blue-gray-100">
                          {'---'}
                        </td>
                        <td className="p-4 border-b border-blue-gray-100">
                          {'---'}
                        </td>
                        <td className="p-4 border-b border-blue-gray-100">
                          {'---'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <>
                {productdata?.length > 0 ? (
                  <>
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                      <thead>
                        <tr>
                          {TABLE_HEAD.map((head, index) => (
                            <th
                              key={head}
                              className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                            >
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex justify-center gap-2 font-normal leading-none opacity-70"
                              >
                                {head}{" "}
                                {/* {index !== TABLE_HEAD.length - 1 && (
                                <ChevronUpDownIcon
                                  strokeWidth={2}
                                  className="h-4 w-4"
                                />
                              )} */}
                              </Typography>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {productdata?.map((prop, index) => {
                          const isLast = index === data?.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";

                          return (
                            <tr key={index} className="text-center">
                              <td className={` ${classes} `}>
                                <div className="flex flex-col">
                                  <Avatar
                                    src={prop.images[0]?.image?.url}
                                    size="xxl"
                                    alt={prop.title}
                                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 xxl:w-24 xxl:h-24 cursor-pointer"
                                    onClick={() => {
                                      handleImageDialog(prop?.images[0].image.url);
                                      handleImageArr(prop?.images);
                                    }}
                                  />
                                  <div className="flex flex-col mt-1 gap-2"
                                    onClick={() => {
                                      handleImageArr(prop?.images);
                                    }}
                                  >
                                    {/* Divide images into rows */}
                                    {prop?.images?.length > 1 && prop.images.slice(1).reduce((rows, image, index) => {
                                      if (index % 4 === 0) rows.push([]);
                                      rows[rows.length - 1].push(image);
                                      return rows;
                                    }, []).map((row, rowIndex) => (
                                      <div className="grid grid-cols-3 gap-1" key={rowIndex}>
                                        {/* Display images in a row */}
                                        {row.map((item, ind) => (
                                          <div className="" key={ind}>
                                            <img
                                              onClick={() => handleImageDialog(item?.image?.url)}
                                              src={item?.image?.url}
                                              alt="imageurl"
                                              className="h-7 w-7 rounded-lg"
                                              style={{ cursor: "pointer" }}
                                            />
                                          </div>
                                        ))}
                                        {/* Fill in empty slots in the row if necessary */}
                                        {row.length < 4 && Array.from({ length: 4 - row.length }).map((_, index) => (
                                          <div className="" key={`empty-${index}`} />
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </td>
                              <td className={`${classes} whitespace-normal break-words max-w-[250px]`}>
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {prop.title}
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70"
                                  >
                                    {prop?.inventory?.sku ??
                                      prop.variants[0]?.sku}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="flex flex-col">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {prop.category?.parent?.name ? prop.category?.parent?.name : "---"}
                                  </Typography>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal opacity-70"
                                  >
                                    {prop?.category?.name ? prop?.category?.name : "---"}
                                  </Typography>
                                </div>
                              </td>
                              <td className={classes}>
                                <div className="w-max">
                                  {/* <Switch color="green" defaultChecked={prop?.approved ? prop?.approved : false} onChange={() => {setApprovalDialog(!approvalDialog); setApprovalProductId(prop.id)}}/> */}
                                  <Select
                                    value={prop.status}
                                    onChange={(e) => {
                                      setApprovalState(e);
                                      setApprovalDialog(!approvalDialog);
                                      setApprovalProductId(prop.id);
                                      setSellerName(prop.vendor?.firstName + "" + prop.vendor?.lastName);
                                    }}
                                  >
                                    <Option value="pending">Pending</Option>
                                    <Option value="active">Active</Option>
                                    <Option value="inactive">Inactive</Option>
                                  </Select>
                                </div>
                              </td>
                              {/* <td className={classes}>
                              <div className="w-max">
                                <Chip
                                  variant="ghost"
                                  size="sm"
                                  value={prop.status}
                                  color={
                                    prop.status == "active" ? "green" : "amber"
                                  }
                                />
                              </div>
                            </td> */}
                              <td className={classes}>
                                <button onClick={() => {
                                  setShowApproval(!showApproval);
                                  fetchProductApproval(prop.id, page);
                                  setProductApprovalId(prop.id)
                                }}
                                >
                                  {approvalLoading ? (
                                    <Spinner className="w-4 h-4" />
                                  ) : (
                                    <IoEyeOutline />
                                  )}

                                </button>
                              </td>
                              <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {new Date(prop.createdAt).toLocaleString()}
                                </Typography>
                              </td>
                              <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {new Date(prop.updatedAt).toLocaleString()}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Tooltip content="Edit Product">
                                  <Link href={`/dashboard/products/${prop.id}`} target="_blank">
                                    <IconButton variant="text">
                                      <PencilIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Link>
                                </Tooltip>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <Typography className="text-black font-bold text-center my-4">
                    {"There's No product"}
                  </Typography>
                )}
              </>
            )}

          </CardBody>
          <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={(page) => setPage(page.selected + 1)}
              pageRangeDisplayed={15}
              pageCount={totalPages}
              activeClassName="!bg-black"
              activeLinkClassName="!text-white"
              className="flex gap-3 items-center"
              pageLinkClassName="text-black"
              pageClassName="bg-white border border-black p-2 rounded"
              disabledClassName="text-gray-400"
              previousLabel="< previous"
              renderOnZeroPageCount={null}
              initialPage={page - 1}
            />
          </CardFooter>
        </Card>
      </Sidebar>
      {/* personl details dialog */}
      <Dialog open={open} handler={handleOpen}  className="overflow-y-auto max-h-screen">
        <div className="flex items-center justify-between">
          <DialogHeader>Edit your basic details</DialogHeader>

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
          <div className="grid gap-6 ">
            <Input
              label="First Name"
              defaultValue={data?.firstName}
              {...register("firstName", { required: true })}
            />
            {errors?.firstName?.message && (
              <p className="text-sm text-red-500">
                {errors?.firstName?.message}
              </p>
            )}
            <Input
              label="Last Name"
              defaultValue={data?.lastName}
              {...register("lastName", { required: true })}
            />
            {errors?.lastName?.message && (
              <p className="text-sm text-red-500">
                {errors?.lastName?.message}
              </p>
            )}
            <Input
              label="Email"
              defaultValue={data?.email}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Please enter a valid email address"
                }
              })}
            />
            {errors?.email?.message && (
              <p className="text-sm text-red-500">{errors?.email?.message}</p>
            )}
            <Input
              label="Phone Number"
              defaultValue={data?.phoneNumber}
              {...register("phoneNumber", { required: true })}
            />
            {errors?.phoneNumber?.message && (
              <p className="text-sm text-red-500">
                {errors?.phoneNumber?.message}
              </p>
            )}
            <Input
              label="Facebook"
              defaultValue={data?.facebook}
              {...register("facebook", { required: false })}
            />
            <Input
              label="Instagram"
              defaultValue={data?.instagram}
              {...register("instagram", { required: false })}
            />
            <Input
              label="Youtube"
              defaultValue={data?.youtube}
              {...register("youtube", { required: false })}
            />
            <Input
              label="LinkedIn"
              defaultValue={data?.linkedIn}
              {...register("linkedIn", { required: false })}
            />
            <Input
              label="Pinterest"
              defaultValue={data?.pinterest}
              {...register("pinterest", { required: false })}
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" onClick={handleOpen}>
            close
          </Button>
          <Button
            variant="gradient"
            onClick={handleSubmit(editBasicDetails)}
          >
            {isLoading ? (
              <Spinner className="mx-auto h-4 w-4" />
            ) : (
              "save changes"
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* approval dialog */}
      <Dialog
        open={approvalDialog}
        handler={() => setApprovalDialog(!approvalDialog)}
      >
        <div className="flex items-center justify-between">
          <DialogHeader>Product approval log</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5 cursor-pointer"
            onClick={() => setApprovalDialog(!approvalDialog)}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogBody divider>
          <div className="grid gap-2">
            <label className="font-bold text-sm">Approval Customer Message</label>
            <select
              {...register4("customerMessage", { required: true })}
              className="peer mb-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-1 rounded-[7px] border-blue-gray-200 cursor-pointer"
            >
              <option>Select approval state</option>
              <option value={`Approval Confirmation: Congratulations! ${sellerName} Your seller account has been successfully approved! You're now able to showcase your unique creations on our platform, connecting with potential buyers worldwide. We're excited to have you on board as a Dirums Seller. Here is the login link through which you can access your seller dashboard & manage your inventory. Hurry up & start uploading your creations, our buyers are waiting for for products.`}>
                Congratulations! {sellerName} Your seller account has been successfully approved!
              </option>
              <option value={`Message to upload products: Hello, ${sellerName}, Thank you for joining our platform. We've noticed that you haven't uploaded any of your products yet. If you're encountering any difficulties with the uploading process or have any questions about the platform, feel free to contact us at our number: +91 7739918888. We're here to assist you!`}>
                Message to upload products: Hello, {sellerName}, Thank you for joining our platform. We've noticed that you haven't uploaded any of your products yet.
              </option>
              <option value={`Waiting For Approval: Hello, ${sellerName} Thank you for registering on our platform & uploading your product, your product upload has been successful and your products are currently pending for approval. As per the approval process, it will take up to 7 days for our product curator team to review your products & take the decision of approval. In the meantime, we kindly ask for your patience and encourage you to continue uploading more of your creations.`}>
                Waiting For Approval: Hello, {sellerName} Thank you for registering on our platform & uploading your product, your product upload has been successful and your products are currently pending for approval.
              </option>
              <option value={`Image Quality Feedback: Greetings! ${sellerName} Your products are pending for approval, our product curator team noticed that the images of the products uploaded by you are not as per the standard guidelines, we request to upload better-quality images of your products to get them approved. Please ensure that your photos are clear, well-lit, & showcase your items from multiple angles. High-resolution images will enhance the visual appeal of your listings. Kindly upload real image of your own product & not a photo from the internet. Make sure you are there are no contact details or watermarks on the images. Hurry up, as our buyers are eagerly.`}>
                Image Quality Feedback: Greetings! {sellerName} Your products are pending for approval, our product curator team noticed that the images of the products uploaded by you are not as per the standard guidelines, we request to upload better-quality images of your products to get them approved.
              </option>
              <option value={`Disapproval Message: Hello, ${sellerName} Thank you for uploading your product and showing patience. After thoughtful review by our product curation team, we regret to inform you that your product does not align with our current customer base & product preferences. While we appreciate your submission, we must decline it for now. Do not be discouraged we encourage you to explore other platforms where your products may find a better fit. We would love to see more of your products on our platform, keep uploading.`}>
                Disapproval Message: Hello, {sellerName} Thank you for uploading your product and showing patience.
              </option>
            </select>
            {errors?.approval?.message && (
              <p className="text-sm text-red-500">
                {errors?.customerMessage?.message}
              </p>
            )}
            <label className="font-bold text-sm">Approval Own message</label>
            <Textarea
              label="Message"
              {...register4("message", { required: true })}
            />
            {errors4?.message?.message && (
              <p className="text-sm text-red-500">{errors4?.message?.message}</p>
            )}
            <label className="font-bold text-sm">Who are you ?</label>
            <Input
              label="Who are you?"
              {...register4("role", {
                required: { value: true, message: "Role is required" },
              })}
              onInput={(e) => { }}
            />
            {errors4?.role?.type === "required" && (
              <p className="text-sm text-red-500">Role is required</p>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2 grid grid-cols-2">
          <Button
            variant="outlined"
            color="black"
            onClick={() => {
              setApprovalDialog(!approvalDialog);
            }}
          >
            close
          </Button>
          <Button
            variant="gradient"
            color="black"
            onClick={handleSubmit4(editApprovalDetails)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="mx-auto h-4 w-4" />
            ) : (
              "save changes"
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* showapproval logs dialog box */}
      <Dialog
        open={showApproval}
        handler={() => setShowApproval(!showApproval)}
      >
        <div className="flex items-center justify-between">
          <DialogHeader className="whitespace-normal break-words max-w-[350px]">
            Checkout the product logs
          </DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5 cursor-pointer"
            onClick={() => setShowApproval(!showApproval)}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="h-[74vh] w-[80vw] overflow-y-auto">
            <DialogBody divider>
              <div className="">
                <div className="grid gap-2">
                  {approvalLogs.length < 1 && !approvalLoading ? (
                    <>
                      {"No logs"}
                    </>
                  ) : (
                    <>
                      {approvalLoading ? (
                        <div className="flex justify-center">
                          <Spinner />
                        </div>
                      ) : (
                      <>
                        {approvalLogs?.map((logs, index) => (
                          <CardBody key={index} className={`border-2`}>
                            <p><span className="font-bold">Action By: </span>{logs?.role}</p>
                            <p>
                              <span className="font-bold">Action Taken: </span>
                              <span className={`${logs?.status === 'active' ? 'text-green-500' : logs?.status === 'inactive' ? 'text-red-500' : 'text-yellow-700'}`}>
                                {logs?.status}
                              </span>
                            </p>
                            {/* <p>
                              <span className="font-bold">
                                Uploaded/Edited: {" "}
                              </span>
                              <span>
                                {logs?.product.edited ? "Edited" : "Uploaded"}
                              </span>
                            </p> */}
                            <p><span className="font-bold">Updated: </span>{new Date(logs?.updatedAt).toLocaleString()}</p>
                            <p><span className="font-bold">Message: </span>{logs?.message}</p>
                            <p><span className="font-bold">Customer Message: </span>{logs?.customerMessage}</p>
                          </CardBody>
                        ))}
                      </>)
                      }
                    </>
                  )}
                </div>
              </div>
            </DialogBody>
          </div>
        </div>

        <DialogFooter className="space-x-2 grid grid-cols-2">
          <Button
            variant="outlined"
            color="black"
            disabled={!hasPrevPage}
            onClick={() => prevLogsPages(productApprovalId)}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            color="black"
            onClick={() => nextLogsPages(productApprovalId)}
            disabled={!hasNextPage}
          >
            Next
          </Button>
        </DialogFooter>
      </Dialog>

      {/* address dialog */}
      <Dialog open={address} handler={addressOpen}>
        <div className="flex items-center justify-between">
          <DialogHeader>Edit your address</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={addressOpen}
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
              label="Address"
              defaultValue={data?.address?.address}
              {...register2("address", { required: true })}
            />
            {errors2?.address?.message && (
              <p className="text-sm text-red-500">
                {errors2?.address?.message}
              </p>
            )}
            <Input
              label="State"
              defaultValue={data?.address?.state}
              {...register2("state", { required: true })}
            />
            {errors2?.state?.message && (
              <p className="text-sm text-red-500">{errors2?.state?.message}</p>
            )}
            <Input
              label="City"
              defaultValue={data?.address?.city}
              {...register2("city", { required: true })}
            />
            {errors2?.city?.message && (
              <p className="text-sm text-red-500">{errors2?.city?.message}</p>
            )}
            <Input
              label="Postal Code"
              defaultValue={data?.address?.postalCode}
              {...register2("postalCode", { required: true })}
            />
            {errors2?.postalCode?.message && (
              <p className="text-sm text-red-500">
                {errors2?.postalCode?.message}
              </p>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2 grid grid-cols-2">
          <Button variant="outlined" color="red" onClick={addressOpen}>
            close
          </Button>
          <Button
            variant="gradient"
            color="black"
            onClick={handleSubmit2(editAddressDetails)}
          >
            {isLoading ? (
              <Spinner className="mx-auto h-4 w-4" />
            ) : (
              "save changes"
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* bank dialog */}
      <Dialog open={bank} handler={bankOpen}>
        <div className="flex items-center justify-between">
          <DialogHeader>Edit bank details</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={bankOpen}
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
              label="Account Number"
              defaultValue={data?.bank?.accountNumber}
              {...register3("accountNumber", { required: true })}
            />
            {errors3?.accountNumber?.message && (
              <p className="text-sm text-red-500">
                {errors3?.accountNumber?.message}
              </p>
            )}
            <Input
              label="Bank Name"
              defaultValue={data?.bank?.bankName}
              {...register3("bankName", { required: true })}
            />
            {errors3?.bankName?.message && (
              <p className="text-sm text-red-500">
                {errors3?.bankName?.message}
              </p>
            )}
            <Input
              label="Branch Name"
              defaultValue={data?.bank?.branchName}
              {...register3("branchName", { required: true })}
            />
            {errors3?.branchName?.message && (
              <p className="text-sm text-red-500">
                {errors3?.branchName?.message}
              </p>
            )}
            <Input
              label="IFSC Code"
              defaultValue={data?.bank?.ifscCode}
              {...register3("ifscCode", { required: true })}
            />
            {errors3?.ifscCode?.message && (
              <p className="text-sm text-red-500">
                {errors3?.ifscCode?.message}
              </p>
            )}
            <Input
              label="UPI ID"
              defaultValue={data?.bank?.upiId}
              {...register3("upiId", { required: true })}
            />
            {errors3?.upiId?.message && (
              <p className="text-sm text-red-500">{errors3?.upiId?.message}</p>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2 grid grid-cols-2">
          <Button variant="outlined" color="red" onClick={bankOpen}>
            close
          </Button>
          <Button
            variant="gradient"
            color="black"
            onClick={handleSubmit3(editBankDetails)}
          >
            {isLoading ? (
              <Spinner className="mx-auto h-4 w-4" />
            ) : (
              "save changes"
            )}
          </Button>
        </DialogFooter>
      </Dialog>

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
      <Alert
        className="absolute right-3 top-3 w-fit flex items-center"
        open={errorAlert}
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
            onClick={() => setErrorAlert(false)}
          >
            <XCircleIcon className="w-6 h-6" />
          </Button>
        }
        color="red"
      >
        {errorMessage}
      </Alert>
    </>
  );
};

export default Page;
