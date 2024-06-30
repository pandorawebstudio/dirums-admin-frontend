import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/variation`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

const data = await res.json()
  return NextResponse.json({code: 200, message: data.docs})
}

export async function POST(request){
  const cookieStore = cookies();
  const apiKey = request.cookies.get('apiKey')?.value
  const userId = request.cookies.get('userId')?.value

  const response = await request.json();
const res = await fetch(`${API_URL}/api/variation`, {
  method: "POST",
  headers: {
      Authorization: `users API-Key ${apiKey}`,
      'Content-Type': 'application/json'
},
body: JSON.stringify({...response, user: userId})
})

const data = await res.json()

  return NextResponse.json({code: 200, message: data})
}