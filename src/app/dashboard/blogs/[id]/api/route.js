import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request, {params}){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/blogs/${params.id}`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}


export async function PATCH(request, {params}){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
    const response = await request.formData();

    for (const pair of response.entries()) {
      if(pair[0] == 'bannerimg'){
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
        response.append(`banner`, data.doc.id)
      }
    }
  
  const res = await fetch(`${API_URL}/api/blogs/${params.id}`, {
    method: "PATCH",
    headers: {
        Authorization: `JWT ${token}`,
    },
    body: response
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}