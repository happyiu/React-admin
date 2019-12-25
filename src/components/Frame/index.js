import React, { Component } from 'react'

import { Layout, Menu, Icon, Dropdown, Avatar, Badge } from 'antd'

import logo from './logo.png'
import './frame.less'

import { withRouter } from 'react-router-dom'

import { connect } from 'react-redux'

import { getNotificationList } from '../../actions/notifications'

// const { SubMenu } = Menu
const { Header, Content, Footer, Sider } = Layout

const mapState = state => {
  return {
    notificationsCount: state.notifications.list.filter(item => item.hasRead === false).length
  }
}

@connect(mapState,{ getNotificationList })
@withRouter
class Frame extends Component {
  componentDidMount(){
    this.props.getNotificationList()
  }
  onMenuClick = ({item, key, keyPath, domEvent}) => {
    this.props.history.push(key)
  }
  onDropdownMenuClick = ({ key }) => {
    this.props.history.push(key)
  }
  renderDropdown = () => {
    return (
      <Menu onClick={this.onDropdownMenuClick}>
      <Menu.Item key="/admin/notifications">
        <Badge dot={Boolean(this.props.notificationsCount)}>
          通知中心
        </Badge>
      </Menu.Item>
      <Menu.Item key="/admin/settings">   
          个人设置
      </Menu.Item>
      <Menu.Item key="/login">
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
              <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
              <span>欢迎您！嘻嘻</span>
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
