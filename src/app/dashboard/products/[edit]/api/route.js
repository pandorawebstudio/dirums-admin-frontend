import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { API_URL } from '../../../../../config';

export async function GET(request, {params}){
    const cookieStore = cookies();
    const token = request.cookies.get('token')?.value
    const res = await fetch(`${API_URL}/api/product/${params.edit}`, {
        headers: {
            Authorization: `JWT ${token}`
        }
    })

    const data = await res.json()
    return NextResponse.json({code: 200, message: data})
}

export async function PATCH(request, { params }) {
    try {
        const token = request.cookies.get('token')?.value;
        const fd = await request.formData();
        let images = [];
        
        for (const pair of fd.entries()) {
            if (pair[0] === 'demoimages') {
                const formData = new FormData();
                const file = pair[1];
                // console.log("Uploaded file MIME type:", file.type); // Log MIME type
                formData.append('file', file);

                const res = await fetch(`${API_URL}/api/media`, {
                    method: "POST",
                    headers: {
                        Authorization: `JWT ${token}`,
                    },
                    body: formData
                });

                if (!res.ok) {
                    throw new Error('Failed to upload image');
                }

                const data = await res.json();
                images.push({ "image": data.doc.id });
                fd.append(`images.${images.length - 1}.image`, data.doc.id);
            }
        }

        if (images.length > 0) {
            const res = await fetch(`${API_URL}/api/product/${params.edit}`, {
                method: "PATCH",
                headers: {
                    Authorization: `JWT ${token}`,
                },
                body: fd
            });

            if (!res.ok) {
                throw new Error('Failed to update product');
            }
            const data = await res.json();
            return NextResponse.json({ code: 200, message: data });
        }
    } catch (error) {
        console.error("Error:", error.message);
        return NextResponse.error(new Error("Internal Server Error"));
    }
}

// export async function PATCH(request, { params }) {
//   const token = request.cookies.get('token')?.value;
//   const fd = await request.formData();

//   const images = [];

//   // Prepare array of promises for parallel image uploads
//   const uploadPromises = [];
//   for (const pair of fd.entries()) {
//       if (pair[0] === 'demoimages') {
//           const formData = new FormData();
//           formData.append('file', pair[1]);
//           uploadPromises.push(uploadImage(formData, token, images, fd));
//       }
//   }

//   // Upload images concurrently
//   await Promise.all(uploadPromises);
//   console.log(images);
//   // If images were uploaded, proceed with PATCH request
//   if (images.length > 0) {
//       const res = await fetch(`${API_URL}/api/product/${params.edit}`, {
//           method: 'PATCH',
//           headers: {
//               Authorization: `JWT ${token}`,
//           },
//           body: fd,
//       });

//       const data = await res.json();
//       return NextResponse.json({ code: 200, message: data });
//   }
// }

// async function uploadImage(formData, token, images, fd) {
//   const res = await fetch(`${API_URL}/api/media`, {
//       method: 'POST',
//       headers: {
//           Authorization: `JWT ${token}`,
//       },
//       body: formData,
//   });

//   const data = await res.json();
//   images.push({ image: data.doc.id });
//   fd.append(`images.${images.length - 1}.image`, data.doc.id);
// }