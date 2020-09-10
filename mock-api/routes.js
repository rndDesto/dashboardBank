module.exports = {
  "/api/secure/_self/transaction*": "/transactions$1",
  "/api/secure/_self/account*": "/accounts$1",
  "/api/secure/system/transaction-type/code/:code":
    "/transactiontypes?code=:code",
  "/api/secure/system/bank/code/:code": "/banks?code=:code",
  "/api/secure/system/bank*": "/banks$1",
  "/api/secure/system/transaction-type*": "/transactiontypes$1",
};
