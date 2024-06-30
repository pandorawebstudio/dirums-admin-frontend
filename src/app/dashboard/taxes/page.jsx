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
import Sidebar from '../../../components/sidebar';
import React, { Suspense, useEffect, useState } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, Input, Chip, Tooltip, IconButton, Spinner } from '@material-tailwind/react'
import { API_URL, BASE_URL } from "../../../config";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from 'use-debounce';
import qs from 'qs'
import ReactPaginate from 'react-paginate'

const TABLE_HEAD = ["Name", "HSN", "Rate (%)", "Products", "Status", "Created", ""];

function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState([]);
  const [filteraApprovalState, setFilterApprovalState] = useState("");
  const [stringifiedQuery, setStringifiedQuery] = useState("");
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("-createdAt");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000)
  const search = (e) => {
    const query = {
      or: [
        {
          name: {
            contains: searchQuery2,
          },
        },
        {
          hsn: {
            contains: searchQuery2,
          },
        },
        {
          'products.title': {
            contains: searchQuery2,
          },
        },
        {
          'products.attributes.value': {
            contains: searchQuery2,
          },
        },
        {
          'products.category.name': {
            contains: searchQuery2,
          },
        },
      ],
      and: [],
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
  
    setStringifiedQuery(stringified);

    fetch(`${API_URL}/api/taxes?${stringified && stringified + '&'}page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.docs);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);
        setHasPrevPage(data.hasPrevPage);
      });
  };
  
  useEffect(() => {
    if (searchQuery2 || page || filteraApprovalState || sort) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&status=${filteraApprovalState}&sort=${sort}&page=${page}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    search();
  }, [filteraApprovalState, searchQuery2, sort, page]);
    

    useEffect(() => {
        fetch(`${BASE_URL}/dashboard/taxes/api`)
        .then(res => res.json())
        .then(data => setData(data.message.docs))
    },[])

  return (
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Taxes list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all your taxes
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                {/* <Button variant="outlined" size="sm">
              view all
            </Button> */}
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  onClick={() => router.push("/dashboard/taxes/create")}
                >
                  <PlusCircleIcon strokeWidth={4} className="h-6 w-6" /> Add
                  Tax
                </Button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 md:flex-row mt-20">

              <>
                <div className="w-full md:w-72">
                  <Input
                    label="Search"
                    onInput={(e) => setSearchQuery(e.target.value)}
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  />
                </div>

                {/* <div className="w-full md:w-72">
                  <Select
                  label="Filter by approval"
                    onChange={(e) => {
                      setFilterApprovalState(e);
                    }}
                    
                  >
                    <Option value="">All</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </div> */}
              </>

            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            {data?.length > 0 ? (
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
                    {data?.map((prop, index) => {
                      const isLast = index === data?.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={index}>
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {prop.name}
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
                                {prop.hsn}
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
                                {prop?.percentage}
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
                                {prop.products.length}
                              </Typography>
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
                            <Tooltip content="Edit Tax">
                              <IconButton
                                variant="text"
                                onClick={() =>
                                  router.push("/dashboard/taxes/" + prop.id)
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
                {"There's No taxes"}
              </Typography>
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
  )
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Page />
    </Suspense>
  );
}