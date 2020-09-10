import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import Login from './containers/LoginPage/Login';
import Dashboard from './containers/DashboardPage';
import './App.css';
import { routes } from './config/routes';
import { getToken } from './utils/localStorage';

const App = function() {
  const { goBack, push } = useHistory();
  const [cekLogin, setCekLogin] = useState(false)

  useEffect(() => {
    if(getToken()){
      setCekLogin(true)
      push(routes.DASHBOARD())
    }
  }, [])

  return (
    <Switch>
      <Route exact path={routes.HOME()} component={Login} />
      <Route exact path={routes.LOGIN()} component={Login} />
      {cekLogin ? <Route path={routes.DASHBOARD()} component={Dashboard} /> : <Redirect to={routes.LOGIN()} />}
      <Route component={() => <p onClick={()=>goBack()} >notfound</p>}/>
    </Switch>
  );
};

export default App;
