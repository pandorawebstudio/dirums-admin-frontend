/* eslint-disable @next/next/no-async-client-component */
"use client";

import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  CheckIcon
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
  Select,
  Option
} from "@material-tailwind/react";
import Sidebar from "../../../components/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BASE_URL, API_URL } from "../../../config";
import { useForm } from "react-hook-form";
import { MeiliSearch } from 'meilisearch'
import ReactPaginate from 'react-paginate';
import qs from 'qs'
import { useDebounce } from 'use-debounce'

const TABLE_HEAD = ["Image", "Name", "Vendor", "Price", "Prev Stock", "Changed Stock", "Category", "Approval", "Status", "Created At", "Updated At", "Edit"];

function SortableTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [approvalProductId, setApprovalProductId] = useState("");
  const [approvalState, setApprovalState] = useState("");
  const [filteraApprovalState, setFilterApprovalState] = useState("");
  const [filteraByVendor, setFilteraByVendor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageToShow, setImageToShow] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000)
  const [sellerName, setSellerName] = useState("");
  const [filterLimit, setFilterLimit] = useState(10);
  const [moveDown, setMoveDown] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const {register, handleSubmit, reset, formState: { errors }} = useForm();

const editApprovalDetails = (values) => {
  setIsLoading(true)
  fetch(`${BASE_URL}/dashboard/edited-products/api/approval`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product: approvalProductId,
      status: approvalState,
      customerMessage: values.customerMessage,
      message: values.message
    })
  })
    .then((res) => res.json())
    .then((data) => {
      search();
      setApprovalDialog(!approvalDialog);
      setSuccessMessage(data.message.message)
      setIsLoading(false)
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
      reset();
    })
}

const search = (e) => {
  setIsLoading(true)
  const query = {
    or: [
      {
        title: {
          contains: searchQuery2,
        },
      },
      {
        'vendor.firstName': {
          contains: searchQuery2,
        },
      },
      {
        'vendor.lastName': {
          contains: searchQuery2,
        },
      },
      {
        'attributes.value': {
          contains: searchQuery2,
        },
      },
      {
        'category.name': {
          contains: searchQuery2,
        },
      },
    ],
    and: [
      {
        edited: {
          equals: true
        }
      }
    ],
  };

  // Add the status filter only if filterApprovalState is not empty
  if (filteraApprovalState) {
    query.and.push({
      status: {
        equals: filteraApprovalState,
      },
    });
  }

  if (filteraByVendor) {
    query.and.push({
      'vendor.firstName': {
        equals: filteraByVendor,
      },
    });
  }

  const stringified = qs.stringify(
    {
      where: query,
      sort: sort,
    },
    { addQueryPrefix: false }
  );

  fetch(`${API_URL}/api/product?${stringified && stringified + '&'}page=${page}&limit=${filterLimit}`)
    .then((res) => res.json())
    .then((data) => {
      setData(data.docs);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
      setHasPrevPage(data.hasPrevPage);
      setIsLoading(false);
    });
};
  
  useEffect(() => {
    if (searchQuery2 || page || filterLimit || filteraApprovalState || sort || filteraByVendor) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&status=${filteraApprovalState}&sort=${sort}&page=${page}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    search();
  }, [filteraApprovalState, filterLimit, searchQuery2, sort, page, filteraByVendor]);
  
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Edited Products list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all your products
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row ">
                {/* <Button variant="outlined" size="sm">
                view all
              </Button> */}
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  onClick={() => router.push("/dashboard/products/create")}
                >
                  <PlusCircleIcon strokeWidth={4} className="h-6 w-6" /> Add
                  Product
                </Button>
              </div>
            </div>
            <div className={`flex flex-col items-center justify-between gap-4 md:flex-row ${moveDown && "mb-36"}`}>
              <div className="w-full">
                <Input
                  label="Search"
                  value={searchQuery}
                  onInput={(e) => setSearchQuery(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <div className="w-full">
                <Select
                label="Filter by vendor"
                value={filteraByVendor}
                onChange={(val) => {
                  console.log(val, "firstname");
                  setFilteraByVendor(val);
                  setMoveDown(false);
                }}
                onClick={() => setMoveDown(true)}
              >
                <Option value="">None</Option>
                {data?.map((prop, index) => (
                  <Option value={prop.vendor?.firstName}>
                    {prop.vendor?.firstName && prop.vendor?.lastName ? `${prop.vendor?.firstName} ${prop.vendor?.lastName}` : "No name"}
                  </Option>
                ))}
                </Select>
              </div>
              <div className="w-full">
                <Select
                label="Filter by approval"
                value={filteraApprovalState}
                  onChange={(e) => {
                    setFilterApprovalState(e);
                    setMoveDown(false);
                  }}
                  onClick={() => setMoveDown(true)}
                >
                  <Option value="">All</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="active">Approved</Option>
                  <Option value="inactive">Disapproved</Option>
                </Select>
              </div>
              <div className="w-full">
                <Select
                label="Sort By"
                defaultValue={sort}
                value={sort}
                  onChange={(e) => {
                    setSort(e);
                    setMoveDown(false);
                  }}
                  onClick={() => setMoveDown(true)}
                >
                  <Option value="-createdAt">Newest</Option>
                  <Option value="createdAt">Oldest</Option>
                  <Option value="-price">Price: High to Low</Option>
                  <Option value="price">Price: Low to High</Option>
                </Select>
              </div>
              <div className="w-full">
                  <Select
                    label="Filter by limit"
                    defaultValue={filterLimit}
                    value={filterLimit}
                    onChange={(e) => {
                      setFilterLimit(e);
                      setMoveDown(false);
                    }}
                    onClick={() => setMoveDown(true)}
                  >
                    <Option value={25}>25</Option>
                    <Option value={50}>50</Option>
                    <Option value={100}>100</Option>
                  </Select>
              </div>
            </div>
            <Button 
              className="float-right mt-2"
              onClick={() =>{
                setFilterApprovalState(false);
                setSearchQuery("");
                setFilterLimit(10);
                setSort("");
              }}
            >
              reset
            </Button>
          </CardHeader>
          <CardBody className="overflow-scroll p-0">
            {data?.length > 0 ? (
              <>
                <tbody>
                  {isLoading ? (
                    // Shimmer effect for loading
                    <>
                      {[...Array(filterLimit)].map((_, index) => (
                        <tr key={index}>
                          {TABLE_HEAD.map((_, index) => (
                            <td
                              key={index}
                              className={`p-4 border-b border-blue-gray-300 w-full animate-pulse`}
                            >
                              <div className="h-4 bg-blue-gray-200 rounded"></div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </>
                  ) : (
                    // Render actual data
                    <>
                      <table className="mt-4 w-full table-auto text-left">
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
                          {data?.map((prop, index) => {
                            const isLast = index === data?.length - 1;
                            const classes = isLast
                              ? "p-4"
                              : "p-4 border-b border-blue-gray-50";

                            return (
                              <tr key={index}>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                    <div>
                                      <Avatar
                                        src={prop.images[0].image.url}
                                        alt={prop.title}
                                        size="xl"
                                        onClick={() => {
                                          setShowImageDialog(true);
                                          setImageToShow(prop.images[0].image.url);
                                        }}
                                        className="cursor-pointer"
                                      />
                                    </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                    <div className="flex flex-col whitespace-normal break-words max-w-[150px]">
                                        {prop.title}
                                    </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                  <div className="flex flex-col">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal whitespace-normal break-words max-w-[150px]"
                                    >
                                      {prop.vendor?.firstName && prop.vendor?.lastName ? `${prop.vendor?.firstName} ${prop.vendor?.lastName}` : "No name"}
                                    </Typography>
                                  </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                  <div className="flex flex-col">
                                    {prop.has_variants ? (
                                      <>
                                        {prop.variants.map((value, index) => (
                                          <Typography key={index} >
                                            {value.name}: {value.price}
                                          </Typography>
                                        ))}
                                      </>
                                    ) : (
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                      >
                                        {new Intl.NumberFormat("en-IN", {
                                          currency: "INR",
                                          style: "currency",
                                          maximumFractionDigits: 0,
                                        }).format(prop.price > 0 ? prop.price : 0)}
                                      </Typography>
                                    )}
                                  </div>
                                </td>
                                <td className={`${classes}`}>
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {prop.has_variants ? (
                                                <>
                                                    {prop.variants.map((value, index) => (
                                                        <Typography key={index} >
                                                            {value.name}: {value.prevquantity}
                                                        </Typography>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    {prop.inventory.prevquantity}
                                                </>
                                            )}
                                        </Typography>
                                    </div>
                                </td>
                                <td className={`${classes}`}>
                                    <div className="flex flex-col">
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {prop.has_variants ? (
                                                <>
                                                    {prop.variants.map((value, index) => (
                                                        <Typography key={index} >
                                                            {value.name}: {value.quantity}
                                                        </Typography>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    {prop.inventory.quantity}
                                                </>
                                            )}
                                        </Typography>
                                        
                                    </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
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
                                      {prop?.category?.name ? prop?.category?.name : "Not available"}
                                    </Typography>
                                  </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                  <div className="w-max">
                                    {/* <Switch color="green" defaultChecked={prop?.approved ? prop?.approved : false} onChange={() => {setApprovalDialog(!approvalDialog); setApprovalProductId(prop.id)}}/> */}
                                    <select
                                      value={prop.status}
                                      onChange={(e) => {
                                        setApprovalState(e.target.value);
                                        setApprovalDialog(!approvalDialog);
                                        setApprovalProductId(prop.id);
                                        setSellerName(prop.vendor?.firstName + "" + prop.vendor?.lastName)
                                      }}
                                      className="border-2 rounded w-[110px]"
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="active">Approved</option>
                                      <option value="inactive">Disapproved</option>
                                    </select>
                                  </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                  <div className="w-max">
                                    <Chip
                                      variant="ghost"
                                      size="sm"
                                      value={
                                        prop.status === 'active' ? "Approved" :
                                          prop.status === 'inactive' ? 'Disapproved' : 'Pending'
                                      }
                                      color={
                                        prop.status == "active" ? "green" : "amber"
                                      }
                                    />
                                  </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {new Date(prop.createdAt).toLocaleString()}
                                  </Typography>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {new Date(prop.updatedAt).toLocaleString()}
                                  </Typography>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[120px]`}>
                                  <Tooltip content="Edit Product">
                                    <IconButton
                                      variant="text"
                                      onClick={() =>
                                        router.push("/dashboard/products/" + prop.id)
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
                  )}
                </tbody>
              </>
            ) : (
              isLoading ? (
                <>
                  {[...Array(10)].map((_, index) => (
                        <tr key={index}>
                          {TABLE_HEAD.map((_, index) => (
                            <td
                              key={index}
                              className="p-4 border-b border-blue-gray-300 animate-pulse"
                            >
                              <div className="h-4 bg-blue-gray-200 rounded w-[203px]"></div>
                            </td>
                          ))}
                        </tr>
                      ))}
                </>
              ) : (
                <Typography className="text-black font-bold text-center my-4">
                {"There's No product"}
                </Typography>
              )
            )}
          </CardBody>
          {data?.length > 0 && (
            <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
              {/* <Typography variant="small" color="blue-gray" className="font-normal">
            Page {page} of {totalPages}
          </Typography> */}
              <div className="flex items-center gap-4">
                <ReactPaginate
                  breakLabel="..."
                  nextLabel="next >"
                  onPageChange={(page) => setPage(page.selected + 1)}
                  pageRangeDisplayed={5}
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
              </div>
            </CardFooter>
          )}
        </Card>
      </Sidebar>

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
              {...register("customerMessage", { required: true })}
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
              {...register("message", { required: true })}
            />
            {errors?.message?.message && (
              <p className="text-sm text-red-500">{errors?.message?.message}</p>
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
            onClick={handleSubmit(editApprovalDetails)}
          >
            {isLoading ? (
              <Spinner className="mx-auto h-4 w-4" />
            ) : (
              "save changes"
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog
        open={showImageDialog}
        handler={() => setShowImageDialog(!showImageDialog)}
      >
        <div className="flex items-center justify-between p-2 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={() => setShowImageDialog(!showImageDialog)}
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
            <img
              src={imageToShow}
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            color="red"
            onClick={() => setShowImageDialog(!showImageDialog)}
          >
            close
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
    </Suspense>
  );
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <SortableTable />
    </Suspense>
  );
}