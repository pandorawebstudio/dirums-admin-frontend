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
  Select,
  Option,
} from "@material-tailwind/react";
import Sidebar from "../../../components/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../../../config";
import { useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";
import qs from 'qs';
import ReactPaginate from "react-paginate";

const TABS = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Active",
    value: "active",
  },
  {
    label: "Pending",
    value: "pending",
  },
];

const TABLE_HEAD = ["Name", "Slug", "Link", "Status", "Created At", "Updated At", "Edit"];

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
  const [approvalPageId, setApprovalPageId] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000);
  const [featureStatus, setFeatureStatus] = useState(false);
  const [filteraApprovalState, setFilterApprovalState] = useState(false);
  const [filterLimit, setFilterLimit] = useState(10);
  const [moveDown, setMoveDown] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const editApprovalDetails = (values) => {
    setIsLoading(true)
    fetch(`${BASE_URL}/dashboard/pages/api/approval?${featureStatus}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: approvalPageId,
        // status: values.approval,
        // ownMessage: values.ownMessage,
        message: values.message
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setApprovalDialog(!approvalDialog);
        setSuccessMessage(data.message.message);
        search();
        setIsLoading(false)
        setSuccess(true);
        reset()
        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      })
  }

  const search = (e) => {
    setIsLoading(true)
    let query = {
      or: [
        {
          name: {
            contains: searchQuery2,
          },
        },
      ],
      and: [],
    };

    // Add the status filter only if filterApprovalState is not empty
    if (filteraApprovalState) {
      query.and.push({
        featured: {
          equals: filteraApprovalState,
        }
      });
    }

    const stringified = qs.stringify(
      {
        where: query,
      },
      { addQueryPrefix: false }
    );

    fetch(`${API_URL}/api/page?${stringified }&page=${page}&limit=${filterLimit}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.docs);
        setPage(data.page);
        setNextPage(data.nextPage);
        setPrevPage(data.prevPage);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);
        setHasPrevPage(data.hasPrevPage);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (searchQuery2 || page || filterLimit || filteraApprovalState) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&featured=${filteraApprovalState}&page=${page}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    search();
  }, [filteraApprovalState, filterLimit, searchQuery2, page]);
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Pages list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all your pages
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                {/* <Button variant="outlined" size="sm">
                view all
              </Button> */}
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  variant="outlined"
                  onClick={() => router.push("/dashboard/pages/create")}
                >
                  <PlusCircleIcon strokeWidth={4} className="h-6 w-6" /> Create New
                  Page
                </Button>
              </div>
            </div>
              <div className={`flex flex-col items-center justify-between gap-4 md:flex-row ${moveDown && "mb-36"}`}>
                <div className="w-full md:w-72">
                  <Input
                    label="Search"
                    value={searchQuery}
                    onInput={(e) => setSearchQuery(e.target.value)}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                </div>
                <div className="w-full md:w-72">
                  <Select
                    label="Filter by status"
                    value={filteraApprovalState}
                    onChange={(e) => {
                      setFilterApprovalState(e);
                      setMoveDown(false);
                    }}
                    onClick={() => setMoveDown(true)}
                  >
                    <Option value="">All</Option>
                    <Option value="true">Active</Option>
                    <Option value="false">Inactive</Option>
                  </Select>
                </div>
                <div className="w-full md:w-72">
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
              variant="outlined"
              onClick={() =>{
                setFilterApprovalState(false);
                setFilterLimit(10);
                setSearchQuery("");
              }}
            >
              reset
            </Button>
          </CardHeader>
          <CardBody className="overflow-scroll p-0">
            {data?.length > 0 ? (
                <table className="mt-4 w-full table-auto text-left">
                  <tbody>
                    {isLoading ? (
                      // Shimmer effect for loading
                      <>
                        {[...Array(filterLimit)].map((_, index) => (
                          <tr key={index}>
                            {TABLE_HEAD.map((_, index) => (
                              <td
                                key={index}
                                className="p-4 border-b border-blue-gray-300 animate-pulse"
                              >
                                <div className="h-4 bg-blue-gray-200 rounded"></div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ) : (
                      // Render actual data
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
                          {data?.map((prop, index) => {
                            const isLast = index === data?.length - 1;
                            const classes = isLast
                              ? "p-4 border-2"
                              : "p-4 border-2";
                            return (
                              <tr key={index} >
                                <td className={`${classes} whitespace-normal break-words max-w-[150px]`}> {/* Adjust the max-width value as needed */}
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {prop.name}
                                  </Typography>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[150px]`}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {prop.slug}
                                  </Typography>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[150px]`}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {prop.link}
                                  </Typography>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[150px]`}>
                                  <div className="flex justify-center">
                                    <select
                                      label="Select"
                                      defaultValue={prop?.featured}
                                      value={prop?.featured}
                                      onChange={(e) => {
                                        setApprovalDialog(!approvalDialog);
                                        setApprovalPageId(prop.id);
                                        setFeatureStatus(!prop?.featured);
                                      }}
                                      className={`w-full border-2 border-gray-500 h-8 rounded`}
                                    >
                                      <option value={true}>Active</option>
                                      <option value={false}>Inactive</option>
                                    </select>
                                    {/* <Switch
                                color="green"
                                defaultChecked={prop?.featured}
                                onChange={() => {
                                  setApprovalDialog(!approvalDialog);
                                  setApprovalPageId(prop.id);
                                  setFeatureStatus(!prop?.featured);
                                }}
                              /> */}
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
                                <td className={classes}>
                                  <Tooltip content="Edit Page">
                                    <IconButton
                                      variant="text"
                                      onClick={() =>
                                        router.push("/dashboard/pages/" + prop.id)
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
                    )}
                  </tbody>
                </table>
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
                              <div className="h-4 bg-blue-gray-200 rounded "></div>
                            </td>
                          ))}
                        </tr>
                      ))}
                </>
              ) : (
                <Typography className="text-black font-bold text-center my-4">
                {"There's No pages"}
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

      <Dialog open={approvalDialog} handler={() => setApprovalDialog(!approvalDialog)}>
        <div className="flex items-center justify-between">
          <DialogHeader>Page approval log</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={() => {
              setApprovalDialog(!approvalDialog);
            }}
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
            {/* <label className="font-bold text-sm">Approval Own Message</label>
            <select
              {...register("ownMessage", { required: true })}
              className="peer mb-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-1 rounded-[7px] border-blue-gray-200"
            >
              <option>Select approval state</option>
              <option value={"approved"}>Approved</option>
              <option value={"disapproved"}>Disapproved</option>
              <option value={"inactive"}>Inactive</option>
            </select>
            {errors?.approval?.message && (
              <p className="text-sm text-red-500">
                {errors?.ownMessage?.message}
              </p>
            )} */}
            <label className="font-bold text-sm">Approval Page message</label>
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
            ) :
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