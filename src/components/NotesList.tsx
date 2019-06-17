import * as React from 'react'
import { colors } from '../theme-override'
import styled from 'styled-components'
import { List } from 'antd'

interface Props {
  notes: string[]
}

export default class NotesList extends React.PureComponent<Props> {
  private renderItem(item: string) {
    return (
      <List.Item key={item} style={{ padding: 12 }}>
        <List.Item.Meta
          title={item}
          description="Description"
        />
      </List.Item>
    )
  }

  render() {
    return (
      <Container>
        <List
          style={{ width: '100%', overflowY: 'scroll' }}
          dataSource={this.props.notes}
          renderItem={this.renderItem}
        />
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
