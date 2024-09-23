// @ts-nocheck
import React, { useEffect } from 'react';
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
};

const EMPTY_VALUE = '<p></p>';

function FormEditor(props: FormEditorProps) {
  const { value, onChange, editorStyle = {}, disabled = false } = props;

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
    },
    onUpdate({ editor }) {
      const content = editor.getHTML();
      onChange(content === EMPTY_VALUE ? '' : content);
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
    </Card>
  );
}

export default FormEditor;
