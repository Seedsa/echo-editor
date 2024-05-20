import type { Editor, JSONContent } from '@tiptap/core'

// https://github.com/ueberdosis/tiptap/blob/6cbc2d423391c950558721510c1b4c8614feb534/packages/extension-image/src/image.ts#L48-L58
export type ImageNodeAttributes = {
  /** The URL at which this image can be served. Used as <img> `src`. */
  src: string
  /** Alt text for the image. */
  alt?: string
  /** The `title` attribute when we render the image element. */
  title?: string
}

/**
 * 将给定的图像数组插入到 Tiptap 编辑器文档内容中。
 * 可选地指定要将图像插入到编辑器内容中的给定位置。如果未给出，则将新插入的图像替换用户当前的选择（如果有）。
 *
 * @param options.images The attributes of each image to insert
 * @param options.editor The Tiptap editor in which to insert
 * @param options.position The position at which to insert into the editor
 * content. If not given, uses the current editor caret/selection position.
 */
export function insertImages({
  images,
  editor,
  position,
}: {
  images: ImageNodeAttributes[]
  editor: Editor | null
  position?: number
}): void {
  if (!editor || editor.isDestroyed || images.length === 0) {
    return
  }

  const imageContentToInsert: JSONContent[] = images
    .filter(imageAttrs => !!imageAttrs.src)
    .map(imageAttrs => ({
      type: editor.schema.nodes.image.name,
      attrs: imageAttrs,
    }))

  editor
    .chain()
    .command(({ commands }) => {
      if (position == null) {
        //将在用户当前的选择位置插入并替换
        return commands.insertContent(imageContentToInsert)
      } else {
        return commands.insertContentAt(position, imageContentToInsert)
      }
    })
    .focus()
    .run()
}
