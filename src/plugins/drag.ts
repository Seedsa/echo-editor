import { PluginKey, Plugin } from '@tiptap/pm/state'
import tippy from 'tippy.js'
import { ySyncPluginKey, absolutePositionToRelativePosition, relativePositionToAbsolutePosition } from 'y-prosemirror'
import { getSelectionRanges, NodeRangeSelection } from './range'
import { cloneElement, getComputedStyles, minMax, removeNode, findElementNextToCoords } from './utils'
import { Editor } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'
import { Props as TippyProps } from 'tippy.js'

function getSelectionRangesNearCursor(e, t) {
  const { doc: n } = t.view.state,
    o = findElementNextToCoords({ editor: t, x: e.clientX, y: e.clientY, direction: 'right' })
  if (!o.resultNode || null === o.pos) return []
  const r = e.clientX,
    i = (function (e, t, n) {
      const o = parseInt(getComputedStyles(e.dom, 'paddingLeft'), 10),
        r = parseInt(getComputedStyles(e.dom, 'paddingRight'), 10),
        i = parseInt(getComputedStyles(e.dom, 'borderLeftWidth'), 10),
        s = parseInt(getComputedStyles(e.dom, 'borderLeftWidth'), 10),
        d = e.dom.getBoundingClientRect()
      return { left: minMax(t, d.left + o + i, d.right - r - s), top: n }
    })(t.view, r, e.clientY),
    s = t.view.posAtCoords(i)
  if (!s) return []
  const { pos: d } = s
  if (!n.resolve(d).parent) return []
  const a = n.resolve(o.pos),
    p = n.resolve(o.pos + 1)
  return getSelectionRanges(a, p, 0)
}
const getPreviousNodeStartPosition = (e, t) => {
  const n = e.resolve(t),
    { depth: o } = n
  if (0 === o) return t
  return n.pos - n.parentOffset - 1
}
const getAncestorNodeAtDepth = (e, t) => {
  const n = e.nodeAt(t),
    o = e.resolve(t)
  let { depth: r } = o,
    i = n
  for (; r > 0; ) {
    const e = o.node(r)
    ;(r -= 1), 0 === r && (i = e)
  }
  return i
}
const getOuterNode = (doc, pos) => {
  const n = ySyncPluginKey.getState(doc)
  return n ? absolutePositionToRelativePosition(pos, n.type, n.binding.mapping) : null
}
const getOuterNodePos = (e, t) => {
  let n = t
  for (; n && n.parentNode && n.parentNode !== e.dom; ) n = n.parentNode
  return n
}

const dragHandlePluginDefaultKey = new PluginKey('dragHandle')
const DragHandlePlugin = ({
  pluginKey: e = dragHandlePluginDefaultKey,
  element,
  editor,
  tippyOptions,
  onNodeChange,
}: {
  pluginKey?: PluginKey | string
  element: HTMLElement
  editor: Editor
  tippyOptions?: Partial<TippyProps>
  onNodeChange?: (data: { editor: Editor; node: Node | null; pos: number }) => void
}) => {
  const container = document.createElement('div')
  let w
  let tippyInstance: any = null
  let x = false
  let currentNode = null
  let lastNodePos = -1
  element.addEventListener('dragstart', e => {
    const { view } = editor
    if (!e.dataTransfer) return
    const { empty, $from, $to } = view.state.selection
    const s = getSelectionRangesNearCursor(e, editor)
    const d = getSelectionRanges($from, $to, 0)
    const c = d.some(e => s.find(t => t.$from === e.$from && t.$to === e.$to))
    const u = empty || !c ? s : d
    if (!u.length) return
    const { tr: g } = view.state
    const h = document.createElement('div')
    const y = u[0].$from.pos
    const v = u[u.length - 1].$to.pos
    const C = NodeRangeSelection.create(view.state.doc, y, v)
    const E = C.content()
    u.forEach(e => {
      const t = cloneElement(view.nodeDOM(e.$from.pos) as HTMLElement)
      h.append(t)
    })
    h.style.position = 'absolute'
    h.style.top = '-10000px'
    document.body.append(h)
    e.dataTransfer.clearData()
    e.dataTransfer.setDragImage(h, 0, 0)
    view.dragging = { slice: E, move: true }
    g.setSelection(C)
    view.dispatch(g)
    document.addEventListener('drop', () => removeNode(h), { once: true })
    setTimeout(() => {
      element && (element.style.pointerEvents = 'none')
    }, 0)
  })
  element.addEventListener('dragend', () => {
    element && (element.style.pointerEvents = 'auto')
  })
  return new Plugin({
    key: typeof e === 'string' ? new PluginKey(e) : e,
    state: {
      init: () => ({ locked: false }),
      apply(e, t, n, o) {
        const l = e.getMeta('lockDragHandle')
        const a = e.getMeta('hideDragHandle')
        if ((undefined !== l && (x = l), a && tippyInstance)) {
          return (
            tippyInstance.hide(),
            (x = false),
            (currentNode = null),
            (lastNodePos = -1),
            null == onNodeChange || onNodeChange({ editor: editor, node: null, pos: -1 }),
            t
          )
        }
        if (e.docChanged && -1 !== lastNodePos && element && tippyInstance) {
          const t = e.mapping.map(lastNodePos)
          t !== lastNodePos && ((lastNodePos = t), (w = getOuterNode(o, lastNodePos)))
        }
        return t
      },
    },
    view: e => {
      var t
      return (
        (element.draggable = true),
        (element.style.pointerEvents = 'auto'),
        null === (t = editor.view.dom.parentElement) || undefined === t || t.appendChild(container),
        container.appendChild(element),
        (container.style.pointerEvents = 'none'),
        (container.style.position = 'absolute'),
        (container.style.top = '0'),
        (container.style.left = '0'),
        (tippyInstance = tippy(e.dom, {
          getReferenceClientRect: null,
          interactive: true,
          trigger: 'manual',
          placement: 'left-start',
          hideOnClick: false,
          duration: 100,
          zIndex: 10,
          popperOptions: {
            modifiers: [
              { name: 'flip', enabled: false },
              { name: 'preventOverflow', options: { rootBoundary: 'document', mainAxis: false } },
            ],
          },
          ...tippyOptions,
          appendTo: container,
          content: element,
        })),
        {
          update(t, n) {
            if (!element || !tippyInstance) return
            if (((element.draggable = !x), e.state.doc.eq(n.doc) || -1 === lastNodePos)) return
            let o: any = e.nodeDOM(lastNodePos)
            if (((o = getOuterNodePos(e, o)), o === e.dom)) return
            if (1 !== (null == o ? undefined : o.nodeType)) return
            const r = e.posAtDOM(o, 0),
              s = getAncestorNodeAtDepth(editor.state.doc, r)
            if (s !== currentNode) {
              const t = getPreviousNodeStartPosition(editor.state.doc, r)
              ;(currentNode = s),
                (lastNodePos = t),
                (w = getOuterNode(e.state, lastNodePos)),
                null == onNodeChange || onNodeChange({ editor: editor, node: currentNode, pos: lastNodePos }),
                tippyInstance.setProps({ getReferenceClientRect: () => o.getBoundingClientRect() }),
                tippyInstance.show()
            }
          },
          destroy() {
            null == tippyInstance || tippyInstance.destroy(), element && removeNode(container)
          },
        }
      )
    },
    props: {
      handleDOMEvents: {
        mouseleave: (e, event: any) => (
          x ||
            (event.target &&
              !container.contains(event.relatedTarget) &&
              (null == tippyInstance || tippyInstance.hide(),
              (currentNode = null),
              (lastNodePos = -1),
              null == onNodeChange || onNodeChange({ editor: editor, node: null, pos: -1 }))),
          false
        ),
        mousemove(e, t) {
          if (!element || !tippyInstance || x) return false
          const n = findElementNextToCoords({ x: t.clientX, y: t.clientY, direction: 'right', editor: editor })
          if (!n.resultElement) return false
          let o = n.resultElement
          if (((o = getOuterNodePos(e, o)), o === e.dom)) return false
          if (1 !== (null == o ? undefined : o.nodeType)) return false
          const r = e.posAtDOM(o, 0),
            s = getAncestorNodeAtDepth(editor.state.doc, r)
          if (s !== currentNode) {
            const t = getPreviousNodeStartPosition(editor.state.doc, r)
            ;(currentNode = s),
              (lastNodePos = t),
              (w = getOuterNode(e.state, lastNodePos)),
              null == onNodeChange || onNodeChange({ editor: editor, node: currentNode, pos: lastNodePos }),
              tippyInstance.setProps({ getReferenceClientRect: () => o.getBoundingClientRect() }),
              tippyInstance.show()
          }
          return false
        },
      },
    },
  })
}

export { DragHandlePlugin, dragHandlePluginDefaultKey }
