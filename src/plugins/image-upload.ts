import { type EditorState, Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view'

const uploadKey = new PluginKey('upload-image')

export const UploadImagesPlugin = () =>
  new Plugin({
    key: uploadKey,
    state: {
      init() {
        return DecorationSet.empty
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc)
        //@ts-expect-error
        const action = tr.getMeta(this)
        if (action?.add) {
          action.add.forEach(({ id, pos, src }) => {
            const placeholder = document.createElement('div')
            placeholder.setAttribute('class', 'img-placeholder')
            const image = document.createElement('img')
            image.setAttribute('class', 'opacity-50')
            image.src = src
            placeholder.appendChild(image)
            const deco = Decoration.widget(pos + 1, placeholder, {
              id,
            })
            set = set.add(tr.doc, [deco])
          })
        } else if (action?.remove) {
          action.remove.forEach(id => {
            set = set.remove(set.find(undefined, undefined, spec => spec.id == id))
          })
        }
        return set
      },
    },
    props: {
      decorations(state) {
        return this.getState(state)
      },
    },
  })

function findPlaceholder(state: EditorState, id: {}) {
  const decos = uploadKey.getState(state) as DecorationSet
  const found = decos.find(undefined, undefined, spec => spec.id == id)
  return found.length ? found[0]?.from : null
}

export interface ImageUploadOptions {
  validateFn?: (file: File) => void
  onUpload: (file: File) => Promise<unknown>
}

export const createImageUpload =
  ({ validateFn, onUpload }: ImageUploadOptions): UploadFn =>
  (files, view, pos) => {
    files.forEach(file => {
      const validated = validateFn?.(file)
      if (!validated) return
      const id = {}
      const tr = view.state.tr
      if (!tr.selection.empty) tr.deleteSelection()
      const result = URL.createObjectURL(file)
      tr.setMeta(uploadKey, {
        add: [{ id, pos, src: result }],
      })
      view.dispatch(tr)

      onUpload(file).then(
        src => {
          const { schema } = view.state
          const pos = findPlaceholder(view.state, id)
          if (pos == null) return
          const imageSrc = typeof src === 'object' ? result : src
          const node = schema.nodes.image?.create({ src: imageSrc })
          if (!node) return
          const transaction = view.state.tr.replaceWith(pos, pos, node).setMeta(uploadKey, { remove: [id] })
          view.dispatch(transaction)
        },
        () => {
          const transaction = view.state.tr.delete(pos, pos).setMeta(uploadKey, { remove: [id] })
          view.dispatch(transaction)
        }
      )
    })
  }

export type UploadFn = (files: File[], view: EditorView, pos: number) => void

export const handleImagePaste = (view: EditorView, event: ClipboardEvent, uploadFn: UploadFn) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault()
    const files = Array.from(event.clipboardData.files)
    const pos = view.state.selection.from
    uploadFn(files, view, pos)
    return true
  }
  return false
}

export const handleImageDrop = (view: EditorView, event: DragEvent, moved: boolean, uploadFn: UploadFn) => {
  if (!moved && event.dataTransfer?.files.length) {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    const coordinates = view.posAtCoords({
      left: event.clientX,
      top: event.clientY,
    })
    if (files) uploadFn(files, view, coordinates?.pos ?? 0 - 1)
    return true
  }
  return false
}
