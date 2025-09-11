import { stripNewLines } from '$lib/flowbite/utils.js'

export const load = ({ url }) => {
  const content = decodeURIComponent(atob(url.searchParams.get('nickname') ?? ''))

  try {
    return { content: stripNewLines(content.trim()) }
  } catch {
    return { content: '' }
  }
}
