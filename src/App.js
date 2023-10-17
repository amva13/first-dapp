import logo from './logo.svg';
import './App.css';

import { useState } from 'react';

// TODO: eliminate hard code, currently using ganache address
const contractAddress = "0x5cb9008fcc1C079542a0D10e4098E084b243042d"

// setup web3
const { Web3 } = require('web3');
// console.log("instantiated contract with from", messageContract.options.from)

function App() {

  const [message, setMessageValue] = useState()
  const [userAccount, setUserAccountValue] = useState()

  async function fetchMessage() {
    try {
      // setUserAccountValue(web3.eth.getAccounts()[0])
      // messageContract.options.from = userAccount
      const messageContract = await getContract()
      await messageContract.methods.getMessage().call().then(console.log)
    } catch (err) {
      console.log("error fetching message. make sure to setMessage first", err)
    }
  }

  async function getContract() {
    const web3 = await getWeb3();
    console.log("web3 is", web3)
    // fetch artifact
    const messageContractArtifact = require('./build/contracts/Message');
    const messageContractABI = messageContractArtifact.abi;
    console.log(messageContractABI)
    // instantiate contract object
    const messageContract = new web3.eth.Contract(messageContractABI, contractAddress);
    return messageContract
  }

  async function getWeb3() {
    console.log("ran getWeb3")
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
    console.log("ran new web3 method")
      // Request account access if needed
      await window.ethereum.enable();
      // Accounts now exposed
      return web3;
    } catch (error) {
      console.error(error);
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    // Use MetaMask/Mist's provider.
    console.log("running legacy block for web3")
    const web3 = window.web3;
    console.log('Injected web3 detected.');
    return web3;
  }
  // Fallback to localhost; use dev console port by default...
  else {
  console.log("running default local block for web3")
    const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    const web3 = new Web3(provider);
    console.log('No web3 instance injected, using Local web3.');
    return web3;
  }
};

  async function setMessage() {
    try {
      console.log("checking a message is set..")
      if (!message) return
      console.log("setting message", message)
      // setUserAccountValue(web3.eth.getAccounts()[0])
      // messageContract.options.from = userAccount
      // console.log("user account is", userAccount, messageContract.options.from, web3.eth.accounts)
      const messageContract = await getContract()
      await messageContract.methods.setMessage(message).call()
      console.log("finished setting message", message)
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
