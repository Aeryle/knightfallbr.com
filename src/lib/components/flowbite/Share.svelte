<script lang="ts">
  import { saveText } from '$lib'
  import { generateButtonId, useEditableContext, type EditorBasicProps } from '@flowbite-svelte-plugins/texteditor'
  import ShareAllOutline from 'flowbite-svelte-icons/ShareAllOutline.svelte'
  import Tooltip from 'flowbite-svelte/Tooltip.svelte'

  interface Props {
    editor: EditorBasicProps['editor']
  }

  let { editor }: Props = $props()

  const { editableContext, getDefaultButtonClass } = useEditableContext()
  const uniqueId = generateButtonId('share')
  const buttonClasses = $derived(getDefaultButtonClass(true))

  const handleClick = async (event: MouseEvent) => {
    const url = saveText(editor!)
    await navigator.clipboard.writeText(url.toString())

    alert('Share URL copied!')
  }
</script>

<button id={uniqueId} class={buttonClasses} onclick={handleClick}>
  <ShareAllOutline class="h-6 w-6 shrink-0" />
</button>

<Tooltip>Share username</Tooltip>
