import React, {Component} from 'react'
import {Redirect, Switch, Route} from 'react-router-dom'
import memoryUtil from '../../utils/memoryUtil'
import { Layout, message } from 'antd';
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../../pages/home/home'
import Product from '../../pages/product/product'
import Category from '../../pages/category/category'
import Role from '../../pages/role/role'
import User from '../../pages/user/user'
import Bar from '../../pages/charts/bar'
import Pie from '../../pages/charts/pie'
import Line from '../../pages/charts/line'

const { Footer, Sider, Content } = Layout;
export default class Admin extends Component {
  accessControl = (user) => {
    if (!user || !user._id) {
      this.props.history.replace('/login')
      return null
    }

    let {menus} = user.role

    // 非admin用户
    if (menus.length !== 0) {
      let {pathname} = this.props.location

      let index = menus.findIndex(menu => menu === pathname)
      if (index === -1 && pathname !== '/') {
        message.error('您没有此次访问的权限！')
        console.log('not access permission!', pathname, menus)
        this.props.history.replace('/home')
      }
    }
  }

  componentWillMount() {
    const user = memoryUtil.user
    // 页面权限访问控制
    this.accessControl(user)
    console.log('c will acc con.')
  }

  render() {
    const user = memoryUtil.user
    if (!user || !user._id) {
      this.props.history.replace('/login')
      return null
    }
    console.log('render() admin.')
    return (
      <Layout style={{minHeight: '100%'}}>
        <Sider>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{margin: '20px', background: '#FFF'}}>
            <Switch>
              <Route path="/home" component={Home}></Route>
              <Route path="/category" component={Category}></Route>
              <Route path="/product" component={Product}></Route>
              <Route path="/role" component={Role}></Route>
              <Route path="/user" component={User}></Route>
              <Route path="/charts/bar" component={Bar}></Route>
              <Route path="/charts/pie" component={Pie}></Route>
              <Route path="/charts/line" component={Line}></Route>
              <Redirect to="/home" />
            </Switch>
          </Content>
          <Footer style={{textAlign: 'center', color: '#AAA'}}>2019 react project.</Footer>
        </Layout>
      </Layout>
    )
  }
}