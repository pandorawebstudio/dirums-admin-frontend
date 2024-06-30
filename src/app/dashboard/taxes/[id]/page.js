'use client';

import Sidebar from '../../../../components/sidebar'
import { Input, Card, CardBody, Typography, List, ListItem, ListItemPrefix, Radio, Checkbox, Spinner, Button } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import ReactPaginate from 'react-paginate'
import qs from 'qs'
import { API_URL, BASE_URL } from '../../../../config';
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce'

function Page({params}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const [productCondition, setProductCondition] = useState("name");
  const [products, setProducts] = useState([]);
  const [productIDs, setProductIDs] = useState([]);
  const [search, setSearch] = useState("");
  const [search2] = useDebounce(search, 500);
  const [name, setName] = useState("");
  const [hsn, setHSN] = useState("");
  const [percentage, setPercentage] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


useEffect(() => {
  if(!name){
  fetch(`${BASE_URL}/dashboard/taxes/${params.id}/api/`)
      .then(res => res.json())
      .then(data => {
          setProducts(data.message.products);
          data.message.products.map((item) => {
            setProductIDs(prev => [...prev, item.id])
          })
          setName(data.message.name)
          setHSN(data.message.hsn)
          setPercentage(data.message.percentage)
      })
    }
},[])

const fetchProducts = () => {
    setIsLoading(true);
      const value = search
      const query = {
          or: [
              {
              title: {
                  contains: value
                }
            },
            {
              'category.name': {
                  contains: value
                }
            },
            {
              'tags.name': {
                  contains: value
                }
            },
            {
              'attributes.value': {
                  contains: value
                }
            },
          ]
        }

        const strigifiedQuery = qs.stringify({where: query, limit: 20, page: page}, {addQueryPrefix: true})
      fetch(`${API_URL}/api/product${strigifiedQuery}`)
      .then(res => res.json())
      .then(data => {
          setAllProducts(data.docs);
          setTotalPages(data.totalPages);
          setIsLoading(false)
      })
  }

  const fetchProductsByCategory = () => {
    setIsLoading(true);
      const value = search
      const query = {
              'category.name': {
                  contains: value
                }
    
        }

        const strigifiedQuery = qs.stringify({where: query, limit: 20, page: page}, {addQueryPrefix: true})
      fetch(`${API_URL}/api/product${strigifiedQuery}`)
      .then(res => res.json())
      .then(data => {
          setAllProducts(data.docs);
          setTotalPages(data.totalPages);
          setIsLoading(false)
      })
  }

  const fetchProductsByTags = () => {
    setIsLoading(true);
      const value = search
      const query = {
              'tags.name': {
                  contains: value
                }
        }

        const strigifiedQuery = qs.stringify({where: query, limit: 20, page: page}, {addQueryPrefix: true})
      fetch(`${API_URL}/api/product${strigifiedQuery}`)
      .then(res => res.json())
      .then(data => {
          setAllProducts(data.docs);
          setTotalPages(data.totalPages);
          setIsLoading(false)
      })
  }

  const fetchProductsByVendors = () => {
    setIsLoading(true);
      const value = search
      const query = {
        or: [
          {
            "vendor.firstName": {
              contains: value,
            },
          },
          {
            "vendor.lastName": {
              contains: value,
            },
          },
        ],
      };

        const strigifiedQuery = qs.stringify({where: query, limit: 20, page: page}, {addQueryPrefix: true})
      fetch(`${API_URL}/api/product${strigifiedQuery}`)
      .then(res => res.json())
      .then(data => {
          setAllProducts(data.docs);
          setTotalPages(data.totalPages);
          setIsLoading(false)
      })
  }

  const submit = () => {
    fetch(`${BASE_URL}/dashboard/taxes/${params.id}/api`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            hsn: hsn,
            percentage: percentage,
            products: productIDs
        })
    })
    .then(res => res.json())
    .then(data => {if(data.code == 200 && !data.message.errors) router.push('/dashboard/taxes')})
  }
 
  useEffect(() => {
    if(productCondition == 'name'){
    fetchProducts()
    }
    if(productCondition == "category"){
        fetchProductsByCategory()
    }
    if(productCondition == "tags"){
        fetchProductsByTags()
    }
    if(productCondition == "vendor"){
        fetchProductsByVendors()
    }
  },[page, search2])
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Sidebar>
        <div className="my-10">
          <Card>
            <CardBody>
              <Typography className="font-bold text-xl">
                Create new Tax rate
              </Typography>
              <Input label="name" containerProps={{ className: "my-3" }} defaultValue={name} onInput={(e) => setName(e.target.value)} />
              <Input label="HSN Code" containerProps={{ className: "my-3" }} defaultValue={hsn} onInput={(e) => setHSN(e.target.value)} />
              <Input label="Tax Rate" containerProps={{ className: "my-3" }} defaultValue={percentage} onInput={(e) => setPercentage(e.target.value)} />
              <Typography className="my-3">Select product by:</Typography>
              <List className="flex-row">
                <ListItem className="p-0">
                  <label
                    htmlFor="horizontal-list-react"
                    className="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <ListItemPrefix className="mr-3">
                      <Radio
                        name="horizontal-list"
                        id="horizontal-list-react"
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                        value={"name"}
                        onChange={(e) => setProductCondition(e.target.value)}
                      />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="font-medium text-blue-gray-400"
                    >
                      Product Details
                    </Typography>
                  </label>
                </ListItem>
                <ListItem className="p-0">
                  <label
                    htmlFor="horizontal-list-vue"
                    className="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <ListItemPrefix className="mr-3">
                      <Radio
                        name="horizontal-list"
                        id="horizontal-list-vue"
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                        value={"category"}
                        onChange={(e) => setProductCondition(e.target.value)}
                      />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="font-medium text-blue-gray-400"
                    >
                      Product category
                    </Typography>
                  </label>
                </ListItem>
                <ListItem className="p-0">
                  <label
                    htmlFor="horizontal-list-svelte"
                    className="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <ListItemPrefix className="mr-3">
                      <Radio
                        name="horizontal-list"
                        id="horizontal-list-svelte"
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                        value={"tags"}
                        onChange={(e) => setProductCondition(e.target.value)}
                      />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="font-medium text-blue-gray-400"
                    >
                      Product Tags
                    </Typography>
                  </label>
                </ListItem>
                <ListItem className="p-0">
                  <label
                    htmlFor="horizontal-list-vendor"
                    className="flex w-full cursor-pointer items-center px-3 py-2"
                  >
                    <ListItemPrefix className="mr-3">
                      <Radio
                        name="horizontal-list"
                        id="horizontal-list-vendor"
                        ripple={false}
                        className="hover:before:opacity-0"
                        containerProps={{
                          className: "p-0",
                        }}
                        value={"vendor"}
                        onChange={(e) => setProductCondition(e.target.value)}
                      />
                    </ListItemPrefix>
                    <Typography
                      color="blue-gray"
                      className="font-medium text-blue-gray-400"
                    >
                      Product vendors
                    </Typography>
                  </label>
                </ListItem>
              </List>

              {productCondition == "name" && (
                <>
                  <Input
                    label="Search products"
                    onInput={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  {allProducts?.length > 0 && (
                    <>
                      {isLoading ? (
                        <Spinner className="w-8 h-8 mx-auto my-20" />
                      ) : (
                        <>
                          <table className="table w-full mt-8">
                            <thead>
                              <th></th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Category</th>
                            </thead>
                            <tbody>
                              {products?.map((prop, index) => (
                                <tr key={index}>
                                  <td>
                                    <Checkbox
                                      value={prop}
                                      checked
                                      onChange={(e) =>
                                        products?.includes(prop)
                                          ? setProducts(
                                              products.filter(
                                                (item) => item !== prop
                                              )
                                            )
                                          : setProducts((prev) => [...prev, prop])
                                      }
                                    />
                                  </td>
                                  <td>
                                    <img
                                      src={prop?.images?.[0]?.image?.url}
                                      className="w-20 h-20 object-contain"
                                    />
                                  </td>
                                  <td>
                                    <Link
                                      className="text-amber-900"
                                      href={"/dashboard/products/" + prop.id}
                                      target="_blank"
                                    >
                                      {prop?.title}
                                    </Link>
                                    <Typography className="font-bold text-sm">
                                      by{" "}
                                      {prop?.vendor?.firstName +
                                        " " +
                                        prop?.vendor?.lastName}
                                    </Typography>
                                    <Typography
                                      className={
                                        prop.category
                                          ? "text-sm font-bold"
                                          : "text-sm font-bold text-red-500"
                                      }
                                    >
                                      {prop?.category
                                        ? prop?.category?.name
                                        : "category not present"}
                                    </Typography>
                                  </td>
                                  <td>
                                    {new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                      minimumFractionDigits: 0,
                                    }).format(prop?.price)}
                                  </td>
                                </tr>
                              ))}
                              {allProducts?.map((prop, index) => (
                                <>
                                  {!products?.some(
                                    (item) => item.id == prop.id
                                  ) && (
                                    <tr key={index}>
                                      <td>
                                        <Checkbox
                                          value={prop}
                                          onChange={(e) => {
                                            productIDs?.includes(prop)
                                              ? setProductIDs(
                                                  products.filter(
                                                    (item) => item !== prop.id
                                                  )
                                                )
                                              : setProductIDs((prev) => [
                                                  ...prev,
                                                  prop.id,
                                                ])
                                            products?.includes(prop)
                                              ? setProducts(
                                                  products.filter(
                                                    (item) => item !== prop
                                                  )
                                                )
                                              : setProducts((prev) => [
                                                  ...prev,
                                                  prop,
                                                ])
                                              }
                                          }
                                        />
                                      </td>
                                      <td>
                                        <img
                                          src={prop?.images?.[0]?.image?.url}
                                          className="w-20 h-20 object-contain"
                                        />
                                      </td>
                                      <td>
                                        <Link
                                          className="text-amber-900"
                                          href={"/dashboard/products/" + prop.id}
                                          target="_blank"
                                        >
                                          {prop?.title}
                                        </Link>
                                        <Typography className="font-bold text-sm">
                                          by{" "}
                                          {prop?.vendor?.firstName +
                                            " " +
                                            prop?.vendor?.lastName}
                                        </Typography>
                                        <Typography
                                          className={
                                            prop.category
                                              ? "text-sm font-bold"
                                              : "text-sm font-bold text-red-500"
                                          }
                                        >
                                          {prop?.category
                                            ? prop?.category?.name
                                            : "category not present"}
                                        </Typography>
                                      </td>
                                      <td>
                                        {new Intl.NumberFormat("en-IN", {
                                          style: "currency",
                                          currency: "INR",
                                          minimumFractionDigits: 0,
                                        }).format(prop?.price)}
                                      </td>
                                    </tr>
                                  )}
                                </>
                              ))}
                            </tbody>
                          </table>

                          <div className="flex items-center gap-4">
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
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {productCondition == "category" && (
                <>
                  <Input
                    label="Search products"
                    onInput={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  {allProducts?.length > 0 && (
                    <>
                      {isLoading ? (
                        <Spinner className="w-8 h-8 mx-auto my-20" />
                      ) : (
                        <>
                          <table className="table w-full mt-8">
                            <thead>
                              <th></th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Category</th>
                            </thead>
                            <tbody>
                              {products?.map((prop, index) => (
                                <tr key={index}>
                                  <td>
                                    <Checkbox
                                      value={prop}
                                      checked
                                      onChange={(e) =>
                                        products?.includes(prop)
                                          ? setProducts(
                                              products.filter(
                                                (item) => item !== prop
                                              )
                                            )
                                          : setProducts((prev) => [...prev, prop])
                                      }
                                    />
                                  </td>
                                  <td>
                                    <img
                                      src={prop?.images?.[0]?.image?.url}
                                      className="w-20 h-20 object-contain"
                                    />
                                  </td>
                                  <td>
                                    <Link
                                      className="text-amber-900"
                                      href={"/dashboard/products/" + prop.id}
                                      target="_blank"
                                    >
                                      {prop?.title}
                                    </Link>
                                    <Typography className="font-bold text-sm">
                                      by{" "}
                                      {prop?.vendor?.firstName +
                                        " " +
                                        prop?.vendor?.lastName}
                                    </Typography>
                                    <Typography
                                      className={
                                        prop.category
                                          ? "text-sm font-bold"
                                          : "text-sm font-bold text-red-500"
                                      }
                                    >
                                      {prop?.category
                                        ? prop?.category?.name
                                        : "category not present"}
                                    </Typography>
                                  </td>
                                  <td>
                                    {new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                      minimumFractionDigits: 0,
                                    }).format(prop?.price)}
                                  </td>
                                </tr>
                              ))}
                              {allProducts?.map((prop, index) => (
                                <>
                                  {!products?.some(
                                    (item) => item.id == prop.id
                                  ) && (
                                    <tr key={index}>
                                      <td>
                                        <Checkbox
                                          value={prop}
                                          onChange={(e) => {
                                            productIDs?.includes(prop)
                                              ? setProductIDs(
                                                  products.filter(
                                                    (item) => item !== prop.id
                                                  )
                                                )
                                              : setProductIDs((prev) => [
                                                  ...prev,
                                                  prop.id,
                                                ])
                                            products?.includes(prop)
                                              ? setProducts(
                                                  products.filter(
                                                    (item) => item !== prop
                                                  )
                                                )
                                              : setProducts((prev) => [
                                                  ...prev,
                                                  prop,
                                                ])
                                              }
                                            }
                                        />
                                      </td>
                                      <td>
                                        <img
                                          src={prop?.images?.[0]?.image?.url}
                                          className="w-20 h-20 object-contain"
                                        />
                                      </td>
                                      <td>
                                        <Link
                                          className="text-amber-900"
                                          href={"/dashboard/products/" + prop.id}
                                          target="_blank"
                                        >
                                          {prop?.title}
                                        </Link>
                                        <Typography className="font-bold text-sm">
                                          by{" "}
                                          {prop?.vendor?.firstName +
                                            " " +
                                            prop?.vendor?.lastName}
                                        </Typography>
                                        <Typography
                                          className={
                                            prop.category
                                              ? "text-sm font-bold"
                                              : "text-sm font-bold text-red-500"
                                          }
                                        >
                                          {prop?.category
                                            ? prop?.category?.name
                                            : "category not present"}
                                        </Typography>
                                      </td>
                                      <td>
                                        {new Intl.NumberFormat("en-IN", {
                                          style: "currency",
                                          currency: "INR",
                                          minimumFractionDigits: 0,
                                        }).format(prop?.price)}
                                      </td>
                                    </tr>
                                  )}
                                </>
                              ))}
                            </tbody>
                          </table>

                          <div className="flex items-center gap-4">
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
                            />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {productCondition == "tags" && (
                <>
                  <Input
                    label="Search products"
                    onInput={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  {allProducts?.length > 0 && (
                    <>
                      {isLoading ? (
                        <Spinner className="w-8 h-8 mx-auto my-20" />
                      ) : (
                        <>
                          <table className="table w-full mt-8">
                            <thead>
                              <th></th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Category</th>
                            </thead>
                            <tbody>
                              {products?.map((prop, index) => (
                                <tr key={index}>
                                  <td>
                                    <Checkbox
                                      value={prop}
                                      checked
                                      onChange={(e) =>
                                        products?.includes(prop)
                                          ? setProducts(
                                              products.filter(
                                                (item) => item !== prop
                                              )
                                            )
                                          : setProducts((prev) => [...prev, prop])
                                      }
                                    />
                                  </td>
                                  <td>
                                    <img
                                      src={prop?.images?.[0]?.image?.url}
                                      className="w-20 h-20 object-contain"
                                    />
                                  </td>
                                  <td>
                                    <Link
                                      className="text-amber-900"
                                      href={"/dashboard/products/" + prop.id}
                                      target="_blank"
                                    >
                                      {prop?.title}
                                    </Link>
                                    <Typography className="font-bold text-sm">
                                      by{" "}
                                      {prop?.vendor?.firstName +
                                        " " +
                                        prop?.vendor?.lastName}
                                    </Typography>
                                    <Typography
                                      className={
                                        prop.category
                                          ? "text-sm font-bold"
                                          : "text-sm font-bold text-red-500"
                                      }
                                    >
                                      {prop?.category
                                        ? prop?.category?.name
                                        : "category not present"}
                                    </Typography>
                                  </td>
                                  <td>
                                    {new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                      minimumFractionDigits: 0,
                                    }).format(prop?.price)}
                                  </td>
                                </tr>
                              ))}
                              {allProducts?.map((prop, index) => (
                                <>
                                  {!products?.some(
                                    (item) => item.id == prop.id
                                  ) && (
                                    <tr key={index}>
                                      <td>
                                        <Checkbox
                                          value={prop}
                                          onChange={(e) => {
                                            productIDs?.includes(prop)
                                              ? setProductIDs(
                                                  products.filter(
                                                    (item) => item !== prop.id
                                                  )
                                                )
                                              : setProductIDs((prev) => [
                                                  ...prev,
                                                  prop.id,
                                                ])
                                            products?.includes(prop)
                                              ? setProducts(
                                                  products.filter(
                                                    (item) => item !== prop
                                                  )
                                                )
                                              : setProducts((prev) => [
                                                  ...prev,
                                                  prop,
                                                ])
                                              }
                                            }
                                        />
                                      </td>
                                      <td>
                                        <img
                                          src={prop?.images?.[0]?.image?.url}
                                          className="w-20 h-20 object-contain"
                                        />
                                      </td>
                                      <td>
                                        <Link
                                          className="text-amber-900"
                                          href={"/dashboard/products/" + prop.id}
                                          target="_blank"
                                        >
                                          {prop?.title}
                                        </Link>
                                        <Typography className="font-bold text-sm">
                                          by{" "}
                                          {prop?.vendor?.firstName +
                                            " " +
                                            prop?.vendor?.lastName}
                                        </Typography>
                                        <Typography
                                          className={
                                            prop.category
                                              ? "text-sm font-bold"
                                              : "text-sm font-bold text-red-500"
                                          }
                                        >
                                          {prop?.category
                                            ? prop?.category?.name
                                            : "category not present"}
                                        </Typography>
                                      </td>
                                      <td>
                                        {new Intl.NumberFormat("en-IN", {
                                          style: "currency",
                                          currency: "INR",
                                          minimumFractionDigits: 0,
                                        }).format(prop?.price)}
                                      </td>
                                    </tr>
                                  )}
                                </>
                              ))}
                            </tbody>
                          </table>

                          <div className="flex items-center gap-4">
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
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {productCondition == "vendor" && (
                <>
                  <Input
                    label="Search products"
                    onInput={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  {allProducts?.length > 0 && (
                    <>
                      {isLoading ? (
                        <Spinner className="w-8 h-8 mx-auto my-20" />
                      ) : (
                        <>
                          <table className="table w-full mt-8">
                            <thead>
                              <th></th>
                              <th>Image</th>
                              <th>Name</th>
                              <th>Price</th>
                              <th>Category</th>
                            </thead>
                            <tbody>
                              {products?.map((prop, index) => (
                                <tr key={index}>
                                  <td>
                                    <Checkbox
                                      value={prop}
                                      checked
                                      onChange={(e) =>
                                        products?.includes(prop)
                                          ? setProducts(
                                              products.filter(
                                                (item) => item !== prop
                                              )
                                            )
                                          : setProducts((prev) => [...prev, prop])
                                      }
                                    />
                                  </td>
                                  <td>
                                    <img
                                      src={prop?.images?.[0]?.image?.url}
                                      className="w-20 h-20 object-contain"
                                    />
                                  </td>
                                  <td>
                                    <Link
                                      className="text-amber-900"
                                      href={"/dashboard/products/" + prop.id}
                                      target="_blank"
                                    >
                                      {prop?.title}
                                    </Link>
                                    <Typography className="font-bold text-sm">
                                      by{" "}
                                      {prop?.vendor?.firstName +
                                        " " +
                                        prop?.vendor?.lastName}
                                    </Typography>
                                    <Typography
                                      className={
                                        prop.category
                                          ? "text-sm font-bold"
                                          : "text-sm font-bold text-red-500"
                                      }
                                    >
                                      {prop?.category
                                        ? prop?.category?.name
                                        : "category not present"}
                                    </Typography>
                                  </td>
                                  <td>
                                    {new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                      minimumFractionDigits: 0,
                                    }).format(prop?.price)}
                                  </td>
                                </tr>
                              ))}
                              {allProducts?.map((prop, index) => (
                                <>
                                  {!products?.some(
                                    (item) => item.id == prop.id
                                  ) && (
                                    <tr key={index}>
                                      <td>
                                        <Checkbox
                                          value={prop}
                                          onChange={(e) => {
                                            productIDs?.includes(prop)
                                              ? setProductIDs(
                                                  products.filter(
                                                    (item) => item !== prop.id
                                                  )
                                                )
                                              : setProductIDs((prev) => [
                                                  ...prev,
                                                  prop.id,
                                                ])
                                            products?.includes(prop)
                                              ? setProducts(
                                                  products.filter(
                                                    (item) => item !== prop
                                                  )
                                                )
                                              : setProducts((prev) => [
                                                  ...prev,
                                                  prop,
                                                ])
                                              }
                                            }
                                        />
                                      </td>
                                      <td>
                                        <img
                                          src={prop?.images?.[0]?.image?.url}
                                          className="w-20 h-20 object-contain"
                                        />
                                      </td>
                                      <td>
                                        <Link
                                          className="text-amber-900"
                                          href={"/dashboard/products/" + prop.id}
                                          target="_blank"
                                        >
                                          {prop?.title}
                                        </Link>
                                        <Typography className="font-bold text-sm">
                                          by{" "}
                                          {prop?.vendor?.firstName +
                                            " " +
                                            prop?.vendor?.lastName}
                                        </Typography>
                                        <Typography
                                          className={
                                            prop.category
                                              ? "text-sm font-bold"
                                              : "text-sm font-bold text-red-500"
                                          }
                                        >
                                          {prop?.category
                                            ? prop?.category?.name
                                            : "category not present"}
                                        </Typography>
                                      </td>
                                      <td>
                                        {new Intl.NumberFormat("en-IN", {
                                          style: "currency",
                                          currency: "INR",
                                          minimumFractionDigits: 0,
                                        }).format(prop?.price)}
                                      </td>
                                    </tr>
                                  )}
                                </>
                              ))}
                            </tbody>
                          </table>

                          <div className="flex items-center gap-4">
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
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}


              <Button className="mt-8" onClick={submit}>Submit</Button>
            </CardBody>
          </Card>
        </div>
      </Sidebar>
    </Suspense>
  );
}

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Page />
    </Suspense>
  );
}