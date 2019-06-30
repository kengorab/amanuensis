import * as React from 'react'
import { Icon } from 'antd'
import styled from 'styled-components'

interface Props {
  icon: string,
  onClick?: () => void
}

export default function IconButton({ icon, onClick }: Props) {
  return (
    <Container onClick={onClick}>
      <Icon type={icon}/>
    </Container>
  )
}

const Container = styled.div`
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
