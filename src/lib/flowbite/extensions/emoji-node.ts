import { Node, mergeAttributes, nodeInputRule } from '@tiptap/core'

import { validEmojis } from '../utils'

export interface EmojiOptions {
  HTMLAttributes: Record<string, unknown>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emoji: {
      insertEmoji: (emoji: string) => ReturnType
    }
  }
}

// Create regex from valid emojis only
const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const EMOJI_REGEX = new RegExp(validEmojis.map(escapeRegExp).join('|'), 'g')

// Input rule to detect typed emojis - will be created in the extension
const createEmojiInputRule = (nodeType: unknown) =>
  nodeInputRule({
    find: EMOJI_REGEX,
    type: nodeType as never,
    getAttributes: match => {
      // Double check that the matched emoji is in our valid list
      if (validEmojis.includes(match[0] as (typeof validEmojis)[number])) {
        return { emoji: match[0] }
      }
      return false
    },
  })

export const EmojiNode = Node.create<EmojiOptions>({
  name: 'emoji',
  group: 'inline',
  inline: true,
  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: 'emoji-node font-emoji',
      },
    }
  },

  addAttributes() {
    return {
      emoji: {
        default: null,
        parseHTML: element => element.getAttribute('data-emoji'),
        renderHTML: attributes => {
          if (!attributes.emoji) return {}

          return { 'data-emoji': attributes.emoji }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-emoji]',
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), node.attrs.emoji]
  },

  addInputRules() {
    return [createEmojiInputRule(this.type)]
  },

  addCommands() {
    return {
      insertEmoji:
        (emoji: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { emoji },
          })
        },
    }
  },
})

export default EmojiNode
