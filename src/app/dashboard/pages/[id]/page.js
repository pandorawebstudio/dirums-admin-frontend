'use client';

import Sidebar from '../../../../components/sidebar';
import { API_URL, BASE_URL } from '../../../../config';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { Alert, Button, Checkbox, IconButton, Input, Option, Radio, Select, Switch, Textarea, Typography, Spinner } from '@material-tailwind/react'
import qs from 'qs';
import React, { Suspense, useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import ReactPaginate from 'react-paginate';
import Link from 'next/link'
// import dynamic from 'next/dynamic'
// import Editor from "../../../../components/Editor";
import { useRouter, useSearchParams } from 'next/navigation';
// import dynamic from 'next/dynamic';
import Tiptap from '../../../../components/Tiptap';


function Page({ params }) {
  const { register, handleSUbmit, control, formState: { errors } } = useForm();
  // const Editor = dynamic(() => import("../../../../components/Editor"), { ssr: false });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'condition'
  })
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const [page, setPage] = useState(initialPage);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [link, setLink] = useState("");
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [footerContent, setFooterContent] = useState("");
  const [method, setMethod] = useState("manual");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [prevPage, setPrevPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [conditionValue, setConditionValue] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [logic, setLogic] = useState("");
  const [condition, setCondition] = useState([{
    main: "",
    operator: "",
    value: ""
  }]);

  const [active, setActive] = React.useState(1);

  useEffect(() => {
    fetch(`${API_URL}/api/page/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.name)
        setSlug(data.slug)
        setLogic(data.logic)
        // setMethod(data.method)
        setMetaTitle(data.metaTitle)
        setMetaDescription(data.metaDescription)
        setFeatured(data.featured)
        data.conditions.map((prop) => {
          setCondition([
            {
              main: prop.main,
              operator: prop.operator,
              value: prop.value,
            }
          ])
        })
        setHeading(data.heading)
        setSubheading(data.subheading)
        setFooterContent(data.footerContent)
        setSlug(data.slug);
        data.products.map((item, index) => {
          setProducts(prev => [...prev, item.product.id]);
        });
      })
  }, [])

  useEffect(() => {
    console.log(products);
  })

  const getItemProps = (index) =>
  ({
    variant: active === index ? "filled" : "text",
    color: "gray",
    onClick: () => { setActive(index); fetchProducts() },
    className: "rounded-full",
  });

  const next = () => {
    if (active === 5) return;

    setActive(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
  };


  const setTitleAndSlug = (e) => {
    setTitle(e.target.value)
    setSlug(e.target.value.toLowerCase().split(" ").join("-"))
  }

  useEffect(() => {
    append({
      main: "",
      operator: "",
      value: ""
    })
  }, [])

  useEffect(() => {
    if (slug != "")
      setLink('/' + slug)
  }, [slug])

  const handleInputValidation = (input, maxLength, setFunction) => {
    if (input.length > maxLength) {
      setFunction(input.substring(0, maxLength)); // Trim the input to the maximum length
    } else {
      setFunction(input);
    }
  };


  const handleConditionChange = (index, field, value) => {
    const updatedCondition = [...condition];
    updatedCondition[index] = {
      ...updatedCondition[index],
      [field]: value,
    };
    setCondition(updatedCondition);
  };

  const createAutomatedPage = () => {
    const query = {
      [logic]: condition.map((item) => ({
        [item.main]: {
          [item.operator]: item.value
        }
      }))
    }

    const strigifiedQuery = qs.stringify({ where: query, limit: 0 }, { addQueryPrefix: true })
    fetch(`${API_URL}/api/product${strigifiedQuery}`)
      .then(res => res.json())
      .then(data => {
        const fd = new FormData();
        fd.append('name', title),
          fd.append('slug', slug),
          fd.append('link', link),
          fd.append('heading', heading),
          fd.append('subheading', subheading),
          fd.append('footerContent', footerContent),
          fd.append('featured', featured),
          fd.append('logic', logic),
          fd.append('method', method),
          fd.append('metaTitle', metaTitle),
          fd.append('metaDescription', metaDescription),
          fd.append('canonical', `${BASE_URL}/${link}`),
          fd.append('products', JSON.stringify(data.docs))
        {
          condition?.map((prop, index) => {
            fd.append(`conditions.${index}.main`, prop.main)
            fd.append(`conditions.${index}.operator`, prop.operator)
            fd.append(`conditions.${index}.value`, prop.value)
          })
        }
        fetch(`${BASE_URL}/dashboard/pages/${params.id}/api`, {
          method: 'PATCH',

          body: fd
        })
          .then(res => res.json())
          .then(data => {
            setSuccess(true);
            router.push('/dashboard/pages');
          })
      })
  }

  const createManualPage = () => {
    setError("")
    if (products?.length == 0) {
      setError('Please select a few products to be uploaded to this page')
    }
    else {
      setIsLoading2(true)
      const fd = new FormData();
      fd.append('name', title),
        fd.append('slug', slug),
        fd.append('link', link),
        fd.append('heading', heading),
        fd.append('subheading', subheading),
        fd.append('footerContent', footerContent),
        fd.append('featured', featured),
        fd.append('logic', logic),
        fd.append('method', method),
        fd.append('metaTitle', metaTitle),
        fd.append('metaDescription', metaDescription),
        fd.append('canonical', `${BASE_URL}/${link}`),
        products.map((item, index) => {
          fd.append(`products.${index}.product`, item);
        });
      {
        condition?.map((prop, index) => {
          fd.append(`conditions.${index}.main`, prop.main)
          fd.append(`conditions.${index}.operator`, prop.operator)
          fd.append(`conditions.${index}.value`, prop.value)
        })
      }
      fetch(`${BASE_URL}/dashboard/pages/${params.id}/api`, {
        method: 'PATCH',
        body: fd
      })
        .then(res => res.json())
        .then(data => {
          setSuccess(true);
          setIsLoading2(false);
          router.push('/dashboard/pages');
        })
    }
  }

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
        // {
        //   'tags.name': {
        //     contains: value
        //   }
        // },
        {
          'attributes.value': {
            contains: value
          }
        },
      ]
    }

    const strigifiedQuery = qs.stringify({ where: query, limit: 20, page: page }, { addQueryPrefix: true })
    fetch(`${API_URL}/api/product${strigifiedQuery}`)
      .then(res => res.json())
      .then(data => {
        setAllProducts(data.docs);
        setNextPage(data.nextPage);
        setPrevPage(data.prevPage);
        setTotalPages(data.totalPages);
        setIsLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts();
  }, [page, search])

  // useEffect(() => {
  //   fetch(`${API_URL}/api/product?where[pages.page][equals]=${params.id}&limit=0`)
  //     .then(res => res.json())
  //     .then(data => { setProducts(data.docs) })
  // }, [])

  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
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
          Page Created Successfully
        </Alert>
        <div className="flex flex-col my-8 justify-between gap-4">
          <Input
            label="Page name"
            defaultValue={title}
            onInput={setTitleAndSlug}
          />
          <Input
            label="Slug"
            value={slug}
            onInput={(e) => {
              setSlug(e.target.value.split(" ").join("-"));
            }}
          />
          <Switch
            label="Featured?"
            defaultChecked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          {/* <Typography className="text-sm font-bold my-3">
            Product selection methods
          </Typography>
          <div>
            <Radio
              label="Manual"
              value="manual"
              checked={method == "manual"}
              onChange={(e) => setMethod(e.target.value)}
            />
            <Radio
              label="Automated"
              value="automated"
              checked={method == "automated"}
              onChange={(e) => setMethod(e.target.value)}
            />
          </div>

          <Typography className="text-sm font-bold my-3">Conditions</Typography>

          {method == "automated" && (
            <>
              <div className="flex gap-4">
                <Typography className="my-3">Product should match: </Typography>
                <Radio
                  label="All conditions"
                  value="and"
                  checked={logic == "and"}
                  onChange={(e) => setLogic(e.target.value)}
                />
                <Radio
                  label="Any condition"
                  value="or"
                  checked={logic == "or"}
                  onChange={(e) => setLogic(e.target.value)}
                />
              </div>
              {fields?.map((prop, index) => (
                <>
                  <div
                    className={
                      fields?.length > 1
                        ? "grid lg:grid-cols-4 grid-cols-1 gap-3"
                        : "grid lg:grid-cols-3 grid-cols-1 gap-3"
                    }
                  >
                    <Select
                      value={condition[index]?.main}
                      onChange={(e) => handleConditionChange(index, "main", e)}
                    >
                      <Option value="category.name">Product category</Option>
                      <Option value="vendor.name">Product vendor</Option>
                      <Option value="tags.name">Product tags</Option>
                    </Select>

                    <Select
                      value={condition[index]?.operator}
                      onChange={(e) =>
                        handleConditionChange(index, "operator", e)
                      }
                    >
                      <Option value="equals">equals</Option>
                      <Option value="not equals">not equals</Option>
                      <Option value="contains">Contains</Option>
                      <Option value="in">in</Option>
                      <Option value="not in">not in</Option>
                      <Option value="exists">exists</Option>
                    </Select>

                    <Input
                      defaultValue={condition[index]?.value}
                      onInput={(e) =>
                        handleConditionChange(index, "value", e.target.value)
                      }
                    />
                    {fields?.length > 1 && (
                      <Button color="red" onClick={() => remove(index)}>
                        Remove
                      </Button>
                    )}
                  </div>
                </>
              ))}
              <Button
                className="w-fit px-3 bg-white border border-black text-black"
                onClick={() => append({ main: "", operator: "", value: "" })}
              >
                Add condition
              </Button>
            </>
          )} */}

          {method == "manual" && (
            <div className="flex flex-col justify-center items-center w-full">
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
                    <table className="table w-full mt-10">
                      <thead className='border-2'>
                        <th></th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Product Status</th>
                        <th>Vendor Status</th>
                        <th>Price</th>
                        <th>Category</th>
                      </thead>
                      <tbody>
                      {allProducts?.map((prop1, index) => (
                          <>
                          {products?.includes(prop1.id) && (
                            <tr key={index} className='text-center border-2'>
                              <td>
                                <Checkbox
                                  value={prop1.id}
                                  checked={products?.includes(prop1.id)}
                                  onChange={(e) =>
                                    setProducts(
                                        products.filter(
                                          (item) => item !== prop1.id
                                        )
                                    )
                                  }
                                />
                              </td>
                              <td className='whitespace-normal break-words max-w-[120px]'>
                                <img
                                  src={prop1?.images?.[0]?.image?.url}
                                  className="w-20 h-20"
                                />
                              </td>
                              <td className='whitespace-normal break-words max-w-[120px]'>
                                <Link
                                  className="text-amber-900"
                                  href={"/dashboard/products/" + prop1.id}
                                  target="_blank"
                                >
                                  {prop1?.title}
                                </Link>
                                <Typography className="font-bold text-sm">
                                  by{" "}
                                  {prop1?.vendor?.firstName +
                                    " " +
                                    prop1?.vendor?.lastName}
                                </Typography>
                              </td>
                              <td>
                                <Typography className="font-bold text-sm">
                                  <span className={
                                    prop1?.status === 'active'
                                      ? 'text-green-500'
                                      : prop1?.status === 'pending'
                                        ? 'text-amber-500'
                                        : 'text-red-500'
                                  }>
                                    {prop1?.status === 'active'
                                      ? 'Approved'
                                      : prop1?.status === 'pending'
                                        ? 'Pending'
                                        : 'Disapproved'
                                    }
                                  </span>
                                </Typography>
                              </td>
                              <td>
                                <Typography className="font-bold text-sm">
                                  <span className={
                                    prop1?.vendor?.status === 'active'
                                      ? 'text-green-500'
                                      : prop1?.vendor?.status === 'pending'
                                        ? 'text-amber-500'
                                        : 'text-red-500'
                                  }>
                                    {prop1?.vendor?.status === 'active'
                                      ? 'Approved'
                                      : prop1?.vendor?.status === 'pending'
                                        ? 'Pending'
                                        : 'Disapproved'
                                    }
                                  </span>
                                </Typography>
                              </td>
                              <td>
                                {prop1?.has_variants ? (
                                  <>
                                    {prop1?.variants.map((variant, index) => (
                                      <Typography key={index} className='space-x-1'>
                                        <span>{variant?.name}</span>
                                        :
                                        <span>
                                          {new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                            minimumFractionDigits: 0,
                                          }).format(variant?.price)}
                                        </span>

                                      </Typography>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    {new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                      minimumFractionDigits: 0,
                                    }).format(prop1?.price)}
                                  </>
                                )}

                              </td>
                              <td>
                                <Typography
                                  className={
                                    prop1.category
                                      ? "text-sm font-bold"
                                      : "text-sm font-bold text-red-500"
                                  }
                                >
                                  {prop1?.category
                                    ? prop1?.category?.name
                                    : "category not present"}
                                </Typography>
                              </td>
                            </tr>
                          )}
                         
                          </>
                        ))}
                        {allProducts?.map((prop1, index) => (
                          <>
                           {!products?.includes(prop1.id) && (
                            <tr key={index} className='text-center border-2'>
                              <td>
                                <Checkbox
                                  value={prop1.id}
                                  onChange={(e) =>
                                    setProducts((prev) => [...prev, prop1.id])
                                  }
                                />
                              </td>
                              <td className='whitespace-normal break-words max-w-[120px]'>
                                <img
                                  src={prop1?.images?.[0]?.image?.url}
                                  className="w-20 h-20"
                                />
                              </td>
                              <td className='whitespace-normal break-words max-w-[120px]'>
                                <Link
                                  className="text-amber-900"
                                  href={"/dashboard/products/" + prop1.id}
                                  target="_blank"
                                >
                                  {prop1?.title}
                                </Link>
                                <Typography className="font-bold text-sm">
                                  by{" "}
                                  {prop1?.vendor?.firstName +
                                    " " +
                                    prop1?.vendor?.lastName}
                                </Typography>
                              </td>
                              <td>
                                <Typography className="font-bold text-sm">
                                  <span className={
                                    prop1?.status === 'active'
                                      ? 'text-green-500'
                                      : prop1?.status === 'pending'
                                        ? 'text-amber-500'
                                        : 'text-red-500'
                                  }>
                                    {prop1?.status === 'active'
                                      ? 'Approved'
                                      : prop1?.status === 'pending'
                                        ? 'Pending'
                                        : 'Disapproved'
                                    }
                                  </span>
                                </Typography>
                              </td>
                              <td>
                                <Typography className="font-bold text-sm">
                                  <span className={
                                    prop1?.vendor?.status === 'active'
                                      ? 'text-green-500'
                                      : prop1?.vendor?.status === 'pending'
                                        ? 'text-amber-500'
                                        : 'text-red-500'
                                  }>
                                    {prop1?.vendor?.status === 'active'
                                      ? 'Approved'
                                      : prop1?.vendor?.status === 'pending'
                                        ? 'Pending'
                                        : 'Disapproved'
                                    }
                                  </span>
                                </Typography>
                              </td>
                              <td>
                                {prop1?.has_variants ? (
                                  <>
                                    {prop1?.variants.map((variant, index) => (
                                      <Typography key={index} className='space-x-1'>
                                        <span>{variant?.name}</span>
                                        :
                                        <span>
                                          {new Intl.NumberFormat("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                            minimumFractionDigits: 0,
                                          }).format(variant?.price)}
                                        </span>

                                      </Typography>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    {new Intl.NumberFormat("en-IN", {
                                      style: "currency",
                                      currency: "INR",
                                      minimumFractionDigits: 0,
                                    }).format(prop1?.price)}
                                  </>
                                )}

                              </td>
                              <td>
                                <Typography
                                  className={
                                    prop1.category
                                      ? "text-sm font-bold"
                                      : "text-sm font-bold text-red-500"
                                  }
                                >
                                  {prop1?.category
                                    ? prop1?.category?.name
                                    : "category not present"}
                                </Typography>
                              </td>
                            </tr>
                           )}
                          </>
                        ))}
                      </tbody>
                    </table>
                  )}
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
            </div>
          )}

          <Input
            label="Heading"
            defaultValue={heading}
            containerProps={{ className: "mt-6" }}
            onInput={(e) =>
              handleInputValidation(e.target.value, 70, setHeading)
            }
            maxLength={70}
          />
          <Typography className="text-sm my-2 text-green-500 font-bold">
            Maximum heading length: {heading?.length} / 70 characters
          </Typography>
          <Input
            label="Subheading"
            defaultValue={subheading}
            onInput={(e) => setSubheading(e.target.value)}
          />
          {/* <Editor
            value={footerContent}
            onBlur={(data) => {
              setFooterContent(data);
            }}
          /> */}
          <Tiptap
            content={footerContent}
            onChange={(data) => {
              setFooterContent(data);
            }}
          />
          <Input
            label="Meta Title"
            defaultValue={metaTitle}
            onInput={(e) => setMetaTitle(e.target.value)}
          />
          {/* <Typography className='text-sm my-2 text-green-500 font-bold'>Maximum meta tile length: {metaTitle?.length} / 70 characters</Typography> */}
          <Input
            label="Meta Description"
            defaultValue={metaDescription}
            onInput={(e) => setMetaDescription(e.target.value)}
          />
          {/* <Typography className='text-sm my-2 text-green-500 font-bold'>Maximum meta description length: {metaDescription?.length} / 160 characters</Typography> */}
          <hr className="my-3 bg-gray-700" />

          {error && (
            <p className='text-sm text-red-500 my-2'>{error}</p>
          )}
          <Button
            className="w-fit px-6"
            onClick={() =>
              method == "automated" ? createAutomatedPage() : createManualPage()
            }
          >
            {isLoading2 ? (
              <Spinner className="w-4 h-4 mx-auto" />
            ) : (
              "Update Page"
            )}
          </Button>
        </div>
      </Sidebar>
    </Suspense>
  );
}

export default function SuspenseWrapper({params}) {
  return (
    <Suspense fallback={<Spinner className="h-12 w-12" />}>
      <Page params={ params }/>
    </Suspense>
  );
}