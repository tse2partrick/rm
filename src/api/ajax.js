import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, params, method = 'GET') {
  return new Promise((resolve, reject) => {
    let promise

    if (method === 'GET') {
      promise = axios.get(url, {params})
    } else if (method === 'POST') {
      promise = axios.post(url, params)
    } else {
      message.error('unkown request method.')
      return
    }

    promise.then((res) => {
      resolve(res.data)
    }).catch((err) => {
      message.error(err.message)
    })
  })
}