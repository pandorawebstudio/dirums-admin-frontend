"use client";

import React, { useEffect, useState } from "react";
import ProductForm from '../../../../components/productForm2'
import { BASE_URL } from "../../../../config";
import { Spinner } from "@material-tailwind/react";
import Sidebar from "../../../../components/sidebar";

export default function StepperWithContent({params}) {
    const [data, setData] = useState([]);
    const [flag, setFlag] = useState(false);
    if(data?.length == 0 && flag === false){
        fetch(`${BASE_URL}/dashboard/products/${params.edit}/api`)
        .then(res => res.json())
        .then(data => {
          setData(data.message);
          setFlag(true);
        })
    }
  return(
    <>
      {data?.length !== 0 ? (
        <ProductForm editData={data} productUrl={`${BASE_URL}/dashboard/products/${params.edit}/api`} inventoryUrl={`${BASE_URL}/dashboard/products/${params.edit}/api/inventory`} />
      ) : (
        <Sidebar >
          <div className="flex justify-center items-center space-x-2 mt-80">
            <span>Please wait while we are loading your data...</span>
            <Spinner className="w-4 h-4" />
          </div>
        </Sidebar>
      )}
    </>
  );
}
