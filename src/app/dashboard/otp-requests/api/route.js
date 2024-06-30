import { API_URL } from '../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request){
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value;
  const { searchParams } = new URL(request.url)
  const limit = searchParams.get('limit');
  const phoneNumber = searchParams.get('phoneNumber');
  const page = searchParams.get('page')

  const params = new URLSearchParams({
    page: page ?? 1,
    limit: limit ?? 10,
  });
  
  if (phoneNumber) {
    params.append('phoneNumber', phoneNumber);
  }
  const res = await fetch(`${API_URL}/api/otp/all?${params.toString()}`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

  const data = await res.json()
  if(data?.errors?.length > 0) {
    cookieStore.delete('token');
    cookieStore.delete('apiKey');
    return NextResponse.json({code: 401, message: "Unauthorized"})
  }
  return NextResponse.json({code: 200, message: data})
}