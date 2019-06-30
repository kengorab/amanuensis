import * as React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import { colors } from '../theme-override'
import 'codemirror/addon/edit/continuelist'
import 'codemirror/addon/search/search'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/theme/material.css'
import AutoSaver from '../util/auto-saver'

interface Props {
  initialValue: string
  onChange: (value: string) => void
}

export default class MarkdownEditor extends React.PureComponent<Props> {
  public isDirty = false
  private autoSaver: AutoSaver<string> | null = null

  static ZeroState() {
    return (
      <ZeroStateContainer>
        Select a note from the list on the left, or create a new one!
      </ZeroStateContainer>
    )
  }

  public getValue(): string | null {
    if (!this.autoSaver) return null
    return this.autoSaver.contents
  }

  componentDidMount() {
    this.autoSaver = new AutoSaver(this.props.onChange, this.props.initialValue)
    this.autoSaver.start()
  }

  componentWillUnmount() {
    this.autoSaver!.dispose()
  }

  onChange = (value: string) => {
    this.autoSaver!.update(value)
    this.isDirty = true
  }

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
          onChange={(_, __, value) => this.onChange(value)}
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

const ZeroStateContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${colors.editorBackground};
`
