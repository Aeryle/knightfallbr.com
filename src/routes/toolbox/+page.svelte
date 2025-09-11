<script lang="ts">
  import Divider from '$lib/components/flowbite/Divider.svelte'
  import Download from '$lib/components/flowbite/Download.svelte'
  import Emoji from '$lib/components/flowbite/Emoji.svelte'
  import FontSize from '$lib/components/flowbite/FontSize.svelte'
  import Share from '$lib/components/flowbite/Share.svelte'
  import TextColor from '$lib/components/flowbite/TextColor.svelte'
  import { createEditorConfig } from '$lib/flowbite/editor-config'
  import { stripNewLines } from '$lib/flowbite/utils'
  import { CharacterCount, FormatButtonGroup, TextEditor, ToolbarRowWrapper } from '@flowbite-svelte-plugins/texteditor'
  import { Editor } from '@tiptap/core'
  import { onMount } from 'svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
  let { content } = data

  let editor = $state<Editor | null>(null)
  let textLength = $state(0)

  onMount(() => {
    textLength = editor!.getText().length

    editor!.on('update', async ({ editor }) => {
      stripNewLines(editor.getHTML())
      textLength = editor.getText().length
    })
  })
</script>

<div class="container flex h-full flex-col items-center justify-center gap-8">
  <h1 class="text-center text-3xl">Welcome to the nickname toolbox</h1>

  <TextEditor
    class="w-full"
    bind:editor
    config={createEditorConfig()}
    {content}
    contentprops={{ id: 'drag-handle-editable' }}
  >
    <ToolbarRowWrapper>
      <FontSize {editor} />
      <TextColor {editor} />
      <Emoji {editor} />
      <Divider />
      <FormatButtonGroup {editor} code={false} highlight={false} link={false} removeLink={false} br={false} />
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

<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');
</style>
