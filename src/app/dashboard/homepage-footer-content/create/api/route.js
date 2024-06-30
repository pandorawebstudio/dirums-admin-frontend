import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value
  const response = await request.json();
  const res = await fetch(`${API_URL}/api/homepage-footer-content`, {
    method: "POST",
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ...response })
  })

  const data = await res.json()
  return NextResponse.json({ code: 200, message: data })
}