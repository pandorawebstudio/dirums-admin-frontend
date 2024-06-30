"use client";

import React, { useState } from "react";
import ProductForm from '../../../../components/productForm2'
import { BASE_URL } from "../../../../config";

export default function StepperWithContent({params}) {
    const [data, setData] = useState([]);
    if(data?.length == 0){
        fetch(`${BASE_URL}/dashboard/edited-products/${params.edit}/api`)
        .then(res => res.json())
        .then(data => {setData(data.message)})
    }
  return(
    <>
    {data?.length != 0  && (
        <ProductForm editData={data} productUrl={`${BASE_URL}/dashboard/edited-products/${params.edit}/api`} inventoryUrl={`${BASE_URL}/dashboard/products/${params.edit}/api/inventory`} />

    )}
    </>
    
  );
}
