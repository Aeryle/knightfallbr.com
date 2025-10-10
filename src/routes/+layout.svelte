<script lang="ts">
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import { MetaTags } from 'svelte-meta-tags'

  import BackgroundImage_Dark from '../assets/images/BackgroundImage-Dark.webp?enhanced'

  import OutlineButton from '$lib/components/OutlineButton.svelte'
  import '../app.css'

  let { data, children } = $props()
  let { session, supabase } = $derived(data)

  onMount(() => {
    const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
      if (newSession?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth')
      }
    })

    return () => data.subscription.unsubscribe()
  })
</script>

<MetaTags
  title="KnightfallBR - Under Construction"
  description="Welcome to KnightfallBR, a growing gaming community. The website is still under construction but you can join our Discord community."
  canonical="https://knightfallbr.com"
  openGraph={{
    type: 'website',
    url: 'https://knightfallbr.com',
    title: 'KnightfallBR - Under Construction',
    description:
      'Welcome to KnightfallBR, a growing gaming community. The website is still under construction but you can join our Discord community.',
    images: [
      {
        url: 'https://knightfallbr.com/og-image.png',
        width: 2560,
        height: 1440,
        alt: 'KnightfallBR',
      },
    ],
  }}
  twitter={{
    site: '@knightfallbr',
    creator: '@knightfallbr',
    cardType: 'summary_large_image',
    title: 'KnightfallBR - Under Construction',
    description:
      'Welcome to KnightfallBR, a growing gaming community. The website is still under construction but you can join our Discord community.',
    image: 'https://knightfallbr.com/og-image.webp',
  }}
  additionalMetaTags={[
    {
      name: 'keywords',
      content: 'KnightfallBR, gaming, community, Discord, Steam',
    },
    {
      name: 'author',
      content: 'Aeryle',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      name: 'theme-color',
      content: '#000000',
    },
  ]}
/>
<!-- TODO: Add support for Light and Dark -->
<enhanced:img
  alt="KnightfallBR background"
  class="h-full w-full object-cover"
  fetchpriority="high"
  src={BackgroundImage_Dark}
/>

<header class="container flex justify-end">
  <OutlineButton mode="link" href="/toolbox">Username editor</OutlineButton>
</header>

{@render children()}

<style>
  @reference "tailwindcss";

  :global(picture:first-child) {
    @apply absolute top-0 left-0 -z-50 h-screen w-screen object-cover;
  }
</style>
