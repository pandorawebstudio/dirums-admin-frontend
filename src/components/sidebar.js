'use client'; 

import React, { useEffect } from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Alert,
  Input,
  Breadcrumbs,
  Drawer,
  IconButton,
  Button,
  Badge,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  InboxIcon,
  PowerIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  CubeTransparentIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BASE_URL } from "../config";
import { useOrderStore } from "../config/store";
 
export default function Sidebar({children}) {
  const [open, setOpen] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(true);
  const [isIndividual, setIsIndividual] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((segment) => segment !== '');
  const { order, fetchOrder } = useOrderStore()


  const logout = () => {
    fetch(`${BASE_URL}/api`)
    .then(res => res.json())
    .then(data => router.push('/login'))
  }

  // useEffect(() => {
  //   fetchOrder();
  // },[])

  return (
    <main>
      <Card className="h-full fixed left-0 top-0 hidden md:block py-4 shadow-xl shadow-blue-gray-900/5 overflow-auto w-52">
        <div className="w-36 px-4">
          <Image src="/admin-logo.png" priority={true} alt="brand" className="w-28" width={50} height={32} />
        </div>
        {/* <div className="p-2">
          <Input icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Search" />
        </div> */}
        <div>
          
        </div>
        <List className="min-w-[190px]">
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Dashboard
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/orders')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            {order > 0 && <Chip value={order} className="rounded-full absolute right-4" color="green" />}
            <Typography color="blue-gray" className="mr-auto font-normal">
              Orders
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/products')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Products
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/edited-products')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Edited Products
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/taxes')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Taxes
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/categories')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Categories
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/attributes')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Attributes
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/customers')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Customers
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/vendors')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Vendors
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/pages')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Pages
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/mega-menu')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Mega Menu
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/newsletter')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Newlsetter
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/coupons')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Coupons
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/blogs')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Blogs
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/otp-requests')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              OTP Requests
            </Typography>
          </ListItem>
          <ListItem className="h-[30px]" onClick={() => router.push('/dashboard/signup-attempts')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Signup Attempts
            </Typography>
          </ListItem>
          <ListItem className="h-[50px]" onClick={() => router.push('/dashboard/product-approval-logs')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Product Approval Logs
            </Typography>
          </ListItem>
          <ListItem className="h-[50px]" onClick={() => router.push('/dashboard/upload-attempts')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Product Upload Attempts
            </Typography>
          </ListItem>
          <ListItem className="h-[50px]" onClick={() => router.push('/dashboard/homepage-footer-content')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Homepage Footer Content
            </Typography>
          </ListItem>
          {/* {isIndividual == false && (
            <ListItem className="h-[10px]" onClick={() => router.push('/dashboard/creators')}>
              <ListItemPrefix>
                <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
              </ListItemPrefix>
              <Typography color="blue-gray" className="mr-auto font-normal">
                Creators
              </Typography>
            </ListItem>
          )} */}
          <hr className="my-2 border-blue-gray-50" />
          <ListItem className="h-[10px]" onClick={() => router.push('/dashboard/account')}>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem className="h-[10px]" onClick={logout} >
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
      <Bars3Icon onClick={() => setOpen(true)} className="w-6 h-6 absolute top-6 left-3 md:hidden" />
      <Drawer open={open} onClose={() => setOpen(false)} className="md:hidden w-fit">
        <div className="mb-2 flex items-center justify-between p-4 ">
          <div className="w-36">
            <Image src="/admin-logo.png" priority={true} alt="brand" className="w-28" width={50} height={32} />
          </div>
          <IconButton variant="text" color="blue-gray" onClick={() => setOpen(false)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </div>
        <List>
          <ListItem>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Dashboard
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Orders
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/products')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Products
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/edited-products')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Edited Products
            </Typography>
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/taxes')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Taxes
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/categories')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Categories
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/attributes')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Attributes
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/customers')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Customers
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/vendors')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Vendors
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/pages')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Pages
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/mega-menu')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Mega Menu
            </Typography>
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/newsletter')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Newlsetter
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/coupons')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Coupons
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/blogs')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Blogs
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/otp-requests')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            OTP Requests
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/signup-attempts')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Signup Attempts
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/product-approval-logs')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            <Typography color="blue-gray" className="mr-auto font-normal">
              Product Approval Logs
            </Typography>
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/upload-attempts')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Product Upload Attempts
          </ListItem>
          <ListItem onClick={() => router.push('/dashboard/homepage-footer-content')}>
            <ListItemPrefix>
              <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
            </ListItemPrefix>
            Homepage Footer Content
          </ListItem>
          <hr className="my-2 border-blue-gray-50" />
          <ListItem onClick={() => router.push('/dashboard/account')}>
            <ListItemPrefix>
              <Cog6ToothIcon className="h-5 w-5" />
            </ListItemPrefix>
            Settings
          </ListItem>
          <ListItem onClick={logout}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Drawer>
      <div className="p-4 md:ml-[195px]">
        <Breadcrumbs
         className=" ml-8 md:ml-0 w-56 sm:w-fit"
        >
          {pathSegments.map((segment, index) => (
            <a href={`/${pathSegments.slice(0, index + 1).join('/')}`} className="opacity-100" key={index}>
              {segment}
            </a>
          ))}
        </Breadcrumbs>
        <main>
          {children}
        </main>
      </div>
    </main>
  );
}