'use client'

import React, { useCallback, useState, useEffect } from 'react';
import Toolbar from './Toolbar'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Heading from '@tiptap/extension-heading'
import Image from '@tiptap/extension-image'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'
import Link from '@tiptap/extension-link'
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Paragraph from '@tiptap/extension-paragraph'
import Focus from '@tiptap/extension-focus'

const Tiptap = ({content, onChange}) => {
  const handleChange = ((newContent) => {
    onChange(newContent);
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      // Focus.configure({
      //   className: 'scroll-smooth focus:scroll-auto',
      //   mode: 'all',
      // }),
      Underline,
      Heading.configure({
        levels: [1, 2, 3],
        HTMLAttributes: {
          class: `text-[30px] font-medium`,
        },
      }),
      Image.configure({
        allowBase64: true,
        inline: true,
        HTMLAttributes: {
          class: 'w-[400px] h-auto border-2 rounded',
      },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'list-disc p-2',
        },
        keepMarks: true,
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'list-decimal p-2',
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'bg-[#F9F9F9]'
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: 'underline text-blue-600 cursor-pointer',
        },
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['right', 'center', 'left'],
      }),
      Paragraph,
    ],
    // autofocus: true,
    content: content,
    
    editorProps: {
      attributes: {
        class: 'flex flex-col px-4 py-3 justify-start border-b border-l border-r border-gray-700  items-start w-full gap-3 font-medium text-[16px] pt-4 rounded-bl-md rounded-br-md outline-none h-auto min-h-[200px]',
      },
    },
    onUpdate: ({editor}) => {
      handleChange(editor.getHTML());
    },
  })

  return (
    <div className='w-full' >
      <Toolbar editor={editor}  />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap