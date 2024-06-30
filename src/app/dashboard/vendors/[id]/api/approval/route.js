

import { NextResponse } from 'next/server';
import { API_URL } from '../../../../../../config';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const id = searchParams.get('productId');

    if (!id) {
      return NextResponse.json({ code: 400, message: 'Product ID is required' });
    }

    const url = new URL(`${API_URL}/api/product-approval-message`);
    url.searchParams.append('where[product][equals]', id);
    url.searchParams.append('page', page ?? '1');
    url.searchParams.append('limit', '10');

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `JWT ${token}`
      }
    });
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ code: res.status, message: errorData });
    }

    const data = await res.json();
    return NextResponse.json({ code: 200, message: data });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ code: 500, message: 'Internal Server Error' });
  }
}

