import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function PATCH(request, {params}){
  try {
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
    const response = await request.json();
    const apiKey = await request.cookies.get('apiKey')?.value;
    const res = await fetch(`${API_URL}/api/order/item-status/${params.id}`, {
      method: "PATCH",
      headers: {
          Authorization: `users API-Key ${apiKey}`,
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({...response})
    })

    const data = await res.json()
    return NextResponse.json({code: 200, message: data})
  } catch(error) {
    return NextResponse.json({code: 500})
  }
    
}