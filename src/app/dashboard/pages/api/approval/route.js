import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value
  const response = await request.json();
  const featuredStatus = request.url.split('?');

  const res = await fetch(`${API_URL}/api/page-approval-message`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
    },
    body: JSON.stringify({ ...response })
  })

  const data = await res.json()

  const res2 = await fetch(`${API_URL}/api/page/${response.page}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
    },
    body: JSON.stringify({ featured: featuredStatus[1] })
  })

  const data2 = await res2.json()

  return NextResponse.json({ code: 200, message: data })
}