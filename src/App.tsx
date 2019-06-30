import * as React from 'react'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import MarkdownEditor from './components/MarkdownEditor'
import { colors } from './theme-override'
import NotesList from './components/NotesList'
import * as NotesDb from './data/notes-db'
import Loader from './components/Loader'
import FadeOut from './components/FadeOut'
import IconButton from './components/IconButton'

interface State {
  notes: NoteMetadata[],
  notesLoading: boolean,
  activeNoteId: string | null,
  noteLoading: boolean,
  noteContents: string,
}

export default class App extends React.Component<{}, State> {
  private editorRef = React.createRef<MarkdownEditor>()
  private savedMessageRef = React.createRef<FadeOut>()

  state = {
    notes: [],
    notesLoading: true,
    activeNoteId: null,
    noteLoading: false,
    noteContents: ' '
  }

  async componentDidMount() {
    const notes = await NotesDb.getNotesMetadata()
    const activeNoteId = notes.length ? notes[0].id : null
    this.setState({ notesLoading: false, notes, activeNoteId })

    if (activeNoteId) {
      this.setState({ noteLoading: true })
      const noteContents = await NotesDb.getNoteContents(activeNoteId) || ' '
      this.setState({ noteLoading: false, noteContents })
    }
  }

  addNote = async () => {
    const newNote = await NotesDb.saveNoteMetadata('Untitled')
    this.setState({
      notes: [newNote, ...this.state.notes],
      activeNoteId: newNote.id
    })
  }

  saveNote = async (activeNoteId: string, noteContents: string) => {
    if (!activeNoteId) return
    if (!this.editorRef.current!.isDirty) return

    await NotesDb.saveNoteContents(activeNoteId!, noteContents)
    this.savedMessageRef.current!.show()
  }

  onClickNote = async (activeNoteId: string) => {
    if (this.state.activeNoteId === activeNoteId) return
    await this.saveNote(this.state.activeNoteId!, this.editorRef.current!.getValue()!)

    this.setState({ activeNoteId, noteLoading: true })
    const noteContents = await NotesDb.getNoteContents(activeNoteId) || ' '
    this.setState({ noteLoading: false, noteContents })
  }

  renderNotesListSection() {
    const { notesLoading, notes, activeNoteId } = this.state

    let contents
    if (notesLoading) {
      contents = <Loader/>
    } else if (!notes.length) {
      contents = <NotesList.ZeroState/>
    } else {
      contents = (
        <NotesList
          notes={notes}
          activeNoteId={activeNoteId!}
          onClickNote={this.onClickNote}
        />
      )
    }

    return (
      <VerticalSection span={6} style={{ background: colors.sidebarBackground }}>
        <HeaderContainer>
          <IconButton onClick={this.addNote} icon="plus"/>
        </HeaderContainer>
        {contents}
      </VerticalSection>
    )
  }

  renderEditorSection() {
    const { noteLoading, activeNoteId, noteContents } = this.state

    let contents
    if (noteLoading) {
      contents = <Loader/>
    } else if (!activeNoteId) {
      contents = <MarkdownEditor.ZeroState/>
    } else if (noteContents) {
      contents = (
        <MarkdownEditor
          ref={this.editorRef}
          initialValue={noteContents}
          onChange={value => this.saveNote(activeNoteId!, value)}
        />
      )
    }

    return (
      <VerticalSection span={18} style={{ background: colors.editorBackground }}>
        <HeaderContainer style={{ justifyContent: 'space-between' }}>
          <FadeOut ref={this.savedMessageRef}>Saved!</FadeOut>
          <IconButton icon="delete"/>
        </HeaderContainer>
        {contents}
      </VerticalSection>
    )
  }

  render() {
    return (
      <AppContainer>
        {this.renderNotesListSection()}
        {this.renderEditorSection()}
      </AppContainer>
    )
  }
}

const AppContainer = styled(Row)`
  display: flex;
  background: white;
  width: 100%;
  height: 100vh;
`

const VerticalSection = styled(Col)`
  display: flex;
  justify-content: center;
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
