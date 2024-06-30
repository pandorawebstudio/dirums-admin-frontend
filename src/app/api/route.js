import { API_URL } from '../../config';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request){
    const cookieStore = cookies();
    cookieStore.delete('token');
    cookieStore.delete('apiKey');
    
    return NextResponse.json({code: 200, message: 'logged out auccessfully'})
}