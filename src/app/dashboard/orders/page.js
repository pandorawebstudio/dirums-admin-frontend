/* eslint-disable @next/next/no-async-client-component */
"use client";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  PlusCircleIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
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
import Sidebar from "../../../components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../../../config";
import { useForm } from "react-hook-form";
import { useDebounce } from 'use-debounce';
import qs from 'qs';

const TABLE_HEAD = ["User", "Phone Number", "No of Items", "Sub Total", "Tax total", "Grand Total", "Payement Mode", "Payment Status", "Created At", "Updated At", "Edit"];

export default function SortableTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [approvalProductId, setApprovalProductId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000);
  const [stringifiedQuery, setStringifiedQuery] = useState("");


  const {register, handleSubmit, formState: {errors}} = useForm();

  const prevPages = () => {
    fetch(`${BASE_URL}/dashboard/orders/api?page=${prevPage}`)
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
    fetch(`${BASE_URL}/dashboard/orders/api?page=${nextPage}`)
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

  if (data?.length === 0) {
    fetch(`${BASE_URL}/dashboard/orders/api`)
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
  }

  const editApprovalDetails = (values) => {
    setIsLoading(true)
    fetch(`${BASE_URL}/dashboard/orders/api/approval`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product: approvalProductId,
        status: values.approval,
        message: values.message
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setApprovalDialog(!approvalDialog);
        setSuccessMessage(data.message.message)
        setIsLoading(false)
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      })
  }

  const search = () => {
    fetch(`${API_URL}/api/order?[where][firstName]=${searchQuery}`)
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

  // useEffect(() => {
  //   search();
  // }, [, searchQuery2]);
  return (
    <>
    <Sidebar>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                All Orders
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all your orders
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {/* <Button variant="outlined" size="sm">
                view all
              </Button> */}
              {/* <Button
                className="flex items-center gap-2"
                size="sm"
                onClick={() => router.push("/dashboard/products/create")}
              >
                <PlusCircleIcon strokeWidth={4} className="h-6 w-6" /> Add
                Product
              </Button> */}
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {data?.length > 0 && (
            <div className="w-full md:w-72">
              <Input
                label="Search"
                onInput={(e) => {
                  setSearchQuery(e.target.value)   
                  search
                }}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            )}
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
        {data?.length > 0 ? (
            <>
              <table className="mt-4 w-full table-auto text-left">
                <thead >
                  <tr >
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

                  {data?.map((prop, index) => {
                    const isLast = index === data?.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={index}>
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {
                                  prop.user.firstName && prop.user.lastName ?
                                 `${prop.user.firstName} ${prop.user.lastName}`
                                 : "Guest"
                                }
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.user.phoneNumber}
                            </Typography>
                          </div>
                        </td>
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <div className="flex justify-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.cart.items.length}
                            </Typography>
                          </div>
                        </td>
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <div className="flex justify-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.payment.cart.subTotal}
                            </Typography>
                          </div>
                        </td>
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <div className="flex justify-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.payment.cart.taxTotal}
                            </Typography>
                          </div>
                        </td>
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <div className="flex justify-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.payment.cart.grandTotal}
                            </Typography>
                          </div>
                        </td>
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <div className="flex justify-center">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.payment.mode === 'online' ? prop.payment.paymentGateway : prop.payment.mode}
                            </Typography>
                          </div>
                        </td>
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <div className="w-max">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={prop.payment.status}
                              color={
                                prop.payment.status == "successful" ? "green" : "amber"
                              }
                            />
                          </div>
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
                        <td className={`${classes} whitespace-normal break-words max-w-[100px]`}>
                          <Tooltip content="Edit Order">
                            <IconButton
                              variant="text"
                              onClick={() =>
                                router.push("/dashboard/orders/" + prop.id)
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
          ) : data?.length === 0 ?
              <Spinner className="mx-auto h-8 w-8"/>
            : 
            <Typography className="text-black font-bold text-center my-4">
              {"There's No Orders"}
            </Typography> 
        }
        </CardBody>
        {data?.length > 0 && (
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
        )}
      </Card>
    </Sidebar>

<Dialog open={approvalDialog} handler={() => setApprovalDialog(!approvalDialog)}>
<div className="flex items-center justify-between">
  <DialogHeader>Edit product approval state</DialogHeader>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="mr-3 h-5 w-5"
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
    <label className="font-bold text-sm">Approval State</label>
    <select
      {...register("approval", { required: true })}
      className="peer mb-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-1 rounded-[7px] border-blue-gray-200"
    >
      <option>Select approval state</option>
      <option value={"approved"}>Approved</option>
      <option value={"disapproved"}>Disapproved</option>
      <option value={"inactive"}>Inactive</option>
      </select>
    {errors?.approval?.message && (
      <p className="text-sm text-red-500">
        {errors?.approval?.message}
      </p>
    )}
    <Textarea
      label="Message"
      {...register("message", { required: true })}
    />
    {errors?.message?.message && (
      <p className="text-sm text-red-500">
        {errors?.message?.message}
      </p>
    )}
   
  </div>
</DialogBody>
<DialogFooter className="space-x-2 grid grid-cols-2">
  <Button variant="outlined" color="red" onClick={() => setApprovalDialog(!approvalDialog)}>
    close
  </Button>
  <Button
    variant="gradient"
    color="black"
    onClick={handleSubmit(editApprovalDetails)}
  >
    {isLoading ? (
      <Spinner className='mx-auto h-4 w-4' />
    ):
    "save changes"
}
  </Button>
</DialogFooter>
</Dialog>

<Alert className="absolute right-3 top-3 w-fit flex items-center" open={success} animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }} action={
          <Button
            variant="text"
            color="white"
            size="sm"
            className="!absolute right-1"
            onClick={() => setSuccess(false)}
          >
            <XCircleIcon className="w-6 h-6" />
          </Button>
        } color="green">{successMessage}</Alert>
</>

  );
}
