import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import { Modal } from 'antd';
import {now} from '../../utils/dateUtil'
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import {reqWeather} from '../../api'
import menuConfig from '../../config/menuConfig'
import LinkSpan from '../link-span'
import './index.less'

class Header extends Component {
  state = {
    weatherPic: '',
    weatherText: '',
    time: now()
  }

  componentDidMount() {
    this.getTime()
    this.getWeather()
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  getTime = () => {
    this.timer = setInterval(() => {
      this.setState({
        time: now()
      })
    }, 1000)
  }

  getTitle = () => {
    let title
    let pathname = this.props.location.pathname

    for (let i = 0, len = menuConfig.length; i < len; i++) {
      let item = menuConfig[i]
      if (item.key === pathname) {
        title = item.title
        break
      } else if (item.children && item.children.length) {
        let res = item.children.find(cItem => pathname.indexOf(cItem.key) !== -1)
        if (res) {
          title = res.title
          break
        }
      }
    }

    return title
  }

  getWeather = async () => {
    let city = '广州'
    let {dayPictureUrl, weather} = await reqWeather(city)
    this.setState({
      weatherPic: dayPictureUrl,
      weatherText: weather,
    })
  }

  logout = () => {
    Modal.confirm({
      title: '退出',
      content: '您确定要退出当前用户登录吗？',
      onOk: () => {
        storageUtil.removeUser()
        memoryUtil.user = {}
        this.props.history.replace('/login')
      }
    })
  }

  render() {
    let {weatherPic, weatherText, time} = this.state
    let username = memoryUtil.user.username
    let title = this.getTitle()
    return (
      <div className="header">
        <div className="header-top">
          <span className="header-top-userinfo">欢迎您，{username}</span>
          <LinkSpan onClick={this.logout}>退出</LinkSpan>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">
            <span>{title}</span>
          </div>
          <div className="header-bottom-right">
            <span>{time}</span>
            <img src={weatherPic} alt="weather" />
            <span>{weatherText}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)