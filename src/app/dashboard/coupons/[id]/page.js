'use client';

import Sidebar from '../../../../components/sidebar';
import { API_URL, BASE_URL } from '../../../../config'
import { Alert, Button, Input, Option, Select, Spinner, Typography } from '@material-tailwind/react'
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

export default function Page({ params }) {
    const router = useRouter();
    const [success, setSuccess] = useState(false);
    const [data, setData] = useState()
    const [type, setType] = useState('')
    const [status, setStatus] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetch(`${API_URL}/api/coupons/${params.id}`)
            .then(res => res.json())
            .then(data => {
                //   console.log(new Date(data?.expiryTime).toISOString().substring(0,10))
                setData(data)
                setStatus(data?.status)
                setType(data?.type)
                setValue('code', data?.code)
                setValue('amount', data?.amount)
                setValue('type', data?.type)
                setValue('status', data?.status)
                setValue('expiryTime', new Date(data?.expiryTime).toISOString().substring(0, 10))
                setValue('minimumSpend', data?.minimumSpend)
                setValue('maximumSpend', data?.maximumSpend)
            })
    }, [])

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const submit = (values) => {
        setIsLoading(true)
        fetch(`${BASE_URL}/dashboard/coupons/${params.id}/api`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(res => res.json())
            .then((data) => {
                if (data.code == 200) {
                    fetch(`${API_URL}/api/coupons/${params.id}`)
                        .then(res => res.json())
                        .then(data => {
                            setData(data)
                            setStatus(data?.status)
                            setType(data?.type)
                            setSuccess(true)
                            setIsLoading(false)
                            router.push('/dashboard/coupons')
                        })

                }
            })
    }


    return (
        <>
            <Sidebar>
                <form onSubmit={handleSubmit(submit)} className='lg:w-4/5 mx-auto w-full'>
                    <Typography className='my-6 font-bold lg:text-2xl text-lg text-center'>Coupon Details</Typography>
                    <Input name='code' defaultValue={data?.code} {...register('code', { required: { value: true, message: 'Coupon Code is required' } })} error={Boolean(errors?.code?.message)} label='Code' containerProps={{ className: 'my-3' }} />

                    <div className="relative w-full min-w-[200px] h-10 my-3">
                        <select name="type" {...register('type', { required: { value: true, message: 'Coupon Type is required' } })} placeholder='Coupon Type' defaultValue={data?.type} className='peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900'>
                            <option value='Percentage'>Percentage</option>
                            <option value='Fixed'>Fixed</option>
                        </select>
                        <label class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">Coupon Type </label>
                    </div>
                    <Input type='number' name="amount" defaultValue={data?.amount}{...register('amount', { required: { value: true, message: 'Coupon amount is required' } })} error={Boolean(errors?.amount?.message)} label='Amount' containerProps={{ className: 'my-3' }} />
                    <Input name="expiryTime" defaultValue={new Date(data?.expiryTime).getFullYear() + "-" + new Date(data?.expiryTime).getMonth() + "-" + new Date(data?.expiryTime).getDate()} {...register('expiryTime', { required: { value: true, message: 'Coupon expiry time is required' } })} error={Boolean(errors?.expiryTime?.message)} label='Expiry time' type='date' containerProps={{ className: 'my-3' }} />
                    <Input name="minimumSpend" defaultValue={data?.minimumSpend}{...register('minimumSpend', { required: { value: true, message: 'Coupon minimum spend is required' } })} error={Boolean(errors?.minimumSpend?.message)} label='Minimum Spend' type='number' containerProps={{ className: 'my-3' }} />
                    <Input name="maximumSpend" defaultValue={data?.maximumSpend} {...register('maximumSpend', { required: { value: true, message: 'Coupon maximum spend is required' } })} error={Boolean(errors?.maximumSpend?.message)} label='Maximum Spend' type='number' containerProps={{ className: 'my-3' }} />

                    <div className="relative w-full min-w-[200px] h-10 my-3">
                        <select name="status"{...register('status', { required: { value: true, message: 'Coupon status is required' } })} placeholder='Status' defaultValue={data?.status} className='peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900'>
                            <option value='Pending'>Pending</option>
                            <option value='Active'>Active</option>
                            <option value='Inactive'>Inactive</option>
                        </select>
                        <label class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">Coupon Status </label>
                    </div>
                    <Button type='submit' className='mt-7 min-w-[131.34px]'>
                        {isLoading ? (
                            <Spinner className='w-max h-4 mx-auto' />
                        ) :
                            "Edit Coupon"
                        }
                    </Button>
                </form>
            </Sidebar>
            <Alert
                open={success}
                onClose={() => setSuccess(false)}
                className='w-fit px-4 flex items-center right-2 top-4 absolute'
                color="green"
                animate={{
                    mount: { y: 0 },
                    unmount: { y: 100 },
                }}
            >
                Your coupon has been updated
            </Alert>
        </>
    )
}
