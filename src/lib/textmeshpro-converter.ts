import type { Editor, TextType } from '@tiptap/core'

import type { EmojiType } from '$lib/flowbite/extensions/emoji-node'

import { wrapBold, wrapColor, wrapEmoji, wrapFontSize, wrapItalic, wrapStrike } from './flowbite/utils'

const isTextNode = (node: TextType | EmojiType): node is TextType => node.type === 'text'
const isEmojiNode = (node: TextType | EmojiType): node is EmojiType => node.type === 'emoji'

export const convertToTMP = (editor: Editor) => {
  const nodes = editor.getJSON().content[0].content as (TextType | EmojiType)[]
  if (!nodes) return null

  let result = ''

  for (const node of nodes) {
    if (isTextNode(node) && !node.marks) {
      result += node.text
      continue
    }

    if (isTextNode(node)) {
      let temporary = node.text

      for (const { attrs = {}, type } of node.marks) {
        if (type === 'bold') temporary = wrapBold(temporary)
        if (type === 'italic') temporary = wrapItalic(temporary)
        if (type === 'strike') temporary = wrapStrike(temporary)
        if (type === 'underline') temporary = wrapStrike(temporary)
        if (attrs.color) temporary = wrapColor(temporary, attrs.color)
        if (attrs.fontSize) temporary = wrapFontSize(temporary, attrs.fontSize)
      }

      result += temporary
    } else if (isEmojiNode(node)) result += wrapEmoji(node.attrs.emoji)
  }

  return result
}
