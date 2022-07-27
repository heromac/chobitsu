import { each, strHash, toStr } from 'licia-es'
import { getAbsoluteUrl } from './util'

const scripts = new Map()
scripts.set('1', {
  scriptId: '1',
  startColumn: 0,
  startLine: 0,
  endColumn: 100000,
  endLine: 100000,
  scriptLanguage: 'JavaScript',
  url: '',
})
const sources = new Map()
sources.set('1', '')

export function get(scriptId: string) {
  return scripts.get(scriptId)
}

export async function getSource(scriptId: string) {
  if (sources.get(scriptId)) {
    return sources.get(scriptId)
  }
  const script = get(scriptId)
  try {
    const result = await fetch(script.url)
    const source = await result.text()
    sources.set(scriptId, source)
  } catch (e) {
    sources.set(scriptId, '')
  }

  return sources.get(scriptId)
}

export function collect() {
  const elements = document.querySelectorAll('script')
  const ret: any[] = []

  each(elements, element => {
    const src = element.getAttribute('src')
    if (src) {
      const url = getAbsoluteUrl(src)
      const scriptId = getScriptId(url)
      if (!scripts.get(scriptId)) {
        scripts.set(scriptId, {
          scriptId,
          startColumn: 0,
          startLine: 0,
          endColumn: 100000,
          endLine: 100000,
          scriptLanguage: 'JavaScript',
          url,
        })
      }
      ret.push(scripts.get(scriptId))
    }
  })

  return ret
}

function getScriptId(url: string) {
  return toStr(strHash(url))
}
