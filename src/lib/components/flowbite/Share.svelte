<script lang="ts">
  import { generateButtonId, useEditableContext, type EditorBasicProps } from '@flowbite-svelte-plugins/texteditor'
  import ShareAllOutline from 'flowbite-svelte-icons/ShareAllOutline.svelte'
  import Tooltip from 'flowbite-svelte/Tooltip.svelte'

  interface Props {
    editor: EditorBasicProps['editor']
  }

  let { editor }: Props = $props()

  const { editableContext, getDefaultButtonClass } = useEditableContext()
  const isEditable = $derived(editableContext.isEditable ?? true)
  const uniqueId = generateButtonId('share')

  let buttonClasses = $derived(getDefaultButtonClass(isEditable))
  let isOpen = $state(false)

  const handleClick = async (event: MouseEvent) => {
    const html = btoa(editor?.getHTML() ?? '')
    const url = new URL(location.href)
    url.searchParams.set('nickname', html)
    history.replaceState('', '', url)
    await navigator.clipboard.writeText(url.toString())
    alert('Share URL copied!')
  }
</script>

<button id={uniqueId} class={buttonClasses} onclick={handleClick}>
  <ShareAllOutline class="h-6 w-6 shrink-0" />
</button>

<Tooltip>Share username</Tooltip>
