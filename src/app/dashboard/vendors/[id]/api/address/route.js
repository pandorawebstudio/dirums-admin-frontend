
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from '../../../../../../config';

export async function PATCH(request){
    const response = NextResponse
    const apiKey = await request.cookies.get('apiKey')?.value;
    const body = await request.json()
    const res = await fetch(`${API_URL}/api/vendor-address/${body._id}`, {
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