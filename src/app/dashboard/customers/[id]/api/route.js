import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request, {params}){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/users/${params.id}`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}

export async function PATCH(request) {
  const response = NextResponse
  const apiKey = await request.cookies.get('apiKey')?.value;
  const body = await request.json()
  const res = await fetch(`${API_URL}/api/users/${body._id}`, {
    method: "PATCH",
    headers: {
      Authorization: `users API-Key ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  const data = await res.json()
  return response.json({ code: data.code, data: data })
}
