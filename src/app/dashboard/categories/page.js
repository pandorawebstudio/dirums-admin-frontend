/* eslint-disable @next/next/no-async-client-component */
"use client";

import React, { Suspense } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  PencilIcon,
  PlusCircleIcon,
  PlusIcon,
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
  DialogFooter,
  DialogBody,
  Dialog,
  DialogHeader,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import Sidebar from "../../../components/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../../../config";
import { useForm } from "react-hook-form";
import qs from 'qs';
import { useDebounce } from "use-debounce";
import ReactPaginate from "react-paginate";

const TABLE_HEAD = ["Name", "Parent", "Created At", "Updated At", "Edit/Delete"];

function SortableTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState([]);
  const [parent, setParent] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [parentCategory, setParentCategory] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [filterLimit, setFilterLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000);
  const [moveDown, setMoveDown] = useState(false);

  const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
  } = useForm();

  const search = () => {
    setIsLoading2(true);
    // Construct the query to search for categories with names containing the categoryName
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
  
    // Stringify the query object for use in the URL
    const stringifiedQuery = qs.stringify(
      {
        where: query,
      },
      {
        addQueryPrefix: true,
      }
    );
     
    // Fetch categories based on the constructed query
    fetch(`${API_URL}/api/category${stringifiedQuery}&page=${page}&limit=${filterLimit}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.docs.length > 0) {
          setData(data.docs);
          setPage(data.page);
          setNextPage(data.nextPage);
          setPrevPage(data.prevPage);
          setTotalPages(data.totalPages);
          setHasNextPage(data.hasNextPage);
          setHasPrevPage(data.hasPrevPage);
          setIsLoading2(false)
        }
      })
      .catch((error) => {
        setIsLoading2(false);
        console.log(error);
      });
  } 
  useEffect(() => {
    if (searchQuery2 || page || filterLimit) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&page=${page}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    search()
  }, [filterLimit, searchQuery2, page])

  useEffect(() => {
    fetch(`${API_URL}/api/category?limit=0`)
    .then(res => res.json())
    .then(data => setParent(data.docs));
  },[])


  const addNewCategory = (values) => {
    setIsLoading(true);
    fetch(`${BASE_URL}/dashboard/categories/api`, {
      method: "POST",
      body: JSON.stringify({
        name: values.newCateogry,
        parent: parentCategory,
      })
    })
      .then((res) => res.json())
      .then((data) => {
        reset();
        setOpen(!open);
        setIsLoading(false)
        search();
      });
  };

  const editCategory = (values) => {
    setIsLoading(true)
    fetch(`${BASE_URL}/dashboard/categories/api`, {
      method: "PATCH",
      body: JSON.stringify({
        name: values.newCateogry,
        parent: parentCategory,
        id: category.id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        reset();
        setEditOpen(!editOpen);
        setIsLoading(false);
        search();
      })
  };

  const deleteCategory = (values) => {
    setIsLoading(true)
    fetch(`${BASE_URL}/dashboard/categories/api`, {
      method: "DELETE",
      body: JSON.stringify({
        id: category,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false)
        setDeleteOpen(!deleteOpen);
        search();
      })
  };
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  All Product Categories
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all product categories
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                {/* <Button variant="outlined" size="sm">
                view all
              </Button> */}
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(!open)
                  }}
                >
                  <PlusCircleIcon strokeWidth={4} className="h-6 w-6" /> Add
                  Category
                </Button>
              </div>
            </div>
            <div className={`flex flex-col items-center justify-between gap-4 md:flex-row ${moveDown && "mb-32"}`}>
              {/* {data?.length > 0 && ( */}
                <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  onInput={(e) => setSearchQuery(e.target.value)}
                  defaultValue={searchQuery}
                  value={searchQuery}
                />
                </div>
                <div className="w-full md:w-72">
                  <Select
                    label="Filter by limit"
                    defaultValue={filterLimit}
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
                </div>
              {/* )} */}
            </div>
            <Button 
              className="float-right mt-2"
              onClick={() =>{
                setFilterLimit(10);
                // setPage(1);
                setSearchQuery("");
              }}
            >
              reset
            </Button>
          </CardHeader>
          <CardBody className="overflow-scroll p-0">
            {data?.length > 0 ? (
              <table className="mt-4 w-full min-w-max table-auto text-left">
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
                                      {prop?.parent?.name ?? "N/A"}
                                    </Typography>
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
                                  <Tooltip content="Edit Category">
                                    <IconButton
                                      variant="text"
                                      onClick={() => {
                                        setEditOpen(!editOpen),
                                          setCategory(prop);
                                        setParentCategory(prop?.parent?.id);
                                      }}
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip content="Delete Category">
                                    <IconButton
                                      variant="text"
                                      onClick={() => {
                                        setDeleteOpen(!deleteOpen),
                                          setCategory(prop.id);
                                      }}
                                    >
                                      <TrashIcon className="h-4 w-4" color="red" />
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
              </table>
            ) : (
              isLoading2 ? (
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
                {"There's No categories"}
                </Typography>
              )
              
            )}
          </CardBody>
          {data?.length > 0 && (
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
          )}
        </Card>
      </Sidebar>

      <Dialog open={open} handler={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <DialogHeader>Add new category</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={() => setOpen(!open)}
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
            <select
              className="peer mb-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-1 rounded-[7px] border-blue-gray-200"
              onChange={(e) => setParentCategory(e.target.value)}
            >
              <option>Select Parent category</option>
              {parent?.map((prop, index) => (
                <option value={prop.id} key={index}>
                  {prop.name}
                </option>
              ))}
            </select>
            <Input
              label="Enter new category name"
              name="newCateogry"
              {...register("newCateogry", {
                required: { value: true, message: "Category name is required" },
              })}
              error={errors?.newCateogry?.message ? true : false}
            />
            {errors?.newCateogry?.message && (
              <p className="text-sm text-red-500">
                {errors?.newCateogry?.message}
              </p>
            )}
            <div className="flex gap-3 flex-wrap items-center">
              {attributes?.map((item) => {
                <button className={selectedAttributes.includes(item.id) ? "bg-black text-white border border-black px-4 py-2" : "bg-white text-black border border-black px-4 py-2"} onClick={() => {selectedAttributes.includes(item.id) ? setSelectedAttributes(selectedAttributes.filter(data => data != item.id)) : setSelectedAttributes(prev => [...prev, item.id])}}>{item.name}</button>
              })}
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={() => setOpen(!open)}>
            close
          </Button>
          <Button
            variant="gradient"
            color="black"
            onClick={handleSubmit(addNewCategory)}
          >
            {isLoading ? (
              <Spinner className='mx-auto h-4 w-4'/>
            ):
            "Request new category"
}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={editOpen} handler={() => setEditOpen(!editOpen)}>
        <div className="flex items-center justify-between">
          <DialogHeader>Edit {category.name}</DialogHeader>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-3 h-5 w-5"
            onClick={() => setEditOpen(!editOpen)}
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
            <select
              className="peer mb-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-1 rounded-[7px] border-blue-gray-200"
              defaultValue={category?.parent?.id}
              onChange={(e) => setParentCategory(e.target.value)}
            >
              <option>Select Parent category</option>
              {parent?.map((prop, index) => (
                <option value={prop.id} key={index}>
                  {prop.name}
                </option>
              ))}
            </select>
            <Input
              label="Enter new category name"
              name="newCateogry"
              defaultValue={category.name}
              {...register("newCateogry", {
                required: { value: true, message: "Category name is required" },
              })}
              error={errors?.newCateogry?.message ? true : false}
            />
            {errors?.newCateogry?.message && (
              <p className="text-sm text-red-500">
                {errors?.newCateogry?.message}
              </p>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="outlined"
            color="red"
            onClick={() => setEditOpen(!editOpen)}
          >
            close
          </Button>
          <Button
            variant="gradient"
            color="black"
            onClick={handleSubmit(editCategory)}
          >
            {isLoading ? (
              <Spinner className='mx-auto h-4 w-4'/>
            ):
            "Save changes"
}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={deleteOpen} handler={() => setDeleteOpen(!deleteOpen)}>
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            Delete category?
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-16 w-16 text-red-500"
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clipRule="evenodd"
            />
          </svg>
          <Typography color="red" variant="h4">
            Are you seure you want to delete the category!
          </Typography>
          <Typography className="text-center font-normal">
           If you are unsure then click on <b>Close</b> to cancel it.
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={() => setDeleteOpen(!deleteOpen)}>
            close
          </Button>
          <Button variant="filled" color="red" onClick={deleteCategory}>
            {isLoading ? (
              <Spinner className='mx-auto h-4 w-4'/>
            ):
            "Delete"
}
          </Button>
        </DialogFooter>
      </Dialog>
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