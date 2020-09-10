import React, { useEffect } from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import { Container, Typography, } from '@material-ui/core';
import DashboardBase from '../../components/layout/DashboardBase';
import Transaction from '../Transaction';
import { routes } from '../../config/routes';
import Account from '../Account';
import NewTransaction from '../Transaction/NewTransaction';
import { fetchUserAccount } from '../../utils/fetch';
import { setAccount } from '../../utils/localStorage';

export default function Dashboard({ classes }) {
  const { goBack } = useHistory();
  const { pathname } = useLocation();

  useEffect(() => {
    globalAccount()
  }, [])

  const globalAccount = () => {
    let akun=[];
    fetchUserAccount().then(res => {
      res.map(data => akun.push(data.accountNumber))
      setAccount(JSON.stringify(akun))
    })
  }
  return (
    <React.Fragment>
      <DashboardBase>
        <Switch>
          <Route render={(props) => <WelcomeDashboard {...props} classes={classes} />} exact path={routes.DASHBOARD()} />
          <Route component={Account} exact path={routes.ACCOUNT()} />
          <Route component={Transaction} exact path={routes.TRANSACTION()} />
          <Route component={NewTransaction} exact path={routes.TRANSACTIONNEW()} />
          
          {pathname === routes.DASHBOARD() ? '' : <Route component={() => <p onClick={()=>goBack()} >notfound</p>}/> }
        </Switch>
      </DashboardBase>
    </React.Fragment>
  );
}


export const WelcomeDashboard = ({classes}) => {
  return (
    <Container maxWidth="sm" component="main" className={classes.heroContent}>
      <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
        Welcome to Tunaiku Dashboard
    </Typography>
    </Container>
  )
}