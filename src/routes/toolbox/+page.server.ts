import { stripNewLines } from '$lib/flowbite/utils.js'

export const load = ({ url }) => {
  try {
    const content = decodeURIComponent(atob(url.searchParams.get('nickname') ?? ''))

    return { content: stripNewLines(content.trim()) }
  } catch {
    return { content: '' }
  }
}
