import * as React from 'react'
import { Icon, Spin } from 'antd'

export default function Loader() {
  return <Spin indicator={<Icon type="loading" spin/>} size="large"/>
}