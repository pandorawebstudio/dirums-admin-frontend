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
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";
import Sidebar from "../../../components/sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { API_URL, BASE_URL } from "../../../config";
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

const TABLE_HEAD = ["Name", "Email", "Phone", "Status", "Created At"];

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
  const [filterLimit, setFilterLimit] = useState(10);
  const [moveDown, setMoveDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // if (data?.length == 0) {
  //   fetch(`${BASE_URL}/dashboard/signup-attempts/api`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if(data.code === 401) {
  //         router.push('/login');
  //       }
  //       setData(data.message.docs);
  //       setPage(data.message.page);
  //       setNextPage(data.message.nextPage);
  //       setPrevPage(data.message.prevPage);
  //       setTotalPages(data.message.totalPages);
  //       setHasNextPage(data.message.hasNextPage);
  //       setHasPrevPage(data.message.hasPrevPage);
  //     });
  // }

  // const search = (value) => {
  //   fetch(`${BASE_URL}/dashboard/signup-attempts/api/search?page=${nextPage}`)
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

    const stringified = qs.stringify(
      {
        where: query,
      },
      { addQueryPrefix: false }
    );

    fetch(`${BASE_URL}/dashboard/signup-attempts/api?query=${stringified }&page=${page}&limit=${filterLimit}`)
      .then((res) => res.json())
      .then((data) => {
        if(data.code === 401) {
          router.push('/login');
        }
        console.log(data)
        setData(data.message);
        setPage(data.message.page);
        setNextPage(data.message.nextPage);
        setPrevPage(data.message.prevPage);
        setTotalPages(data.message.totalPages);
        setHasNextPage(data.message.hasNextPage);
        setHasPrevPage(data.message.hasPrevPage);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (searchQuery2 || page || filterLimit) {
      // Construct the new URL with the updated query parameters
      const newUrl = `?q=${encodeURIComponent(searchQuery2)}&page=${page}&limit=${filterLimit}`;
      router.replace(newUrl, undefined, { shallow: true });
    }
    search();
  }, [filterLimit, searchQuery2, page]);
  return (
      <Sidebar>
        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-8 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  Signup Attempts
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  See information about all your signup attempts
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                {/* <Button variant="outlined" size="sm">
                  view all
                </Button> */}
              </div>
            </div>
            <div className={`flex flex-col items-center justify-between gap-4 md:flex-row ${moveDown && "mb-36"}`}>
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  onInput={(e) => setSearchQuery(e.target.value)}
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
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
                  }}
                  onClick={() => setMoveDown(true)}
                >
                  <Option value={25}>25</Option>
                  <Option value={50}>50</Option>
                  <Option value={100}>100</Option>
                </Select>
              </div>
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
                          <Chip variant="ghost" size="sm" value={prop.status} />
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ):
          <Typography className="text-black font-bold text-center my-4">{"There's No Signup attempts"}</Typography>
              }
          </CardBody>
          {data?.length > 0 && (
          <CardFooter className="flex justify-center border-t border-blue-gray-50 p-4">
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
          </CardFooter>
          )}
        </Card>
      </Sidebar>
  );
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <SortableTable />
    </Suspense>
  );
}