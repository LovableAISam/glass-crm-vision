// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';

import { Card } from '@mui/material';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import MenuBarEditor from './MenuBarEditor';

type FormEditorProps = {
  value: string;
  onChange: (text: string) => void;
  editorStyle?: Object | undefined;
  disabled?: boolean;
  maxLength?: number;
};

const EMPTY_VALUE = '<p></p>';

function FormEditor(props: FormEditorProps) {
  const { value, onChange, editorStyle = {}, disabled = false, maxLength } = props;
  const [maxLengthError, setMaxLengthError] = useState(false);

  function extractTextFromHTML(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  }

  const editor = useEditor({
    editable: !disabled,
    extensions: [
      StarterKit,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: css`
          min-height: 100px;
        `,
      },
      handleTextInput(view) {
        if (maxLength && view.state.doc.textContent.length >= maxLength && view.state.selection.empty) {
          return true;
        }
      },
      handlePaste(view, event, slice) {
        if (maxLength && view.state.doc.textContent.length + slice.size > maxLength) {
          slice.content = view.state.doc.textContent.slice(0, maxLength - view.state.doc.textContent.length);
          setMaxLengthError(true);
          return true;
        }
      }
    },
    onUpdate({ editor }) {
      const content = editor.getHTML();
      const plainText = extractTextFromHTML(content);
      if (!maxLength) onChange(content === EMPTY_VALUE ? '' : content);
      if (maxLength > 1 && plainText.length <= maxLength) {
        onChange(content === EMPTY_VALUE ? '' : content);
        setMaxLengthError(false);
      }
    },
  });

  useEffect(() => {
    if (value && editor?.getHTML() === EMPTY_VALUE) {
      editor?.commands?.setContent(value);
    }
  }, [value]);

  return (
    <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
      {!disabled && <MenuBarEditor editor={editor} />}
      <EditorContent
        editor={editor}
        style={editorStyle !== undefined ? editorStyle : {}}
      />
      {maxLengthError && <small style={{ color: 'red' }}>Max length is {maxLength}</small>}
    </Card>
  );
}

export default FormEditor;
