<script lang="ts">
  import {
    generateButtonId,
    setFontSize,
    useEditableContext,
    type EditorBasicProps,
  } from '@flowbite-svelte-plugins/texteditor'
  import { Dropdown, DropdownItem, Tooltip } from 'flowbite-svelte'
  import TextSizeOutline from 'flowbite-svelte-icons/TextSizeOutline.svelte'

  interface Props {
    editor: EditorBasicProps['editor']
  }

  let { editor }: Props = $props()

  const { editableContext, getDefaultButtonClass } = useEditableContext()
  const isEditable = $derived(editableContext.isEditable ?? true)
  const uniqueId = generateButtonId('fontSize')

  let buttonClasses = $derived(getDefaultButtonClass(isEditable))
  let isOpen = $state(false)

  const fontSizes = [
    { name: '14 (Smaller)', value: 'smaller' },
    { name: '18 (Default)', value: 'default' },
    { name: '22 (Bigger)', value: 'bigger' },
  ] as const
  const convertedFontSizes = {
    smaller: '1rem',
    default: '2rem',
    bigger: '3rem',
  }
</script>

<button id={uniqueId} class={buttonClasses}>
  <TextSizeOutline class="h-6 w-6 shrink-0" />

  <Dropdown bind:isOpen simple triggeredBy="#{uniqueId}">
    {#each fontSizes as font}
      <DropdownItem
        onclick={() => setFontSize(editor, convertedFontSizes[font.value])}
        style="font-size: {convertedFontSizes[font.value]};"
      >
        {font.name}
      </DropdownItem>
    {/each}
  </Dropdown>
</button>

<Tooltip>Font size</Tooltip>
