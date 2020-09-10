import React, { Fragment, useEffect, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import { fetchTransactionType, fetchListBank, fetchSubmitNewTransaction } from '../../utils/fetch';
import { FormControl, InputLabel, Select, MenuItem, makeStyles, Container, Typography, TextField, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { getAccount } from '../../utils/localStorage';
import {isNumberOnly, thousand} from '../../utils/format'
import { routes } from '../../config/routes';

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: '100%',
    },
    formListBank:{
        width: '100%'
    },
    containerSpace: {
        marginTop: theme.spacing(5),
    },
    contentSection:{
        marginTop: theme.spacing(1),
    },
    btnSpace: {
        '& > *': {
            margin: theme.spacing(1),
        },
      },
}));



const NewTransaction = () => {
    const classes = useStyles();
    const { goBack } = useHistory()
    const [isLoading, setIsLoading] = useState(false);
    const [transactionType, setTransactionType] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [transactionChoosen, setTransactionChoosen] = useState('');
    const [sourceAccount, setSourceAccount] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [listBank, setListBank] = useState([]);
    const [selectedBank, setSelectedBank] = useState('');
    const [receiverAccount, setReceiverAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [isSubmited, setIsSubmited] = useState(false);
    const [transactionDetail, setTransactionDetail] = useState({});

    let selectType, senderAccount, bankReceiver;

    useEffect(() => {
        getTransactionType()
        getListBank()
        setSourceAccount(JSON.parse(getAccount()))
    }, [])

    const getTransactionType = async () => {
        setIsLoading(true)
        try {
            const response = await fetchTransactionType()
            setTransactionType(response)
            setIsLoading(false)
        } catch (err) {
            setErrorMsg(err.message)
            setIsLoading(false)
        }
    }

    const getListBank = async () => {
        try {
            const response = await fetchListBank()
            setListBank(response)
        } catch (err) {
            setErrorMsg(err.message)
        }
    }

    const handleChange = (event) => {
        setTransactionChoosen(event.target.value)
    };

    const handleAccount = (event) => {
        setSelectedAccount(event.target.value)
    };

    const handleBank = (event) => {
        setSelectedBank(event.target.value)
    };

    const handleInputNumber = (e) => {
      if (e.target.value === '' || isNumberOnly(e.target.value)) {
        if(e.target.name === 'amount'){
            setAmount(e.target.value)
        }
        else if(e.target.name === 'receiverAccount'){
            setReceiverAccount(e.target.value)
        }
      }
    };


    const handleTransaction = () => {
        Number.prototype.padLeft = function(base,chr){
            var  len = (String(base || 10).length - String(this).length)+1;
            return len > 0? new Array(len).join(chr || '0')+this : this;
         }
        let d = new Date
        let dformat = [ (d.getMonth()+1).padLeft(), d.getDate().padLeft(), d.getFullYear()].join('-')+ ' ' + [ d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft()].join(':');
        let bankCheck;
        let receiverNumber;

        if(transactionChoosen === "T002"){
            bankCheck = bankRules(selectedBank)
            receiverNumber = `${bankCheck.bankExt}${receiverAccount.toString()}`

            if(!bankCheck.amount.isValid || !bankCheck.receiver.isValid){
                bankValidation(bankCheck)
                return
            }
        }
        else{
            receiverNumber = `${receiverAccount.toString()}`
        }
        
        
        let payload = {
            "accountNumber": selectedAccount.toString(),
            "receiver": {
              "accountNumber": receiverNumber,
              "bankCode": selectedBank ? selectedBank.toString() : '0'
            },
            "transactionCode": transactionChoosen.toString(),
            "amount": Number(amount),
            "currency": "IDR",
            "date": dformat.toString()
          }
        
          submitNewTransaktion(payload)

    }

    const submitNewTransaktion = (payload) => {
        fetchSubmitNewTransaction(payload).then(res => {
            setTransactionDetail(res)
            setIsSubmited(true)
        }).catch(err => {
            console.log(err)
        })
    }

    const bankValidation = (bankCheck) =>{
        if(!bankCheck.amount.isValid){
            alert(bankCheck.amount.errMsg)
            return
        }

        if(!bankCheck.receiver.isValid){
            alert(bankCheck.receiver.errMsg)
            return
        }
    }

    const amountConstrain = (min, max) => {
        let amountValid
        if(Number(amount) > (min-1) && Number(amount) < (max+1)){
            amountValid = {
                isValid: true,
                errMsg: `min ${min} max ${max}`
            }
        }
        else{
            amountValid = {
                isValid: false,
                errMsg: `min ${min} max ${max}`
            }
        }

        return amountValid
    }

    const receiverConstrain = (maxChar) => {
        let receiverValid = {}
        if(maxChar >= receiverAccount.length ){
            receiverValid = {
                isValid: true,
                errMsg: ""
            }
        }
        else{
            receiverValid = {
                isValid: false,
                errMsg: "akun penerima tidak valid"
            }
        }

        return receiverValid
    }

    const bankRules = (selectedBank) => {
        let amountRules;
        let receiverRules;
        let bankExt;

        switch (selectedBank) {
            case "001":
                amountRules = amountConstrain(10000, 15000000)
                receiverRules = receiverConstrain(9)
                bankExt = 123
            break;
            case "002":
                amountRules = amountConstrain(2000, 2000000)
                receiverRules = receiverConstrain(9)
                bankExt = 344
            break;
            case "003":
                amountRules = amountConstrain(5000, 999999999999)
                receiverRules = receiverConstrain(13)
                bankExt = ''
            break;
        }

        return {amount:amountRules, receiver: receiverRules, bankExt: bankExt}
    }

    if (transactionType.length !== 0) {
        selectType = transactionType.map(data => {
            return <MenuItem key={data.id} value={data.code}>{data.description}</MenuItem>
        })
    }

    if(sourceAccount.length !== 0){
        senderAccount = sourceAccount.map(data => {
            return <MenuItem key={data} value={data}>{data}</MenuItem>
        })
    }
    
    bankReceiver = listBank.map(data => {
        return <MenuItem key={data.code} value={data.code}>{data.name}</MenuItem>
    })


   
    return (
        <Fragment>

            <form onSubmit={()=> handleTransaction()}>
            <Container maxWidth="sm" className={classes.containerSpace}>
                <Typography variant="h5" align="center">NewTransaction</Typography>
                <FormControl className={classes.formControl}>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select onChange={handleChange} value={transactionChoosen}>
                        {selectType}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel>Source Account</InputLabel>
                    <Select onChange={handleAccount} value={selectedAccount}>
                        {senderAccount}
                    </Select>
                </FormControl>
                <Grid container alignItems="center" spacing={1} className={classes.contentSection}>
                    {transactionChoosen === "T002" ? 
                    <Fragment>
                        <Grid item xs={3}>
                            Destination Account
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl className={classes.formListBank} variant="outlined" size="small">
                                <Select onChange={handleBank} value={selectedBank}>
                                    {bankReceiver}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={5}>
                            <TextField fullWidth variant="outlined" size="small" onChange={(e)=>handleInputNumber(e)} value={receiverAccount} name="receiverAccount"/>
                        </Grid>
                    </Fragment>
                    :
                    <Fragment>
                        <Grid item xs={4}>
                            Destination Account
                        </Grid>
                        <Grid item xs={8}>
                            <TextField fullWidth variant="outlined" size="small" onChange={(e)=>handleInputNumber(e)} value={receiverAccount} name="receiverAccount"/>
                        </Grid>
                    </Fragment>
                    }
                    <Grid item xs={12} className={classes.contentSection}>
                        <TextField fullWidth variant="outlined" size="small" label="Amount" onChange={(e)=>handleInputNumber(e)} value={amount} name="amount"/>
                    </Grid>
                </Grid>
                <div className={classes.btnSpace}>
                    <Button onClick={() => goBack()} variant="contained" color="secondary">Kembali</Button>
                    <Button onClick={() => handleTransaction()} variant="contained" color="primary">Submit</Button>
                </div>
            </Container>
            </form>
            <TransaksiBerhasil isSubmited={isSubmited} transactionDetail={transactionDetail}/>
        </Fragment>
    )
}

export default NewTransaction



const TransaksiBerhasil = ({isSubmited, transactionDetail}) =>{
    return(
        <Dialog open={isSubmited}>
        <DialogTitle>Transaksi Berhasil</DialogTitle>
        <DialogContent>
        {Object.keys(transactionDetail).length !== 0 ?
            <DialogContentText component="div">
            <Typography>Akun Penerima : {transactionDetail.receiver.accountNumber}</Typography>
            <Typography>Jumlah : {`${transactionDetail.currency} ${thousand(transactionDetail.amount)},00`}</Typography>
            <Typography>Tanggal : {transactionDetail.date}</Typography>
          </DialogContentText>
        : ''}
          
          <DialogActions>
          <Button color="primary" variant="contained" component={Link} to={routes.TRANSACTION()}>
            Lihat Transaksi
          </Button>
        </DialogActions>
        </DialogContent>
      </Dialog>
    )
}