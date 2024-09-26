import { Extension, Range, type Dispatch } from '@tiptap/core'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { Plugin, PluginKey, type EditorState, type Transaction } from '@tiptap/pm/state'
import { Node as PMNode } from '@tiptap/pm/model'
import ActionButton from '@/components/ActionButton.vue'
import { useTiptapStore } from '@/hooks'

const store = useTiptapStore()
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    search: {
      /**
       * @description Set search term in extension.
       */
      setSearchTerm: (searchTerm: string) => ReturnType
      /**
       * @description Set replace term in extension.
       */
      setReplaceTerm: (replaceTerm: string) => ReturnType
      /**
       * @description Set case sensitivity in extension.
       */
      setCaseSensitive: (caseSensitive: boolean) => ReturnType
      /**
       * @description Reset current search result to first instance.
       */
      resetIndex: () => ReturnType
      /**
       * @description Find next instance of search result.
       */
      nextSearchResult: () => ReturnType
      /**
       * @description Find previous instance of search result.
       */
      previousSearchResult: () => ReturnType
      /**
       * @description Replace first instance of search result with given replace term.
       */
      replace: () => ReturnType
      /**
       * @description Replace all instances of search result with given replace term.
       */
      replaceAll: () => ReturnType
    }
  }
}

interface TextNodesWithPosition {
  text: string
  pos: number
}

const getRegex = (s: string, disableRegex: boolean, caseSensitive: boolean): RegExp => {
  return RegExp(disableRegex ? s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : s, caseSensitive ? 'gu' : 'gui')
}

interface ProcessedSearches {
  decorationsToReturn: DecorationSet
  results: Range[]
}

function processSearches(
  doc: PMNode,
  searchTerm: RegExp,
  searchResultClass: string,
  resultIndex: number
): ProcessedSearches {
  const decorations: Decoration[] = []
  const results: Range[] = []

  let textNodesWithPosition: TextNodesWithPosition[] = []
  let index = 0

  if (!searchTerm) {
    return {
      decorationsToReturn: DecorationSet.empty,
      results: [],
    }
  }

  doc?.descendants((node, pos) => {
    if (node.isText) {
      if (textNodesWithPosition[index]) {
        textNodesWithPosition[index] = {
          text: textNodesWithPosition[index].text + node.text,
          pos: textNodesWithPosition[index].pos,
        }
      } else {
        textNodesWithPosition[index] = {
          text: `${node.text}`,
          pos,
        }
      }
    } else {
      index += 1
    }
  })

  textNodesWithPosition = textNodesWithPosition.filter(Boolean)

  for (const element of textNodesWithPosition) {
    const { text, pos } = element
    const matches = Array.from(text.matchAll(searchTerm)).filter(([matchText]) => matchText.trim())

    for (const m of matches) {
      if (m[0] === '') break

      if (m.index !== undefined) {
        results.push({
          from: pos + m.index,
          to: pos + m.index + m[0].length,
        })
      }
    }
  }

  for (let i = 0; i < results.length; i += 1) {
    const r = results[i]
    const className = i === resultIndex ? `${searchResultClass} ${searchResultClass}-current` : searchResultClass
    const decoration: Decoration = Decoration.inline(r.from, r.to, {
      class: className,
    })

    decorations.push(decoration)
  }

  return {
    decorationsToReturn: DecorationSet.create(doc, decorations),
    results,
  }
}

const replace = (
  replaceTerm: string,
  results: Range[],
  { state, dispatch }: { state: EditorState; dispatch: Dispatch }
) => {
  const firstResult = results[0]

  if (!firstResult) return

  const { from, to } = results[0]

  if (dispatch) dispatch(state.tr.insertText(replaceTerm, from, to))
}

const rebaseNextResult = (
  replaceTerm: string,
  index: number,
  lastOffset: number,
  results: Range[]
): [number, Range[]] | null => {
  const nextIndex = index + 1

  if (!results[nextIndex]) return null

  const { from: currentFrom, to: currentTo } = results[index]

  const offset = currentTo - currentFrom - replaceTerm.length + lastOffset

  const { from, to } = results[nextIndex]

  results[nextIndex] = {
    to: to - offset,
    from: from - offset,
  }

  return [offset, results]
}

const replaceAll = (
  replaceTerm: string,
  results: Range[],
  { tr, dispatch }: { tr: Transaction; dispatch: Dispatch }
) => {
  let offset = 0

  let resultsCopy = results.slice()

  if (!resultsCopy.length) return

  for (let i = 0; i < resultsCopy.length; i += 1) {
    const { from, to } = resultsCopy[i]

    tr.insertText(replaceTerm, from, to)

    const rebaseNextResultResponse = rebaseNextResult(replaceTerm, i, offset, resultsCopy)

    if (!rebaseNextResultResponse) continue

    offset = rebaseNextResultResponse[0]
    resultsCopy = rebaseNextResultResponse[1]
  }
  if (dispatch) {
    dispatch(tr)
  }
}

export const findAndReplacePluginKey = new PluginKey('findAndReplacePlugin')

export interface FindAndReplaceOptions {
  searchResultClass: string
  disableRegex: boolean
}

export interface FindAndReplaceStorage {
  searchTerm: string
  replaceTerm: string
  results: Range[]
  lastSearchTerm: string
  caseSensitive: boolean
  lastCaseSensitive: boolean
  resultIndex: number
  lastResultIndex: number
}
// origin repo https://github.com/sereneinserenade/tiptap-search-and-replace/blob/main/src/findAndReplace.ts
export const FindAndReplace = Extension.create<FindAndReplaceOptions, FindAndReplaceStorage>({
  name: 'findAndReplace',
  addOptions() {
    return {
      searchResultClass: 'echo-editor-search-result',
      disableRegex: true,
      button: ({ editor, extension, t }) => ({
        component: ActionButton,
        componentProps: {
          icon: 'DocSearch',
          tooltip: t('editor.findAndReplace.tooltip'),
          action: () => {
            store.toggleFindAndReplace()
          },
        },
      }),
    }
  },

  addStorage() {
    return {
      searchTerm: '',
      replaceTerm: '',
      results: [],
      lastSearchTerm: '',
      caseSensitive: false,
      lastCaseSensitive: false,
      resultIndex: 0,
      lastResultIndex: 0,
    }
  },

  addCommands() {
    return {
      setSearchTerm:
        (searchTerm: string) =>
        ({ editor }) => {
          editor.storage.findAndReplace.searchTerm = searchTerm

          return false
        },
      setReplaceTerm:
        (replaceTerm: string) =>
        ({ editor }) => {
          editor.storage.findAndReplace.replaceTerm = replaceTerm

          return false
        },
      setCaseSensitive:
        (caseSensitive: boolean) =>
        ({ editor }) => {
          editor.storage.findAndReplace.caseSensitive = caseSensitive

          return false
        },
      resetIndex:
        () =>
        ({ editor }) => {
          editor.storage.findAndReplace.resultIndex = 0

          return false
        },
      nextSearchResult:
        () =>
        ({ editor }) => {
          const { results, resultIndex } = editor.storage.findAndReplace

          const nextIndex = resultIndex + 1

          if (results[nextIndex]) {
            editor.storage.findAndReplace.resultIndex = nextIndex
          } else {
            editor.storage.findAndReplace.resultIndex = 0
          }

          return false
        },
      previousSearchResult:
        () =>
        ({ editor }) => {
          const { results, resultIndex } = editor.storage.findAndReplace

          const prevIndex = resultIndex - 1

          if (results[prevIndex]) {
            editor.storage.findAndReplace.resultIndex = prevIndex
          } else {
            editor.storage.findAndReplace.resultIndex = results.length - 1
          }

          return false
        },
      replace:
        () =>
        ({ editor, state, dispatch }) => {
          const { replaceTerm, results } = editor.storage.findAndReplace

          replace(replaceTerm, results, { state, dispatch })

          return false
        },
      replaceAll:
        () =>
        ({ editor, tr, dispatch }) => {
          const { replaceTerm, results } = editor.storage.findAndReplace

          replaceAll(replaceTerm, results, { tr, dispatch })

          return false
        },
    }
  },

  addProseMirrorPlugins() {
    const editor = this.editor
    const { searchResultClass, disableRegex } = this.options

    const setLastSearchTerm = (t: string) => (editor.storage.findAndReplace.lastSearchTerm = t)
    const setLastCaseSensitive = (t: boolean) => (editor.storage.findAndReplace.lastCaseSensitive = t)
    const setLastResultIndex = (t: number) => (editor.storage.findAndReplace.lastResultIndex = t)

    return [
      new Plugin({
        key: findAndReplacePluginKey,
        state: {
          init: () => DecorationSet.empty,
          apply({ doc, docChanged }, oldState) {
            // console.log(ed)
            const { searchTerm, lastSearchTerm, caseSensitive, lastCaseSensitive, resultIndex, lastResultIndex } =
              editor.storage.findAndReplace

            if (
              !docChanged &&
              lastSearchTerm === searchTerm &&
              lastCaseSensitive === caseSensitive &&
              lastResultIndex === resultIndex
            )
              return oldState

            setLastSearchTerm(searchTerm)
            setLastCaseSensitive(caseSensitive)
            setLastResultIndex(resultIndex)

            if (!searchTerm) {
              editor.storage.findAndReplace.results = []
              return DecorationSet.empty
            }

            const { decorationsToReturn, results } = processSearches(
              doc,
              getRegex(searchTerm, disableRegex, caseSensitive),
              searchResultClass,
              resultIndex
            )

            editor.storage.findAndReplace.results = results

            return decorationsToReturn
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
        },
      }),
    ]
  },
})
