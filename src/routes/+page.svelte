<script lang="ts">
  import { authClient } from '#lib/auth-client.ts'

  import type { PageProps } from './$types'

  const { data }: PageProps = $props()
  const clientSession = authClient.useSession()
  let session = $derived(data.session ?? $clientSession.data?.session)
</script>

{#if session}
  <p>Logged in {JSON.stringify(session)}</p>
  <button onclick={() => authClient.signOut()}>Log out</button>
{:else}
  <p>Logged out</p>
  <button
    onclick={() =>
      authClient.signIn.social({
        provider: 'discord',
      })}
  >
    Log in
  </button>
{/if}
