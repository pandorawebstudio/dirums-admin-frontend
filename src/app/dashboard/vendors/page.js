/* eslint-disable @next/next/no-async-client-component */
"use client";

import React, { Suspense } from 'react';
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { saveAs } from 'file-saver';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  PlusCircleIcon,
  UserPlusIcon,
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
  DialogBody,
  Dialog,
  DialogHeader,
  DialogFooter,
  Avatar,
  IconButton,
  Tooltip,
  Select,
  Option,
  Spinner
} from "@material-tailwind/react";
import Sidebar from "../../../components/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../../../config";
import { MeiliSearch } from 'meilisearch';
import ReactPaginate from 'react-paginate';
import qs from 'qs';
import { useDebounce } from 'use-debounce';
import { GrDownload } from "react-icons/gr";
import Link from 'next/link';

const TABLE_HEAD = ["Image", "Name", "oldUserId", "Email", "Phone Number", "Approval", "Created At", "Updated At", "Edit"];

const searchClient = new MeiliSearch({
  host: 'https://search.dirums.com',
  apiKey: 'YzM2ZjY1NzQ2MTk2NDNlNmMyMzhiZThj'
});

// Configure sortable and filterable attributes
const index = searchClient.index('users');

Promise.all([
  index.updateFilterableAttributes(['role', 'status']),
  index.updateSortableAttributes(['createdAt', 'updatedAt'])
])
  .then(() => {
    console.log('Filterable and sortable attributes updated');
  })
  .catch((error) => {
    console.error('Error updating attributes:', error);
  });

function SortableTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [filterApprovalState, setFilterApprovalState] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000);
  const [statusChange, setStatusChange] = useState({flag: false, i: null});
  const [moveDown, setMoveDown] = useState(false);
  const [filterLimit, setFilterLimit] = useState("10");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageToShow, setImageToShow] = useState({});

  const updateStatus = (id, e, index) => {
    setStatusChange({flag: true, i: index});
    fetch(`${BASE_URL}/dashboard/vendors/${id}/api`, {
      method: "PATCH",
      body: JSON.stringify({
        _id: id,
        status: e,
      }),
    })
      .then((res) => {
        res.json();
        setStatusChange({flag: false, i: null});
      })
  }

  const search = async () => {
    const searchWords = searchQuery2.trim().split(/\s+/);
    const filterConditions = searchWords.map(word => `(firstName="${word}" OR lastName="${word}" OR email="${word}")`);
  
    const searchFilters = [`role="seller"`];
    if (filterApprovalState) {
      searchFilters.push(`status="${filterApprovalState}"`);
    }
  
    const searchQuery = filterConditions.length > 0 ? filterConditions.join(' OR ') : '';
    const filters = searchFilters.join(' AND ');
  
    const searchParams = {
      q: searchQuery || undefined,
      filter: filters,
      sort: sort ? [sort] : undefined,
      limit: 1000
    };
  
    const result = await searchClient.index('users').search(searchQuery, searchParams);
    setData(result.hits);
  };

  useEffect(() => {
    search();
  }, [searchQuery2]);


  
  const withouSearch = (e) => {
    const query = {
      and: [
        {
          role: {
            contains: "seller"
          }
        }
      ],
    };
  
    // Add the status filter only if filterApprovalState is not empty
    if (filterApprovalState) {
      query.and.push({
        status: {
          equals: filterApprovalState,
        },
      });
    }
  
    const stringified = qs.stringify(
      {
        where: query,
        // sort: sort,
      },
      { addQueryPrefix: false }
    );

    if(filterApprovalState) {
      fetch(`${API_URL}/api/users?${stringified}&page=${page}&limit=${filterLimit}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.docs);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);
        setHasPrevPage(data.hasPrevPage);
      });
    } 
    else {
      fetch(`${API_URL}/api/users?${stringified && stringified + '&'}page=${page}&limit=${filterLimit}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.docs);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);
        setHasPrevPage(data.hasPrevPage);
      });
    }
    
  };
  
  useEffect(() => {
    if (page || filterLimit || filterApprovalState || sort || statusChange) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=status=${filterApprovalState}&sort=${sort}&page=${page}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    withouSearch();
  }, [filterApprovalState, sort, page, statusChange, filterLimit]);

  const Reset = () => {
    return (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
          />
        </svg>
      </div>
    )
  };

  // Add a function to handle the download action
  const handleDownload = (imageUrl, fileName) => {
    if (imageUrl) {
      // Extract the file extension from the URL
      const fileExtension = imageUrl.split('.').pop();
      // Define the filename for the downloaded file
      const downloadedFileName = `${fileName}-profile.${fileExtension}`;
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
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Vendors
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all vendors
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button variant="outlined" size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterApprovalState("");
                    setSort('');
                    setFilterLimit("10");
                  }}>
                  Reset
                </Button>
              </div>
            </div>
            <div className={`flex flex-col items-center justify-between md:flex-row ${moveDown && 'pb-48'} space-x-2`}>
              <div className="w-full flex flex-row space-x-2">
                <Input
                  label="Search"
                  value={searchQuery}
                  onInput={(e) => setSearchQuery(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
                <Button variant="outlined" size="sm"
                  onClick={() => {
                    setSearchQuery("");
                  }}>
                  <Reset />
                </Button>
              </div>
              <div className="w-full relative flex flex-row space-x-2">
                <Select
                  label="Filter by approval"
                  value={filterApprovalState}
                  onChange={(e) => {
                    setFilterApprovalState(e);
                    setMoveDown(false);
                    // setPage(1);
                    setSort("-created")
                  }}
                  onClick={() => setMoveDown(true)}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
                <Button variant="outlined" size="sm"
                  onClick={() => {
                    setFilterApprovalState("");
                  }}>
                  <Reset />
                </Button>
              </div>
              <div className="w-full flex flex-row space-x-2">
                <Select
                  label="Sort By"
                  value={sort}
                  onChange={(e) => {
                    setSort(e);
                    setMoveDown(false);
                  }}
                  onClick={() => setMoveDown(true)}
                >
                  <Option value="-createdAt">Newest</Option>
                  <Option value="createdAt">Oldest</Option>
                </Select>
                <Button variant="outlined" size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterApprovalState('');
                    setSort('');
                  }}>
                  <Reset />
                </Button>
              </div>
              <div className="w-full flex flex-row space-x-2">
                <Select
                  label="Filter by limit"
                  disabled={!hasNextPage}
                  value={filterLimit}
                  defaultValue={filterLimit}
                  onChange={(e) => {
                    setFilterLimit(e);
                    setMoveDown(false);
                    // setPage(1)
                  }}
                  onClick={() => setMoveDown(true)}
                >
                  <Option value={"10"}>10</Option>
                  <Option value={"25"}>25</Option>
                  <Option value={"50"}>50</Option>
                  <Option value={"100"}>100</Option>
                </Select>
                <Button variant="outlined" size="sm"
                  onClick={() => {
                    setFilterLimit(10);
                  }}>
                  <Reset />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            {data?.length > 0 ? (
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
                    {data?.map((prop, index) => {
                      const isLast = index === data?.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={index} className="text-center">
                          <td className={classes}>
                            <Avatar
                              src={prop.profilePicture?.url || '/admin-logo.png'}
                              alt={prop.firstName}
                              size="sm"
                              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 xxl:w-24 xxl:h-24 cursor-pointer"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/admin-logo.png';
                              }}
                              onClick={() => {
                                setShowImageDialog(true);
                                setImageToShow({ profilePicture: prop?.profilePicture?.url, firstName: prop.firstName });

                              }}
                              priority={true}
                            />
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.firstName && prop.lastName ? `${prop.firstName} ${prop.lastName}` : "No Name"}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.oldUserId ?
                                (
                                  <>
                                    {prop.oldUserId}
                                  </>
                                ) : (
                                  "--"
                                )}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {prop?.email}
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
                                {prop?.phoneNumber}
                              </Typography>
                            </div>
                          </td>
                          <td className={classes}>
                            <div className="w-max">
                              <Select
                                value={prop?.status}
                                onChange={(e) => {
                                  updateStatus(prop.id, e, index)
                                }}
                              >
                                <Option value="pending">Pending</Option>
                                <Option value="active">Active</Option>
                                <Option value="inactive">Inactive</Option>
                              </Select>
                            </div>
                          </td>
                          {/* <td className={classes}>
                      <div className=" flex justify-center">
                        {statusChange && statusChange.i === index ? <span><Spinner className="h-4 w-4"/></span> : (
                          <Chip
                          variant="ghost"
                          size="sm"
                          value={prop.status}
                          color={
                            prop.status === "active" ? "green" : prop.status === "inactive" ? "red" : "amber"
                          }
                        />
                        )}
                      </div>
                    </td> */}
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {new Date(prop?.createdAt).toLocaleString()}
                            </Typography>
                          </td>
                          <td className={`${classes}`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.updatedAt ?
                                (
                                  <>
                                    {new Date(prop.updatedAt).toLocaleString()}
                                  </>
                                ) : (
                                  "--"
                                )}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Tooltip content="Edit Vendor">
                              <Link href={`/dashboard/vendors/${prop.id}`} target="_blank">
                                <IconButton
                                  variant="text"
                                >
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
            ) :
              <Typography className="text-black font-bold text-center my-4">{"There's No vendors"}</Typography>
            }
          </CardBody>
          <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
            {/* <Typography variant="small" color="blue-gray" className="font-normal">
            Page {page} of {totalPages}
          </Typography> */}
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
            onClick={() => handleDownload(imageToShow.profilePicture, imageToShow.firstName)}
          >
            <GrDownload />
          </button>
        </div>
        <DialogBody divider>
          <div className="grid gap-2">
            <img
              src={imageToShow.profilePicture}
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
    </>
  );
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <SortableTable />
    </Suspense>
  );
}
