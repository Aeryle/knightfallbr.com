<script lang="ts">
  import {
    generateButtonId,
    removeTextColorFormatting,
    setTextColor,
    useEditableContext,
    type EditorBasicProps,
  } from '@flowbite-svelte-plugins/texteditor'
  import { FontColorOutline } from 'flowbite-svelte-icons'
  import Dropdown from 'flowbite-svelte/Dropdown.svelte'
  import DropdownItem from 'flowbite-svelte/DropdownItem.svelte'
  import Tooltip from 'flowbite-svelte/Tooltip.svelte'

  interface Props {
    editor: EditorBasicProps['editor']
  }

  type Hex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
  interface Color {
    name: string
    value: `#${Hex}${Hex}${Hex}${Hex}${Hex}${Hex}${Hex}${Hex}`
  }

  let { editor }: Props = $props()

  const { editableContext, getDefaultButtonClass } = useEditableContext()
  const isEditable = $derived(editableContext.isEditable ?? true)
  const uniqueId = generateButtonId('textColor')

  const colors: Color[] = [
    { name: 'Blue', value: '#1a56db' },
    { name: 'Green', value: '#0e9f6e' },
    { name: 'Yellow', value: '#faca15' },
    { name: 'Red', value: '#f05252' },
    { name: 'Orange', value: '#ff8a4c' },
    { name: 'Teal', value: '#0694a2' },
    { name: 'Light indigo', value: '#b4c6fc' },
    { name: 'Indigo', value: '#8da2fb' },
    { name: 'Purple', value: '#5145cd' },
    { name: 'Brown', value: '#771d1d' },
    { name: 'Light orange', value: '#fcd9bd' },
    { name: 'Bordo', value: '#99154b' },
    { name: 'Dark Purple', value: '#7e3af2' },
    { name: 'Light', value: '#cabffd' },
    { name: 'Dark Pink', value: '#d61f69' },
    { name: 'Pink', value: '#f8b4d9' },
    { name: 'Cream', value: '#f6c196' },
    { name: 'Light Blue', value: '#a4cafe' },
    { name: 'Dark Blue', value: '#5145cd' },
    { name: 'Orange Brown', value: '#b43403' },
    { name: 'Light Yellow', value: '#fce96a' },
    { name: 'Navy Blue', value: '#1e429f' },
    { name: 'Light Purple', value: '#768ffd' },
    { name: 'Light Green', value: '#bcf0da' },
    { name: 'Sky Blue', value: '#ebf5ff' },
    { name: 'Cyan', value: '#16bdca' },
    { name: 'Pink', value: '#e74694' },
    { name: 'Darker Sky Blue', value: '#83b0ed' },
    { name: 'Forest Green', value: '#03543f' },
    { name: 'Black', value: '#111928' },
    { name: 'Stone', value: '#4b5563' },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Light Gray', value: '#d1d5db' },
    { name: 'Cloud Gray', value: '#f3f4f6' },
    { name: 'Heaven Gray', value: '#f9fafb' },
  ]

  let buttonClasses = $derived(getDefaultButtonClass(isEditable))

  let isOpen = $state(false)
  let colorValue: Color['value'] = $state('')
</script>

<button id={uniqueId} class={buttonClasses}>
  <FontColorOutline class="h-6 w-6 shrink-0" />

  <Dropdown bind:isOpen simple triggeredBy="#{uniqueId}">
    <div class="p-2">
      <div
        class="group mb-3 grid grid-cols-6 items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-600"
      >
        <input
          type="color"
          id="color"
          bind:value={colorValue}
          onchange={() => setTextColor(editor, colorValue)}
          class="col-span-3 h-8 w-full rounded-md border border-gray-200 bg-gray-50 p-px px-1 group-hover:bg-gray-50 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:group-hover:bg-gray-700"
        />

        <label
          for="color"
          class="col-span-3 text-sm font-medium text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
        >
          Pick a color
        </label>
      </div>
      <div class="mb-3 grid grid-cols-6 gap-1">
        {#each colors as color}
          <button
            type="button"
            onclick={() => setTextColor(editor, color.value)}
            style="background-color: {color.value}"
            class="h-6 w-6 rounded-md transition-transform duration-150 hover:scale-110"
            title={color.name}
          >
            <span class="sr-only">{color.name}</span>
          </button>
        {/each}
      </div>
      <DropdownItem onclick={() => removeTextColorFormatting(editor)} class="text-center">Remove color</DropdownItem>
    </div>
  </Dropdown>
</button>

<Tooltip>Text color</Tooltip>
