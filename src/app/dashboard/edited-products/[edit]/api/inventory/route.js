import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import uuid4 from "uuid4";
import { API_URL } from '../../../../../../config';
export async function PATCH(request){
  const token = request.cookies.get('token')?.value
  const resp = await request.json();
const res = await fetch(`${API_URL}/api/inventory/${resp.inventoryId}`, {
  method: "PATCH",
  headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    quantity: resp.quantity,
    backOrder: false,
    status: resp.quantity > 0 ? "inStock" : 'outOfStock'
  })
})

const data = await res.json()
  return NextResponse.json({code: 200, message: data})
}