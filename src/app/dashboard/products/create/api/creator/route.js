import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from '../../../../../../config';

export async function GET(request){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/creator`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}