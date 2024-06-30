import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";

const Editor = ({
  value,
  onBlur,
}) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onBlur={(event, editor) => {
        const data = editor.getData();
        onBlur(data);
      }}
    />
  );
};

export default Editor;