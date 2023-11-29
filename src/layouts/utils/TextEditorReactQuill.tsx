import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Quill from "quill";
import "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";

interface TextEditorReactQuillProps {
  value: string; // Specify the type for the 'value' prop
  onChange: (html: string) => void;
}

export const TextEditorReactQuill: React.FC<TextEditorReactQuillProps> = ({
  value,
  onChange,
}) => {
  const [editorHtml, setEditorHtml] = useState(value);

  useEffect(() => {
    const EmojiBlot = Quill.import("formats/emoji");
    const ToolbarEmoji = Quill.import("modules/emoji-toolbar");
    const TextAreaEmoji = Quill.import("modules/emoji-textarea");
    const ShortNameEmoji = Quill.import("modules/emoji-shortname");

    Quill.register(
      {
        "formats/emoji": EmojiBlot,
        "modules/emoji-toolbar": ToolbarEmoji,
        "modules/emoji-textarea": TextAreaEmoji,
        "modules/emoji-shortname": ShortNameEmoji,
      },
      true
    );
  }, []);

  const toolbarOptions = {
    container: [
      [{ header: "1" }, { header: "2" }],
      ["bold", "italic", "underline", "strike"],
      ["link"],
      ["emoji"],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      // ['blockquote', 'code-block'],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["align"],
      ["image"],
      ["video"],
      ["clean"],
    ],
  };

  const handleEditorChange = (html: string) => {
    setEditorHtml(html);
    onChange(html);
  };

  return (
    <div style={{overflow : 'auto', paddingBottom : '50px'}}>
      <ReactQuill
        theme="snow"
        value={editorHtml}
        onChange={handleEditorChange}
        modules={{
          toolbar: toolbarOptions,
          "emoji-toolbar": true,
          "emoji-textarea": true,
          "emoji-shortname": true,
        }}
        style={{ height: "150px"}}
      />
    </div>
  );
};
