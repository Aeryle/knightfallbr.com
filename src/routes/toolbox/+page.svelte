<script lang="ts">
  import Divider from '$lib/components/flowbite/Divider.svelte'
  import Download from '$lib/components/flowbite/Download.svelte'
  import FontSize from '$lib/components/flowbite/FontSize.svelte'
  import Share from '$lib/components/flowbite/Share.svelte'
  import TextColor from '$lib/components/flowbite/TextColor.svelte'
  import { CharacterCount, FormatButtonGroup, TextEditor, ToolbarRowWrapper } from '@flowbite-svelte-plugins/texteditor'
  import type { Editor } from '@tiptap/core'
  import { onMount } from 'svelte'
  import type { PageProps } from './$types'

  let { data }: PageProps = $props()
  let { content } = data

  let editor = $state<Editor | null>(null)
  let textLength = $state(content.length)

  onMount(() => {
    editor!.on('update', ({ editor }) => {
      const content = editor.getHTML()

      if (content.includes('<p></p>'))
        editor.commands.setContent(content.replaceAll('<p></p>', ''), {
          emitUpdate: false,
          parseOptions: { preserveWhitespace: true },
        })

      textLength = editor!.getText().length
    })
  })
</script>

<div class="container flex h-full flex-col items-center justify-center gap-8">
  <h1 class="text-center text-3xl">Welcome to the nickname toolbox</h1>

  <TextEditor class="w-full" bind:editor {content} contentprops={{ id: 'drag-handle-editable' }}>
    <ToolbarRowWrapper>
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
