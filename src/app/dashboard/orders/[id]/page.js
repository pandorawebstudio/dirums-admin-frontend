'use client';
import Sidebar from '../../../../components/sidebar'
import { API_URL, BASE_URL } from '../../../../config'
import { Button, Card, CardBody, CardHeader, Typography, Alert, Select, Option, } from '@material-tailwind/react'
import { PencilIcon,PlusIcon, XCircleIcon } from "@heroicons/react/24/solid";
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


export default function Page({params}) {
const [data, setData] = useState();
const [selectedStatus, setSelectedStatus] = useState('');
const [successMessage, setSuccessMessage] = useState("");
const [success, setSuccess] = useState(false);
    useEffect(() => {
        fetch(`${API_URL}/api/order/${params.id}?depth=3`)
        .then(res => res.json())
        .then(data => {
          setData(data)
          setSelectedStatus(data?.status)
        })
    },[])

    const handleStatusChange = (event, id) => {
       const status=event;
       fetch(`${BASE_URL}/dashboard/orders/${id}/api`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status,
          orderId: params.id,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == 200) {
            fetch(`${API_URL}/api/order/${params.id}?depth=3`)
              .then((res) => res.json())
              .then((data) => {
                setData(data)
                setSelectedStatus(data?.status)
                setSuccessMessage("Order status updated successfully");
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                }, 3000);

              })
          }
        })
        .catch(error => {
          throw error;
        }) 
    };
  return (
    <>
     <Sidebar>
      <Card className="h-full w-full my-6">
        <CardBody>
        <Typography variant="h6" color="black" className="mb-4 uppercase underline underline-offset-4">
          Order details
        </Typography>
            {data?.cart?.items?.map((prop, index) => (
              <div className='flex justify-between items-center gap-10' key={index}>
                <img
                  src={prop.product.images[0].image.url}
                  alt="card-image"
                  className="h-80 w-auto object-contain"
                />
                <div>
                  <Typography variant="h6" color="gray" className="mb-4 uppercase">
                    {prop.product.categoryName}
                  </Typography>
                  <Typography variant="h4" color="blue-gray" className="mb-2 hover:text-[#cc8e51] transition-all ease-in-out duration-300">
                    <Link href={`${BASE_URL}/product/` + prop.product.slug} target='_blank'>{prop.product.title}</Link>
                  </Typography>
                  <Typography color="gray" className="mb-2 font-semibold">
                    {new Intl.NumberFormat('en-IN', { currency: 'INR', style: 'currency' }).format(prop.product.price)}
                  </Typography>
                  <Typography color="gray" className="mb-8 font-mormal">
                    Payment mode: {data?.payment.mode}
                  </Typography>
                  <Typography className="mb-8 font-normal flex items-center">
                    <span className="mr-2">Order Status:</span>
                    <Select
                      id="status"
                      defaultValue={prop.status}
                      value={prop.status}
                      onChange={(e) => handleStatusChange(e, prop.id)}
                    >
                      <Option value="pending">Pending</Option>
                      <Option value="proccesing">Processing</Option>
                      <Option value="shipping">Shipped</Option>
                      <Option value="delivered">Delivered</Option>
                    </Select>
                  </Typography>
                  <a href={`${BASE_URL}/product/` + prop.product.slug} target='_blank' className="inline-block">
                    <Button variant="text" className="flex items-center gap-2">
                      View product
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </Button>
                  </a>
                </div>
              </div>
            ))}
        </CardBody>
      </Card>

      <Card className="h-full w-full">
        <CardBody>
        <Typography variant="h6" color="black" className="mb-4 uppercase underline underline-offset-4">
          Shipping details
        </Typography>
            {data?.cart?.deliveryAddress?.id ? (
              <>
                <Typography className="mb-2 capitalize font-bold">
                  {data?.cart?.deliveryAddress?.firstName + " " + data?.cart?.deliveryAddress?.lastName}
                </Typography>
                <Typography color="gray" className="mb-2 font-normal">
                  {data?.cart?.deliveryAddress?.email}
                </Typography>
                <Typography color="gray" className="mb-2 capitalize font-normal">
                  {data?.cart?.deliveryAddress?.phoneNumber}
                </Typography>
                <Typography color="blue-gray" className="mb-2">
                  {data?.cart?.deliveryAddress?.address}
                </Typography>
                <Typography color="gray" className="mb-2">
                  {data?.cart?.deliveryAddress?.city}
                </Typography>
                <Typography color="gray" className="mb-2 font-mormal">
                  {data?.cart?.deliveryAddress?.state} - {data?.cart?.deliveryAddress?.postalCode}
                </Typography>
                <Typography color="gray" className="mb-8 font-mormal">
                  {data?.cart?.deliveryAddress?.country}
                </Typography>
              </>
            ) : (
              <>N/A</>
            )}
        </CardBody>
      </Card>
      </Sidebar>
      <Alert
        className="absolute right-3 top-3 w-fit flex items-center"
        open={success}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
        action={
          <Button
            variant="text"
            color="white"
            size="sm"
            className="!absolute right-1"
            onClick={() => setSuccess(false)}
          >
            <XCircleIcon className="w-6 h-6" />
          </Button>
        }
        color="green"
      >
        {successMessage}
      </Alert>
    </>
  )
}
