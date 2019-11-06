import React, {Component} from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
import "./index.less"
import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import Storage from '../../utils/storageUtil'

const { SubMenu } = Menu
class LeftNav extends Component {
  getMenuNodes_maps = (menus) => {
    return menus.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }>
            {this.getMenuNodes(item.children)}
          </SubMenu>
        )
      }
    })
  }

  getMenuNodes = (menus) => {
    return menus.reduce((prev, item) => {
      if (!item.children) {
        prev.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{item.title}</span>
            </Link>
          </Menu.Item>
        ))
      } else {
        let cItem = item.children.find(cItem => cItem.key === this.props.location.pathname)
        if (cItem) {
          this.openKeys = item.key
        }

         prev.push((
          <SubMenu key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </span>
            }>
            {this.getMenuNodes(item.children)}
          </SubMenu>
        ))
      }

      return prev
    }, [])
  }

  getOtherMenuList = (menus) => {
    // 深拷贝
    let ret = JSON.parse(JSON.stringify(menuList))

    return ret.filter((item) => {
      if (item.children) {
        item.children = item.children.filter((cItem) => {
          return menus.indexOf(cItem.key) !== -1
        })
        return item.children.length === 0 ? null : item.children
      } else {
        return menus.indexOf(item.key) !== -1
      }
    })
  }

  componentWillMount() {
    let menus = Storage.getUser().role.menus

    // admin用户，取得本地权限
    if (menus.length === 0) {
      this.menuNodes = this.getMenuNodes(menuList)
    } else {
      let otherMenuList = this.getOtherMenuList(menus)
      this.menuNodes = this.getMenuNodes(otherMenuList)
    }
  }

  render() {
    return (
      <div className="left-nav">
        <Link to="/" className="left-nav-header">
          <img src={logo} alt='logo' />
          <h1>管理后台</h1>
        </Link>
        <Menu
          theme="dark"
          selectedKeys={[this.props.location.pathname]}
          mode="inline"
          defaultOpenKeys={[this.openKeys]}
        >
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)