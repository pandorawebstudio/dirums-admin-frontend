'use client';


import Sidebar from '../../components/sidebar';
// import { useOrderStore } from '../../config/store';
import { Alert } from '@material-tailwind/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';
import { API_URL } from '../../config';

export default function Dashboard() {
  console.log("hello")
  const [notificaioAlert, setNotificationAlert] = useState(false)
  // const { increaseOrder, fetchOrder } = useOrderStore()
    
    useEffect(() => {
      // fetchOrder();
      const socket = io(API_URL);
    
      socket.on('notification', (notification) => {
        // Handle the incoming notification and update the UI
        if(notification.id){
        setNotificationAlert(true);
        // increaseOrder();
        }
      });
    },[])
  return (
    <>
      <Sidebar>
        <div className='flex justify-center h-48 mt-80 text-global animate-bounce font-montserrat text-2xl'>
          Welcome to Dirums Admin Pannel
        </div>
      </Sidebar>

        <Alert
          open={notificaioAlert}
          className='w-fit px-4 flex items-center right-2 absolute'
          onClose={() => setNotificationAlert(false)}
          color="green"
          animate={{
            mount: { y: 0 },
            unmount: { y: 100 },
          }}
        >
          A New order has been placed. <Link href='/dashboard/orders' className='underline underline-offset-2'>View order</Link>
        </Alert>
    </>
  )
}
