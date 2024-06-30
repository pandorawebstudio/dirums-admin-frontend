import { API_URL } from '../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value;
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page')
  const res = await fetch(`${API_URL}/api/users?where[role][equals]=seller&page=${page ?? 1}`, {
    headers: {
      Authorization: `JWT ${token}`
    }
  })

  const data = await res.json()
  return NextResponse.json({ code: 200, message: data })
}