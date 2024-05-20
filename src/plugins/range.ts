import { Selection, SelectionRange } from '@tiptap/pm/state'
import { NodeRange, ResolvedPos, Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Mapping, Mappable } from '@tiptap/pm/transform'

export function getSelectionRanges(state: ResolvedPos, range: ResolvedPos, depth?: number): SelectionRange[] {
  const ranges: SelectionRange[] = []
  const root = state.node(0)
  depth =
    typeof depth === 'number' && depth >= 0
      ? depth
      : state.sameParent(range)
        ? Math.max(0, state.sharedDepth(range.pos) - 1)
        : state.sharedDepth(range.pos)
  const nodeRange = new NodeRange(state, range, depth)
  const startIndex = nodeRange.depth === 0 ? 0 : root.resolve(nodeRange.start).posAtIndex(0)

  nodeRange.parent.forEach((size, offset) => {
    const from = startIndex + offset
    const to = from + size.nodeSize
    if (from < nodeRange.start || from >= nodeRange.end) return
    const selectionRange = new SelectionRange(root.resolve(from), root.resolve(to))
    ranges.push(selectionRange)
  })

  return ranges
}

class NodeRangeBookmark {
  anchor: number
  head: number
  constructor(anchor: number, head: number) {
    this.anchor = anchor
    this.head = head
  }
  map(mapping: Mappable) {
    return new NodeRangeBookmark(mapping.map(this.anchor), mapping.map(this.head))
  }
  resolve(doc: ProseMirrorNode) {
    const e = doc.resolve(this.anchor)
    const o = doc.resolve(this.head)
    return new NodeRangeSelection(e, o)
  }
}

export class NodeRangeSelection extends Selection {
  depth: number | undefined
  constructor(t: ResolvedPos, e: ResolvedPos, o?: number, s = 1) {
    const { doc: r } = t
    const n = t === e
    const i = t.pos === r.content.size && e.pos === r.content.size
    const a = n && !i ? r.resolve(e.pos + (s > 0 ? 1 : -1)) : e
    const c = n && i ? r.resolve(t.pos - (s > 0 ? 1 : -1)) : t
    const d = getSelectionRanges(c.min(a), c.max(a), o)
    super(a.pos >= t.pos ? d[0].$from : d[d.length - 1].$to, a.pos >= t.pos ? d[d.length - 1].$to : d[0].$from, d)
    this.depth = o
  }
  get $to() {
    return this.ranges[this.ranges.length - 1].$to
  }
  eq(other: Selection) {
    return other instanceof NodeRangeSelection && other.$from.pos === this.$from.pos && other.$to.pos === this.$to.pos
  }
  map(doc: ProseMirrorNode, mapping: Mapping) {
    const o = doc.resolve(mapping.map(this.anchor))
    const s = doc.resolve(mapping.map(this.head))
    return new NodeRangeSelection(o, s)
  }
  toJSON() {
    return { type: 'nodeRange', anchor: this.anchor, head: this.head }
  }
  get isForwards() {
    return this.head >= this.anchor
  }
  get isBackwards() {
    return !this.isForwards
  }
  extendBackwards() {
    const { doc: t } = this.$from
    if (this.isForwards && this.ranges.length > 1) {
      const t = this.ranges.slice(0, -1)
      const e = t[0].$from
      const o = t[t.length - 1].$to
      return new NodeRangeSelection(e, o, this.depth)
    }
    const e = this.ranges[0]
    const o = t.resolve(Math.max(0, e.$from.pos - 1))
    return new NodeRangeSelection(this.$anchor, o, this.depth)
  }
  extendForwards() {
    const { doc: t } = this.$from
    if (this.isBackwards && this.ranges.length > 1) {
      const t = this.ranges.slice(1)
      const e = t[0].$from
      const o = t[t.length - 1].$to
      return new NodeRangeSelection(o, e, this.depth)
    }
    const e = this.ranges[this.ranges.length - 1]
    const o = t.resolve(Math.min(t.content.size, e.$to.pos + 1))
    return new NodeRangeSelection(this.$anchor, o, this.depth)
  }
  static fromJSON(doc: ProseMirrorNode, json: any): NodeRangeSelection {
    return new NodeRangeSelection(doc.resolve(json.anchor), doc.resolve(json.head))
  }
  static create(doc: ProseMirrorNode, anchor: number, head: number, depth?: number, bias = 1) {
    return new this(doc.resolve(anchor), doc.resolve(head), depth, bias)
  }
  getBookmark() {
    return new NodeRangeBookmark(this.anchor, this.head)
  }
}
