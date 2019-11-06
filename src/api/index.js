import ajax from './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'

const BASE = ''

export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')

export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', {parentId})

export const reqAddCategory = (parentId, categoryName) => ajax(BASE + '/manage/category/add', {parentId, categoryName}, 'POST')

export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')

export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

export const reqAddProduct = ({categoryId, pCategoryId, name, desc, price, detail, imgs}) => ajax(BASE + '/manage/product/add', {categoryId, pCategoryId, name, desc, price, detail, imgs}, 'POST')

export const reqUpdateProduct = ({_id, categoryId, pCategoryId, name, desc, price, detail, imgs}) => ajax(BASE + '/manage/product/update', {_id, categoryId, pCategoryId, name, desc, price, detail, imgs}, 'POST')

export const reqUpdateProductStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', {productId, status}, 'POST')

export const reqSearch = ({pageNum, pageSize, productName, productDesc}) => ajax(BASE + '/manage/product/search', {pageNum, pageSize, productName, productDesc}, 'GET')

export const reqDelImg = (name) => ajax(BASE + '/manage/img/delete', {name}, 'POST')

export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add', {roleName}, 'POST')

export const reqRoleList = () => ajax(BASE + '/manage/role/list', {},'GET')

export const reqUpdateRole = ({_id, menus, auth_time, auth_name}) => ajax(BASE + '/manage/role/update', {_id, menus, auth_time, auth_name}, 'POST')

export const reqAllUsers = () => ajax(BASE + '/manage/user/list', {}, 'GET')

export const reqAddUser = ({username, password, phone, email, role_id}) => ajax(BASE + '/manage/user/add', {username, password, phone, email, role_id}, 'POST')

export const reqDelUser = (userId) => ajax(BASE + '/manage/user/delete', {userId}, 'POST')

export const reqUpdateUser = ({_id, username, phone, email, role_id}) => ajax(BASE + '/manage/user/update', {_id, username, phone, email, role_id}, 'POST')

export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    let url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&ou
tput=json&ak=3p49MVra6urFRGOT9s8UBWr2`

    jsonp(url, {}, (err, res) => {
      if (!err && res.status === 'success') {
        let {dayPictureUrl, weather} = res.results[0].weather_data[0]
        resolve({dayPictureUrl, weather})
      } else {
        message.error('获取天气信息失败')
      }
    })
  })
}