'use client';

import React, { useEffect, useState } from 'react'
import { Button, Input, Typography } from '@material-tailwind/react';
// import "novel/styles.css";
import { API_URL, BASE_URL } from '../../../../config';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../../components/sidebar';
import Tiptap from '../../../../components/Tiptap';

export default function Create() {
    const [content, setContent] = useState({content: [], type: 'doc'})
    const [footerContent, setFooterContent] = useState({content: [], type: 'doc'})
    const [headline, setHeadline] = useState("")
    const [slug, setSLug] = useState("")
    const router = useRouter();

    const preventDefaultContextMenu = (e) => {
        e.preventDefault();
      };

    const saveContent = (e) => {
        fetch(`${BASE_URL}/dashboard/homepage-footer-content/create/api`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                headline: headline,
                mainContent: content,
                footerContent: footerContent,
                slug: slug,
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.code == 200){
                localStorage.removeItem('main_content')
                localStorage.removeItem('footer_content')
                router.push('/dashboard/homepage-footer-content')
            }
        }
            )
    }

  return (
    <Sidebar>
          <div className='mb-8 w-full max-w-screen-lg fixed top-0 p-4 !bg-white z-10'>
              <Button className='!bg-black ml-auto' onClick={saveContent}>Create Content</Button>
          </div>
          <div className='flex min-h-screen flex-col items-center sm:px-5 gap-4 mt-20' onContextMenu={preventDefaultContextMenu}>
              <div className='flex justify-center items-center w-full max-w-screen-lg'>
                  <Input label="Headline" onInput={(e) => setHeadline(e.target.value)} />
              </div>
              <div className='w-full max-w-screen-lg'>
                  <Typography className='font-bold text-sm'>Main Content</Typography>
              </div>
              <Tiptap
                  content={content}
                  onChange={(newContent) => {
                      setContent(newContent);
                  }}
              />
              <div className='w-full max-w-screen-lg'>
                  <Typography className='font-bold text-sm'>Footer Content</Typography>
              </div>
              <Tiptap
                  content={footerContent}
                  onChange={(newContent) => {
                    setFooterContent(newContent);
                  }}
              />
              <div className='flex justify-center items-center w-full max-w-screen-lg'>
                  <Input label="Page Slug" onInput={(e) => setSLug(e.target.value)} />
              </div>
          </div>
    </Sidebar>
  )
}
