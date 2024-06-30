import React, {useCallback} from 'react'
import { RiBold } from "react-icons/ri";
import { GoItalic } from "react-icons/go";
import { RiStrikethrough2 } from "react-icons/ri";
import { LuHeading1 } from "react-icons/lu";
import { LuHeading2 } from "react-icons/lu";
import { GoListUnordered } from "react-icons/go";
import { VscListOrdered } from "react-icons/vsc";
import { SlActionUndo } from "react-icons/sl";
import { SlActionRedo } from "react-icons/sl";
import { TbBlockquote } from "react-icons/tb";
import { GoCode } from "react-icons/go";
import { RxUnderline } from "react-icons/rx";
import { BiImageAdd } from "react-icons/bi";
import { GoLink } from "react-icons/go";
import { GoUnlink } from "react-icons/go";
import { API_URL } from '../config';
import { Option, Select } from '@material-tailwind/react';

const uploadImageToServer = async (image) => {
  // console.log(image);
  const formData = new FormData();
  formData.append('file', image);

  try {
    const response = await fetch(`${API_URL}/api/media`, {
      method: 'POST',
      body: formData,
    });
    // console.log(response);
    if (response.ok) {
      const data = await response.json();
      // console.log(data.doc.url);
      return data.doc.url; // Assuming the server returns the URL in the response
    } else {
      // console.error('Failed to upload image');
      return null;
    }
  } catch (error) {
    // console.error('Error uploading image:', error);
    return null;
  }
};

const Toolbar = ({ editor }) => {
  if(!editor) {
    return null;
  }

  const handleFileSelection = async (event) => {
    const fileInput = event.target;

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0]; // Access the first file

      // Upload the image file to the server
      const imageUrl = await uploadImageToServer(file);

      // If the image URL was successfully retrieved, set the image in the editor
      if (imageUrl) {
        editor.chain().focus().setImage({ src: imageUrl, alt: "editor-image" }).run();
      }
    }
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink()
        .run()

      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url })
      .run()
  }, [editor])

  const handleChangeColor = (value) => {
    const color = value;

    if (color === 'unset') {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().setColor(color).run();
    }
  };

  // Function to handle select change event
  const handleTextAlignmentChange = (value) => {
    const allign = value;
    // console.log(value);
    if (allign === 'unset') {
      editor.chain().focus().unsetTextAlign().run();
    } else {
      // console.log(value);
      editor.chain().focus().setTextAlign(allign).run();
    }
  };
  
  return (
    <div className='px-4 py-3 rounded-tl-md rounded-tr-md flex justify-between items-start gap-5 w-full flex-wrap border border-gray-700'
    >
      <div className='flex justify-start items-center gap-5 w-full lg-w-10/12 flex-wrap'>
        {/* heading1 button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({level: 1}).run()
          }}
          className={
            editor.isActive("heading", { level: 1 })
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <LuHeading1 className='w-6 h-6' />
        </button>
        {/* heading2 button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleHeading({level: 2}).run()
          }}
          className={
            editor.isActive("heading", { level: 2 })
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <LuHeading2 className='w-6 h-6' />
        </button>
        {/* bold button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBold().run()
          }}
          className={
            editor.isActive("bold")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <RiBold className='w-6 h-6' />
        </button>
        {/* itallic button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleItalic().run()
          }}
          className={
            editor.isActive("italic")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <GoItalic className='w-6 h-6' />
        </button>
        {/* underline button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run()
          }}
          className={
            editor.isActive("underline")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <RxUnderline className='w-6 h-6' />
        </button>
        {/* strikethrough button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleStrike().run()
          }}
          className={
            editor.isActive("strike")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <RiStrikethrough2 className='w-6 h-6' />
        </button>
        {/* unordered bullet list button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBulletList().run()
          }}
          className={
            editor.isActive("bulletList")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <GoListUnordered className='w-6 h-6' />
        </button>
        {/* ordered bullet listing button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleOrderedList().run()
          }}
          className={
            editor.isActive("orderedList")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <VscListOrdered className='w-6 h-6' />
        </button>
        {/* blockquote button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleBlockquote().run()
          }}
          className={
            editor.isActive("blockquote")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <TbBlockquote className='w-6 h-6' />
        </button>
        {/* code button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().toggleCode().run()
          }}
          className={
            editor.isActive("code")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <GoCode className='w-6 h-6' />
        </button>
        {/* set link button */}
        <button onClick={setLink} 
          className={editor.isActive('link') ?
              "bg-blue-300 text-white p-1.5 rounded-lg"
              : "text-gray-700"
        }>
          <GoLink className='w-6 h-6' />
        </button>
        {/* unset link button */}
        <button
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
        >
          <GoUnlink className='w-6 h-6' />
        </button>
        {/* set color for text */}
        <span>
          <Select 
            label='Select Color'
            onChange={handleChangeColor} 
            data-testid="setColorSelect" 
            className='cursor-pointer'
          >
            <Option value="unset">Unset Color</Option>
            <Option value="#958DF1">Purple</Option>
            <Option value="#FF0000">Red</Option>
            <Option value="#FF5733 ">Orange</Option>
            <Option value="#FFC300">Yellow</Option>
            <Option value="#008000">Green</Option>
            <Option value="#0000FF">Blue</Option>
          </Select>
        </span>
        {/* set alignment for text */}
        <span>
            <Select 
              label='Select Allignment'
              onChange={handleTextAlignmentChange}
            >
                <Option value="unset">reset</Option>
                <Option value="left">left</Option>
                <Option value="center">center</Option>
                <Option value="right">right</Option>
            </Select>
        </span>
        {/* image button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            const imgInput = document.getElementById('img') // Cast to HTMLInputElement
            imgInput?.click(); // Safely click the input element if it exists
          }}
          className={
            editor.isActive('image')
              ? 'bg-blue-300 text-white p-1.5 rounded-lg'
              : 'text-gray-700'
          }
        >
          <BiImageAdd className="w-7 h-7" />
        </button>
        {/* File input for image selection */}
        <input
          className="hidden"
          type="file"
          id="img"
          name="img"
          accept="image/*"
          onChange={handleFileSelection} // Attach the event handler
        />
        {/* undo button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().undo().run()
          }}
          className={
            editor.isActive("undo")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <SlActionUndo className='w-6 h-6' />
        </button>
        {/* redo button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().redo().run
          }}
          className={
            editor.isActive("redo")
            ? "bg-blue-300 text-white p-1.5 rounded-lg"
            : "text-gray-700"
          }
        >
          <SlActionRedo className='w-6 h-6' />
        </button>
      </div>
    </div>
  )
}

export default Toolbar