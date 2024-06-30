import { API_URL } from '../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  try {
    const res = await fetch(`${API_URL}/api/page?page=${page ?? 1}`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json();
    return NextResponse.json({ code: 200, message: data });
  } catch (error) {
    return NextResponse.json({ code: 500, message: 'Internal Server Error' });
  }
}

export async function POST(request) {
  const cookieStore = cookies();
  const token = request.cookies.get('token')?.value;
  const resp = await request.formData();

  try {
    const res = await fetch(`${API_URL}/api/page`, {
      method: 'POST',
      headers: {
        Authorization: `JWT ${token}`,
      },
      body: resp,
    });

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await res.json();
    console.log(data);
    // const products = resp.get('products');

    // const updatePromises = JSON.parse(products).map((item) => {
    //   const fd = new FormData();
    //   item.pages.forEach((page, index) => {
    //     fd.append(`pages.${index}.page`, page.page.id);
    //   });
    //   fd.append(`pages.${item.pages.length}.page`, data.doc.id);

    //   return fetch(`${API_URL}/api/product/${item.id}`, {
    //     method: 'PATCH',
    //     headers: {
    //       Authorization: `JWT ${token}`,
    //     },
    //     body: fd,
    //   });
    // });

    // await Promise.all(updatePromises);
    return NextResponse.json({ code: 200, message: data });
  } catch (error) {
    return NextResponse.json({ code: 500, error: error, message: 'Internal Server Error' });
  }
}
