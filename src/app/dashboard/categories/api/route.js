import { API_URL } from '../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value;
    const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  const res = await fetch(`${API_URL}/api/category?page=${page ?? 1}`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}

export async function POST(request){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value;
    const body = await request.json()
    const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  const res = await fetch(`${API_URL}/api/category`, {
    method: "POST",
    headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}

export async function PATCH(request){
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value;
  const body = await request.json()
  const { searchParams } = new URL(request.url)
const page = searchParams.get('page')
const res = await fetch(`${API_URL}/api/category/${body.id}`, {
  method: "PATCH",
  headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})

const data = await res.json()
  return NextResponse.json({code: 200, message: data})
}

export async function DELETE(request){
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value;
  const body = await request.json()
  const { searchParams } = new URL(request.url)
const page = searchParams.get('page')
const res = await fetch(`${API_URL}/api/category/${body.id}`, {
  method: "DELETE",
  headers: {
      Authorization: `JWT ${token}`,
  },
})

const data = await res.json()
  return NextResponse.json({code: 200, message: data})
}