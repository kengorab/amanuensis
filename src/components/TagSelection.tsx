import * as React from 'react'
import { createGlobalStyle } from 'styled-components'
import { AutoComplete, Icon, Input } from 'antd'
import { SelectValue } from 'antd/lib/select'

interface Props {
  tagOptions: string[],
  onSelect: (tag: string) => void
}

interface State {
  tagInput: string,
  tagOptions: string[]
}

export default class TagSelection extends React.PureComponent<Props, State> {
  autocompleteRef = React.createRef<AutoComplete>()
  madeSelection = false

  constructor(props: Props) {
    super(props)

    this.state = {
      tagInput: '',
      tagOptions: this.props.tagOptions
    }
  }

  componentWillReceiveProps({ tagOptions }: Props) {
    this.setState({ tagOptions })
  }

  handleSearch = (query: string) => {
    if (query) {
      const options = this.props.tagOptions.filter(tag => tag.startsWith(query))
      const hasQuery = options.includes(query)
      if (!hasQuery) {
        options.unshift(`New tag: '${query}'`)
      }
      this.setState({ tagOptions: options })
    } else {
      this.setState({ tagOptions: this.props.tagOptions })
    }
  }

  handleChange = (tagInput: SelectValue) => {
    if (this.madeSelection) {
      this.autocompleteRef.current!.blur()
      this.madeSelection = false
      this.setState({ tagInput: '' })
      return
    }

    this.setState({ tagInput: tagInput as string })
  }

  handleSelect = (selection: SelectValue) => {
    selection = (selection as string)
    const match = selection.match(/New tag: '(.*)'/)!
    const tag = match ? match[1] : selection

    this.props.onSelect(tag)
    this.madeSelection = true
  }

  render() {
    const { tagOptions, tagInput } = this.state

    return (
      <>
        <AutoCompleteStyle/>
        <AutoComplete
          ref={this.autocompleteRef}
          className="autocomplete-wrapper"
          defaultActiveFirstOption={false}
          dataSource={tagOptions}
          value={tagInput}
          onSearch={this.handleSearch}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        >
          <Input placeholder="Add Tag" prefix={<Icon type="plus"/>}/>
        </AutoComplete>
      </>
    )
  }
}

const AutoCompleteStyle = createGlobalStyle`
  .autocomplete-wrapper {
    .ant-select-selection {
      background: transparent;
    }
    
    .ant-input-affix-wrapper .ant-input-prefix {
      left: 0;
      color: rgba(255,255,255,0.5);
    }
    
    .ant-input-affix-wrapper .ant-input:not(:first-child) {
      padding-left: 18px;
    }
    
    input.ant-input {
      cursor: pointer;
      outline: none;
      font-size: 14px;
      border: none;
      
      &::placeholder {
        color: rgba(255,255,255,0.5);
      }
      
      &:focus {
        box-shadow: none;
      }
    }
  }
`
