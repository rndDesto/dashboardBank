import React, { Fragment, useState, useEffect } from 'react'
import DataTable from '../../components/DataTable'
import { TablePagination, Button, Container, Grid, Box, FormControl, Select, MenuItem, makeStyles } from '@material-ui/core'
import { fetchTransaction } from '../../utils/fetch';
import { Link } from 'react-router-dom';
import { routes } from '../../config/routes';
import { thousand } from '../../utils/format';


const useStyles = makeStyles((theme) => ({
    containerSpace: {
        margin: theme.spacing(2, 0),
    },
}));


const Transaction = () => {
	const classes = useStyles()
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(0);
	const [errorMsg, setErrorMsg] = useState('');
	const [order, setOrder] = useState('asc');


	useEffect(() => {
		let currentPage
		page === 0 ? currentPage = 1 : currentPage = page + 1
		let payload = {
			page: currentPage,
			limit: limit,
			ordering: order,
			sorting: 'amount'
		}
		getTransaction(payload)
	}, [page, limit, order])


	const getTransaction = async (payload) => {
		setIsLoading(true)
		try {
			const response = await fetchTransaction(payload)
			setData(response)
			setIsLoading(false)
		} catch (err) {
			setErrorMsg(err.message)
			setIsLoading(false)
		}
	}


	const inOutAccount = (data) => {
		let inOutAccount;
		if (data.receiver) {
			inOutAccount = data.receiver.accountNumber
		}
		else {
			inOutAccount = data.sender.accountNumber;
		}
		return inOutAccount;
	}

	const amountNumber = (data) => {
		let amountStatus;
		if (data.sender) {
			amountStatus = `${data.currency} +${data.amount}`;
		}
		else {
			amountStatus = `${data.currency} -${data.amount}`;
		}
		return `${thousand(amountStatus)},00`;
	}


	const column = [
		{ heading: 'Date', value: 'date' },
		{ heading: 'Transaction Code', value: 'transactionCode' },
		{ heading: 'Your Account', value: 'accountNumber' },
		{ heading: 'Sender / Receiver Account', value: (data) => inOutAccount(data) },
		{ heading: 'Amount', value: (data) => amountNumber(data) },
	];


	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setLimit(parseInt(event.target.value));
	};



	return (
		<Fragment>

			<Container maxWidth="lg">
				<Grid container spacing={1} className={classes.containerSpace}>
					<Grid item sm={10}>
						<Grid container direction="row" justify="flex-start" alignItems="center">
							<Grid item xs={1}>Order</Grid>
							<Grid item xs={11}>
								<FormControl variant="outlined" size="small">
									<Select onChange={(e)=>setOrder(e.target.value)} value={order}>
										<MenuItem value='asc'>Asc</MenuItem>
										<MenuItem value='desc'>Desc</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>
					</Grid>
					<Grid item sm={2}>
						<Button component={Link} to={routes.TRANSACTIONNEW} color="primary" variant="contained" fullWidth>New Transaction</Button>
					</Grid>
				</Grid>
				{
				data.length !== 0 ?
					<Fragment>
						<DataTable column={column} data={data} />
						<TablePagination
							component="div"
							count={1000}
							page={page}
							onChangePage={handleChangePage}
							rowsPerPage={limit}
							onChangeRowsPerPage={handleChangeRowsPerPage}
						/>
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

export default Transaction
