import React, {Component} from 'react'
import {Card, Icon, message} from 'antd'
import LinkSpan from '../../components/link-span'
import {reqCategorys} from '../../api'

import './detail.less'

export default class Detail extends Component {
  state = {
    categoryNames: ''
  }
  getProductInfo = () => {
    let data = this.props.location.state
    if (!!data) {
      this.product = this.props.location.state
    } else {
      this.product = {}
    }
  }
  getCategoryNames = async () => {
    console.log('get names.')
    let namesArr = []
    let categoryNames = ''
    let {categoryId, pCategoryId} = this.product

    let req = await reqCategorys(pCategoryId)

    if (req.status === 0) {
      let target = req.data.find(item => item._id === categoryId)
      console.log('target', target)
      namesArr.push(target.name)
      categoryNames = namesArr[0]
      if (pCategoryId !== '0') {
        let reqSecond = await reqCategorys(0)
        if (reqSecond.status === 0) {
          let cTarget = reqSecond.data.find(item => item._id === pCategoryId)
          console.log('cTarget', cTarget)
          namesArr.unshift(cTarget.name)
          categoryNames = namesArr[0] + ' -> ' + namesArr[1]
        } else {
          message.error('详情：获取分类信息失败。')
        }
      }
    } else {
      message.error('详情：获取分类信息失败。')
    }

    console.log(categoryNames)
    this.setState({
      categoryNames
    })
  }

  componentWillMount() {
    this.getProductInfo()
    this.getCategoryNames()
  }

  render() {
    console.log('render')
    let title = (
      <div>
        <LinkSpan onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left" style={{marginRight: 10}} />
        </LinkSpan>
        <span>商品详情</span>
      </div>
    )
    return (
      <Card title={title}>
        <div className="item">
          <h3>商品名称：</h3>
          <span>{this.product.name}</span>
        </div>
        <div className="item">
          <h3>商品描述：</h3>
          <span>{this.product.desc}</span>
        </div>
        <div className="item">
          <h3>商品价格：</h3>
          <span>{this.product.price}</span>
        </div>
        <div className="item">
          <h3>所属分类：</h3>
          <span>{this.state.categoryNames}</span>
        </div>
        <div className="item">
          <h3>商品图片：</h3>
          <span>
            {
              this.product.imgs.length > 0 ? this.product.imgs.map(img => <img style={{width: 100, padding: '10px 0'}} src={img.url} alt={img.name} key={img.name} />) : '暂无图片'
            }
          </span>
        </div>
        <div className="item">
          <h3>商品详情：</h3>
          <span dangerouslySetInnerHTML={{__html: this.product.detail}}></span>
        </div>
      </Card>
    )
  }
}