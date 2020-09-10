import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types';
import { CssBaseline, AppBar, Toolbar, Typography, List, ListItem, ListItemText, Button } from '@material-ui/core';
import { Link, useLocation, Redirect } from 'react-router-dom';
import { routes } from '../../../config/routes';
import { clearStorages } from '../../../utils/localStorage';

const DashboardBase = ({ children, classes }) => {
	const { pathname } = useLocation();

	const handleLogout = () => {
		clearStorages()
		location.href = routes.LOGIN()
	}

	return (
		<Fragment>
			<CssBaseline />
			<AppBar position="static" color="default" elevation={0} className={classes.appBar}>
				<Toolbar className={classes.toolbar}>
					<Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle} component={Link} to={routes.DASHBOARD()}>
						Dashboard
          </Typography>
					<List component="nav" className={classes.listInline}>
						<ListItem button component={Link} to={routes.ACCOUNT()} selected={pathname === routes.ACCOUNT()}>
							<ListItemText>Account</ListItemText>
						</ListItem>
						<ListItem button component={Link} to={routes.TRANSACTION()} selected={pathname === routes.TRANSACTION() || pathname === routes.TRANSACTIONNEW()}>
							<ListItemText>Transaction</ListItemText>
						</ListItem>
					</List>
					<Button href="#" color="primary" variant="outlined" className={classes.link} onClick={() => handleLogout()}>
						Logout
            </Button>
				</Toolbar>
			</AppBar>
			<div>
				{children}
			</div>
		</Fragment>
	)
}


DashboardBase.defaultProps = {
	children: null,
	classes: {}
};

DashboardBase.propTypes = {
	classes: PropTypes.object,
	children: PropTypes.node,
};


export default DashboardBase
