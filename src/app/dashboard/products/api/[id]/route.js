import { NextResponse } from 'next/server';
import { API_URL } from '../../../../../config';

export async function GET(request, { params }) {
    try {
        const token = request.cookies.get('token')?.value
        const res = await fetch(`${API_URL}/api/creator?user=${params.id}`, {
            headers: {
                Authorization: `JWT ${token}`
            }
        })

        const data = await res.json()
        return NextResponse.json({code: 200, message: data})
    } catch (err) {
        return NextResponse.json({ code: 200, message: err.message })
    }
}