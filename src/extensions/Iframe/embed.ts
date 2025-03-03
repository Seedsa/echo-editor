import { icons } from '@/components/icons'

interface ServiceType {
  label: string
  value: string
  icon: keyof typeof icons
}
export const VideoServices: ServiceType[] = [
  { label: '优酷', value: 'youku', icon: 'Youku' },
  {
    label: '哔哩哔哩',
    value: 'bilibili',
    icon: 'BiliBili',
  },
  {
    label: '腾讯视频',
    value: 'qqvideo',
    icon: 'QQVideo',
  },
]

export const MapServices: ServiceType[] = [
  { label: '高德地图', value: 'amap', icon: 'Gaode' },
  { label: '百度地图', value: 'baidu_map', icon: 'Baidu' },
]

export const DesignServices: ServiceType[] = [
  { label: '墨刀', value: 'modao', icon: 'Modao' },
  { label: '蓝湖', value: 'lanhu', icon: 'Lanhu' },
  { label: 'Figma', value: 'figma', icon: 'Figma' },
  { label: 'Canva', value: 'canva', icon: 'Canva' },
  { label: 'ProcessOn', value: 'processon', icon: 'Processon' },
]

export const DevelopServices: ServiceType[] = [{ label: 'CodePen', value: 'codepen', icon: 'Codepen' }]

export const DataServices: ServiceType[] = [{ label: '金数据', value: 'jinshuju', icon: 'Jinshuju' }]

export const OtherServices = []

export const AllEmbedServices = [
  ...VideoServices,
  ...MapServices,
  ...DesignServices,
  ...DevelopServices,
  ...DataServices,
  ...OtherServices,
]

export const getEmbedService = value => {
  for (var item of AllEmbedServices) {
    if (item.value === value) {
      return item
    }
  }

  return {}
}

/**
 * Embed service link
 * @id source id
 * @exmplae example link
 * @src source src, used in iframe
 */
export const EmbedServiceLink = {
  youtube: {
    example: 'https://www.youtube.com/watch?v=I4sMhHbHYXM',
    src: 'https://www.youtube.com/embed/I4sMhHbHYXM',
    srcPrefix: 'https://www.youtube.com/embed',
    linkRule: ['www.youtube.com\\/watch\\?v=\\w+'],
  },
  youku: {
    example: 'https://v.youku.com/v_show/id_XNDM0NDM4MTcy.html?spm=a2h0c.8166622.PhoneSokuUgc_4.dtitle',
    src: 'https://player.youku.com/embed/XNDM0NDM4MTcy',
    srcPrefix: 'https://player.youku.com/embed',
    linkRule: ['v.youku.com\\/v_show\\/id_\\w+\\=*'],
    idRule: 'id_\\w+\\=*',
  },
  bilibili: {
    example: 'https://www.bilibili.com/video/BV1EJ411u7DN',
    src: 'https://player.bilibili.com/player.html?bvid=BV1EJ411u7DN',
    srcPrefix: 'https://player.bilibili.com/player.html?bvid',
    linkRule: ['www.bilibili.com\\/video\\/\\w+'],
  },
  qqvideo: {
    example: 'https://v.qq.com/x/cover/mzc0020006aw1mn/u0033nvzb5v.html',
    src: 'https://v.qq.com/txp/iframe/player.html?vid=u0033nvzb5v',
    srcPrefix: 'https://v.qq.com/txp/iframe/player.html?vid',
    linkRule: ['v.qq.com\\/x\\/cover\\/\\w+\\/\\w+'],
  },
  amap: {
    example: 'https://ditu.amap.com/',
    src: 'https://www.amap.com/place/B000A45467',
    srcPrefix: '',
    linkRule: ['\\.amap\\.com'],
  },
  baidu_map: {
    example: 'https://j.map.baidu.com/15/fo',
    src: 'https://j.map.baidu.com/15/fo',
    srcPrefix: '',
    linkRule: ['map\\.baidu\\.com'],
  },
  modao: {
    example: 'https://free.modao.cc/app/2cd26580a6717a147454df7470e7ec464093cba3/embed/v2#screen=sk71k6d1dfxulzx',
    src: 'https://free.modao.cc/app/6UkpAxcGE3nPz52GLqhnOZgC7MATBSy/embed/v2',
    srcPrefix: '',
    linkRule: ['https:\\/\\/\\w+.modao.cc\\/app\\/\\w+\\/embed\\/v2'],
    tips: 'Modao > More > Share > Embed > COPY',
  },
  lanhu: {
    example: 'https://lanhuapp.com/web/#/item/project/stage?pid=uuid',
    src: 'https://lanhuapp.com/web/#/item/project/stage?pid=uuid',
    srcPrefix: '',
    linkRule: ['lanhuapp\\.com\\/web\\/#\\/item\\/project\\/stage\\?pid=[\\w-]+'],
    tips: 'Lanhu > Project > Share > Copy Link',
  },
  figma: {
    example: 'https://www.figma.com/file/aS9uSgPXoNpaPkzbjNcK8v/Demo?node-id=0%3A1',
    src: 'https://www.figma.com/file/aS9uSgPXoNpaPkzbjNcK8v/Demo?node-id=0%3A1',
    srcPrefix: 'https://www.figma.com/embed?embed_host=share&url',
    linkRule: ['https:\\/\\/www.figma.com\\/file\\/\\w+'],
  },
  canva: {
    example: 'https://www.canva.cn/design/DAD61-t29UI/view',
    src: 'https://www.canva.cn/design/DAD61-t29UI/view',
    srcPrefix: '',
    linkRule: ['https:\\/\\/www.canva.cn\\/design\\/.+\\/view'],
  },
  processon: {
    example: 'https://www.processon.com/embed/5ea99d8607912948b0e6fe78',
    src: 'https://www.processon.com/embed/5ea99d8607912948b0e6fe78',
    srcPrefix: '',
    linkRule: ['https:\\/\\/www.processon.com\\/embed\\/\\w+'],
  },
  codepen: {
    example: 'https://codepen.io/mekery/embed/YzyrKOJ',
    src: 'https://codepen.io/mekery/embed/YzyrKOJ',
    srcPrefix: '',
    linkRule: ['https:\\/\\/codepen.io\\/.+\\/embed\\/\\w+'],
  },
  jinshuju: {
    example: 'https://jinshuju.net/f/q9YvVf',
    src: 'https://jinshuju.net/f/q9YvVf',
    srcPrefix: '',
    linkRule: ['https:\\/\\/jinshuju.net\\/f\\/\\w+'],
  },
  iframe: {
    example: 'https://v.youku.com/v_show/id_XNDM0NDM4MTcy.html',
    src: 'https://player.youku.com/embed/XNDM0NDM4MTcy',
    srcPrefix: '',
    linkRule: ['.+'],
  },
}

// Add stricter type definitions
interface EmbedResult {
  validLink: boolean
  validId: boolean
  matchedUrl: string
  originalLink: string
  src: string
}

interface EmbedServiceConfig {
  example: string
  src: string
  srcPrefix: string
  linkRule: string[]
  idRule?: string
  tips?: string
}

// Use Map to store service handlers to avoid multiple switch-case
const serviceHandlers = new Map<string, (originalLink: string, result: EmbedResult) => EmbedResult>([
  ['youtube', getYoutubeSrc],
  ['youku', getYoukuSrc],
  ['bilibili', getBilibiliSrc],
  ['qqvideo', getQQVideoSrc],
  ['amap', getAMapSrc],
  ['baidu_map', getBaiduMapSrc],
  ['modao', getModaoSrc],
  ['lanhu', getLanhuSrc],
  ['figma', getFigmaSrc],
  ['canva', getCanvaSrc],
  ['processon', getProcessonSrc],
  ['codepen', getCodepenSrc],
  ['jinshuju', getJinshujuSrc],
  ['iframe', getCommonSrc],
])

// Cache regex patterns for better performance
const regexCache = new Map<string, RegExp>()

function getMatchedUrl(service: string, originalLink: string, result: EmbedResult): EmbedResult {
  const link = EmbedServiceLink[service]
  const linkRule = link.linkRule

  for (const rule of linkRule) {
    let regex = regexCache.get(rule)
    if (!regex) {
      regex = new RegExp(rule)
      regexCache.set(rule, regex)
    }

    const match = originalLink.match(regex)
    if (match?.[0]) {
      result.validLink = true
      result.matchedUrl = match[0]
      return result
    }
  }

  return result
}

function getYoutubeSrc(originalLink, result) {
  let link = EmbedServiceLink.youtube
  let url = result.matchedUrl
  result.validLink = true

  let splits = url.split('=')
  let len = splits.length
  if (len > 0) {
    let id = splits[len - 1]
    result.src = `${link.srcPrefix}/${id}`
    result.validId = true
  }

  return result
}

function getYoukuSrc(originalLink, result) {
  let link = EmbedServiceLink.youku
  let url = result.matchedUrl

  let idRule = link.idRule
  let regex = new RegExp(idRule)
  let match = url.match(regex)
  if (match && match.length > 0) {
    let id = match[0].substr(3)

    result.validId = true
    result.src = `${link.srcPrefix}/${id}`
  } else {
    result.validId = false
  }

  return result
}

function getBilibiliSrc(originalLink, result) {
  let link = EmbedServiceLink.bilibili
  let url = result.matchedUrl

  let splits = url.split('/')
  let len = splits.length
  if (len > 0) {
    let id = splits[len - 1]
    result.src = `${link.srcPrefix}=${id}`
    result.validId = true
  }

  return result
}

function getQQVideoSrc(originalLink, result) {
  let link = EmbedServiceLink.qqvideo
  let url = result.matchedUrl

  let splits = url.split('/')
  let len = splits.length
  if (len > 0) {
    let id = splits[len - 1]
    result.src = `${link.srcPrefix}=${id}`
    result.validId = true
  }

  return result
}

function getAMapSrc(originalLink, result) {
  result.src = originalLink
  result.validId = true

  return result
}

function getBaiduMapSrc(originalLink, result) {
  result.src = originalLink
  result.validId = true

  return result
}

function getGoogleMapSrc(originalLink, result) {
  result.src = result.matchedUrl
  result.validId = true
  result.originalLink = result.src

  return result
}

function getModaoSrc(originalLink, result) {
  result.src = result.matchedUrl
  result.validId = true
  result.originalLink = result.src

  return result
}

function getLanhuSrc(originalLink: string, result: EmbedResult): EmbedResult {
  // 从URL中提取项目ID
  const pidMatch = originalLink.match(/pid=([\w-]+)/)
  if (pidMatch && pidMatch[1]) {
    // 构建嵌入式URL
    result.src = `https://lanhuapp.com/web/#/item/project/stage?pid=${pidMatch[1]}&type=share_embed`
    result.validId = true
  } else {
    result.src = originalLink
    result.validId = true
  }
  result.originalLink = originalLink

  return result
}

function getFigmaSrc(originalLink, result) {
  let link = EmbedServiceLink.figma
  result.src = `${link.srcPrefix}=${encodeURIComponent(result.matchedUrl)}`
  result.validId = true
  result.originalLink = result.matchedUrl

  return result
}

function getCanvaSrc(originalLink, result) {
  result.src = `${result.matchedUrl}?embed`
  result.validId = true
  result.originalLink = originalLink

  return result
}

function getProcessonSrc(originalLink, result) {
  result.src = `${result.matchedUrl}`
  result.validId = true
  result.originalLink = originalLink

  return result
}

function getCodepenSrc(originalLink, result) {
  result.src = `${result.matchedUrl}`
  result.validId = true
  result.originalLink = result.src

  return result
}

function getJinshujuSrc(originalLink, result) {
  result.src = `${result.matchedUrl}?background=white&banner=show&embedded=true`
  result.validId = true
  result.originalLink = originalLink

  return result
}

function getCommonSrc(originalLink, result) {
  result.src = `${result.matchedUrl}`
  result.validId = true
  result.originalLink = originalLink

  return result
}

export function getExampleUrl(service: string) {
  let exampleUrl = ''
  let link = EmbedServiceLink[service]
  if (link) {
    exampleUrl = link.example
  }
  return exampleUrl
}

// Update getServiceSrc type declaration
export const getServiceSrc = (service: string, originalLink: string): EmbedResult => {
  if (!service || !originalLink) {
    return {
      validLink: false,
      validId: false,
      matchedUrl: '',
      originalLink: originalLink || '',
      src: '',
    }
  }

  if (!EmbedServiceLink[service]) {
    console.warn(`Unknown embed service: ${service}`)
    return {
      validLink: false,
      validId: false,
      matchedUrl: '',
      originalLink,
      src: '',
    }
  }

  let result: EmbedResult = {
    validLink: false,
    validId: false,
    matchedUrl: '',
    originalLink,
    src: '',
  }

  // Match URL pattern
  result = getMatchedUrl(service, originalLink, result)
  if (!result.validLink) {
    return result
  }

  // Get corresponding handler function
  const handler = serviceHandlers.get(service) || getCommonSrc
  return handler(originalLink, result)
}
