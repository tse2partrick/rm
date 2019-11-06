import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import storageUtil from './utils/storageUtil'
import memoryUtil from './utils/memoryUtil'

memoryUtil.user = storageUtil.getUser()
console.log('init user:' + memoryUtil.user)

ReactDOM.render(<App />, document.getElementById('root'))