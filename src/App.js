import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { adminRoutes } from './routes'
import { Frame } from './components'

const menus = adminRoutes.filter(route => route.isNav === true)

export default class App extends Component {
  render() {
    return (
      <Frame menus={menus}>
        <Switch>
          {
            adminRoutes.map(route => {
              return (
                <Route key={route.pathname} path={route.pathname} exact={true} render={(routerPorps) => {
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
