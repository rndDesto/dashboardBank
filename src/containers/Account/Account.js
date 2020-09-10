import React, { useState, useEffect, Fragment } from 'react'
import { fetchUserAccount } from '../../utils/fetch';
import DataTable from '../../components/DataTable';
import { thousand } from '../../utils/format';
import { Container, makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({

	containerSpace: {
		marginTop: theme.spacing(5),
	},

}));

const Account = () => {
	const classes = useStyles()
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		getAccount()
	}, [])

	const getAccount = async () => {
		setIsLoading(true)
		try {
			const response = await fetchUserAccount()
			setData(response)
			setIsLoading(false)
		} catch (err) {
			setErrorMsg(err.message)
			setIsLoading(false)
		}
	}

	const amountBalance = (data) => {
		return `${data.currency} ${thousand(data.balance)},00 `;
	}

	const column = [
		{ heading: 'Your Account', value: 'accountNumber' },
		{ heading: 'Balance', value: (data) => amountBalance(data) },
	];


	return (
		<Fragment>
			<Container maxWidth="md" className={classes.containerSpace}>
				{
					data.length !== 0 ?
						<Fragment>
							<DataTable column={column} data={data} />
						</Fragment>
						:
						<Fragment>
							{errorMsg}
						</Fragment>
				}
			</Container>
		</Fragment>
	)
}
export default Account
