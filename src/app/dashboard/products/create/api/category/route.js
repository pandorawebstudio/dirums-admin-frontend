import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import uuid4 from "uuid4";
import { API_URL } from '../../../../../../config';

export async function POST(request) {
  const token = request.cookies.get('token')?.value
  const resp = await request.json();
  const res = await fetch(`${API_URL}/api/category`, {
    method: "POST",
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(resp)
  })

  const data = await res.json()
  return NextResponse.json(data)
}