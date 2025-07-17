<script lang="ts">
  import { invalidate } from '$app/navigation'
  import { onMount } from 'svelte'
  import { MetaTags } from 'svelte-meta-tags'
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

{@render children()}
