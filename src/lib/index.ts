import type { Editor } from '@tiptap/core'

import { replaceState } from '$app/navigation'
import { page } from '$app/state'

export const saveText = (editor: Editor) => {
  const url = page.url
  url.searchParams.set('nickname', btoa(encodeURIComponent(editor.getHTML())))
  replaceState(url, {})

  return url
}
