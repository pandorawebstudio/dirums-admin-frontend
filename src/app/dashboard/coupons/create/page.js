'use client';

import Sidebar from '../../../../components/sidebar';
import { API_URL, BASE_URL } from '../../../../config';
import { Alert, Button, Input, Spinner, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';


export default function Page() {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openModal, setOpenModal] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([])

    useEffect(() => {
        // Fetch products and categories when component mounts
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/api/products`);
            const data = await response.json();
            setProducts(data.map(product => ({ value: product._id, label: product.name })));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_URL}/api/categories`);
            const data = await response.json();
            setCategories(data.map(category => ({ value: category._id, label: category.name })));
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setOpenModal(false);
    };

    const submit = (values) => {
        const payload = {
            ...values,
            applicableProducts: selectedProducts.map(product => product.value),
            applicableCategories: selectedCategories.map(category => category.value)
        };
        setIsLoading(true);
        fetch(`${BASE_URL}/dashboard/coupons/create/api`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data) => {
                reset(values);
                setSuccess(true);
                setIsLoading(false);
                router.push('/dashboard/coupons');
            });
    };

    return (
        <>
            <Sidebar>
                <form onSubmit={handleSubmit(submit)} className='lg:w-4/5 mx-auto w-full'>
                    <Typography className='my-6 font-bold lg:text-2xl text-lg text-center'>Create a new Coupon</Typography>

                    <Input name='code' {...register('code', { required: { value: true, message: 'Coupon Code is required' } })} error={Boolean(errors?.code?.message)} label='Code' containerProps={{ className: 'my-3' }} />
                    <Input name='description' {...register('description')} label='Description' containerProps={{ className: 'my-3' }} />
                    <div className="relative w-full min-w-[200px] my-3">
                        <select name="type" {...register('type', { required: { value: true, message: 'Coupon Type is required' } })} className='peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none focus:outline-none disabled:bg-blue-gray-50 transition-all border border-blue-gray-200 focus:border-2 focus:border-gray-900 text-sm px-3 py-2.5 rounded-[7px]'>
                            <option value='Percentage'>Percentage</option>
                            <option value='Fixed'>Fixed</option>
                        </select>
                        <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:border-gray-900 after:border-blue-gray-200 peer-focus:after:border-gray-900">Coupon Type</label>
                    </div>
                    <Input type='number' name="amount" {...register('amount', { required: { value: true, message: 'Coupon amount is required' } })} error={Boolean(errors?.amount?.message)} label='Amount' containerProps={{ className: 'my-3' }} />
                    <Input name="expiryTime" {...register('expiryTime', { required: { value: true, message: 'Coupon expiry time is required' } })} error={Boolean(errors?.expiryTime?.message)} label='Expiry time' type='date' containerProps={{ className: 'my-3' }} />
                    <Input name="minimumSpend" {...register('minimumSpend')} label='Minimum Spend' type='number' containerProps={{ className: 'my-3' }} />
                    <Input name="maximumSpend" {...register('maximumSpend')} label='Maximum Spend' type='number' containerProps={{ className: 'my-3' }} />
                    <Input name="usageLimit" {...register('usageLimit')} label='Usage Limit' type='number' containerProps={{ className: 'my-3' }} />
                    <Input name="perUserUsageLimit" {...register('perUserUsageLimit')} label='Per User Usage Limit' type='number' containerProps={{ className: 'my-3' }} />
                    <Input name="customerEligibility" {...register('customerEligibility')} label='Customer Eligibility' containerProps={{ className: 'my-3' }} />
                    <div className="relative w-full min-w-[200px] h-10 my-3">
                        <select name="status" {...register('status', { required: { value: true, message: 'Coupon status is required' } })} className='peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline-none focus:outline-none disabled:bg-blue-gray-50 transition-all border border-blue-gray-200 focus:border-2 focus:border-gray-900 text-sm px-3 py-2.5 rounded-[7px]'>
                            <option value='Active'>Active</option>
                            <option value='Expired'>Expired</option>
                            <option value='Pending'>Pending</option>
                        </select>
                        <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:border-gray-900 after:border-blue-gray-200 peer-focus:after:border-gray-900">Coupon Status</label>
                    </div>

                    {selectedOption === 'Product Specific' && (
                        <div className="relative w-full min-w-[200px] my-3">
                            <label className="block text-sm font-medium text-gray-700">Select Products</label>
                            <Select
                                value={selectedProducts}
                                onChange={setSelectedProducts}
                                options={products}
                                isMulti
                                classNamePrefix="react-select"
                            />
                        </div>
                    )}

                    {selectedOption === 'Category Specific' && (
                        <div className="relative w-full min-w-[200px] my-3">
                            <label className="block text-sm font-medium text-gray-700">Select Categories</label>
                            <Select
                                value={selectedCategories}
                                onChange={setSelectedCategories}
                                options={categories}
                                isMulti
                                classNamePrefix="react-select"
                            />
                        </div>
                    )}

                    <Button type='submit' className='mt-7 bg-blue-500 text-white py-2 px-4 rounded'>
                        {isLoading ? (
                            <Spinner className='w-max h-4 mx-auto' />
                        ) :
                            "Create New Coupon"
                        }
                    </Button>
                </form>
            </Sidebar>

            {openModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <h2 className="text-xl mb-4">Select Coupon Type</h2>
                        <button
                            onClick={() => handleOptionSelect('Global')}
                            className='bg-blue-500 text-white py-2 px-4 rounded my-2 w-full'
                        >
                            Global Coupon
                        </button>
                        <button
                            onClick={() => handleOptionSelect('Product Specific')}
                            className='bg-blue-500 text-white py-2 px-4 rounded my-2 w-full'
                        >
                            Product Specific Coupon
                        </button>
                        <button
                            onClick={() => handleOptionSelect('Category Specific')}
                            className='bg-blue-500 text-white py-2 px-4 rounded my-2 w-full'
                        >
                            Category Specific Coupon
                        </button>
                    </div>
                </div>
            )}

            {success && (
                <Alert
                    open={success}
                    onClose={() => setSuccess(false)}
                    className='w-fit px-4 flex items-center right-2 top-4 fixed bg-green-500 text-white py-2 px-4 rounded'
                    color="green"
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: 100 },
                    }}
                >
                    Your new coupon has been created
                </Alert>
            )}
        </>
    );
}
