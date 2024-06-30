import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from '../../../../../config';

export async function GET(request, {params}){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/product/${params.edit}`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}

export async function PATCH(request, {params}){
  const token = request.cookies.get('token')?.value
  const fd = await request.formData();

  let images = [];
  for (const pair of fd.entries()) {
    if(pair[0] == 'demoimages'){
      const formData = new FormData();
      formData.append('file', pair[1])
      const res = await fetch(`${API_URL}/api/media`, {
        method: "POST",
        headers: {
            Authorization: `JWT ${token}`,
        },
        body: formData
      })

      const data = await res.json();
      images.push({"image": data.doc.id})
      fd.append(`images.${images.length - 1}.image`, data.doc.id)
    }
  }

if(images.length > 0){
const res = await fetch(`${API_URL}/api/product/${params.edit}`, {
  method: "PATCH",
  headers: {
      Authorization: `JWT ${token}`,
  },
  body: fd
})

const data = await res.json()
  return NextResponse.json({code: 200, message: data})
}
}