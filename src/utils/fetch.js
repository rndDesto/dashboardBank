import axios from 'axios';

const BASE_URL = 'http://localhost:3200'
const BASE_AUTH = 'http://localhost:3300'

const fetch = (url, method, param1, param2) => {
    return new Promise((resolve, reject) => {
        axios[method](url, param1, param2)
            .then(res => resolve(res.data))
            .catch(err => {
                const defaultError = {
                    code: 500,
                    status: 'error',
                    message: 'Failed to fetch data. Please contact developer.'
                };
                if (!err.response) reject(defaultError);
                else if (!err.response.data) reject(defaultError);
                else reject(err.response.data);
            });
    });
};

export const fetchUserAccount = async () => (
    await fetch(`${BASE_URL}/api/secure/_self/account`, 'get')
);

export const fetchTransaction = async (data) => (
    await fetch(`${BASE_URL}/api/secure/_self/transaction/?_page=${data.page}&_limit=${data.limit}&_order=${data.ordering}&_sort=${data.sorting}`, 'get')
);

export const fetchSubmitNewTransaction = async (payload) => (
    await fetch(`${BASE_URL}/api/secure/_self/transaction/`, 'post', payload)
);

export const fetchTransactionType = async () => (
    await fetch(`${BASE_URL}/api/secure/system/transaction-type`, 'get')
);

export const fetchListBank = async () => (
    await fetch(`${BASE_URL}/api/secure/system/bank`, 'get')
);

export const fetchLogin = async (data) => (
    await fetch(`${BASE_AUTH}/api/login` ,'post', data)
);

