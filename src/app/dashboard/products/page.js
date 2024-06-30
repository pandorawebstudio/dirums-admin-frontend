/* eslint-disable @next/next/no-async-client-component */
"use client";

import { saveAs } from 'file-saver';
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
import { GrDownload } from "react-icons/gr";
import ImageViewDialog from "../../../components/imageViewDialog";
import Link from 'next/link';

const TABLE_HEAD = ["Images", "Name", "Vendor", "Price", "Stock", "Category", "Approval", "Created", "Updated", "Edit"];

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
  const [filterApprovalState, setFilterApprovalState] = useState("");
  const [filteraByVendor, setFilteraByVendor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageToShow, setImageToShow] = useState({});
  const [sort, setSort] = useState("-createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000)
  const [sellerName, setSellerName] = useState("");
  const [filterLimit, setFilterLimit] = useState("10");
  const [moveDown, setMoveDown] = useState(false);
  const [fullImageSet, setFullImageSet] = useState([]);
  const [image, setImage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const {register, handleSubmit, reset, formState: { errors }} = useForm();

const editApprovalDetails = (values) => {
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
    and: [],
  };

  // Add the status filter only if filterApprovalState is not empty
  if (filterApprovalState) {
    query.and.push({
      status: {
        equals: filterApprovalState,
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

  if(filterApprovalState) {
    fetch(`${API_URL}/api/product?${stringified}&page=${page}&limit=${filterLimit}`)
    .then((res) => res.json())
    .then((data) => {
      setData(data.docs);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setHasNextPage(data.hasNextPage);
      setHasPrevPage(data.hasPrevPage);
      setIsLoading(false);
    });
  } 
  else {
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
  }

};
  
  useEffect(() => {
    if (searchQuery2 || page || filterLimit || filterApprovalState || sort || filteraByVendor) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&status=${filterApprovalState}&sort=${sort}&page=${page}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    search();
  }, [filterApprovalState, filterLimit, searchQuery2, sort, page, filteraByVendor]);

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
  
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
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
        <Card>
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Products list
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
            <div className={`flex flex-row gap-4 items-center justify-between ${moveDown && "mb-36"}`}>
              <div>
                <Input
                  label="Search"
                  value={searchQuery}
                  onInput={(e) => setSearchQuery(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <div>
                <Select
                label="Filter by vendor"
                value={filteraByVendor}
                onChange={(val) => {
                  console.log(val, "firstname");
                  setFilteraByVendor(val);
                  setMoveDown(!moveDown);
                }}
                onClick={() => setMoveDown(!moveDown)}
              >
                <Option value="">None</Option>
                {data?.map((prop, index) => (
                  <Option value={prop.vendor?.firstName}>
                    {prop.vendor?.firstName && prop.vendor?.lastName ? `${prop.vendor?.firstName} ${prop.vendor?.lastName}` : "No name"}
                  </Option>
                ))}
                </Select>
              </div>
              <div>
                <Select
                label="Filter by approval"
                value={filterApprovalState}
                  onChange={(e) => {
                    setFilterApprovalState(e);
                    setMoveDown(!moveDown)
                  }}
                  onClick={() => setMoveDown(!moveDown)}
                >
                  <Option value="">All</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="active">Approved</Option>
                  <Option value="inactive">Disapproved</Option>
                </Select>
              </div>
              <div>
                <Select
                label="Sort By"
                defaultValue={sort}
                value={sort}
                  onChange={(e) => {
                    setSort(e);
                    setMoveDown(!moveDown);
                  }}
                  onClick={() => setMoveDown(!moveDown)}
                >
                  <Option value="-createdAt">Newest</Option>
                  <Option value="createdAt">Oldest</Option>
                  <Option value="-price">Price: High to Low</Option>
                  <Option value="price">Price: Low to High</Option>
                </Select>
              </div>
              <div>
                  <Select
                    label="Filter by limit"
                    defaultValue={filterLimit}
                    value={filterLimit}
                    onChange={(e) => {
                      setFilterLimit(e);
                      setMoveDown(!moveDown);
                    }}
                    onClick={() => setMoveDown(!moveDown)}
                  >
                    <Option value="10">10</Option>
                    <Option value="25">25</Option>
                    <Option value="50">50</Option>
                    <Option value="100">100</Option>
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
          <CardBody className="overflow-x-auto p-0 mt-4">
            {data?.length > 0 ? (
              <table className="min-w-full divide-y divide-blue-gray-200">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 text-center"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="flex justify-center gap-2 font-normal leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    // Shimmer effect for loading
                    [...Array(10)].map((_, index) => (
                      <tr key={index}>
                        {TABLE_HEAD.map((_, index) => (
                          <td
                            key={index}
                            className="p-4 border-b border-blue-gray-300 w-full animate-pulse"
                          >
                            <div className="h-4 bg-blue-gray-200 rounded"></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    // Render actual data
                    data.map((prop, index) => {
                      const isLast = index === data.length - 1;
                      const classes = isLast
                        ? "p-2"
                        : "p-2 border-b border-blue-gray-50";

                      return (
                        <tr key={index} className="text-center">
                          <td className={` ${classes} `}>
                            <div className="flex flex-col">
                              <Avatar
                                src={prop.images[0]?.image.url}
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
                          <td className={`${classes}`}>
                            <div className="flex flex-col whitespace-normal break-words max-w-[150px]">
                              {prop.title}
                            </div>
                          </td>
                          <td className={`${classes}`}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal whitespace-normal break-words max-w-[150px]"
                              >
                                {prop.vendor?.firstName && prop.vendor?.lastName
                                  ? `${prop.vendor?.firstName} ${prop.vendor?.lastName}`
                                  : "No name"}
                              </Typography>
                            </div>
                          </td>
                          <td className={`${classes}`}>
                            <div className="flex flex-col">
                              {prop.has_variants ? (
                                prop.variants.map((value, index) => (
                                  <Typography key={index}>
                                    {value.name}: {value.price}
                                  </Typography>
                                ))
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
                            <div>
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {prop.has_variants ? (
                                  prop.variants.map((value, index) => (
                                    <Typography key={index}>
                                      {value.name}: {value.quantity}
                                    </Typography>
                                  ))
                                ) : (
                                  prop.inventory.quantity
                                )}
                              </Typography>
                            </div>
                          </td>
                          <td className={`${classes}`}>
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
                                {prop?.category?.name ? prop?.category?.name : "---"}
                              </Typography>
                            </div>
                          </td>
                          <td className={`${classes}`}>
                            <div className="w-max">
                              <select
                                value={prop.status}
                                onChange={(e) => {
                                  setApprovalState(e.target.value);
                                  setApprovalDialog(!approvalDialog);
                                  setApprovalProductId(prop.id);
                                  setSellerName(
                                    prop.vendor?.firstName + "" + prop.vendor?.lastName
                                  );
                                }}
                                className="border-2 rounded w-[110px]"
                              >
                                <option value="pending">Pending</option>
                                <option value="active">Approved</option>
                                <option value="inactive">Disapproved</option>
                              </select>
                            </div>
                          </td>
                          <td className={`${classes}`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {new Date(prop.createdAt).toLocaleString()}
                            </Typography>
                          </td>
                          <td className={`${classes}`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.updatedAt ? (
                                new Date(prop.updatedAt).toLocaleString()
                              ) : (
                                "---"
                              )}
                            </Typography>
                          </td>
                          <td className={`${classes}`}>
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
                    })
                  )}
                </tbody>
              </table>
            ) : isLoading ? (
                  [...Array(10)].map((_, index) => (
                      <tr key={index}>
                        {TABLE_HEAD.map((_, index) => (
                          <td
                            key={index}
                            className="p-4 border-b border-blue-gray-300 w-full animate-pulse"
                          >
                            <div className="h-4 bg-blue-gray-200 rounded"></div>
                          </td>
                        ))}
                      </tr>
                    ))
            ) : (
              <Typography className="text-black font-bold text-center my-4">
                {"There's No product"}
              </Typography>
            )}
          </CardBody>
          {data?.length > 0 && (
            <CardFooter className="flex flex-col sm:flex-row justify-center border-t border-blue-gray-50 p-4">
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
            color="red"
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
          <button
            onClick={() => handleDownload(imageToShow.productImage, imageToShow.title)}
          >
            <GrDownload />
          </button>
        </div>
        <DialogBody divider>
          <div className="grid gap-2">
            <img
              src={imageToShow.productImage}
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