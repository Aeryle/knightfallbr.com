<script lang="ts">
  import { validEmojis } from '$lib/flowbite/utils'
  import { generateButtonId, useEditableContext, type EditorBasicProps } from '@flowbite-svelte-plugins/texteditor'
  import Dropdown from 'flowbite-svelte/Dropdown.svelte'
  import Tooltip from 'flowbite-svelte/Tooltip.svelte'

  interface Props {
    editor: EditorBasicProps['editor']
  }

  let { editor }: Props = $props()

  const { editableContext, getDefaultButtonClass } = useEditableContext()
  const isEditable = $derived(editableContext.isEditable ?? true)
  const uniqueId = generateButtonId('emoji')

  let buttonClasses = $derived(getDefaultButtonClass(isEditable))

  let isOpen = $state(false)

  const pickRandomEmoji = () => validEmojis[Math.floor(Math.random() * validEmojis.length)]
  let emoji = $state(pickRandomEmoji())
</script>

<button
  id={uniqueId}
  class={buttonClasses}
  onmouseenter={() => {
    if (!isOpen) emoji = pickRandomEmoji()
  }}
  onmouseleave={() => {
    if (!isOpen) emoji = pickRandomEmoji()
  }}
>
  <!-- <FontColorOutline class="h-6 w-6 shrink-0" /> -->
  <p class="h-6 w-6 shrink-0">{emoji}</p>

  <Dropdown bind:isOpen simple triggeredBy="#{uniqueId}" triggerDelay={0}>
    <div class="p-2">
      <div class="mb-3 grid grid-cols-6 gap-1 gap-y-4">
        {#each validEmojis as emoji}
          <button
            type="button"
            onclick={() => {
              editor?.chain().focus().insertEmoji(emoji).run()
            }}
            class="justify-center transition-transform duration-150 hover:scale-110"
            title={emoji}
          >
            <span class="text-4xl">{emoji}</span>
          </button>
        {/each}
      </div>
    </div>
  </Dropdown>
</button>

<Tooltip>Emoji</Tooltip>
