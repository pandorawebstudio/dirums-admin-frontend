import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value
  const response = await request.json();

  const res = await fetch(`${API_URL}/api/product-approval-message`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
    },
    body: JSON.stringify({ ...response })
  })

  const data = await res.json()

  console.log(response.status);
  console.log(response.product);
  const res2 = await fetch(`${API_URL}/api/product/${response.product}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
    },
    body: JSON.stringify({ approved: response.status === 'active' ? true : false, status: response.status === 'active' ? 'active' : response.status === 'inactive' ? 'inactive' : 'pending' })
  })

  const data2 = await res2.json()
  console.log(data2)

  return NextResponse.json({ code: 200, message: data })
}