<script lang="ts">
  import { saveText } from '$lib'
  import { wrapBold, wrapColor, wrapFontSize, wrapItalic, wrapStrike } from '$lib/tmp-utils'
  import { generateButtonId, useEditableContext, type EditorBasicProps } from '@flowbite-svelte-plugins/texteditor'
  import { type TextType } from '@tiptap/core'
  import { Tooltip } from 'flowbite-svelte'
  import { DownloadOutline } from 'flowbite-svelte-icons'

  interface Props {
    editor: EditorBasicProps['editor']
    textLength: number
  }

  let { editor, textLength }: Props = $props()

  const { getDefaultButtonClass } = useEditableContext()
  const uniqueId = generateButtonId('share')

  let isEditable = $derived(textLength <= 30)
  let buttonClasses = $derived(getDefaultButtonClass(isEditable))

  const downloadFile = (content: string) => {
    var element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', 'NickNameDefiner.txt')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }
  const handleClick = () => {
    const html = btoa(editor?.getHTML() ?? '')
    saveText(html)

    // TODO: Write a parser that transforms the editor's content back to TMP's tags and then download the file
    const nodes = editor?.getJSON().content[0].content as TextType[]

    // TODO: Say something if content is empty
    if (!nodes) return

    let result = ''

    for (const node of nodes) {
      if (!node.marks) {
        result += node.text
        continue
      }

      let temporary = node.text
      console.log("Node's marks:", node.marks)

      for (const { attrs = {}, type } of node.marks) {
        if (type === 'bold') temporary = wrapBold(temporary)
        if (type === 'italic') temporary = wrapItalic(temporary)
        if (type === 'strike') temporary = wrapStrike(temporary)
        if (type === 'underline') temporary = wrapStrike(temporary)
        if (attrs.color) temporary = wrapColor(temporary, attrs.color)
        if (attrs.fontSize) temporary = wrapFontSize(temporary, attrs.fontSize)
      }
      result += temporary
    }

    console.log({ result })
  }
</script>

<button id={uniqueId} class={buttonClasses} onclick={handleClick}>
  <DownloadOutline class="h-6 w-6 shrink-0" />
</button>

<Tooltip>Download <span class="text-green-400">NickNameDefiner.txt</span></Tooltip>
