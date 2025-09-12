<script lang="ts">
  import { cn } from 'flowbite-svelte'
  import type { Snippet } from 'svelte'

  type Props = { children: Snippet; class?: string } & (
    | {
        mode: 'link'
        href: string
      }
    | {
        mode: 'button'
        callback: () => unknown
      }
  )

  let { children, class: className, ...props }: Props = $props()

  const classes = cn(
    className,
    'mx-8 flex items-center justify-center rounded-lg border-2 border-white p-4 text-center text-3xl transition-[scale] duration-200 hover:scale-125'
  )
</script>

{#if props.mode === 'button'}
  <button class={classes} onclick={props.callback}>
    {@render children()}
  </button>
{:else}
  <a class={classes} href={props.href}>
    {@render children()}
  </a>
{/if}
