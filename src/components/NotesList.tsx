import * as React from 'react'
import { colors } from '../theme-override'
import styled from 'styled-components'
import { List } from 'antd'

interface Props {
  notes: NoteMetadata[],
  activeNoteId: string,
  onClickNote: (noteId: string) => void
}

export default class NotesList extends React.PureComponent<Props> {
  static ZeroState() {
    return (
      <ZeroStateContainer>
        You have no notes! Click the + button in the toolbar above to get started!
      </ZeroStateContainer>
    )
  }

  renderItem = (note: NoteMetadata) => {
    return (
      <List.Item key={note.id} style={{
        padding: 12,
        background: this.props.activeNoteId === note.id ? colors.activeItem : 'inherit'
      }} onClick={() => this.props.onClickNote(note.id)}>
        <List.Item.Meta
          title={note.name}
          description="Description"
        />
      </List.Item>
    )
  }

  render() {
    return (
      <Container>
        {this.props.notes.length !== 0 && (
          <List
            style={{ width: '100%', overflowY: 'scroll' }}
            dataSource={this.props.notes}
            renderItem={this.renderItem}
          />
        )}
      </Container>
    )
  }
}

const Container = styled.aside`
  padding-top: 40px;
  display: flex;
  flex: 1;
  background-color: ${colors.sidebarBackground};
  overflow-y: scroll;
  user-select: none;
`

const ZeroStateContainer = styled(Container)`
  padding: 40px;
  text-align: center;
  align-items: center;
  justify-content: center;
`
