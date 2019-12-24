import React, { Component } from 'react'

import { Layout, Menu, Icon } from 'antd'

import logo from './logo.png'
import './frame.less'

import { withRouter } from 'react-router-dom'

// const { SubMenu } = Menu
const { Header, Content, Footer, Sider } = Layout

@withRouter
class Frame extends Component {
  onMenuClick = ({item, key, keyPath, domEvent}) => {
    this.props.history.push(key)
  }
  render() {
    return (
      <Layout style={{height: "100%"}}>
      <Header className="header qf-header" style={{background: "#fff"}}>
        <div className="qs-logo">
          <img src={logo} alt="蚂蚁" />
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
