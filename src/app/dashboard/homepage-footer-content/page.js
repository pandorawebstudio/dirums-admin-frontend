/* eslint-disable @next/next/no-async-client-component */
'use client';

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
   
  const TABLE_HEAD = ["Title", "Created", ""];
    
  export default function SortableTable() {
    const router = useRouter();
    const [data, setData] = useState([]);

    useEffect(() => {
      if(data?.length === 0){
        fetch(`${BASE_URL}/dashboard/homepage-footer-content/api`)
        .then(res => res.json())
        .then(data => setData(data.message.docs))
      }
    }, []);

    return (
        <Sidebar>
      <Card className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Homepage Footer Content list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all your homepage footer content
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {/* <Button variant="outlined" size="sm">
                view all
              </Button> */}
              <Button className="flex items-center gap-2 !bg-black" size="sm" onClick={() => router.push("/dashboard/homepage-footer-content/create")}>
                <PlusCircleIcon strokeWidth={4} className="h-6 w-6" /> Add New Homepage Footer Content
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {data?.length > 0 && (
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
            )}
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
                        <ChevronUpDownIcon strokeWidth={2} className="h-4 w-4" />
                      )}
                    </Typography>
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
                    <tr key={index}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          {/* <Avatar src={prop.images[0].image.url} alt={prop.title} size="sm" /> */}
                          <div className="flex flex-col">
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prop.headline}
                            </Typography>
                           
                          </div>
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
                        <Tooltip content="Edit User">
                          <IconButton variant="text" onClick={() => router.push('/dashboard/homepage-footer-content/'+prop.id)}>
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
          ):
          <Typography className="text-black font-bold text-center my-4">{"There's No Homepage footer content"}</Typography>
              }
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Previous
            </Button>
            <Button variant="outlined" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
      </Sidebar>
    );
  }