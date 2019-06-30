import * as React from 'react'

const TIMEOUT = 1700

export default class FadeOut extends React.PureComponent<{}, { visible: boolean }> {
  state = { visible: false }

  public show() {
    this.setState({ visible: true })
    setTimeout(() => this.setState({ visible: false }), TIMEOUT)
  }

  render() {
    return (
      <span style={{
        fontSize: 12,
        opacity: this.state.visible ? 0.5 : 0,
        transition: this.state.visible ? 'none' : 'opacity 300ms ease-out'
      }}>
        {this.props.children}
      </span>
    )
  }
}
