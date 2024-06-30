/* eslint-disable @next/next/no-async-client-component */
"use client";

import React, { Suspense } from 'react';
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
  Avatar,
  IconButton,
  Tooltip,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import Sidebar from "../../../components/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../../../config";
import { MeiliSearch } from 'meilisearch';
import { useDebounce } from "use-debounce";
import qs from 'qs';
import ReactPaginate from "react-paginate";

const TABLE_HEAD = ["Name", "Email", "Phone Number", "Approval", "Status", "Created At", "Updated At"];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000);
  const [moveDown, setMoveDown] = useState(false);
  const [filterLimit, setFilterLimit] = useState(10);
  const [filteraApprovalState, setFilterApprovalState] = useState("");
  const [sort, setSort] = useState("");
  const [statusChange, setStatusChange] = useState({flag: false, i: null});

//   const search = () => {
//     const client = new MeiliSearch({ host: 'https://search.dirums.com', apiKey: 'YzM2ZjY1NzQ2MTk2NDNlNmMyMzhiZThj' })
//     client.index('customers').searchGet(searchQuery2).then(res => {
//       setData(res?.hits);
//         setPage(1);
//         setNextPage(res?.nextPage);
//         setPrevPage(res?.prevPage);
//         setTotalPages(res?.estimatedTotalHits);
//         setHasNextPage(res?.hasNextPage);
//         setHasPrevPage(res?.hasPrevPage);
//     })
//  }  

const updateStatus = (id, e, index) => {
  setStatusChange({flag: true, i: index});
  fetch(`${BASE_URL}/dashboard/customers/${id}/api`, {
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

 const search = (e) => {
  const query = {
    or: [

      {
        firstName: {
          contains: searchQuery2,
        },
      },
      {
        lastName: {
          contains: searchQuery2,
        },
      },
      {
        email: {
          contains: searchQuery2,
        },
      },
    ],
    and: [
      {
        role: {
          contains: "customer"
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

  const stringified = qs.stringify(
    {
      where: query,
      sort: sort,
    },
    { addQueryPrefix: false }
  );
  
  if(filteraApprovalState) {
    fetch(`${API_URL}/api/users?${stringified}`)
    .then((res) => res.json())
    .then((data) => {
      setData(data.docs);
      setPage(data.page);
      setTotalPages(data.totalPages);
    });
  }
  fetch(`${API_URL}/api/users?${stringified && stringified + '&'}page=${page}&limit=${filterLimit}`)
    .then((res) => res.json())
    .then((data) => {
      setData(data.docs);
      setPage(data.page);
      setTotalPages(data.totalPages);
    });
};

  useEffect(() => {
    if (searchQuery2 || page || filterLimit || filteraApprovalState || sort || statusChange) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&status=${filteraApprovalState}&sort=${sort}&page=${page}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    search();
  }, [filteraApprovalState, searchQuery2, sort, page, statusChange, filterLimit]);

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
 return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Customers
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all customers
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button variant="outlined" size="sm" 
                onClick={() => {
                  setSearchQuery("");
                  setFilterApprovalState("");
                  setSort('');
                  setFilterLimit(10);
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
                value={filteraApprovalState}
                onChange={(e) => {
                  setFilterApprovalState(e);
                  setMoveDown(false);
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
                value={filterLimit}
                onChange={(e) => {
                  setFilterLimit(e);
                  setMoveDown(false);
                  // setPage(1)
                }}
                onClick={() => setMoveDown(true)}
              >
                <Option value={25}>25</Option>
                <Option value={50}>50</Option>
                <Option value={100}>100</Option>
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
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
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
              <tbody >
                {data?.map((prop, index) => {
                  const isLast = index === data?.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={index}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={prop.profilePicture?.url || '/admin-logo.png'}
                            alt={prop.firstName}
                            size="sm"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/admin-logo.png';
                            }}
                            className="w-[30px] h-[30px]"
                            priority={true}
                          />
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.firstName && prop.lastName ? `${prop.firstName} ${prop.lastName}` : "No Name"}
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
                            {prop.email}
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
                            {prop.phoneNumber}
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
                      <td className={classes}>
                        <div className="flex justify-left">
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
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </>
          ):
          <Typography className="text-black font-bold text-center my-4">{"There's No customers"}</Typography>
              }
          </CardBody>
          <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
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
        </Card>
      </Sidebar>
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