import { API_URL } from '../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const cookieStore = cookies();
  const token = request.cookies.get('accessToken')?.value
  const { searchParams } = new URL(request.url)
  const page = searchParams.get('page');
  const limit = searchParams.get('limit');
  const query = searchParams.get('query');
  const res = await fetch(`${API_URL}/api/users?${query}&page=${page ?? 1}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()
  if (data?.errors?.length > 0) {
    return NextResponse.json({ code: 401, message: "Unauthorized" })
  }
  return NextResponse.json({ code: 200, message: data })
}