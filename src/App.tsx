import * as React from 'react'
import styled from 'styled-components'
import MarkdownEditor from './components/MarkdownEditor'
import { colors } from './theme-override'
import { Col, Icon, Row } from 'antd'
import NotesList from './components/NotesList'

const note = `# Hello
\`code\`
  - thing 1
  - thing 2`

const IconButton = styled.div`
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  opacity: 0.8;
  transition: opacity 300ms ease-in;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
`

export default function App() {
  const [notes, setNotes] = React.useState<string[]>('abcdefghijklmnopqrstuvwxyz'.split(''))

  const addNote = React.useCallback(() => {
    setNotes(notes => {
      const newNote = Math.random().toString(32).substring(3, 6)
      return [newNote, ...notes]
    })
  }, [])

  return (
    <AppContainer>
      <VerticalSection span={6}>
        <HeaderContainer>
          <IconButton onClick={addNote}>
            <Icon type="plus"/>
          </IconButton>
        </HeaderContainer>
        <NotesList notes={notes}/>
      </VerticalSection>
      <VerticalSection span={18} style={{ background: colors.editorBackground }}>
        <HeaderContainer/>
        <MarkdownEditor
          initialValue={note}
          onChange={value => console.log(value)}
        />
      </VerticalSection>
    </AppContainer>
  )
}

const AppContainer = styled(Row)`
  display: flex;
  background: white;
  width: 100%;
  height: 100vh;
`

const VerticalSection = styled(Col)`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const HEADER_HEIGHT = 40
const HeaderContainer = styled.header`
  -webkit-app-region: drag;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background: rgba(0, 0, 0, 0.25);
  color: white;
  height: ${HEADER_HEIGHT}px;
  padding: 0 6px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`
