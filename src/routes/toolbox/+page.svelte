<script lang="ts">
  import Divider from '$lib/components/flowbite/Divider.svelte'
  import Download from '$lib/components/flowbite/Download.svelte'
  import FontSize from '$lib/components/flowbite/FontSize.svelte'
  import Share from '$lib/components/flowbite/Share.svelte'
  import TextColor from '$lib/components/flowbite/TextColor.svelte'
  import {
    CharacterCount,
    EditableButton,
    FormatButtonGroup,
    TextEditor,
    ToolbarRowWrapper,
  } from '@flowbite-svelte-plugins/texteditor'
  import type { Editor } from '@tiptap/core'
  import { onMount } from 'svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
  let { content } = data

  let editor = $state<Editor | null>(null)
  let isEditable = $state(content.length > 0)
  let textLength = $state(0)

  const handleEditableToggle = (editable: boolean) => {
    isEditable = editable
    console.log('Editor is now:', editable ? 'editable' : 'read-only')
  }

  onMount(() => {
    editor!.on('update', ({ editor }) => {
      const content = editor.getHTML()

      if (content.includes('<p></p>')) {
        const cleanContent = content.replaceAll('<p></p>', '')

        editor.commands.setContent(cleanContent, {
          emitUpdate: false,
          parseOptions: {
            preserveWhitespace: true,
          },
        })
      }

      textLength = editor!.getText().length
    })
  })
</script>

<div class="container flex h-full flex-col items-center justify-center gap-8">
  <h1 class="text-center text-3xl">Welcome to the nickname toolbox</h1>

  <TextEditor class="w-full" bind:editor {content} {isEditable} contentprops={{ id: 'drag-handle-editable' }}>
    <ToolbarRowWrapper>
      <EditableButton {editor} bind:isEditable onToggle={handleEditableToggle} />
      <Divider />
      <FontSize {editor} />
      <TextColor {editor} />
      <Divider />
      <FormatButtonGroup {editor} highlight={false} link={false} removeLink={false} br={false} />
      <Divider />
      <Share {editor} />
      <Download {editor} {textLength} />
    </ToolbarRowWrapper>

    {#snippet footer()}
      {#if editor}
        <CharacterCount {editor} limit={30} />
      {/if}
    {/snippet}
  </TextEditor>
</div>
