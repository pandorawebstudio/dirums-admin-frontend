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
  Textarea,
  Alert,
} from "@material-tailwind/react";
import { PencilIcon,PlusIcon, XCircleIcon } from "@heroicons/react/24/solid";
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";

const Page = ({ params }) => {
  const [data, setData] = useState([]);
  const [productdata, setProductsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(false);
  const [bank, setBank] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError2] = useState("");
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);


  const handleOpen = () => setOpen(!open);
  const addressOpen = () => setAddress(!address);
  const bankOpen = () => setBank(!bank);

  if (data?.length == 0) {
    fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api`)
      .then((res) => res.json())
      .then((data) => {
        
        setData(data.message);
      });

      fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api/product`)
    .then(res => res.json())
    .then((data) =>{ 
      setProductsData(data.message.docs)
      setPage(data.message.page);
      setNextPage(data.message.nextPage);
      setPrevPage(data.message.prevPage);
      setTotalPages(data.message.totalPages);
      setHasNextPage(data.message.hasNextPage);
      setHasPrevPage(data.message.hasPrevPage);
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

  const editBasicDetails = (values) => {
    fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api`, {
      method: "PATCH",
      body: JSON.stringify({
        _id: data?.id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.data.doc);
        setOpen(!open);
        setSuccessMessage("Profile details updated successfully");
        setSuccess(true);
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
            setData(data.message);
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
      fetch(`${BASE_URL}/dashboard/account/api/bank`, {
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

          fetch(`${BASE_URL}/dashboard/account/api`)
            .then((res) => res.json())
            .then((data) => {
    
              setData(data.data?.user);
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
      fetch(`${BASE_URL}/dashboard/account/api/bank`, {
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

          fetch(`${BASE_URL}/dashboard/account/api`)
            .then((res) => res.json())
            .then((data) => {
    
              setData(data.data?.user);
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

  const prevPages = () => {
    fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api/product?page=${prevPage}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.message.docs);
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setPrevPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
      });
  };

  const nextPages = () => {
    fetch(`${BASE_URL}/dashboard/vendors/${params.id}/api/product?page=${nextPage}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.message.docs);
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setPrevPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
      });
  };
  const TABLE_HEAD = ["Name", "Category", "Approval", "Status", "Created", ""];
  return (
    <>
      <Sidebar>
        <div className="grid grid-rows-[300px_1fr] max-w-[1600px] mx-auto w-11/12">
          <div className="flex h-full w-full items-center justify-center">
            <Avatar
              src={data?.profilePicture?.url}
              alt={data?.firstName}
              className="rounded-full w-44 h-44 border overflow-hidden"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Vendor Details */}
          <div className="p-5 shadow-md rounded-md">
            <p className="ml-2 font-semibold text-lg">
              Vendor Personal Details
            </p>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto mt-8">
              <strong className="text-sm md:text-base">Name</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.firstName + " " + data?.lastName}
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
            <div className="my-12">
              <Button onClick={handleOpen}>Edit Personal Details</Button>
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
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto mt-8">
              <strong className="text-sm md:text-base">Address</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.address?.address}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">City</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.address?.city}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">State</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.address?.state}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Postal Code</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.address?.postalCode}
              </p>
            </div>
            <div className="flex justify-between items-center max-w-[800px] border-b p-2 mx-auto">
              <strong className="text-sm md:text-base">Country</strong>
              <p className="capitalize text-xs md:text-sm">
                {data?.address?.country}
              </p>
            </div>
            <div className="my-12">
              <Button onClick={addressOpen}>Edit address</Button>
            </div>

            {/*               
              <Button
                className="absolute bottom-5 left-5"
                onClick={() =>
                  document.getElementById("vendor-address-dialog").click()
                }
              >
                Edit Details
              </Button> */}
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
            <div className="my-12">
              <Button onClick={bankOpen}>Edit Bank</Button>
            </div>
            {/* <Button className="absolute bottom-5 left-5">Edit Details</Button> */}
          </div>
          {/* Bank Details End */}
        </div>
        <div>
          <Card>
            <CardHeader>
              <Typography variant="h5" color="blue-gray">
                Products list
              </Typography>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
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
                              className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                            >
                              {head}{" "}
                              {index !== TABLE_HEAD.length - 1 && (
                                <ChevronUpDownIcon
                                  strokeWidth={2}
                                  className="h-4 w-4"
                                />
                              )}
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
                          <tr key={index}>
                            <td className={classes}>
                              <div className="flex items-center gap-3">
                                <Avatar
                                  src={prop.images[0].image.url}
                                  alt={prop.title}
                                  size="sm"
                                />
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
                                      prop.variants[0].sku}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className={classes}>
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {prop.category?.parent?.name}
                                </Typography>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal opacity-70"
                                >
                                  {prop?.category?.name}
                                </Typography>
                              </div>
                            </td>
                            <td className={classes}>
                              <div className="w-max">
                                <Switch
                                  color="green"
                                  defaultChecked={
                                    prop?.approved ? prop?.approved : false
                                  }
                                  onChange={() => {
                                    setApprovalDialog(!approvalDialog);
                                    setApprovalProductId(prop.id);
                                  }}
                                />
                              </div>
                            </td>
                            <td className={classes}>
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
                            </td>
                            <td className={classes}>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {new Date(prop.createdAt).toLocaleString()}
                              </Typography>
                            </td>
                            <td className={classes}>
                              <Tooltip content="Edit User">
                                <IconButton
                                  variant="text"
                                  onClick={() =>
                                    router.push(
                                      "/dashboard/products/" + prop.id
                                    )
                                  }
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </IconButton>
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
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page {page} of {totalPages}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={prevPages}
              disabled={!hasPrevPage}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              onClick={nextPages}
              disabled={!hasNextPage}
            >
              Next
            </Button>
          </div>
        </CardFooter>
          </Card>
        </div>
      </Sidebar>
      {/* personl details dialog */}
      <Dialog open={open} handler={handleOpen}>
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
          <div className="grid gap-6">
            {/* <div className="gap-6 mb-4 flex flex-col items-center">
            <input type="file" accept="image/*" id="photo" hidden onChange={(e) => setFile(e.target.files[0])} />
            <img src={file ? URL.createObjectURL(file) : "/default-user.jpeg"} className="w-28 h-28 rounded-full mx-auto object-cover" />
            {errors?.file?.message && (
                <p className="text-sm text-red-500">{errors?.file?.message}</p>
              )}
            <Button variant="outlined" size="sm" onClick={() => document.getElementById('photo').click()}>Upload photo</Button>
          </div> */}
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
              {...register("email", { required: true })}
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
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={handleOpen}>
            close
          </Button>
          <Button
            variant="gradient"
            color="green"
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
    </>
  );
};

export default Page;
