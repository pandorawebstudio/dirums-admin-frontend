import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import {BASE_URL, API_URL} from '../../../config'
export async function POST(request){
  const res = await request.json();
  const response = NextResponse
  const resi = await fetch(`${API_URL}/api/login`, {
    method: 'POST',
    credentials: "include",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: res.email,
        password: res.password,
        role: 'admin'
    })
  })
   
const data = await resi.json()
    if(!data.errors){
      if(data.user.role.name == 'Admin'){
      const cookieStore = cookies();
      const oneDay = 24 * 60 * 60 * 1000
      cookieStore.set('accessToken', data.accessToken, {httpOnly: true, expires: Date.now() + oneDay })
      cookieStore.set('refreshToken', data.refreshToken, {httpOnly: true})
      cookieStore.set('userId', data.user._id, {httpOnly: true})
    return response.json({code: 200, message: "Logged In successfully"})
      }
      else{
        return response.json({code: 400, message: {message: "You are not allowed to login"}})  
      }
    }
    else{
      return response.json({code: 400, message: data.errors[0]}) 
    }
}