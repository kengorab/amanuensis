import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import 'codemirror/addon/edit/continuelist'
import 'codemirror/addon/search/search'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/theme/material.css'

interface Props {
  initialValue: string
  onChange: (value: string) => void
}

export default class MarkdownEditor extends React.PureComponent<Props> {
  render() {
    return (
      <>
        <GlobalStyle/>
        <CodeMirror
          value={this.props.initialValue}
          options={{
            mode: 'markdown',
            theme: 'material',
            lineNumbers: true,
            extraKeys: {
              Enter: 'newlineAndIndentContinueMarkdownList' // Comes from continuelist addon
            }
          }}
          onChange={(_, __, value) => this.props.onChange(value)}
        />
      </>
    )
  }
}

const GlobalStyle = createGlobalStyle`
.react-codemirror2 {
  padding-top: 40px;
  flex: 1;
  overflow-y: scroll;
}

.CodeMirror {
  width: 100%;
  height: 100%;
}
`
