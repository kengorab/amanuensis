import * as React from 'react'
import styled from 'styled-components'
import { colors } from '../theme-override'

interface Props {
  metadata: NoteMetadata,
  onChange: (newMetadata: NoteMetadata) => void
}

export default function NoteMetadata({ metadata, onChange }: Props) {
  const [title, setTitle] = React.useState(metadata.name)

  return (
    <Container>
      <NoteTitle
        placeholder="Untitled"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={() => onChange({ ...metadata, name: title })}
      />
    </Container>
  )
}

const Container = styled.div`
  padding: 44px 12px 12px;
  background: ${colors.editorBackground};
  height: 100px;
  border-bottom: 1px solid rgba(255,255,255,0.25);
`

const NoteTitle = styled.input`
  background: transparent;
  outline: none;
  font-weight: bold;
  font-size: 20px;
  border: none;
  color: white;
  
  &::placeholder {
    color: rgba(255,255,255,0.5);
  }
`
