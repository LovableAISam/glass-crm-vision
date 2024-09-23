import React from 'react';

import { IconButton, TextField, useTheme } from '@mui/material';

import { Editor } from '@tiptap/react';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

type MenuBarEditorProps = {
  editor: Editor | null;
}

function MenuBarEditor({ editor }: MenuBarEditorProps) {
  const theme = useTheme();
  if (!editor) {
    return null
  }

  return (
    <>
      <IconButton onClick={() => editor.chain().focus().undo().run()}>
        <UndoIcon 
          fontSize="small" 
          sx={({ color: theme.palette.text.primary })}
        />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().redo().run()}>
        <RedoIcon 
          fontSize="small" 
          sx={({ color: theme.palette.text.primary })}
        />
      </IconButton>
      <IconButton onClick={() => editor.commands.setTextAlign('left')}>
        <FormatAlignLeftIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive({ textAlign: 'left' }) ? theme.palette.primary.main : theme.palette.text.primary })}
        />
      </IconButton>
      <IconButton onClick={() => editor.commands.setTextAlign('center')}>
        <FormatAlignCenterIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive({ textAlign: 'center' }) ? theme.palette.primary.main : theme.palette.text.primary })}
        />
      </IconButton>
      <IconButton onClick={() => editor.commands.setTextAlign('right')}>
        <FormatAlignRightIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive({ textAlign: 'right' }) ? theme.palette.primary.main : theme.palette.text.primary })}
        />
      </IconButton>
      <IconButton onClick={() => editor.commands.setTextAlign('justify')}>
        <FormatAlignJustifyIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive({ textAlign: 'justify' }) ? theme.palette.primary.main : theme.palette.text.primary })}
        />
      </IconButton>
      <TextField
        size="small"
        sx={{ 
          width: 40, 
          '& .MuiOutlinedInput-input': {
            p: 0.6
          }
        }}
        type="color"
        // @ts-ignore
        onInput={event => editor.chain().focus().setColor(event.target.value).run()}
        value={editor.getAttributes('textStyle').color}
      />
      <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
        <FormatBoldIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive('bold') ? theme.palette.primary.main : theme.palette.text.primary })} 
        />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleItalic().run()}>
        <FormatItalicIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive('italic') ? theme.palette.primary.main : theme.palette.text.primary })}
        />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <FormatUnderlinedIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive('underline') ? theme.palette.primary.main : theme.palette.text.primary })}
        />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FormatListBulletedIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive('bulletList') ? theme.palette.primary.main : theme.palette.text.primary })}
        />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <FormatListNumberedIcon 
          fontSize="small" 
          sx={theme => ({ color: editor.isActive('orderedList') ? theme.palette.primary.main : theme.palette.text.primary })}
        />
      </IconButton>
    </>
  )
}

export default MenuBarEditor;