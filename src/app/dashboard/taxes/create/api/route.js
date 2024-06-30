import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {API_URL} from "../../../../../config";

export async function POST(request){
    const token = request.cookies.get('token')?.value
    const fd = await request.json();
    
  const res = await fetch(`${API_URL}/api/taxes`, {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
      Authorization: `JWT ${token}`
    },
    body: JSON.stringify({...fd})
  })
  
  const data = await res.json()
    return NextResponse.json({code: 200, message: data})

  }