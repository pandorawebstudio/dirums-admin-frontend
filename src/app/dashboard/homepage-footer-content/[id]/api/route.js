import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request, {params}){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/homepage-footer-content/${params.id}`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}


export async function PATCH(request, { params }) {
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value
  const response = await request.json();
  const res = await fetch(`${API_URL}/api/homepage-footer-content/${params.id}`, {
    method: "PATCH",
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...response })
  })

  const data = await res.json()
  return NextResponse.json({ code: 200, message: data })
}