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
} from "@material-tailwind/react";
import Sidebar from "../../../components/sidebar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BASE_URL } from "../../../config";

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

const TABLE_HEAD = ["Product Name", "Customer Message", "Own Message", "Approval", "Created At", "Updated At"];

export default function SortableTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  if (data?.length === 0) {
    fetch(`${BASE_URL}/dashboard/product-approval-logs/api`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if(data.code === 401) {
          router.push('/login');
        }
        setData(data.message.docs);
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setPrevPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
      });
  }

  const prevPages = () => {
    fetch(`${BASE_URL}/dashboard/product-approval-logs/api?page=${prevPage}`)
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
    fetch(`${BASE_URL}/dashboard/product-approval-logs/api?page=${nextPage}`)
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

  // const search = () => {
  //   fetch(`${BASE_URL}/dashboard/product-approval-logs/api/search?page=${nextPage}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setData(data.message.docs);
  //       setPage(data.message.page);
  //       setNextPage(data.message.nextPage);
  //       setPrevPage(data.message.prevPage);
  //       setTotalPages(data.message.totalPages);
  //       setHasNextPage(data.message.hasNextPage);
  //       setHasPrevPage(data.message.hasPrevPage);
  //     });
  // };
  return (
    <Sidebar>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Product Approval Message logs
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all your prodcut approval message logs
              </Typography>
            </div>
          </div>
          {/* <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {data?.length > 0 && (
            <div className="w-full md:w-72">
              <Input
                label="Search"
                onInput={search}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            )}
          </div> */}
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
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
                  ? "p-4 border-2 whitespace-normal break-words max-w-[150px]"
                  : "p-4 border-2 whitespace-normal break-words max-w-[150px]";

                return (
                  <tr key={index}>
                    <td className={`${classes}`}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {prop.product.title}
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
                          {prop.customerMessage}
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
                          {prop.message}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip 
                          variant="ghost" 
                          size="sm" 
                          color={prop.status === "active" ? "green" : "amber"}
                          value={
                            prop.status  === "active" ? "Approved" : 
                            prop.status === "inactive" ? "Disapproved" : 
                            "Pending"} 
                        />
                      </div>
                    </td>
                    <td className={`${classes} `}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {new Date(prop.createdAt).toLocaleString()}
                      </Typography>
                    </td>
                    <td className={`${classes} `}>
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
        )
        :
          <Typography className="text-black font-bold text-center my-4">
            {"There's No Product Approval Message logs"}
          </Typography>
        }
        </CardBody>
        {data?.length > 0 && (
        <CardFooter className="flex items-center justify-between p-4">
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
  );
}
