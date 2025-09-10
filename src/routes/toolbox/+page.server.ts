export const load = ({ url }) => {
  const content = url.searchParams.get('nickname') ?? ''

  try {
    return { content: atob(content) }
  } catch {
    return { content: '' }
  }
}
