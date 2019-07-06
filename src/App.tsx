import * as React from 'react'
import styled from 'styled-components'
import { Col, Row } from 'antd'
import { uniq, isEqual } from 'lodash'
import MarkdownEditor from './components/MarkdownEditor'
import { colors } from './theme-override'
import NotesList from './components/NotesList'
import * as NotesDb from './data/notes-db'
import Loader from './components/Loader'
import FadeOut from './components/FadeOut'
import IconButton from './components/IconButton'
import NoteMetadata from './components/NoteMetadata'

interface State {
  notes: NoteMetadata[],
  notesLoading: boolean,
  activeNote: NoteMetadata | null,
  noteLoading: boolean,
  noteContents: string,
}

export default class App extends React.Component<{}, State> {
  private editorRef = React.createRef<MarkdownEditor>()
  private savedMessageRef = React.createRef<FadeOut>()

  state: State = {
    notes: [],
    notesLoading: true,
    activeNote: null,
    noteLoading: false,
    noteContents: ' '
  }

  async componentDidMount() {
    const notes = await NotesDb.getNotesMetadata()
    const activeNote = notes[0] || null
    this.setState({ notesLoading: false, notes, activeNote })

    if (activeNote) {
      this.setState({ noteLoading: true })
      const noteContents = await NotesDb.getNoteContents(activeNote.id) || ' '
      this.setState({ noteLoading: false, noteContents })
    }
  }

  addNote = async () => {
    const newNote = await NotesDb.createNoteMetadata('Untitled')
    this.setState({
      notes: [newNote, ...this.state.notes],
      activeNote: newNote
    })
  }

  saveNote = async (activeNoteId: string, noteContents: string) => {
    if (!activeNoteId) return
    if (!this.editorRef.current!.isDirty) return

    await NotesDb.saveNoteContents(activeNoteId!, noteContents)
    this.savedMessageRef.current!.show()
  }

  saveNoteMetadata = async (metadata: NoteMetadata) => {
    const activeNote = this.state.notes.find(({ id }) => id === metadata.id)
    if (!activeNote || isEqual(metadata, activeNote)) return

    await NotesDb.updateNoteMetadata(metadata)
    const notes = await NotesDb.getNotesMetadata()
    this.setState({ notes, activeNote: metadata })
    this.savedMessageRef.current!.show()
  }

  onClickNote = async (activeNoteId: string) => {
    if (this.state.activeNote && this.state.activeNote.id === activeNoteId) return
    await this.saveNote(this.state.activeNote!.id, this.editorRef.current!.getValue()!)

    const activeNote = this.state.notes.find(({ id }) => id === activeNoteId)
    if (!activeNote) return

    this.setState({ activeNote, noteLoading: true })
    const noteContents = await NotesDb.getNoteContents(activeNoteId) || ' '
    this.setState({ noteLoading: false, noteContents })
  }

  renderNotesListSection() {
    const { notesLoading, notes, activeNote } = this.state

    let contents
    if (notesLoading) {
      contents = <Loader/>
    } else if (!notes.length) {
      contents = <NotesList.ZeroState/>
    } else {
      contents = (
        <NotesList
          notes={notes}
          activeNoteId={activeNote!.id}
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
    const { noteLoading, activeNote, noteContents, notes } = this.state

    let contents
    if (noteLoading) {
      contents = <Loader/>
    } else if (!activeNote) {
      contents = <MarkdownEditor.ZeroState/>
    } else if (noteContents) {
      const allTags = uniq(notes.map(({ tags }) => tags).flat())

      contents = <>
        <NoteMetadata
          metadata={activeNote}
          allTags={allTags}
          onChange={this.saveNoteMetadata}
        />
        <MarkdownEditor
          ref={this.editorRef}
          initialValue={noteContents}
          onChange={value => this.saveNote(activeNote.id, value)}
        />
      </>
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
