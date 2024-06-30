import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {API_URL} from "../../../../../config";

export async function GET(request){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/category`, {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`
    }
  })

const data = await res.json()

const vendorRequest = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
  },
  });

  const vendor = await vendorRequest.json()
  const res2 = await fetch(`${API_URL}/api/users?where[role][equals]=seller&limit=0`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })
  
  const data2 = await res2.json()
    return NextResponse.json({code: 200, message: data, vendors: data2.docs})
}

export async function POST(request) {
  const token = request.cookies.get('token')?.value
  const fd = await request.formData();
  // fd.append('vendor', vendor.user.id);

  let images = [];
  for (const pair of fd.entries()) {
    if (pair[0] == 'demoimages') {
      const formData = new FormData();
      formData.append('file', pair[1])
      const res = await fetch(`${API_URL}/api/media`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`
        },
        body: formData
      })

      const data = await res.json();
      images.push({ "image": data.doc.id })
      fd.append(`images.${images.length - 1}.image`, data.doc.id)
    }
  }

  if (images.length > 0) {
    const res = await fetch(`${API_URL}/api/product`, {
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`
      },
      body: fd
    })

    const data = await res.json()
    return NextResponse.json({ code: 200, message: data })
  }
}