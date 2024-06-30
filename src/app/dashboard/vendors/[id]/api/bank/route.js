
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from '../../../../../../config';

export async function PATCH(request){
    const response = NextResponse
    const apiKey = await request.cookies.get('apiKey')?.value;
    const body = await request.json()
    const res = await fetch(`${API_URL}/api/user-bank-details/${body._id}`, {
        method: "PATCH",
      headers: {
          Authorization: `users API-Key ${apiKey}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  
    const data = await res.json()
        return response.json({code: data.code, data: data}) 
  }

  export async function POST(request, {params}){
    const response = NextResponse
    const apiKey = await request.cookies.get('apiKey')?.value;
    const userId = await request.cookies.get('userId')?.value;
    const body = await request.json()
    const res = await fetch(`${API_URL}/api/user-bank-details/`, {
        method: "POST",
      headers: {
          Authorization: `users API-Key ${apiKey}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  
    const data = await res.json()

    const res2 = await fetch(`${API_URL}/api/users/${params.id}`, {
        method: "PATCH",
      headers: {
          Authorization: `users API-Key ${apiKey}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({bank: data.doc.id})
    })
    const data2 = await res2.json()

    return response.json({code: data.code, data: data}) 
  }