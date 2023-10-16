import logo from './logo.svg';
import './App.css';

import { useState } from 'react';

// TODO: eliminate hard code, currently using ganache address
const contractAddress = "0x70348E9Af3d7f65D2a4387A61Aa5f11ea3625AdC"

// setup web3
const { Web3 } = require('web3');
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

// fetch artifact
const messageContractArtifact = require('./build/contracts/Message');
const messageContractABI = messageContractArtifact.abi;
console.log(messageContractABI)
// instantiate contract object
const messageContract = new web3.eth.Contract(messageContractABI, contractAddress);
// console.log("instantiated contract with from", messageContract.options.from)

function App() {

  const [message, setMessageValue] = useState()
  const [userAccount, setUserAccountValue] = useState()

  async function fetchMessage() {
    try {
      setUserAccountValue(web3.eth.getAccounts()[0])
      // messageContract.options.from = userAccount
      await messageContract.methods.getMessage().call().then(console.log)
    } catch (err) {
      console.log("error fetching message. make sure to setMessage first", err)
    }
  }

  async function setMessage() {
    try {
      console.log("checking a message is set..")
      if (!message) return
      console.log("setting message", message)
      setUserAccountValue(web3.eth.getAccounts()[0])
      // messageContract.options.from = userAccount
      console.log("user account is", userAccount, messageContract.options.from, web3.eth.accounts)
      await messageContract.methods.setMessage(message).call()
      console.log("finished setting message", message)
    } catch(err) {
      console.log("Error setting Message", err)
    }
  }

  var accountInterval = setInterval(function () {
    if (web3.eth.accounts[0] !== userAccount) {
      setUserAccountValue(web3.eth.accounts[0]);
    }
  }, 100)


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
