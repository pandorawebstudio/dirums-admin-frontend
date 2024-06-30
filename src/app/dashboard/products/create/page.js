"use client";

import React, { useEffect, useState } from "react";
import ProductForm from "../../../../components/productForm2";
import { BASE_URL } from "../../../../config";

export default function StepperWithContent() {
  return(
    <ProductForm productUrl={`${BASE_URL}/dashboard/products/create/api`} inventoryUrl={`${BASE_URL}/dashboard/products/create/api/inventory`}/>
    
  );
}
