import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import uuid4 from "uuid4";
import { API_URL } from '../../../../../../config';
export async function POST(request){
  const token = request.cookies.get('token')?.value
  const userId = request.cookies.get('userId')?.value
  const resp = await request.json();
 const sku = uuid4();

const res2 = await fetch(`${API_URL}/api/inventory`, {
  method: "POST",
  headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`

  },
  body: JSON.stringify({
    sku: sku,
    quantity: resp.quantity,
    backOrder: false,
    status: "inStock"
  })
})

const data2 = await res2.json()
  return NextResponse.json({code: 200, message: data2})
}