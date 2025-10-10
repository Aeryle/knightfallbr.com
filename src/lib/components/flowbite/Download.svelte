<script lang="ts">
  import { dev } from '$app/environment'
  import { saveText } from '$lib'
  import type { EmojiType } from '$lib/flowbite/extensions/emoji-node'
  import { convertToTMP } from '$lib/textmeshpro-converter'
  import { generateButtonId, useEditableContext, type EditorBasicProps } from '@flowbite-svelte-plugins/texteditor'
  import { type TextType } from '@tiptap/core'
  import { Tooltip } from 'flowbite-svelte'
  import { DownloadOutline } from 'flowbite-svelte-icons'

  interface Props {
    editor: EditorBasicProps['editor']
    textLength: number
    force?: boolean
  }

  let { editor, textLength, force = false }: Props = $props()

  const { getDefaultButtonClass } = useEditableContext()
  const uniqueId = generateButtonId('share')

  let isEditable = $derived(textLength > 0 && textLength <= 30)
  let buttonClasses = $derived(getDefaultButtonClass(isEditable))

  const downloadFile = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' })

    var element = document.createElement('a')
    element.href = URL.createObjectURL(blob)
    element.download = 'NickNameDefiner.txt'

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  const handleClick = () => {
    if (editor!.getText().length > 30) return

    saveText(editor!)

    const nodes = editor?.getJSON().content[0].content as (TextType | EmojiType)[]
    if (!nodes) return

    const result = convertToTMP(editor!)
    if (!result) return

    console.debug('Converted result is')
    console.debug(result)

    if (!dev || force) downloadFile(result)
  }
</script>

<button id={uniqueId} class={buttonClasses} onclick={handleClick}>
  <DownloadOutline class="h-6 w-6 shrink-0" />
</button>

<Tooltip>
  {#if force}
    <span class="text-red-600">Force</span>
  {/if}
  {dev || force ? 'Log' : 'Download'} <span class="text-green-400">NickNameDefiner.txt</span></Tooltip
>
