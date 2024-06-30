import { API_URL } from '../../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request){
    const cookieStore = cookies();
    const token = request.cookies.get('accessToken')?.value
    const { searchParams } = new URL(request.url)
    const resp = await request.json()
  const res = await fetch(`${API_URL}/api/coupons`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({...resp, isActive: resp.status == 'active' ? true : false})
  })

const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}