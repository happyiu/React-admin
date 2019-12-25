import React, { Component, createRef } from 'react'
import { Card, Row, Col } from 'antd'

import './Dashboard.less'

import echarts from 'echarts'

import { getArticleAmount } from '../../requests'


export default class Dashboard extends Component {
  constructor(){
    super()
    this.articleAmount = createRef()
  }
  initArticleChart = () => {
    getArticleAmount()
    .then(resp => {
      console.log(resp)
      const option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: resp.amount.map(item => item.month)
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: resp.amount.map(item => item.value),
            type: 'line',
            areaStyle: {}
        }]
      }
      this.articleChart.setOption(option);

    })
  }
  componentDidMount(){
    this.articleChart = echarts.init(this.articleAmount.current)
    this.initArticleChart()    
  }
  render() {
    return (
      <>
        <Card title='概览' bordered={false} style={{ width: '100%' }} > 
          <Row gutter={16}>
            <Col className="gutter-row" span={6}>
              <div className="qf-gutter-box" style={{background:'#29B6F6'}}>col-6</div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="qf-gutter-box" style={{background:'#AB47BC'}}>col-6</div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="qf-gutter-box" style={{background:'#FF7043'}}>col-6</div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className="qf-gutter-box" style={{background:'#43A047'}}>col-6</div>
            </Col>
          </Row>
        </Card>
        <Card title='文章浏览量' bordered={false} style={{ width: '100%' }} > 
          <div ref={this.articleAmount} style={{height: '400px'}} />
        </Card>
      </>
    )
  }
}
