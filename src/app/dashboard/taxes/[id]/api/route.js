import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {API_URL} from "../../../../../config";

export async function GET(request, { params }) {
  const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/taxes/${params.id}`, {
    method: "GET",
    headers: {
      Authorization: `JWT ${token}`
    }
  })

  const data = await res.json()
  return NextResponse.json({ code: 200, message: data })

}

export async function PATCH(request, { params }) {
  const token = request.cookies.get('token')?.value
  const fd = await request.json();

  const res = await fetch(`${API_URL}/api/taxes/${params.id}`, {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
    },
    body: JSON.stringify({ ...fd })
  })

  const data = await res.json()
  return NextResponse.json({ code: 200, message: data })

}