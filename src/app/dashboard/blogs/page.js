/* eslint-disable @next/next/no-async-client-component */
'use client';

import React, { Suspense } from 'react';
import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import { PencilIcon, PlusCircleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
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
import { API_URL,BASE_URL } from "../../../config";
import ReactPaginate from 'react-paginate';
import { useDebounce } from "use-debounce";
import qs from 'qs';

   
  const TABLE_HEAD = ["Title", "Status", "Created", "Updated", "Edit"];
    
function SortableTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000);
  const [filterLimit, setFilterLimit] = useState(10);
  const [moveDown, setMoveDown] = useState(false);

  useEffect(() => {
    if (data?.length == 0) {
      setIsLoading(true);
      fetch(`${BASE_URL}/dashboard/blogs/api`)
        .then(res => res.json())
        .then(data => {
          setData(data.message.docs);
          setTotalPages(data.message.totalPages);
          setPage(data.message.page);
          setIsLoading(false);
        })
    }
  }, [])

  useEffect(() => {
    // Fetch data when the component mounts or when filter/sort/search parameters change
    search();
  }, [searchQuery2, page, filterLimit]);

  useEffect(() => {
    if (searchQuery2 || page || filterLimit) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&page=${page}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
  }, [searchQuery2, page, filterLimit, router]);

  const search = () => {
    setIsLoading(true);
    let query = {
      or: [
        {
          title: {
            contains: searchQuery2,
          },
        },
      ],
      and: [],
    };

    const stringified = qs.stringify(
      {
        where: query,
      },
      { addQueryPrefix: false }
    );

    fetch(`${BASE_URL}/dashboard/blogs/api?query=${stringified}&page=${page}&limit=${filterLimit}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.message.docs);
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setPrevPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching search data:", error);
        setIsLoading(false);
      });
  };


  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Blogs list
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all your blogs
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                {/* <Button variant="outlined" size="sm">
                  view all
                </Button> */}
                <Button className="flex items-center gap-2 !bg-black" size="sm" onClick={() => router.push("/dashboard/blogs/create")}>
                  <PlusCircleIcon strokeWidth={4} className="h-6 w-6" /> Add New Blog
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
              onClick={() => {
                setFilterLimit(10);
                setSearchQuery("");
              }}
            >
              reset
            </Button>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            {isLoading ? (
              // Shimmer effect for loading
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
                {data.length > 0 ? (
                  <>
                    <table className="mt-4 w-full table-auto text-left">
                      <thead>
                        <tr>
                          {TABLE_HEAD.map((head, index) => (
                            <th
                              key={head}
                              className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 text-center"
                            >
                              {/* <Typography
                                variant="small"
                                color="blue-gray"
                                className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                              > */}
                              {head}
                              {/* {index !== TABLE_HEAD.length - 1 && (
                                  <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                                )}
                              </Typography> */}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data?.map(
                          (prop, index) => {
                            const isLast = index === data?.length - 1;
                            const classes = isLast
                              ? "p-4"
                              : "p-4 border-b border-blue-gray-50";

                            return (
                              <tr key={index} className="text-center">
                                <td className={`${classes} whitespace-normal break-words max-w-[50px]`}>
                                  <div className="">
                                    {/* <Avatar src={prop.images[0].image.url} alt={prop.title} size="sm" /> */}
                                    <div className="flex flex-col">
                                      <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal"
                                      >
                                        {prop.title}
                                      </Typography>

                                    </div>
                                  </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[50px]`}>
                                  <div className="">
                                    {/* <Avatar src={prop.images[0].image.url} alt={prop.title} size="sm" /> */}
                                    <div className="flex flex-col">
                                      <Select
                                        label="Filter by approval"
                                        // value={filteraApprovalState}
                                        onChange={(e) => {
                                          console.log(e.target.value);
                                        }}
                                        onClick={() => setMoveDown(true)}
                                      >
                                        <Option value="active">Active</Option>
                                        <Option value="inactive">Inactive</Option>
                                      </Select>
                                    </div>
                                  </div>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[50px]`}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {new Date(prop.createdAt).toLocaleString()}
                                  </Typography>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[50px]`}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal"
                                  >
                                    {new Date(prop.updatedAt).toLocaleString()}
                                  </Typography>
                                </td>
                                <td className={`${classes} whitespace-normal break-words max-w-[50px]`}>
                                  <Tooltip content="Edit Blog">
                                    <IconButton variant="text" onClick={() => router.push('/dashboard/blogs/' + prop.id)}>
                                      <PencilIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                </td>
                              </tr>
                            );
                          },
                        )}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <Typography className="text-black font-bold text-center my-4">
                    {"There's No blogs"}
                  </Typography>
                )}
              </>
            )}
          </CardBody>
          <CardFooter className="flex justify-center border-t border-blue-gray-50 p-4">
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