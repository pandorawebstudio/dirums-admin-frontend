/* eslint-disable @next/next/no-async-client-component */
"use client";

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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../../../config";
import { useFieldArray, useForm } from "react-hook-form";
import qs from "qs";
import { useDebounce } from "use-debounce";

export default function SortableTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [attribute, setAttribute] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [parentCategory, setParentCategory] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [attributeValues, setAttributeValues] = useState([]);
  const [filterLimit, setFilterLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2] = useDebounce(searchQuery, 1000);
  const [moveDown, setMoveDown] = useState(false);

  const TABLE_HEAD = ["Name", "Type", "Created At", "Edit/Delete"];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    control: control2
  } = useForm();

  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "values",
  });

  const { fields: fields2, append: append2, remove: remove2 } = useFieldArray({
    control: control2,
    name: "values",
  });

  const search = () => {
    // Construct the query to search for attributes with names containing the attributeName
    const query = {
      name: {
        contains: searchQuery2,
      },
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

    // Fetch attribute based on the constructed query
    fetch(`${API_URL}/api/attribute${stringifiedQuery}&limit=${filterLimit}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.docs);
        setPage(data.page);
        setNextPage(data.nextPage);
        setPrevPage(data.prevPage);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);
        setHasPrevPage(data.hasPrevPage);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  useEffect(() => {
    if (searchQuery2 || page || filterLimit) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&page=${page}&limit=${filterLimit}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    search();
  }, [filterLimit, page, searchQuery2, deleteOpen, open, editOpen]);

  const prevPages = () => {
    fetch(`${BASE_URL}/dashboard/attributes/api?page=${prevPage}`)
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
    fetch(`${BASE_URL}/dashboard/attributes/api?page=${nextPage}`)
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

  const addNewAttribute = (values) => {
    const fd = new FormData();
    fd.append('name', values.newAttribute);
    fd.append('type', values.type);
    fd.append('valueType', values.valueType)
    {attributeValues.map((prop, index) => {
        fd.append(`values.${index}.name`, prop.name);
    })}
    setIsLoading(true);
    fetch(`${BASE_URL}/dashboard/attributes/api`, {
      method: "POST",
      body: fd
    })
      .then((res) => res.json())
      .then((data) => {
        setOpen(!open);
        setIsLoading(false);
        reset();
      });
  };

  const editAttribute = (values) => {
    const fd = new FormData();
    fd.append('name', values.newAttribute);
    fd.append('type', values.type);
    fd.append('id', attribute.id);
    {fields2?.map((prop, index) => {
        fd.append(`values.${index}.name`, prop.name);
    })}
    setIsLoading(true);
    fetch(`${BASE_URL}/dashboard/attributes/api`, {
      method: "PATCH",
      body: fd
    })
      .then((res) => res.json())
      .then((data) => {
        setEditOpen(!editOpen);
        setIsLoading(false);
      });
  };

  const deleteAttribute = (values) => {
    setIsLoading(true);
    fetch(`${BASE_URL}/dashboard/attributes/api`, {
      method: "DELETE",
      body: JSON.stringify({
        id: attribute,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setDeleteOpen(!deleteOpen);
      });
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributesValues = [...attributeValues];
    updatedAttributesValues[index] = {
      ...updatedAttributesValues[index],
      [field]: value,
    };
    
    setAttributeValues(updatedAttributesValues);

  };
  return (
    <>
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  All Product Attributes
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all product attributes
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  className="flex items-center gap-2"
                  size="sm"
                  onClick={() => {
                    setOpen(!open);
                    append({ name: "" });
                  }}
                >
                  <PlusCircleIcon strokeWidth={4} className="h-6 w-6" /> Add
                  Attribute
                </Button>
              </div>
            </div>
            <div className={`flex flex-col items-center justify-between gap-4 md:flex-row ${moveDown && "mb-36"}`}>
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
            </div>
            <Button
              className="float-right mt-2"
              onClick={() => {
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
                              {prop?.type ?? "N/A"}
                            </Typography>
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
                          <Tooltip content="Edit Category">
                            <IconButton
                              variant="text"
                              onClick={() => {
                                setEditOpen(!editOpen), setAttribute(prop);
                                prop.values.map((item) => {append2({name: item.name})})
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
                                  setAttribute(prop.id);
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
            ) : (
              <Typography className="text-black font-bold text-center my-4">
                {"There's No product attributes"}
              </Typography>
            )}
          </CardBody>
          <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
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
      </Sidebar>

      <Dialog open={open} handler={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <DialogHeader>Add new Attribute</DialogHeader>
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
            <Input
              label="Enter new attribute name"
              name="newAttribute"
              {...register("newAttribute", {
                required: {
                  value: true,
                  message: "Attribute name is required",
                },
              })}
              error={errors?.newAttribute?.message ? true : false}
            />
            {errors?.newAttribute?.message && (
              <p className="text-sm text-red-500">
                {errors?.newAttribute?.message}
              </p>
            )}
          </div>
          <select
            className="peer mt-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
            {...register('type', {required: {value: true, message: "Attribute type is required"}})}
          >
            <option>Select Attribute type</option>
            <option value={"input"}>Input</option>
            <option value={"select"}>Select</option>
            <option value={"checkbox"}>Checkbox</option>
          </select>
          <select
            className="peer mt-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
            {...register('valueType', {required: {value: true, message: "Attribute value type is required"}})}
          >
            <option>Select value type</option>
            <option value={"number"}>Number</option>
            <option value={"text"}>Text</option>
            <option value={"checkbox"}>Checkbox</option>
          </select>
          <hr className="my-4 border-gray-500" />
          {fields?.map((prop, index) => (
            <div key={index} className="my-2">
              <div className="flex gap-2 w-full">
                <Input
                  label="Enter new Attribute value"
                  defaultValue={prop.name}
                  {...register(`values.${index}.name`, {
                    required: {
                      value: true,
                      message: "Attribute value is required",
                    },
                  })}
                  onBlur={(e) => handleAttributeChange(index, "name", e.target.value)}
                  error={errors?.newAttribute?.message ? true : false}
                />
                {index !== 0 && (
                <Tooltip content="Delete attribute value">
                  <IconButton
                    variant="text"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" color="red" />
                  </IconButton>
                </Tooltip>
                )}
              </div>
              {errors?.newAttribute?.message && (
                <p className="text-sm text-red-500">
                  {errors?.newAttribute?.message}
                </p>
              )}
            </div>
          ))}
          <Button
            onClick={() => append({ name: "" })}
            className="flex gap-2 mt-2"
          >
            <PlusIcon className="w-4 h-4" /> Add New Value
          </Button>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" color="red" onClick={() => setOpen(!open)}>
            close
          </Button>
          <Button
            variant="gradient"
            color="black"
            onClick={handleSubmit(addNewAttribute)}
          >
            {isLoading ? (
              <Spinner className="mx-auto h-4 w-4" />
            ) : (
              "Create new attribute"
            )}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={editOpen} handler={(e) => {
        e.preventDefault();
        setEditOpen(!editOpen);
        }}>
        <div className="flex items-center justify-between">
          <DialogHeader>Edit {attribute.name}</DialogHeader>
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
            <Input
              label="Enter new category name"
              name="newAttribute"
              defaultValue={attribute.name}
              {...register2("newAttribute", {
                required: {
                  value: true,
                  message: "Attribute name is required",
                },
              })}
              error={errors2?.newAttribute?.message ? true : false}
            />
            {errors2?.newAttribute?.message && (
              <p className="text-sm text-red-500">
                {errors2?.newAttribute?.message}
              </p>
            )}
          </div>
          <select
          defaultValue={attribute.type}
            className="peer mt-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
            {...register2('type', {required: {value: true, message: "Attribute type is required"}})}
          >
            <option>Select Attribute type</option>
            <option value={"input"}>Input</option>
            <option value={"select"}>Select</option>
            <option value={"checkbox"}>Checkbox</option>
          </select>
          <select
            className="peer mt-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
            {...register('type', {required: {value: true, message: "Attribute value type is required"}})}
          >
            <option>Select value type</option>
            <option value={"input"}>Number</option>
            <option value={"select"}>Text</option>
            <option value={"checkbox"}>Checkbox</option>
          </select>
          <hr className="my-4 border-gray-500" />
          {fields2?.map((prop, index) => (
            <div key={index} className="my-2">
              <div className="flex gap-2 w-full">
                <Input
                  label="Enter new Attribute value"
                  defaultValue={prop.name}
                  {...register2(`values.${index}.name`, {
                    required: {
                      value: true,
                      message: "Attribute value is required",
                    },
                  })}
                  onBlur={(e) => {fields2[index]['name'] = e.target.value}}
                  error={errors2?.newAttribute?.message ? true : false}
                />
                {index !== 0 && (
                <Tooltip content="Delete attribute value">
                  <IconButton
                    variant="text"
                    onClick={() => {
                      remove2(index);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" color="red" />
                  </IconButton>
                </Tooltip>
                )}
              </div>
              {errors2?.newAttribute?.message && (
                <p className="text-sm text-red-500">
                  {errors2?.newAttribute?.message}
                </p>
              )}
            </div>
          ))}
          <Button
            onClick={() => append2({ name: "" })}
            className="flex gap-2 mt-2"
          >
            <PlusIcon className="w-4 h-4" /> Add New Value
          </Button>
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
            onClick={handleSubmit2(editAttribute)}
          >
            {isLoading ? (
              <Spinner className="mx-auto h-4 w-4" />
            ) : (
              "Save changes"
            )}
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
            Are you seure you want to delete this attribute!
          </Typography>
          <Typography className="text-center font-normal">
            If you are unsure then click on <b>Close</b> to cancel it.
          </Typography>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setDeleteOpen(!deleteOpen)}
          >
            close
          </Button>
          <Button variant="filled" color="red" onClick={deleteAttribute}>
            {isLoading ? <Spinner className="mx-auto h-4 w-4" /> : "Delete"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
