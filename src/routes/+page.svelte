<script lang="ts">
  import { faDiscord } from '@fortawesome/free-brands-svg-icons'
  import { MetaTags, JsonLd } from 'svelte-meta-tags'
  import CircleButton from '../components/CircleButton.svelte'
  import OutlineButton from '../components/OutlineButton.svelte'
  import BackgroundImage_Dark from '../assets/images/BackgroundImage-Dark.webp?enhanced'

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

<!-- TODO: Add support for Light and Dark -->
<enhanced:img
  class="fixed top-0 left-0 -z-50 h-screen w-screen object-cover"
  src={BackgroundImage_Dark}
  alt="KnightfallBR background"
  fetchpriority="high"
/>

<h1 class="text-center text-6xl [word-spacing:100vw]">UNDER CONSTRUCTION</h1>

<!-- <a
    class="p-4 dark:bg-white bg-gray-800 rounded-4xl dark:text-black text-white mt-4"
    href={session ? '/auth/logout' : '/auth/login'}
    data-sveltekit-preload-code="off"
    data-sveltekit-preload-data="off"
  >
    {session ? 'Logout' : 'Login with Discord'}
  </a> -->
{#if !session}
  <OutlineButton mode="link" href="/auth/login">Login / Register</OutlineButton>
{:else}
  <OutlineButton mode="link" href="/auth/login">Already logged in</OutlineButton>
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
