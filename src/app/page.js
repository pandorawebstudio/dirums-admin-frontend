'use client';

import Sidebar from '../components/sidebar'
import { Alert, Button, Card, Checkbox, Input, Spinner, Typography } from '@material-tailwind/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {BASE_URL, API_URL} from '../config'
import Navbar from '../components/helper/signupNav';
import { useForm } from 'react-hook-form';
import { io } from 'socket.io-client';

export default function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState("");
    const router = useRouter();
    const {register, handleSubmit, formState: {errors}} = useForm();

    
      

    const submit = (values) => {
      setIsLoading(true);
      setError("");
            setIsError(false);
      fetch(`${BASE_URL}/login/api`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: values.email,
              password: values.password
          })
      }).then(res => res.json())
      .then(data => {
          if(data.code == 200){
            router.push('/dashboard')
            setIsLoading(false)
          }
          else{
            setIsLoading(false);
            setError(data.message);
            setIsError(true);
          }
        })
  }
  return (
    <>
     <Navbar />
    <div className='flex flex-col gap-3 justify-center items-center w-full h-screen'>
      {isError && (
    <Alert color="red" className='w-fit'>{error}</Alert>
      )}
        <Card color="white" className='p-4' >
      <Typography variant="h4" color="blue-gray">
        Login
      </Typography>
      <Typography color="gray" className="mt-1 font-normal">
        Enter your details to login.
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" label="Email" type='email' {...register('email', {required: {value:true, message:"Email is required"}})} />
          {errors?.email?.message && <p className='text-sm text-red-500'>{errors?.email?.message}</p>}
        </div>
        <div className="mb-4 flex flex-col gap-6">
          <Input size="lg" label="Password" type='password' {...register('password', {required: {value:true, message:"Password is required"}})} />
          {errors?.password?.message && <p className='text-sm text-red-500'>{errors?.password?.message}</p>}
        </div>
        <Button className="mt-6" fullWidth onClick={handleSubmit(submit)}>
            {isLoading ? (
                <Spinner className='mx-auto h-4 w-4'/>
            ):
          "Login"
            }
        </Button>
      </form>
    </Card>
    </div>

    
    </>
  )
}
