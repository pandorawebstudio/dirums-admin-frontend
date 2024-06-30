"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from '../../../components/sidebar';
import { API_URL, BASE_URL } from '../../../config';
import { Alert, Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Option, Select, Spinner, Typography } from '@material-tailwind/react';
import { useForm } from "react-hook-form";

function MegaMenu() {
  const [data, setData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [parentCategory, setParentCategory] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const megaMenuData = () => {
    fetch(`${BASE_URL}/dashboard/mega-menu/api`)
      .then((res) => res.json())
      .then((responseData) => {
        if (responseData.code === 200) {
          setData(responseData.message.docs);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  const megaMenuAndPageData = () => {
    megaMenuData();
    fetch(`${API_URL}/api/page?limit=0&sort=createdAt`)
      .then((res) => res.json())
      .then((responseData) => {
        setPageData(responseData.docs);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    megaMenuAndPageData();
  }, []);

  const handlePageAddOnCategory = (e, id) => {
    fetch(`${BASE_URL}/dashboard/mega-menu/api`,{
      method: 'PATCH',
      body: JSON.stringify({
        pageId: e,
        categoryId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1000)
      })
      .catch((error) => {
        setSuccess(false);
        console.error('Error fetching data:', error);
      });
  }

  const addNewCategory = (values) => {
    setIsLoading(true);
    fetch(`${BASE_URL}/dashboard/mega-menu/api`, {
      method: "POST",
      body: JSON.stringify({
        name: values.newCateogry,
        parent: parentCategory,
      })
    })
      .then((res) => res.json())
      .then((data) => {
        megaMenuData();
        reset();
        setOpen(!open);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Typography>
        <Sidebar>
          <Alert
            open={success}
            className="w-fit px-4 flex items-center right-2 top-4 fixed"
            color="green"
            animate={{
              mount: { y: 0 },
              unmount: { y: 100 },
            }}
          >
            Page Added Successfully
          </Alert>
          <div className='float-right'>
            <Button 
              variant='outlined'
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                setOpen(!open)
              }}
            >
              Create
            </Button>
          </div>
          <div className='mt-4 p-4 grid grid-cols-2 gap-2 w-full'>
            <div className='border-2 p-4'>
              <div className='flex justify-center font-bold underline'>
              Select Pages For Categories
              </div>
              {data.map((value, index) => (
                <div key={index}>
                  {value.name}
                  <Select 
                    label={value.page  ? value.page.name : 'select page'}
                    onChange={(e) => {
                      handlePageAddOnCategory(e, value.id);
                    }
                    }
                  >
                  {pageData.map((pageValue, index) => (
                      <Option 
                        key={index}
                        value={pageValue.id}
                        selected={value.page && pageValue.name === value.page.name}
                      >
                        {pageValue.name}
                      </Option>
                  ))}
                  </Select>
                </div>
              ))}
            </div>
            <div className='border-2 p-4'>
              <div className='flex justify-center font-bold underline'>
                Mega Menu Structure
              </div>
              {data
                ?.filter(prop => prop?.parent === null)
                .map((prop, index) => (
                  <div key={index} >
                    {prop && (
                      <div className='border-2 p-2'>
                        <label className='font-bold'>{prop.name}</label>
                        <div
                        >
                          {/* Displaying child items */}
                          {data
                            ?.filter(item => item?.parent?.id === prop.id) // Filter out child items
                            .map((item, index) => (
                              <div key={index} >
                                {index+1}. {item.name}
                                <ul>
                                  {/* Displaying sub-items */}
                                  {data
                                    ?.filter(subItem => subItem?.parent?.id === item.id) // Filter out sub-items
                                    .map((subItem, subIndex) => (
                                      <div key={subIndex} >
                                        ----- <label className='font-light'>
                                          {subItem.name}
                                          </label>
                                      </div>
                                    ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
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
              <Select
                label='Select Parent category'
                className="peer mb-4 w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal text-left outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all border text-sm px-3 py-1 rounded-[7px] border-blue-gray-200"
                onChange={(e) => setParentCategory(e)}
              >
                {data?.map((prop, index) => (
                  <Option value={prop.id} key={index}>
                    {prop.name}
                  </Option>
                ))}
              </Select>
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
                <Spinner className='mx-auto h-4 w-4' />
              ) :
                "Request new category"
              }
            </Button>
          </DialogFooter>
        </Dialog>
    </Typography>
  );
}

export default MegaMenu;
