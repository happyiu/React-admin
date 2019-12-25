# 项目流程

## 创建react应用

> npx create-react-app myapp-6

## 配置

默认配置进行自定义前需要先安装包

> npm i react-app-rewired customize-cra -s

新建配置文件 config-overrides.js

```js
// 定制化配置文件
const { override } = require('customize-cra')
module.exports = override()
```

修改 page.json 的命令
```js
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test":  "react-app-rewired test",
  "eject": "react-scripts eject"
},
```

### 配置 Antd

> npm i antd -s

配置 Antd 定制主题需要 less 和 less-loader

> npm i less less-loader -s

修改 配置文件 config-overrides.js , 即可添加 less 支持

```js
const { 
  override,
  addLessLoader
} = require('customize-cra')

module.exports = override(
  addLessLoader({
    javascriptEnabled: true,
  })
)
```

> npm i babel-plugin-import -s

再次修改 config-overrides.js

```js
const { 
  override,
  fixBabelImports,
  addLessLoader,
} = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
  })
)
```

新建 theme 作为 antd 的主题文件

```js
module.exports = {
  '@primary-color': '#1890ff', // 全局主色
  ... ...
}
```

### 配置装饰器模式
```js 
// 装饰器部分配置
const { addDecoratorsLegacy} = require('customize-cra')
module.exports = override(
  addDecoratorsLegacy(),
)
```

> npm i @babel/plugin-proposal-decorators -s 

## 配置目录结构

在 src 目录下 新建 文件夹

- <a href="#views">views</a>
- <a href="#routes">routes</a>
- <a href="#components">components</a>
- <a>actions</a>
- <a>reducers</a>

## views <a id="views"></a>

在 views 目录下新建 index.js 用来导出 view 组件

### NotFound 组件

### 

## 路由配置 <a id="routes"></a>

> npm i react-router-dom

### 路由跳转基本逻辑

首先 进入页面 地址为 '/' 则重定向到 '/admin' 页面在去判断是否登录

若没有登录，跳转到 '/login' 页面，渲染 <Login /> 组件

若输入的地址匹配不到，则重定向到 '/404' 页面，渲染 <NotFound /> 组件

若登录了，则进入 '/admin' 页面，并渲染 <App /> 组件

首先进入 '/admin' 后渲染 <App />组件，<App /> 组件分为了各个部分和路由视图部分

然后点击不同菜单，路由视图切换不同的组件，公共部分不变

进入 '/admin' 后，先重定向到 '/admin/dashboard'，渲染 <Dashboard /> 仪表盘组件

点击地址匹配为 '/admin/sttings'，渲染 <Set+tings /> 设置组件

点击地址匹配为 '/admin/article'，渲染 <ArticleList /> 文章列表组件

点击地址匹配为 '/admin/article/edit/:id'，渲染 <ArticleEdit /> 修改文章组件

如果地址都匹配不到，则重定向到 '/404'，渲染 <NotFound /> 页面

### 在 routes 目录下新建index.js作为路由配置文件

```js
import {
  Dashboard,
  ......
} from '../views'

export const mainRouter = [{
  pathname: '/login',
  component: Login
}......]

export const adminRouter = [{
  pathname: '/admin/dashboard',
  component: Dashboard
}......]
```

### 在顶层使用 Router 包裹组件

```js
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import App from './App'
// 导入之前配的路由信息，然后使用 map 列表渲染出 对应的 Route 组件
import { mainRouter } from './routes/index.js'

render(
  <Router>
    <Switch>
      <Route path="/admin" render={(routerProps) => {
        return <App {...routerProps} />
      }} />>
      将 路由配置信息 渲染成 Route 组件
      {
        mainRouter.map(route => {
          return <Route key={route.pathname} path={route.pathname} component={route.component} />
        })
      }
      重定向
      <Redirect to="/admin" exact from="/" />
      <Redirect to="/404" />
    </Switch>
  </Router>,
  document.querySelector("#root")
)
```

### 在 App.js 中配置主页面的路由
```js
import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { adminRouter } from './routes'

export default class App extends Component {
  render() {
    return (
      <div>
        <div>公共部分</div>
        <Switch>
        {
          adminRouter.map(route => {
            return <Route key={route.pathname} path={route.pathname} exact={true} render={(routerProps) => {
              return <route.component {...routerProps}/>
            }}/>
          })
        }
        <Redirect to={adminRouter[0].pathname} from="/admin" exact />
        <Redirect to="/404" from="/" />
        </Switch>  
      </div>
    )
  }
}

```

### 实现路由懒加载

> npm i react-loadable -s

#### 先在 components 下创建 Loading 文件夹即index.js

```js
import React from 'react'

export default function Loading() {
  return (
    <div>
      loading
    </div>
  )
}
```

#### 修改 views 目录下的 index.js

```js
// 原来的方法
// import Dashboard from './Dashboard'
// import Login from './Login'
// import NotFound from './NotFound'
// import Settings from './Settings'
// import ArticleList from './Article'
// import ArticleEdit from './Article/Edit'
// 路由懒加载的方法
import Loadable from 'react-loadable'
import { Loading } from '../components'

const Dashboard = Loadable({
  loader: () => import('./Dashboard'),
  loading: Loading
})

const Login = Loadable({
  loader: () => import('./Login'),
  loading: Loading
})

const NotFound = Loadable({
  loader: () => import('./NotFound'),
  loading: Loading
})

const Settings = Loadable({
  loader: () => import('./Settings'),
  loading: Loading
})

const ArticleList = Loadable({
  loader: () => import('./Article'),
  loading: Loading
})

const ArticleEdit = Loadable({
  loader: () => import('./Article/Edit'),
  loading: Loading
})


export {
  Dashboard,
  Login,
  NotFound,
  Settings,
  ArticleList,
  ArticleEdit,
  Loading
}
```

### index.js 文件下的 路由视图

```js
render(
  // 顶层需要使用 Router 组件包裹
  <Router>
    <Switch>
      <Route path="/admin" render={(routerProps) => {
        return <App {...routerProps} />
      }} />>
      // 渲染 mainRoutes配置中的 <Route /> 组件 
      {
        mainRoutes.map(route => {
          return <Route key={route.pathname} path={route.pathname} component={route.component} />
        })
      }
      <Redirect to="/admin" exact from="/" />
      <Redirect to="/404" />
    </Switch>
  </Router>,
  document.querySelector("#root")
)
```

### App.js 的 路由视图
```js
export default class App extends Component {
  render() {
    return (
      // Frame 是 基于 Antd 里的做的后台 导航组件
      <Frame menus={menus}>
        // 组件里 包裹着的组件 都传入 到 Frame 作为 this.props.children 渲染成组件
        <Switch>
          {
            // adminRoutes 配置中 渲染 <Route /> 组件
            adminRoutes.map(route => {
              return (
                <Route key={route.pathname} path={route.pathname} exact={true} render={(routerPorps) => {
                  // 将 路由信息 传递下去
                  return <route.component {...routerPorps} />
                }} /> 
              )
            })
          }
          <Redirect to={adminRoutes[0].pathname} from="/admin" exact />
          <Redirect to="/404" />
        </Switch>
      </Frame>
    )
  }
}
```

### Article 页面的数据渲染

```js
import React, { Component } from 'react'
import { Card, Button, Table, Tag } from 'antd'
// 导入 axios 的请求方法
import { getArticles }  from '../../requests'

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
      total: 0
    }
  }
  // 根据 后台获取的 字段 创建列名
  createColumns = (columnKeys) => {
    return columnKeys.map(item => {
      if(item === 'amount'){
        return {
          title: titleDisplayMap[item],
          key: item,
          render: (text,record) => {
            const { amount } = record
            return <Tag color={amount>200?'red':'green'}>{record.amount}</Tag> 
          }
        }
      }
      return {
        title: titleDisplayMap[item],
        dataIndex: item,
        key: item,
      }
    })
  }
  getData = () => {
    getArticles()
      .then(resp => {
        const columnKeys = Object.keys(resp.list[0])
        const columns = this.createColumns(columnKeys)
        this.setState({
          total: resp.total,
          columns,
          dataSource: resp.list
        })
      })
  }
  componentDidMount(){
    this.getData()
  }
  render() {
    return (
      <Card title="文章列表" bordered={false} style={{ width: '100%' }} extra={<Button>导出</Button>}>
        
        <Table
          dataSource={this.state.dataSource}
          columns={this.state.columns} 
          loading={false}
          pagination={{
            total: this.state.total,
            hideOnSinglePage: true
          }}
          rowKey={record => record.id}
        />

      </Card>
    )
  }
}
```





```js
// @withRouter 是装饰器的写法
@withRouter
class Frame extends Component {
  onMenuClick = ({item, key, keyPath, domEvent}) => {
    this.props.history.push(key)
  }
  render() {
    console.log(this.props)
    return (
      <Layout>
      <Header className="header qf-header" style={{background: "#fff"}}>
        <div className="qs-logo">
          <img src={logo} alt="蚂蚁" />
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Layout style={{ padding: '24px 0', background: '#fff' }}>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%' }}
              onClick={this.onMenuClick}
            >
            // 渲染 路由链接
              {
                this.props.menus.map(item => {
                  return (
                  <Menu.Item key={item.pathname}><Icon type={item.icon} />{item.title}</Menu.Item>
                  )
                })
              }
            
            </Menu>
          </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
              // 这里的 this.props.children 就是 <Frame>中传入的<Route>路由视图 </Frame>
              {this.props.children}</Content>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
    </Layout>
    )
  }
}

export default Frame
```



### moment.js 时间格式化

> npm install moment --save

使用方法

moment(需要格式化的时间).format(格式)

### 前端导出 EXCE

```js
  toExcel = () => {
    // 前端导出 EXCEL 的方法
    const data = [Object.keys(this.state.dataSource)]
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

		XLSX.writeFile(wb, `aritical-sheetjs-${moment().format("YYYY-MM-DD")}.xlsx`)
  }
```

> npm install xlsx -s

### 实现富文本编辑

富文本编辑实现的原理是 contentable document.execCommand 

在此中，借用开源 富文本编辑器 wangEditor

> npm install wangeditor -s

## 数据可视化

图表类型
- canvas 位图格式
- svg 矢量图
- 三维图表 webGL

开源图表库
- echarts
- highcharts
- antV

数据可视化
- D3.js
- dataV

游戏
- egret

## Echart 图表库使用

> npm install echarts --save

## redux

> npm i redux react-redux redux-thunk -s

## 组件 <a id="components"></a>

## store

# 我崩溃了...编不下去了emmmmmm