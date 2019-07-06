import * as React from 'react'
import { Tag } from 'antd'
import styled from 'styled-components'
import { colors } from '../theme-override'
import TagSelection from './TagSelection'

interface Props {
  metadata: NoteMetadata,
  allTags: string[],
  onChange: (newMetadata: NoteMetadata) => void
}

export default function NoteMetadata({ metadata, onChange, allTags }: Props) {
  const [title, setTitle] = React.useState(metadata.name)

  return (
    <Container>
      <NoteTitle
        placeholder="Untitled"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={() => onChange({ ...metadata, name: title })}
      />
      <TagsContainer>
        {metadata.tags.map(tag =>
          <Tag
            key={tag}
            closable
            onClose={() => {
              const tags = metadata.tags.filter(metadataTag => metadataTag !== tag)
              onChange({ ...metadata, tags })
            }}
          >
            {tag}
          </Tag>
        )}
        <TagSelection
          tagOptions={allTags.filter(tag => !metadata.tags.includes(tag))}
          onSelect={tag => onChange({ ...metadata, tags: metadata.tags.concat(tag) })}
        />
      </TagsContainer>
    </Container>
  )
}

const Container = styled.div`
  padding: 44px 16px 4px 16px;
  background: ${colors.editorBackground};
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

const TagsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 4px;
`
