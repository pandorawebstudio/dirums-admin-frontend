"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { API_URL, BASE_URL } from "../../../../config";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/sidebar";
import Tiptap from "../../../../components/Tiptap";

export default function Create({params}) {
  const [content, setContent] = useState("");
    const [footerContent, setFooterContent] = useState("");
    const [headline, setHeadline] = useState("")
    const [slug, setSLug] = useState("")
    const router = useRouter();

  const preventDefaultContextMenu = (e) => {
    e.preventDefault();
  };

  const saveContent = (e) => {
    fetch(`${BASE_URL}/dashboard/homepage-footer-content/${params.id}/api`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        headline: headline,
        mainContent: content,
        footerContent: footerContent,
        slug: slug,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          router.push("/dashboard/homepage-footer-content");
        }
      });
  };

  useEffect(() => {
    if(headline?.length == 0){
    fetch(`${BASE_URL}/dashboard/homepage-footer-content/${params.id}/api`, {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 200) {
          setContent(data.message.mainContent)
          setFooterContent(data.message.footerContent)
          setHeadline(data.message.headline)
          setSLug(data.message.slug)
        }
      });
    }
  }, [headline]);
  return (
    <Sidebar>
      <div className='mb-8 w-full max-w-screen-lg fixed top-0 p-4 !bg-white z-10'>
        <Button className='!bg-black ml-auto' onClick={saveContent}>Save changes</Button>
      </div>
      <div className='flex min-h-screen flex-col items-center sm:px-5 gap-4 mt-20' onContextMenu={preventDefaultContextMenu}>
        <div className='flex justify-center items-center w-full max-w-screen-lg'>
          <Input label="Headline" onInput={(e) => setHeadline(e.target.value)} defaultValue={headline} />
        </div>
        <div className='w-full max-w-screen-lg'>
          <Typography className='font-bold text-sm'>Main Content</Typography>
        </div>
        {content && (
          <Tiptap
            content={content}
            onChange={(newContent) => {
              setContent(newContent);
            }}
          />
        )}
        <div className='w-full max-w-screen-lg'>
          <Typography className='font-bold text-sm'>Footer Content</Typography>
        </div>
        {footerContent && (
          <Tiptap
            content={footerContent}
            onChange={(newContent) => {
              setFooterContent(newContent);
            }}
          />
        )}
        <div className='flex justify-center items-center w-full max-w-screen-lg'>
          <Input label="Page Slug" onInput={(e) => setSLug(e.target.value)} defaultValue={slug} />
        </div>
      </div>
    </Sidebar>
  );
}
