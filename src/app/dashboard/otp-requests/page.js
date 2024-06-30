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
import { useEffect, useState } from "react";
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

const TABLE_HEAD = ["Issued To", "OTP", "Status", "Created At", "Expiry At"];

//   const TABLE_ROWS = [
//     {
//       img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
//       name: "John Michael",
//       email: "john@creative-tim.com",
//       job: "Manager",
//       org: "Organization",
//       online: true,
//       date: "23/04/18",
//     },
//     {
//       img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
//       name: "Alexa Liras",
//       email: "alexa@creative-tim.com",
//       job: "Programator",
//       org: "Developer",
//       online: false,
//       date: "23/04/18",
//     },
//     {
//       img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
//       name: "Laurent Perrier",
//       email: "laurent@creative-tim.com",
//       job: "Executive",
//       org: "Projects",
//       online: false,
//       date: "19/09/17",
//     },
//     {
//       img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
//       name: "Michael Levi",
//       email: "michael@creative-tim.com",
//       job: "Programator",
//       org: "Developer",
//       online: true,
//       date: "24/12/08",
//     },
//     {
//       img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
//       name: "Richard Gran",
//       email: "richard@creative-tim.com",
//       job: "Manager",
//       org: "Executive",
//       online: false,
//       date: "04/10/21",
//     },
//   ];

export default function SortableTable() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");

  useEffect(() => {
    fetchData();
  }, [searchPhoneNumber]);

  const fetchData = (pageToFetch = 1) => {
    const params = new URLSearchParams({
      page: pageToFetch,
      limit: 10,
      phoneNumber: searchPhoneNumber,
    });

    fetch(`${BASE_URL}/dashboard/otp-requests/api?${params.toString()}`)
      .then((res) => {
        console.log("Response:", res);
        return res.json();
      })
      .then((data) => {
        console.log("Data:", data); // Log the parsed JSON data
        if (data.code === 401) {
          router.push("/login");
        }
        setData(data.message.data);
        setPage(data.message.pagination.page);
        setNextPage(data.message.pagination.nextPage);
        setPrevPage(data.message.pagination.prevPage);
        setTotalPages(data.message.pagination.totalPages);
        setHasNextPage(data.message.pagination.hasNextPage);
        setHasPrevPage(data.message.pagination.hasPrevPage);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const prevPages = () => {
    fetchData(prevPage);
  };

  const nextPages = () => {
    fetchData(nextPage);
  };

  return (
    <Sidebar>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                OTP requests
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all OTP requests
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {/* <Button variant="outlined" size="sm">
                view all
              </Button> */}
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* {data?.length > 0 && ( */}
              <div className="w-full md:w-72">
                <Input
                  label="Search by Phone Number"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchPhoneNumber}
                  onChange={(e) => setSearchPhoneNumber(e.target.value)}
                  onKeyDown={(e) =>e.key === 'Enter' && fetchData()}
                />
              </div>
            {/* )} */}
          </div>
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
                              {prop.user_id.phoneNumber}
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
                            {prop.otp}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <div className="w-max">
                          <Chip
                            variant="ghost"
                            color={prop.expired ? "green" : "amber"}
                            size="sm"
                            value={
                              prop.status = "sent_sms" ? "OTP Verification pending" : "OTP verifed"
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
                          {new Date(prop.created_at).toLocaleString()}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {new Date(prop.expires_at).toLocaleString()}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) :
            <Typography className="text-black font-bold text-center my-4">{"There's No OTP requests"}</Typography>
          }
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
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
      </Card>
    </Sidebar>
  );
}
