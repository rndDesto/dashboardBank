const casual = require("casual");
const INTER_BANK_TCODE = "T002";
const INTER_ACCOUNT_TCODE = "T001";

const pickSample = (array = []) => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateTransactionTypes = () => {
  return [
    {
      id: 1,
      code: INTER_ACCOUNT_TCODE,
      description: "Inter Account Transfer",
    },
    {
      id: 2,
      code: INTER_BANK_TCODE,
      description: "Inter Bank Transfer",
    },
  ];
};

const generateAccounts = (sampleSize = 2) => {
  const accounts = [];
  for (let i = 0; i < sampleSize; i++) {
    accounts.push({
      id: casual.uuid,
      accountNumber: casual.card_number(),
      balance: casual.integer(20000, 10000000),
      currency: "IDR",
    });
  }
  return accounts;
};

const generateAccountsWithName = (sampleSize = 2) => {
  const accounts = generateAccounts(sampleSize);
  return accounts.map((acc) => ({ accountHolderName: casual.name, ...acc }));
};

const generateBanks = () => {
  return [
    {
      name: "BANK AKBARRIZ",
      code: "001",
    },
    {
      name: "BANK JOS",
      code: "002",
    },

    {
      name: "BANK ABC",
      code: "003",
    },
  ];
};

const generateTransactions = (
  sampleSize = 1000,
  transactionTypes = [],
  sourceAccounts = [],
  destinationAccounts = [],
  banks = []
) => {
  const transactionCodes = transactionTypes.map((t) => t.code);
  const sourceAccountNumbers = sourceAccounts.map((acc) => acc.accountNumber);
  const destinationAccountNumberAndNames = destinationAccounts.map((acc) => ({
    accountNumber: acc.accountNumber,
    accountHolderName: casual.name,
  }));
  const bankCodes = banks.map((b) => b.code);
  const transactions = [];
  for (let i = 0; i < sampleSize; i++) {
    const transaction = {
      id: casual.uuid,
      date: casual.date("DD-MM-YYYY HH:mm:ss"),
      amount: casual.integer(20000, 10000000),
      currency: "IDR",
      transactionCode: pickSample(transactionCodes),
      accountNumber: pickSample(sourceAccountNumbers),
    };

    const receiverOrSenderBase = {};

    if (transaction.transactionCode == INTER_BANK_TCODE) {
      receiverOrSenderBase.bankCode = pickSample(bankCodes);
    }

    if (i % 3 == 0) {
      transaction.sender = {
        ...receiverOrSenderBase,
        ...pickSample(destinationAccountNumberAndNames),
      };
    } else {
      transaction.receiver = {
        ...receiverOrSenderBase,
        ...pickSample(destinationAccountNumberAndNames),
      };
    }
    transactions.push(transaction);
  }
  return transactions;
};

module.exports = (sampleSize) => {
  const transactionTypes = generateTransactionTypes();
  const sourceAccounts = generateAccounts(3);
  const destinationAccounts = generateAccountsWithName(100);
  const banks = generateBanks();
  return {
    transactionTypes: transactionTypes,
    accounts: sourceAccounts,
    banks: banks,
    transactions: generateTransactions(
      sampleSize,
      transactionTypes,
      sourceAccounts,
      destinationAccounts,
      banks
    ),
  };
};
