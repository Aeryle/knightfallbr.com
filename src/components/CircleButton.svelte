<script lang="ts">
  import { Fa } from 'svelte-fa'
  import { type IconDefinition } from '@fortawesome/free-brands-svg-icons'

  type Props = { icon: IconDefinition } & (
    | {
        mode: 'link'
        href: string
      }
    | {
        mode: 'button'
        callback: () => unknown
      }
  )

  let { icon, ...props }: Props = $props()
</script>

{#if props.mode === 'link'}
  <a
    class="flex aspect-square items-center justify-center rounded-full border-4 border-white p-6 transition-[scale] duration-200 hover:scale-125"
    href={props.href}
  >
    <Fa {icon} size="2.5x" />
  </a>
{:else}
  <button
    class="flex aspect-square items-center justify-center rounded-full border-4 border-white p-6 transition-[scale] duration-200 hover:scale-125"
  >
    <Fa {icon} size="2.5x" />
  </button>
{/if}
