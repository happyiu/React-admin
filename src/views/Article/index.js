import React, { Component } from 'react'
import { Card, Button, Table, Tag, Modal, Typography, message, Tooltip } from 'antd'

import momnet from 'moment'

import { getArticles, deleteArticle }  from '../../requests'

import XLSX from 'xlsx'
import moment from 'moment'

const ButtonGroup = Button.Group

const titleDisplayMap = {
  id: 'id',
  title: '标题',
  author: '作者',
  createAt: '创建时间',
  amount: '阅读量'
}

export default class ArticleList extends Component {
  constructor(){
    super()
    this.state = {
      dataSource: [
        
      ],
      columns: [
        
      ],
      total: 0,
      isLoading: false,
      offset: 0,
      limited: 10
    }
  }
  // 根据 后台获取的 字段 创建列名
  createColumns = (columnKeys) => {
    const columns = columnKeys.map(item => {
      if(item === 'amount'){
        return {
          title: titleDisplayMap[item],
          key: item,
          render: (text,record) => {
            const { amount } = record
            return (
              <Tooltip mouseLeaveDelay={0} placement="topLeft" title={amount>230?'高阅读量':'低阅读量'}>
                <Tag color={amount>200?'red':'green'}>{record.amount}</Tag>
              </Tooltip> )
          }
        }
      }
      if(item === 'createAt'){
        return {
          title: titleDisplayMap[item],
          key: item,
          render: (text,record) => {
            const { createAt } = record
            return momnet(createAt).format('YYYY年MM月DD日 hh:mm:ss')
          }
        } 
      }
      return {
        title: titleDisplayMap[item],
        dataIndex: item,
        key: item,
      }
    })
    columns.push({
      title: '操作',
      key: 'action',
      render: (txt,record) => {
        return (
          <ButtonGroup>
            <Button size="small" type="primary" onClick={this.toEdit.bind(this,record.id)}>编辑</Button>
            <Button size="small" type="danger" onClick={this.deleteArticles.bind(this,record)}>删除</Button>
          </ButtonGroup>
        )
      }
    })
    return columns
  }

  toEdit = (id) => {
    this.props.history.push(`/admin/article/edit/${id}`)
  } 

  deleteArticles = (record) => {
    const that = this
    Modal.confirm({
      title: <Typography>是否删除</Typography>,
      content: `是否删除文章 - ${record.title}`,
      okText: '删删删！',
      cancelText: '我点错了',
      onOk() {
        deleteArticle(record.id)
          .then(resp=>{
            message.success(`${resp.msg}`)
            that.setState({
              offset: 0
            })
          },() => {
            that.getData()
          })
      }
    })
  }

  onPageChange = (page,pageszie) => {
    this.setState({
      offset: (page - 1) * pageszie,
      limited: pageszie
    },() => {
      this.getData()
    })
  }

  onShowSizeChange = (current, size) => {
    this.setState({
      offset: 0,
      limited: size
    },() => {
      this.getData()
    })
  }

  toExcel = () => {
    // 实际的项目中 前端发送 ajax 请求到后端，后端返回一个文件下载的地址

    // 前端导出 EXCEL 的方法
    /* convert state to workbook */
    const data = [Object.keys(this.state.dataSource[0])]
    for(let i=0;i<this.state.dataSource.length;i++){
      data.push([
        this.state.dataSource[i].id,
        this.state.dataSource[i].title,
        this.state.dataSource[i].author,
        this.state.dataSource[i].amount,
        momnet(this.state.dataSource[i].createAt).format('YYYY年MM月DD日 hh:mm:ss')
      ])
    }

		const ws = XLSX.utils.aoa_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		/* generate XLSX file and send to client */
		XLSX.writeFile(wb, `aritical-sheetjs-${moment().format("YYYY-MM-DD")}.xlsx`)
  }

  getData = () => {
    this.setState({
      isLoading: true
    })
    getArticles(this.state.offset,this.state.limited)
      .then(resp => {
        const columnKeys = Object.keys(resp.list[0])
        const columns = this.createColumns(columnKeys)
        if(!this.updater.isMounted(this)) return 

        this.setState({
          total: resp.total,
          columns,
          dataSource: resp.list,
          isLoading: false
        })
      })
      .catch(err => {
        // 处理错误
      })
      .finally(() => {
        if(!this.updater.isMounted(this)) return 
        this.setState({
          isLoading: false
        })
      })
  }
  componentDidMount(){
    this.getData()
  }
  componentWillUnmount(){
    
  }
  render() {
    return (
      <Card title="文章列表" bordered={false} style={{ width: '100%' }} extra={<Button onClick={this.toExcel}>导出</Button>}>
        
        <Table
          dataSource={this.state.dataSource}
          columns={this.state.columns} 
          loading={this.state.isLoading}
          pagination={{
            current: this.state.offset / this.state.limited + 1,
            total: this.state.total,
            hideOnSinglePage: true,
            onChange: this.onPageChange,
            showSizeChanger: true,
            onShowSizeChange: this.onShowSizeChange
          }}
          rowKey={record => record.id}
        />

      </Card>
    )
  }
}
