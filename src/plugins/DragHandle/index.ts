import { PluginKey, Plugin } from '@tiptap/pm/state'
import tippy from 'tippy.js'
import debounce from 'lodash/debounce'
import { ySyncPluginKey, absolutePositionToRelativePosition, relativePositionToAbsolutePosition } from 'y-prosemirror'
import { getSelectionRanges, NodeRangeSelection } from './range'
import { cloneElement, getComputedStyles, minMax, removeNode, findElementNextToCoords } from './utils'
import { Editor } from '@tiptap/core'
import { Node } from '@tiptap/pm/model'
import type { Props as TippyProps } from 'tippy.js'
import { Transaction, EditorState } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'


function getSelectionRangesNearCursor(event, editor) {
  const { doc: editorDocument } = editor.view.state,
    nearestElement = findElementNextToCoords({ editor: editor, x: event.clientX, y: event.clientY, direction: 'right' })
  if (!nearestElement.resultNode || null === nearestElement.pos) return []
  const mouseXPosition = event.clientX,
    cursorPosition = (function (editor, mouseX, mouseY) {
      const editorPaddingLeft = parseInt(getComputedStyles(editor.dom, 'paddingLeft'), 10),
        editorPaddingRight = parseInt(getComputedStyles(editor.dom, 'paddingRight'), 10),
        editorBorderLeft = parseInt(getComputedStyles(editor.dom, 'borderLeftWidth'), 10),
        editorBorderRight = parseInt(getComputedStyles(editor.dom, 'borderLeftWidth'), 10),
        editorRect = editor.dom.getBoundingClientRect()
      return {
        left: minMax(mouseX, editorRect.left + editorPaddingLeft + editorBorderLeft,
          editorRect.right - editorPaddingRight - editorBorderRight),
        top: mouseY
      }
    })(editor.view, mouseXPosition, event.clientY),
    positionAtCoords = editor.view.posAtCoords(cursorPosition)
  if (!positionAtCoords) return []
  const { pos: documentPosition } = positionAtCoords
  if (!editorDocument.resolve(documentPosition).parent) return []
  const startResolvedPosition = editorDocument.resolve(nearestElement.pos),
    endResolvedPosition = editorDocument.resolve(nearestElement.pos + 1)
  return getSelectionRanges(startResolvedPosition, endResolvedPosition, 0)
}
const getPreviousNodeStartPosition = (document, position) => {
  const resolvedPosition = document.resolve(position),
    { depth: nodeDepth } = resolvedPosition
  if (0 === nodeDepth) return position
  return resolvedPosition.pos - resolvedPosition.parentOffset - 1
}
const getAncestorNodeAtDepth = (document, position) => {
  const currentNode = document.nodeAt(position),
    resolvedPosition = document.resolve(position)
  let { depth: currentDepth } = resolvedPosition,
    ancestorNode = currentNode
  for (; currentDepth > 0;) {
    const parentNode = resolvedPosition.node(currentDepth)
    currentDepth -= 1
    if (0 === currentDepth) {
      ancestorNode = parentNode
    }
  }
  return ancestorNode
}
const getOuterNode = (doc, pos) => {
  const n = ySyncPluginKey.getState(doc)
  return n ? absolutePositionToRelativePosition(pos, n.type, n.binding.mapping) : null
}
const getOuterNodePos = (e, t) => {
  let n = t
  for (; n && n.parentNode && n.parentNode !== e.dom;) n = n.parentNode
  return n
}

const dragHandlePluginDefaultKey = new PluginKey('dragHandle')

const DragHandlePlugin = ({
  pluginKey: customPluginKey = dragHandlePluginDefaultKey,
  element: dragHandleElement,
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
  const dragHandleContainer = document.createElement('div')
  let relativePosition
  let tippyInstance: any = null
  let isDragLocked = false
  let selectedNode = null
  let selectedNodePosition = -1

  dragHandleElement.addEventListener('dragstart', event => {
    const { view: editorView } = editor
    if (!event.dataTransfer) return
    const { empty: isSelectionEmpty, $from: selectionStart, $to: selectionEnd } = editorView.state.selection
    const nearCursorRanges = getSelectionRangesNearCursor(event, editor)
    const currentSelectionRanges = getSelectionRanges(selectionStart, selectionEnd, 0)
    const hasOverlappingRanges = currentSelectionRanges.some(range =>
      nearCursorRanges.find(nearRange => nearRange.$from === range.$from && nearRange.$to === range.$to))
    const selectedRanges = isSelectionEmpty || !hasOverlappingRanges ? nearCursorRanges : currentSelectionRanges

    if (!selectedRanges.length) return
    const { tr: transaction } = editorView.state
    const dragPreviewElement = document.createElement('div')
    const startPos = selectedRanges[0].$from.pos
    const endPos = selectedRanges[selectedRanges.length - 1].$to.pos
    const nodeSelection = NodeRangeSelection.create(editorView.state.doc, startPos, endPos)
    const selectionSlice = nodeSelection.content()

    selectedRanges.forEach(range => {
      const clonedNode = cloneElement(editorView.nodeDOM(range.$from.pos) as HTMLElement)
      dragPreviewElement.append(clonedNode)
    })
    dragPreviewElement.style.position = 'absolute'
    dragPreviewElement.style.top = '-10000px'
    document.body.append(dragPreviewElement)
    event.dataTransfer.clearData()
    event.dataTransfer.setDragImage(dragPreviewElement, 0, 0)
    editorView.dragging = { slice: selectionSlice, move: true }
    transaction.setSelection(nodeSelection)
    editorView.dispatch(transaction)
    document.addEventListener('drop', () => removeNode(dragPreviewElement), { once: true })
    setTimeout(() => {
      dragHandleElement && (dragHandleElement.style.pointerEvents = 'none')
    }, 0)
  })
  dragHandleElement.addEventListener('dragend', () => {
    dragHandleElement && (dragHandleElement.style.pointerEvents = 'auto')
  })
  return new Plugin({
    key: typeof customPluginKey === 'string' ? new PluginKey(customPluginKey) : customPluginKey,
    state: {
      init: () => ({ locked: false }),
      apply(transaction: Transaction, oldState: { locked: boolean }, newState: EditorState, editorState: EditorState): { locked: boolean } {
        const isLocked = transaction.getMeta('lockDragHandle')
        const shouldHide = transaction.getMeta('hideDragHandle')
        if ((undefined !== isLocked && (isDragLocked = isLocked), shouldHide && tippyInstance)) {
          tippyInstance.hide()
          isDragLocked = false
          selectedNode = null
          selectedNodePosition = -1
          onNodeChange?.({ editor: editor, node: null, pos: -1 })
          return oldState
        }
        if (transaction.docChanged && -1 !== selectedNodePosition && dragHandleElement && tippyInstance) {
          const newPos = transaction.mapping.map(selectedNodePosition)
          if (newPos !== selectedNodePosition) {
            selectedNodePosition = newPos
            relativePosition = getOuterNode(editorState.doc, selectedNodePosition)
          }
        }
        return oldState
      },
    },
    view: editorView => {
      // 初始化拖动句柄
      initializeDragHandle()

      // 设置容器样式
      setupDragHandleContainer(editor.view.dom)

      // 初始化 tippy 实例
      tippyInstance = tippy(editorView.dom, {
        ...getDefaultTippyConfig(),
        ...tippyOptions,
      })

      return {
        update(editorView, oldState) {
          if (!canUpdateDragHandle(dragHandleElement, tippyInstance)) {
            return
          }

          // 更新拖动锁定状态
          dragHandleElement.draggable = !isDragLocked

          // 检查是否需要更新位置
          if (!shouldUpdatePosition(editorView, oldState)) {
            return
          }

          // 获取并验证目标元素
          const targetElement = getValidTargetElement(editorView)
          if (!targetElement) {
            return
          }

          // 更新节点信息
          updateNodeInformation(editorView, targetElement)
        },
        destroy() {
          cleanup()
        }
      }

      // 辅助函数
      function initializeDragHandle() {
        dragHandleElement.draggable = true
        dragHandleElement.style.pointerEvents = 'auto'
      }

      function setupDragHandleContainer(parentElement) {
        parentElement.parentElement?.appendChild(dragHandleContainer)
        dragHandleContainer.appendChild(dragHandleElement)

        // 设置容器样式
        Object.assign(dragHandleContainer.style, {
          pointerEvents: 'none',
          position: 'absolute',
          top: '0',
          left: '0'
        })
      }

      function getDefaultTippyConfig(): Partial<TippyProps> {
        return {
          getReferenceClientRect: null,
          interactive: true,
          trigger: 'manual',
          placement: 'left-start',
          hideOnClick: false,
          duration: 100,
          zIndex: 10,
          appendTo: dragHandleContainer,
          content: dragHandleElement,
          popperOptions: {
            modifiers: [
              { name: 'flip', enabled: false },
              {
                name: 'preventOverflow',
                options: {
                  rootBoundary: 'document',
                  mainAxis: false
                }
              },
            ],
          }
        }
      }

      function canUpdateDragHandle(element: HTMLElement | null, tippy: any) {
        return element && tippy
      }

      function shouldUpdatePosition(view: EditorView, oldState: EditorState) {
        return !view.state.doc.eq(oldState.doc) && selectedNodePosition !== -1
      }

      function getValidTargetElement(view: EditorView) {
        let targetElement: any = view.nodeDOM(selectedNodePosition)
        targetElement = getOuterNodePos(view, targetElement)

        if (targetElement === view.dom || targetElement?.nodeType !== 1) {
          return null
        }

        return targetElement
      }

      function updateNodeInformation(view: EditorView, targetElement: HTMLElement) {
        const domPosition = view.posAtDOM(targetElement, 0)
        const ancestorNode = getAncestorNodeAtDepth(editor.state.doc, domPosition)

        if (ancestorNode === selectedNode) {
          return
        }

        const previousNodePos = getPreviousNodeStartPosition(editor.state.doc, domPosition)

        selectedNode = ancestorNode
        selectedNodePosition = previousNodePos
        relativePosition = getOuterNode(editor.state.doc, selectedNodePosition)

        onNodeChange?.({
          editor,
          node: selectedNode,
          pos: selectedNodePosition
        })

        updateTippyPosition(targetElement)
      }

      function updateTippyPosition(element: HTMLElement) {
        tippyInstance.setProps({
          getReferenceClientRect: () => element.getBoundingClientRect()
        })
        tippyInstance.show()
      }

      function cleanup() {
        tippyInstance?.destroy()
        dragHandleElement && removeNode(dragHandleContainer)
      }
    },
    props: {
      handleDOMEvents: {
        mouseleave: (editorView, event: any) => {
          if (isDragLocked) return false
          if (!shouldHideDragHandle(event)) return false

          hideDragHandle()
          resetSelectedState()
          return false

          function shouldHideDragHandle(event) {
            return event.target && !dragHandleContainer.contains(event.relatedTarget)
          }

          function hideDragHandle() {
            tippyInstance?.hide()
          }

          function resetSelectedState() {
            selectedNode = null
            selectedNodePosition = -1
            onNodeChange?.({
              editor: editor,
              node: null,
              pos: -1
            })
          }
        },
        mousemove: debounce((editorView: EditorView, mouseEvent: MouseEvent) => {
          // 检查拖动句柄是否可用
          if (!dragHandleElement || !tippyInstance || isDragLocked) {
            return false;
          }

          // 获取最近的元素
          const nearestElement = findElementNextToCoords({
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
            direction: 'right',
            editor: editor
          });

          // 验证目标元素
          if (!nearestElement.resultElement) {
            return false;
          }

          if (nearestElement.resultElement === editorView.dom) {
            return false;
          }

          // 获取外部节点位置
          const targetElement = getOuterNodePos(editorView, nearestElement.resultElement);

          // 验证 DOM 节点
          if (targetElement === editorView.dom) {
            return false;
          }

          if (targetElement?.nodeType !== 1) {
            return false;
          }

          const domPosition = editorView.posAtDOM(targetElement, 0);
          const ancestorNode = getAncestorNodeAtDepth(editor.state.doc, domPosition);

          // 只在节点发生变化时更新
          if (ancestorNode === selectedNode) {
            return false;
          }

          // 更新选中的节点
          const previousNodePosition = getPreviousNodeStartPosition(editor.state.doc, domPosition);
          selectedNode = ancestorNode;
          selectedNodePosition = previousNodePosition;
          relativePosition = getOuterNode(editorView.state, selectedNodePosition);

          // 触发节点变化回调
          onNodeChange?.({
            editor: editor,
            node: selectedNode,
            pos: selectedNodePosition
          });

          // 更新 tippy 位置
          tippyInstance.setProps({
            getReferenceClientRect: () => targetElement.getBoundingClientRect()
          });
          tippyInstance.show();

          return false;
        }, 100),
      },
    },
  })
}

export { DragHandlePlugin, dragHandlePluginDefaultKey }
