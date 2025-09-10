<script lang="ts">
  import CircleButton from '$lib/components/CircleButton.svelte'
  import OutlineButton from '$lib/components/OutlineButton.svelte'
  import { faDiscord } from '@fortawesome/free-brands-svg-icons'
  import { JsonLd, MetaTags } from 'svelte-meta-tags'

  const { data } = $props()
  const { session } = $derived(data)
</script>

<MetaTags
  title="KnightfallBR"
  description="Welcome to KnightfallBR, a growing gaming community. The website is still under construction but you can join our Discord community."
  openGraph={{
    title: 'KnightfallBR',
    description:
      'Welcome to KnightfallBR, a growing gaming community. The website is still under construction but you can join our Discord community.',
    type: 'website',
  }}
/>

<JsonLd
  schema={{
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KnightfallBR',
    description: 'A gaming community based around the game Knightfall: A Daring Journey',
    url: 'https://knightfallbr.com',
    sameAs: ['https://store.steampowered.com/app/1911390/'],
    founder: {
      '@type': 'Person',
      name: 'Aeryle',
      url: 'https://github.com/Aeryle',
    },
  }}
/>

<h1 class="text-center text-6xl [word-spacing:100vw]">UNDER CONSTRUCTION</h1>

{#if !session}
  <OutlineButton mode="link" href="/auth/login">Notify me by email</OutlineButton>
{:else}
  <OutlineButton mode="link" href="#">You will be notified by email</OutlineButton>
{/if}

<div class="flex flex-col items-center space-y-8">
  <div class="flex flex-col items-center justify-center space-y-3">
    <CircleButton mode="link" href="/discord" icon={faDiscord} />
    <p class="text-2xl">Join the community</p>
  </div>
</div>

<iframe
  class="hidden lg:block"
  title="Steam Widget"
  src="https://store.steampowered.com/widget/1911390/"
  frameborder="0"
  width="646"
  height="190"
></iframe>

<footer>KnightfallBR. Website by <a class="underline" href="https://github.com/Aeryle">Aeryle</a>.</footer>

<style>
  h1 {
    font-size: clamp(2.5rem, 10vw, 4rem);
  }
</style>
