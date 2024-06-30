"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Spinner, Textarea } from "@material-tailwind/react";
// import "novel/styles.css";
import { API_URL, BASE_URL } from "../../../../config";
import { useRouter } from "next/navigation";
import Sidebar from "../../../../components/sidebar";
import { CameraIcon } from "@heroicons/react/24/outline";
// import Editor from "../../../../components/Editor";
// import slugify from 'react-slugify';
// import dynamic from "next/dynamic";
import Tiptap from "../../../../components/Tiptap";

export default function Create({params}) {
  // const Editor = dynamic(() => import("../../../../components/Editor"), { ssr: false });
  const [content, setContent] = useState([]);
  const [title, setTitle] = useState();
  const [banner, setBanner] = useState();
  const [file, setFile] = useState();
  const [author, setAuthor] = useState();
  const [metaTitle, setMetaTitle] = useState();
  const [metaDescription, setMetaDescription] = useState();
  const [slug, setSlug] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const preventDefaultContextMenu = (e) => {
    e.preventDefault();
  };

  const saveContent = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fd = new FormData();
    fd.append('title', title);
    fd.append('metaTitle', metaTitle);
    fd.append('metaDescription', metaDescription);
    fd.append('content', content);
    {
      file && fd.append("bannerimg", file);
    }
    fd.append('author', author);
    fetch(`${BASE_URL}/dashboard/blogs/${params.id}/api`, {
      method: "PATCH",
      body: fd
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          router.push("/dashboard/blogs");
        }
      });
  };

  useEffect(() => {
    if(content?.length == 0){
    fetch(`${BASE_URL}/dashboard/blogs/${params.id}/api`, {
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == 200) {
          setContent(data.message?.content);
          setTitle(data.message?.title);
          setAuthor(data.message?.author);
          setMetaTitle(data.message?.metaTitle);
          setMetaDescription(data.message?.metaDescription);
          setSlug(data.message?.slug);
          setBanner(data.message?.banner?.url);
        }
      });
    }
  }, [content]);

  return (
    <Sidebar>
    <div
      className="flex min-h-screen flex-col items-center sm:px-5"
      onContextMenu={preventDefaultContextMenu}
    >
      <div className="flex justify-end items-center mb-8 w-full max-w-screen-lg">
        <Button className="!bg-black" onClick={saveContent}>
          Save changes
        </Button>
      </div>
        {content?.length > 0 &&
          // <Editor storageKey="blog_edit" defaultValue={renderHTML(content.content)} onUpdate={(e) => setContent(e.getHTML())} />
          <div className="py-12 w-full">
            <div className="w-full mx-auto sm:px-6 lg:px-8">
              <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200">
                  <form onSubmit={(e) => saveContent(e)}>
                    <div className="relative">
                      <input type="file" hidden accept="image/*" id="banner" onChange={(e) => { setFile(e.target.files[0]); setBanner(URL.createObjectURL(e.target.files[0])) }} />
                      <img src={banner} className="w-full h-80 mb-4 object-cover rounded" />
                      <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent h-20 w-full flex justify-end items-center p-4">
                        <Button className="flex gap-3 items-center !bg-white !text-black" onClick={() => document.getElementById('banner').click()}><CameraIcon className="w-5 h-5" /> Change Cover</Button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="text-xl text-gray-600">Title <span className="text-red-500">*</span></label><br />
                      <Input type="text" name="title" id="title" label="Title" defaultValue={title} onInput={(e) => { setTitle(e.target.value) }} required />
                    </div>

                    <div className="mb-8">
                      <label className="text-xl text-gray-600">Content <span className="text-red-500">*</span></label><br />
                      {content?.length > 0 && (
                        // <Editor
                        //   value={content}
                        //   onChange={ ( data ) => {
                        //       setContent(data)
                        //   } }
                        // />
                        <Tiptap
                          content={content}
                          onChange={(newContent) => {
                            setContent(newContent);
                          }}
                        />
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="text-xl text-gray-600">Author <span className="text-red-500">*</span></label><br />
                      <Input type="text" name="author" id="author" label="Author" defaultValue={author} onInput={(e) => setAuthor(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                      <label className="text-xl text-gray-600">Meta Title <span className="text-red-500">*</span></label><br />
                      <Input type="text" name="metaTitle" id="metaTitle" label="Meta Title" defaultValue={metaTitle} onInput={(e) => setMetaTitle(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                      <label className="text-xl text-gray-600">Meta Description <span className="text-red-500">*</span></label><br />
                      <Input type="text" name="metaDescription" id="metaDescription" label="Meta Description" defaultValue={metaDescription} onInput={(e) => setMetaDescription(e.target.value)} required />
                    </div>

                    <Button type="submit" className="!bg-black">
                      {isLoading ? (
                        <Spinner className="w-4 h-4" />
                      ) :
                        "Submit"
                      }
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        }
    </div>
    </Sidebar>
  );
}
