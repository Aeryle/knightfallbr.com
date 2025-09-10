export const load = ({ url }) => {
  const content = url.searchParams.get('nickname') ?? ''

  return {
    content: atob(content),
  }
}
