import type { EditorOptions, Extensions } from '@tiptap/core'
import { Bold } from '@tiptap/extension-bold'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Document } from '@tiptap/extension-document'
import { Focus } from '@tiptap/extension-focus'
import { Heading } from '@tiptap/extension-heading'
import { Italic } from '@tiptap/extension-italic'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Strike } from '@tiptap/extension-strike'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Text } from '@tiptap/extension-text'
import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style'
import { Underline } from '@tiptap/extension-underline'

import { DisableNewlines } from './extensions/disable-newline'
import { EmojiNode } from './extensions/emoji-node'

export const getDefaultExtensions = (): Extensions => [
  Document,
  Paragraph,
  Text,
  TextStyle,
  Color,
  FontSize,
  Bold,
  Italic,
  Underline,
  Strike,
  Subscript,
  Superscript,
  Heading.configure({
    levels: [1, 2, 3, 4, 5, 6],
  }),
  CharacterCount,
  Placeholder.configure({
    placeholder: 'Write something...',
  }),
  Focus,
  DisableNewlines,
  EmojiNode,
]

export const createEditorConfig = (): Partial<EditorOptions> => ({
  extensions: getDefaultExtensions(),
})
