import { API_URL } from '../../../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request){
  const token = request.cookies.get('token')?.value
  const res = await fetch(`${API_URL}/api/mega-menu?limit=0&sort=createdAt`, {
    headers: {
        Authorization: `JWT ${token}`
    }
  })

  const data = await res.json()
  return NextResponse.json({code: 200, message: data})
}

export async function PATCH(request) {
    try {
        const token = request.cookies.get('token')?.value;

        // Get the JSON data from the request body
        const requestData = await request.json();
        const res = await fetch(`${API_URL}/api/mega-menu/${requestData.categoryId}`, {
            method: "PATCH",
            headers: {
                Authorization: `JWT ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ page: requestData.pageId }),
        });
        // Parse the response JSON
        const data = await res.json();
        // Return a response
        return new Response(JSON.stringify({ code: 200, message: data }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ code: 500, message: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(request) {
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value;
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const res = await fetch(`${API_URL}/api/mega-menu`, {
        method: "POST",
        headers: {
            Authorization: `JWT ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = await res.json()
    return NextResponse.json({ code: 200, message: data })
}
