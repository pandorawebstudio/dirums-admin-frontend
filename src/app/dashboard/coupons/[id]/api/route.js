import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';




export async function PATCH(request, { params }) {
  const cookieStore = cookies();
  const token = request.cookies.get('accessToken')?.value
  const response = await request.json();
  const res = await fetch(`${API_URL}/api/coupons/${params.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...response })
  })

  const data = await res.json()
  return NextResponse.json({ code: 200, message: data })
}