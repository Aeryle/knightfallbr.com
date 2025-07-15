<script lang="ts">
  import type { Snippet } from 'svelte'

  type Props = { children: Snippet } & (
    | {
        mode: 'link'
        href: string
      }
    | {
        mode: 'button'
        callback: () => unknown
      }
  )

  let { children, ...props }: Props = $props()
</script>

{#if props.mode === 'button'}
  <button
    class="flex items-center justify-center rounded-lg border-2 border-white p-4 text-3xl transition-[scale] duration-200 hover:scale-125"
    onclick={props.callback}
  >
    {@render children()}
  </button>
{:else}
  <a
    class="flex items-center justify-center rounded-lg border-2 border-white p-4 text-3xl transition-[scale] duration-200 hover:scale-125"
    href={props.href}
  >
    {@render children()}
  </a>
{/if}
