import { NextResponse, NextRequest } from 'next/server';
import { API_URL, BASE_URL } from '../../config';
import { cookies } from 'next/headers';

const getNewTokens = async (refresh_token) => {
  // Your code to fetch new tokens using the refresh token goes here
  // For example, make an API call to your backend with the refresh token
  const response = await fetch(`${API_URL}/v1/token/refresh-token`, {
    method: 'POST',
    body: JSON.stringify({ refreshToken: refresh_token }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to get new tokens');
  }

  const { accessToken, refreshToken } = await response.json();
  return {accessToken, refreshToken}
}
export async function refreshToken() {
  
    const response = NextResponse.next()
    const refresh_token = cookies().get('refreshToken')?.value;
    const access_token = cookies().get('accessToken')?.value;
    // console.log(request)
    if(!access_token){
    const data = await getNewTokens(refresh_token);
    
    var today = new Date();
    cookies().set({name: 'accessToken', value: data.accessToken, httpOnly: true, expires: today.setHours(today.getHours() + 1)})
    cookies().set({name: 'refreshToken', value: data.refreshToken, httpOnly: true, expires: today.setHours(today.getHours() + 8760),})
    return response  

    
}
}