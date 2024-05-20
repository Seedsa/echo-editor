import { Editor } from '@tiptap/core'

export function cloneElement(node: HTMLElement) {
  const clonedNode: any = node.cloneNode(true)
  const originalElements = [node, ...Array.from(node.getElementsByTagName('*'))]
  const clonedElements = [clonedNode, ...Array.from(clonedNode.getElementsByTagName('*'))]
  originalElements.forEach((element, index) => {
    clonedElements[index].style.cssText = (function (element) {
      let styles = ''
      const computedStyles = getComputedStyle(element)
      for (let i = 0; i < computedStyles.length; i += 1) {
        styles += `${computedStyles[i]}:${computedStyles.getPropertyValue(computedStyles[i])};`
      }
      return styles
    })(element)
  })
  return clonedNode
}
export function getComputedStyles(node: Element, property: any) {
  return window.getComputedStyle(node)[property]
}

export function minMax(value = 0, min = 0, max = 0) {
  return Math.min(Math.max(value, min), max)
}

export function removeNode(node: HTMLElement) {
  if (node.parentNode !== null && node.parentNode !== undefined) {
    node.parentNode.removeChild(node)
  }
}
export type FindElementNextToCoords = {
  x: number
  y: number
  direction?: 'left' | 'right'
  editor: Editor
}
export const findElementNextToCoords = (options: FindElementNextToCoords) => {
  const { x, y, direction, editor } = options
  let resultElement: any = null
  let resultNode: any = null
  let d: any = null
  let l = x
  for (; null === resultNode && l < window.innerWidth && l > 0; ) {
    const elements = document.elementsFromPoint(l, y)
    const index = elements.findIndex(el => el.classList.contains('ProseMirror'))
    const filteredElements = elements.slice(0, index)
    if (filteredElements.length > 0) {
      const element = filteredElements[0]
      resultElement = element
      d = editor.view.posAtDOM(element, 0)
      if (d >= 0) {
        resultNode = editor.state.doc.nodeAt(Math.max(d - 1, 0))
        if (resultNode === null || resultNode.isText) {
          resultNode = editor.state.doc.nodeAt(Math.max(d - 1, 0))
        }
        if (!resultNode) {
          resultNode = editor.state.doc.nodeAt(Math.max(d, 0))
        }
        break
      }
    }
    if (direction === 'left') {
      l -= 1
    } else {
      l += 1
    }
  }
  return { resultElement, resultNode, pos: d !== null ? d : null }
}
