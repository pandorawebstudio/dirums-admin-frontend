"use client";

import Sidebar from "../../../components/sidebar";
import { BASE_URL } from "../../../config";
import { ChevronUpDownIcon, PencilIcon } from "@heroicons/react/24/solid";
import { Button, CardFooter, Checkbox, Chip, IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const TABLE_HEAD = ["Code", "Type", "Amount", "Status", "Created At", "Updated At", "Edit"];

export default function Page() {
  const router = useRouter();
  const [coupons, setCoupons] = useState([]);
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (coupons?.length < 1) {
      fetch(`${BASE_URL}/dashboard/coupons/api?page=1`)
        .then((res) => res.json())
        .then((data) => {
          setCoupons(data.message.coupons);
          setPage(data.message.page);
          setNextPage(data.message.nextPage);
          setPrevPage(data.message.prevPage);
          setTotalPages(data.message.totalPages);
          setHasNextPage(data.message.hasNextPage);
          setHasPrevPage(data.message.hasPrevPage);
        });
    }
  }, []);

  const prevPages = () => {
    fetch(`${BASE_URL}/dashboard/coupons/api?page=${prevPage}`)
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
    fetch(`${BASE_URL}/dashboard/coupons/api?page=${nextPage}`)
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

  return (
    <Sidebar>
      <div className="flex flex-wrap justify-center items-start lg:p-4 mx-auto leading-5 text-zinc-800">
        <div className="flex items-center justify-end w-full">
          <Button
            className="my-6"
            onClick={() => router.push("/dashboard/coupons/create")}
          >
            Create new coupon
          </Button>
        </div>

        {coupons?.length == 0 ? (
          <div className="flex-grow flex-shrink mt-4 ml-4 basis-full">
            <div
              className="relative bg-white rounded-xl border-0 border-none sm:relative sm:rounded-xl sm:border-0 sm:border-none sm:border-zinc-800 overflow-clip border-zinc-800"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                outline: "rgba(0, 0, 0, 0) solid 1px",
              }}
            >
              <div className="relative rounded-none">
                <div className="rounded-none">
                  <div className="p-4 text-zinc-800 flex justify-center items-center flex-col shadow-lg">
                    <div className="overflow-x-visible overflow-y-visible w-64 min-w-0 max-w-none min-h-0 bg-opacity-[0]">
                      <div className="flex flex-col items-center">
                        <img
                          alt=""
                          src="https://cdn.shopify.com/shopifycloud/web/assets/v1/b8d201c5328e302a.svg"
                          className=""
                          role="presentation"
                        />
                        <div className="overflow-x-visible overflow-y-visible w-64 border-none border-zinc-800 outline-0 outline-zinc-800">
                          <div className="flex flex-col items-center">
                            <div className="overflow-x-visible overflow-y-visible w-64 max-w-none border-none border-zinc-800 outline-0 outline-zinc-800">
                              <div className="overflow-x-visible overflow-y-visible w-64 min-w-0 max-w-none min-h-0 border-none border-zinc-800 outline-0 outline-zinc-800">
                                <p className="block m-0 text-sm font-semibold text-center mt-4 mb-4">
                                  Manage discounts and promotions
                                </p>
                              </div>
                              <span className="block m-0 text-xs leading-4 text-center">
                                <p className="m-0 text-base font-normal">
                                  Create discount codes and automatic discounts
                                  that apply at checkout. You can also use
                                  discounts with
                                </p>
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center sm:gap-2 md:gap-2 lg:gap-2 mt-8">
                              <Button
                                type="button"
                                onClick={() =>
                                  router.push("/dashboard/coupons/create")
                                }
                              >
                                Create new coupon
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center m-5 w-full sm:m-5 sm:w-auto">
              <div
                className="text-sm font-normal text-zinc-800"
                style={{ letterSpacing: "normal" }}
              >
                Learn more about{" "}
                <a
                  href="https://help.shopify.com/en/manual/promoting-marketing/discount-codes?st_source=admin&amp;st_campaign=discounts_footer&amp;utm_source=admin&amp;utm_campaign=discounts_footer"
                  rel="noopener noreferrer"
                  target="_blank"
                  data-polaris-unstyled="true"
                  className="inline p-0 text-blue-700 bg-none border-0 appearance-none cursor-pointer"
                  aria-label="Learn more about discounts"
                  style={{ textDecoration: "underline" }}
                >
                  discounts
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            {coupons?.length > 0 ? (
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
                    {coupons?.map((prop, index) => {
                      const isLast = index === coupons?.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={index}>
                          {/* <td className={classes}>
                          <Checkbox value={prop.id} />
                          </td> */}
                          <td className={classes}>
                            <div className="flex items-center gap-3">
                            
                              <div className="flex flex-col">
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                >
                                  {prop.code}
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
                                {prop.type}
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
                                {prop.amount}{prop.type == 'fixed' ? " INR" : "%"}
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
                          <td className={`${classes} whitespace-normal break-words max-w-[150px]`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {new Date(prop.created_at).toLocaleString()}
                            </Typography>
                          </td>
                          <td className={`${classes} whitespace-normal break-words max-w-[150px]`}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {new Date(prop.updatedAt).toLocaleString()}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Tooltip content="Edit User">
                              <IconButton
                                variant="text"
                                onClick={() =>
                                  router.push("/dashboard/coupons/" + prop._id)
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
                {"There's No product"}
              </Typography>
            )}
          </>
        )}
        {coupons?.length > 0 && (
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
        )}
      </div>
    </Sidebar>
  );
}
