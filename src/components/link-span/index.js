import React from 'react'
import './index.less'

export default function LinkSpan(props) {
  return <span className="link-span" {...props}>{props.children}</span>
}