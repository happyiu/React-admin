import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { adminRoutes } from './routes'
import { Frame } from './components'

import { connect } from 'react-redux'

const menus = adminRoutes.filter(route => route.isNav === true)

const mapState = state => ({
  isLogin: state.user.isLogin ,
  role: state.user.role 
})

@connect(mapState)
class App extends Component {
  render() {
    
    return (
      this.props.isLogin ? 
      <Frame menus={menus}>
        <Switch>
          {
            adminRoutes.map(route => {
              return (
                <Route key={route.pathname} path={route.pathname} exact={true} 
                render={(routerPorps) => {
                  const hasPermission = route.roles.includes(this.props.role)
                  return hasPermission ? <route.component {...routerPorps} /> : <Redirect to="/admin/NoAuth" />
                }} /> 
              )
            })
          }
          <Redirect to={adminRoutes[0].pathname} from="/admin" exact />
          <Redirect to="/404" />
        </Switch>
      </Frame>
      :
      <Redirect to="/login"/>
    )
  }
}

export default App