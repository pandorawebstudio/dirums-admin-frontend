import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PATCH(request, { params }) {
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value
  const resp = await request.formData()
  const res = await fetch(`${API_URL}/api/page/${params.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: resp
  })

  const data = await res.json()

  // const products = resp.get('products')

  // for (const item of JSON.parse(products)) {
  //   const fd = new FormData();
  //   if (item.pages != undefined && item.pages.length > 0) {
  //     item.pages.forEach((page, index) => {
  //       fd.append(`pages.${index}.page`, page.page.id)
  //     })
  //     fd.append(`pages.${item.pages.length}.page`, data.doc.id)
  //   }
  //   else {
  //     fd.append(`pages.0.page`, data.doc.id)
  //   }
  //   const patched = await fetch(`${API_URL}/api/product/${item.id}`, {
  //     method: 'PATCH',
  //     headers: {
  //       Authorization: `JWT ${token}`
  //     },
  //     body: fd
  //   })

  //   const data2 = await patched.json()

  // }

  // const req = await fetch(`${API_URL}/api/product?where[pages.page][equals]=${params.id}&limit=0`)

  // const getAllPageProducts = await req.json()

  // for (const item of getAllPageProducts.docs) {
  //   // console.log(JSON.parse(products).some(product => product.id === item.id))
  //   const fd = new FormData();
  //   if (!JSON.parse(products).some(product => product.id === item.id)) {
  //     item.pages.forEach((page, index) => {
  //       if (page.page.id != params.id) {
  //         fd.append(`pages.${index}.page`, page.page.id)
  //       }
  //     })

  //     // for (let pair of fd.entries()) {
  //     //   console.log(pair[0], pair[1])
  //     // }
  //     const res3 = await fetch(`${API_URL}/api/product/${item.id}`, {
  //       method: 'PATCH',
  //       headers: {
  //         Authorization: `JWT ${token}`
  //       },
  //       body: fd
  //     })

  //     const data3 = await res3.json()
  //   }
  // }

  return NextResponse.json({ code: 200, message: data })
}