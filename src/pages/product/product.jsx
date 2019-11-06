import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import Home from './home'
import AddUpdate from './add-update'
import Detail from './detail'

export default class Product extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/product" component={Home}></Route>
        <Route path="/product/add-update" component={AddUpdate}></Route>
        <Route path="/product/detail" component={Detail}></Route>
        <Redirect to="/product" />
      </Switch>
    )
  }
}