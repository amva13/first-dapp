import './App.css';

import { useState } from 'react';

// TODO: eliminate hard code, currently using ganache address
const contractAddress = "0xa9bC08dbF2deBd9DEdA97106ed1D5DA45CF84712"

// setup web3
const { Web3 } = require('web3');

function App() {

  const [message, setMessageValue] = useState()
  const [userAccount, setUserAccountValue] = useState()

  async function fetchMessage() {
    try {
      const {messageContract,_, accounts} = await getContract()
      const account = accounts[0]
      setUserAccountValue(account)
      console.log("invoking getMessage w/ messageContract from account", account)
      await messageContract.methods.getMessage().call().then(console.log)
      console.log("finished call to getMessage")
    } catch (err) {
      console.log("error fetching message. make sure to setMessage first", err)
    }
  }


  async function getContract() {
    const {web3, accounts} = await getWeb3();
    console.log("web3 is", web3)
    // fetch artifact
    const messageContractArtifact = require('./build/contracts/Message');
    const messageContractABI = messageContractArtifact.abi;
    console.log(messageContractABI)
    // instantiate contract object
    console.log("getting account to append to contract")
    const account = accounts[0]
    console.log("account when getting contract is", account)
    const messageContract = new web3.eth.Contract(messageContractABI, contractAddress, account);
    return {messageContract: messageContract, web3: web3, accounts: accounts}
  }

  async function getWeb3() {
    console.log("ran getWeb3")
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  let web3
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
    console.log("ran new web3 method")
      // Request account access if needed
      await window.ethereum.enable();
      // Accounts now exposed
    } catch (error) {
      console.error(error);
    }
  }

  // Legacy dapp browsers...
  else if (window.web3) {
    // Use MetaMask/Mist's provider.
    console.log("running legacy block for web3")
    web3 = window.web3;
    console.log('Injected web3 detected.');
  }
  // Fallback to localhost; use dev console port by default...
  else {
  console.log("running default local block for web3")
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    web3 = new Web3(provider);
    console.log('No web3 instance injected, using Local web3.');
  }
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  console.log("retreived accounts", accounts)
  return {web3: web3, accounts: accounts}
};

  async function setMessage() {
    try {
      console.log("checking a message is set..")
      if (!message) return
      console.log("setting message", message)
      const {messageContract,_,accounts} = await getContract()
      const account = accounts[0]
      setUserAccountValue(account)
      console.log("invoking setMessage from messageContract with account", account)
      await messageContract.methods.setMessage(message).call().then(() => {console.log("finished .then() call on setMessage")})
      console.log("finished setting message.. this will not reflect in local testing on truffle for subsequent getMessage calls..", message)
    } catch(err) {
      console.log("Error setting Message", err)
    }
  }

  // var accountInterval = setInterval(function () {
  //   if (web3.eth.accounts[0] !== userAccount) {
  //     setUserAccountValue(web3.eth.accounts[0]);
  //   }
  // }, 100)


  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchMessage}>Fetch Message</button>
        <button onClick={setMessage}>Set Message</button>
        <input onChange={e => setMessageValue(e.target.value)} placeholder="Set message" />
      </header>
    </div>
  );
}

export default App;
