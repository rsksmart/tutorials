import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

var client = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var contractAbi = [{ "constant": true, "inputs": [], "name": "getAllowedNames", "outputs": [{ "name": "", "type": "bytes32[]" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getParentBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "allowed", "outputs": [{ "name": "name", "type": "bytes32" }, { "name": "account", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_to", "type": "address" }], "name": "buySomething", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "bytes32" }, { "name": "_account", "type": "address" }], "name": "addAllowed", "outputs": [{ "name": "_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getAllowedAddresses", "outputs": [{ "name": "", "type": "address[]" }], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" }];

// Hardcoded Contract Address
var contractAddress = '0x9068af4de1582b6dceab8ff77f54aadb9788332d';
var contract = new client.eth.Contract(contractAbi, contractAddress);
var isParent = false;
var isParentText = 'Children';

// https://github.com/facebookincubator/create-react-app/issues/2867
if (process.env.hasOwnProperty('REACT_APP_ISPARENT')) {
  isParent = true;
  isParentText = 'Parent';
}

if (!process.env.hasOwnProperty('REACT_APP_MYADDRESS')) {
  console.log('ERROR: REACT_APP_MYADDRESS parameters is required! See README.md for more information.');
  // return false;
}

var myAccount = process.env.REACT_APP_MYADDRESS;

console.log('process.argv', isParent);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      names: [],
      addresses: [],
      childrenAllowed: false
    }

    // ES6 React.Component doesn't auto bind methods to itself.
    // You need to bind them yourself in constructor.
    this.addAllowed = this.addAllowed.bind(this);
    this.canIBuy = this.canIBuy.bind(this);
    this.childrenAmountToPay = this.childrenAmountToPay.bind(this);
  }

  componentWillMount() {
    client.eth.getBalance(myAccount).then((balance) => {
      balance = client.utils.fromWei(balance, 'ether');
      console.log('call mount addresses', balance)
      this.setState({ balance: balance });
    });

    console.log('CONTRACT', contract.methods)
    contract.methods.getParentBalance().call().then((contractBalance) => {
      contractBalance = client.utils.fromWei(contractBalance, 'ether');
      console.log('call mount names', contractBalance);
      this.setState({ contractBalance: contractBalance });
    });

    contract.methods.getAllowedNames().call().then((promise) => {
      this.setState({
        names: promise
      });
    });

    contract.methods.getAllowedAddresses().call().then((promise) => {
      this.setState({
        addresses: promise
      });
    });
  }

  canIBuy() {
    var to = document.getElementById('address-can-i-buy').value;
    var result = document.getElementById('result-address-can-i-buy');

    if (client.utils.isAddress(to) !== true) {
      result.innerHTML = 'ERROR: Invalid address';
      return false;
    }
    this.setState({ childrenAllowed: false });

    contract.methods.buySomething(to).call().then((promise) => {
      result.innerHTML = promise;

      if (promise === 'You can buy here') {
        this.setState({ childrenAllowed: true });
      }
    });
  }

  childrenAmountToPay() {
    var amount = document.getElementById('children-amount-toPay').value;
    var to = document.getElementById('address-can-i-buy').value;

    // console.log('amount to pay', parseInt(amount));
    var tx = {
      from: myAccount,
      to: to,
      value: client.utils.toWei(amount),
      gas: 200000,
      gasPrice: 1
    }

    client.eth.sendTransaction(tx).then((err, res) => {
      return client.eth.getBalance(myAccount).then((balance) => {
        balance = client.utils.fromWei(balance, 'ether');
        this.setState({ balance: balance });
      });
    })
  }

  addAllowed() {
    var name = client.utils.fromAscii(document.getElementById('name-add-allowed').value);
    var address = document.getElementById('account-add-allowed').value;
    var result = document.getElementById('account-add-label');

    if (client.utils.isAddress(address) !== true) {
      result.innerHTML = 'ERROR: Invalid address';
      return false;
    }

    contract.methods.addAllowed(name, address).send({ gas: 200000, from: myAccount, gasPrice: 1 }, function (er, promise) {
      console.log(er);
      console.log(promise);

      this.state.addresses.push(address);
      this.setState({ addresses: this.state.addresses })
      this.state.names.push(name);
      this.setState({ names: this.state.names })
    }.bind(this));
  }

  render() {
    var tableRows = [];
    this.state.names.map((value, index) => {
      tableRows.push(<tr>
        <td>{client.utils.toAscii(this.state.names[index]).replace(/\u0000/g, '')}</td>
        <td>{this.state.addresses[index]}</td>
      </tr>
      )
    })
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to {isParentText} Wallet DAPP</h1>
        </header>

        <div className="App-userdata">
          <div>
            <p><b>{isParentText} info</b></p>
            <p><i>Address</i>: {myAccount}</p>
            <p><i>Balance</i>: {this.state.balance} eth</p>
          </div>
          <div>
            <p><b>Contract info</b></p>
            <p><i>Address</i>: {contractAddress}</p>
            <p><i>Balance</i>: {this.state.contractBalance} eth</p>
          </div>
        </div>

        <div className="App-Content">
          <div className="App-parentsAllow" style={{ display: isParent ? 'block' : 'none' }}>
            <p>Add allowed</p>
            <div>
              <input placeholder="Name" id="name-add-allowed" />
              <input placeholder="Account" id="account-add-allowed" size="40" />
              <button onClick={this.addAllowed}>Add</button><br />
              <label id="account-add-label"></label>
            </div>
          </div>


          <div className="App-childCanBuild" style={{ display: isParent ? 'none' : 'block' }}>
            <p>¿Can buy?</p>
            <div>
              <input placeholder="Address" id="address-can-i-buy" size="40" />
              <button onClick={this.canIBuy}>Buy</button><br />
              <label id="result-address-can-i-buy"></label>
            </div>
            {this.state.childrenAllowed ? <span>
              <input type="number" placeholder="Amount" id="children-amount-toPay" />
              <button onClick={this.childrenAmountToPay}>Pay</button>
            </span> : null}
          </div>

          <table className="App-parentsAllowedAddresses" style={{ display: isParent ? 'block' : 'none' }}>
            <thead>
              <tr>
                <th>Names</th>
                <th>Addresses</th>
              </tr>
            </thead>
            <tbody>
              {tableRows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
