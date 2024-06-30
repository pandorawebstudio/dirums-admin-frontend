import { NextResponse } from 'next/server';
import { API_URL } from '../../../../../../config';

export async function PATCH(request, { params }) {
  const response = NextResponse;
  const token = request.cookies.get('token')?.value;
  const body = await request.formData();

  console.log(body);

  let profilePictureId;

  // Upload the image and get the profile picture ID
  for (const pair of body.entries()) {
    if (pair[0] === "image") {
      const formData = new FormData();
      formData.append("file", pair[1]);
      const res = await fetch(`${API_URL}/api/media`, {
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      profilePictureId = data.doc.id;
      break; // Exit the loop after processing the image
    }
  }

  // Create a new FormData object without the image field
  const newBody = new FormData();
  for (const pair of body.entries()) {
    if (pair[0] !== "image") {
      newBody.append(pair[0], pair[1]);
    }
  }

  // Append the profilePicture field to the new FormData object
  if (profilePictureId) {
    newBody.append('profilePicture', profilePictureId);
  }

  // console.log(newBody);
  
  // Perform the PATCH request with the new FormData object
  const res = await fetch(`${API_URL}/api/users/${params.id}`, {
    method: "PATCH",
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: newBody,
  });

  const data = await res.json();
  // console.log(data);
  // if(data?.errors[0]) {
  //   return response.json({ code: 500, error: data?.errors[0].message });
  // }
  return response.json({ code: data.code, data: data });
}
