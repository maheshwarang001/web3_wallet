require('dotenv').config();
const {Web3} = require('web3');

// Load environment variables
const apikey = process.env['apikey'];
const privateKey = process.env['private_key'];

// Initialize Web3 instance
const node = `https://go.getblock.io/${apikey}`;
const web3 = new Web3(node);

// Create a new account
const accountTo = web3.eth.accounts.create();
console.log("Newly created account:", accountTo);

// Get the account from private key
const accountFrom = web3.eth.accounts.privateKeyToAccount(privateKey);
console.log("Sender account:", accountFrom);

const createSignedTx = async (rawTx) => {
    // Estimate gas for the transaction
    rawTx.gas = await web3.eth.estimateGas(rawTx);
    
    // Set gas price (can be dynamic based on network conditions)
    rawTx.gasPrice = await web3.eth.getGasPrice();
    
    // Fetch current nonce for the account
    rawTx.nonce = await web3.eth.getTransactionCount(accountFrom.address);

    // Sign the transaction
    return await accountFrom.signTransaction(rawTx);
}

const sendSignedTx = async (signedTx) => {
    // Send the signed transaction
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
        .on('receipt', console.log)
        .on('error', console.error);
}

const amount = "0.01";
const rawTx = {
    to: accountTo.address,
    value: web3.utils.toWei(amount, "ether")
};

// Create and send the signed transaction
createSignedTx(rawTx).then(sendSignedTx).catch(console.error);
