import React, { Component } from 'react'
import { Card, Button, List, Badge, Spin} from 'antd'

import { connect } from 'react-redux'

import { markNotificationAsReadById, markAllNotificationAsRead } from '../../actions/notifications'

const mapState = state => {
  const {
    list,
    isLoading
  } = state.notifications
  return {
    list,
    isLoading
  }
}

@connect(mapState,{markNotificationAsReadById,markAllNotificationAsRead})
class Notifications extends Component {
  data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ]
  render() {
    console.log(this.props)
    return (
      <Spin spinning={this.props.isLoading}>
        <Card title='通知中心' bordered={false} style={{ width: '100%' }} extra={<Button onClick={this.props.markAllNotificationAsRead} disabled={this.props.list.every(item => item.hasRead == true)}>全部已读</Button>}> 
          <List
              itemLayout="horizontal"
              dataSource={this.props.list}
              renderItem={item => (
                <List.Item extra={ item.hasRead ? null : <Button onClick={this.props.markNotificationAsReadById.bind(this,item.id)}>标记已读</Button>}>
                  <List.Item.Meta
                    title={<Badge dot={!item.hasRead}>{item.title}</Badge>}
                    description={item.desc}
                  />
                </List.Item>
              )}
            />
        </Card>
      </Spin>
    )
  }
}

export default Notifications
