import React, { Component } from 'react'

import { Layout, Menu, Icon, Dropdown, Avatar, Badge } from 'antd'

import logo from './logo.png'
import './frame.less'

import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import { getNotificationList } from '../../actions/notifications'
import { logout } from '../../actions/user'

// const { SubMenu } = Menu
const { Header, Content, Footer, Sider } = Layout

const mapState = state => {
  return {
    notificationsCount: state.notifications.list.filter(item => item.hasRead === false).length,
    avatar: state.user.avatar,
    displayName: state.user.displayName
  }
}

@connect(mapState,{ getNotificationList, logout })
@withRouter
class Frame extends Component {
  componentDidMount(){
    this.props.getNotificationList()
  }
  onMenuClick = ({item, key, keyPath, domEvent}) => {
    this.props.history.push(key)
  }
  onDropdownMenuClick = ({ key }) => {
    if(key === '/logout'){
      this.props.logout()
      this.props.history.push('/login')
    } else{ 
      this.props.history.push(key)
    }
  }
  renderDropdown = () => {
    return (
      <Menu onClick={this.onDropdownMenuClick}>
      <Menu.Item key="/admin/notifications">
        <Badge dot={Boolean(this.props.notificationsCount)}>
          通知中心
        </Badge>
      </Menu.Item>
      <Menu.Item key="/admin/profile">   
          个人设置
      </Menu.Item>
      <Menu.Item key="/logout">
          退出
      </Menu.Item>
    </Menu>
    )
  }
    
  
  render() {
    return (
      <Layout style={{height: "100%"}}>
      <Header className="header qf-header" style={{background: "#fff"}}>
        <div className="qs-logo">
          <img src={logo} alt="蚂蚁" />
        </div>
        <div>
        <Dropdown overlay={this.renderDropdown}>
          
            <div style={{display: 'flex',alignItems: 'center'}}>
              <Avatar src={this.props.avatar} ></Avatar>
              <span>欢迎您！{this.props.displayName}</span>
              <Badge count={this.props.notificationsCount} offset={[3, 0]}>
                <Icon type="down" />
              </Badge>
            </div>
          
        </Dropdown>
        </div>
      </Header>
      <Content>
        <Layout style={{ padding: '24px 0', background: '#fff' , height: '100%'}}>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              selectedKeys={this.props.location.pathname}
              style={{ height: '100%' }}
              onClick={this.onMenuClick}
            >
              {
                this.props.menus.map(item => {
                  return (
                  <Menu.Item key={item.pathname}><Icon type={item.icon} />{item.title}</Menu.Item>
                  )
                })
              }
            
            </Menu>
          </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>{this.props.children}</Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
    )
  }
}

export default Frame
