<script lang="ts">
  const { data } = $props()
  const { session } = $derived(data)
</script>

<main
  class="h-screen w-screen flex flex-col justify-center items-center bg-white dark:bg-black text-black dark:text-white"
>
  <h1 class="text-3xl text-center">Website in construction...</h1>

  <a
    class="p-4 dark:bg-white bg-gray-800 rounded-4xl dark:text-black text-white mt-4"
    href={session ? '/auth/logout' : '/auth/login'}
    data-sveltekit-preload-code="off"
    data-sveltekit-preload-data="off"
  >
    {session ? 'Logout' : 'Login with Discord'}
  </a>
</main>
