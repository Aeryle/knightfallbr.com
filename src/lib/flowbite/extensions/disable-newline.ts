import { Extension, generateHTML } from '@tiptap/core'

import { getDefaultExtensions } from '../editor-config'

export const DisableNewlines = Extension.create({
  name: 'disableNewlines',
  onCreate: ({ editor }) => {
    if (editor.getText().includes('\n'))
      editor.commands.setContent(editor.getText().replaceAll('\n', ''), {
        emitUpdate: false,
        parseOptions: {
          preserveWhitespace: true,
        },
      })
  },
  onUpdate: ({ transaction, editor }) => {
    const previous = generateHTML(transaction.before.toJSON(), getDefaultExtensions())

    if (editor.getText().includes('\n'))
      editor.commands.setContent(previous, {
        emitUpdate: false,
        parseOptions: {
          preserveWhitespace: true,
        },
      })
  },
})
