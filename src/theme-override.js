const _ = require('lodash')
const darkTheme = require('@ant-design/dark-theme').default

function fade(hex, percent) {
  let color = hex.replace('#', '')
  let parts = _.chunk(hex.replace('#', '').split(''), color.length / 3)
  let r = parts[0].join('')
  let g = parts[1].join('')
  let b = parts[2].join('')
  if (color.length === 3) {
    r = r + r
    g = g + g
    b = b + b
  }
  r = parseInt(r, 16)
  g = parseInt(g, 16)
  b = parseInt(b, 16)
  const amt = parseInt(percent.replace('%', ''), 10) / 100
  return `rgba(${r}, ${g}, ${b}, ${amt})`
}

function applyMods(input) {
  if (input.startsWith('fade')) {
    const values = input.replace('fade(', '').replace(')', '').split(',')
    // No destructuring in electron's node version?
    const hex = values[0], percent = values[1]
    return fade(hex, percent)
  }

  return input
}

module.exports.colors = {
  primary: '#1DA57A',
  editorBackground: '#263238',
  metadataBackground: '#19242a',
  sidebarBackground: darkTheme['@layout-sider-background'],
  activeItem: applyMods(darkTheme['@item-active-bg'])
}

module.exports.scss = Object.assign(darkTheme, { '@primary-color': module.exports.colors.primary })
