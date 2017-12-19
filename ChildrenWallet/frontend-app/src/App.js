import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import _ from 'lodash';

var client = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));
var contractAbi = [{"constant":true,"inputs":[],"name":"getAllowedNames","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"allowed","outputs":[{"name":"name","type":"bytes32"},{"name":"account","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_to","type":"address"}],"name":"buySomething","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_account","type":"address"}],"name":"addAllowed","outputs":[{"name":"_success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllowedAddresses","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
var contractAddress = '0x345ca3e014aaf5dca488057592ee47305d9b3e10';
var contract = new client.eth.Contract(contractAbi, contractAddress);
var myAccount = '0x627306090abab3a6e1400e9345bc60c78a8bef57';

function canIBuy(){
  var address = document.getElementById('address-can-i-buy').value;
  var result = document.getElementById('result-address-can-i-buy');
  result.value = '';
  contract.methods.buySomething(address).call().then((promise) =>{      
    result.innerHTML = promise;
  }); 
}

function addAllowed(){
  var name = client.utils.fromAscii(document.getElementById('name-add-allowed').value);
  var address = document.getElementById('account-add-allowed').value; 
  contract.methods.addAllowed(name, address).send( { gas: 200000, from: myAccount, gasPrice:1}, function(er, promise)  {      
    console.log(er);
    console.log(promise);
  }); 
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      names: [],
      addresses: []
    }
  }
  componentWillMount(){
    contract.methods.getAllowedNames().call().then((promise) =>{   
      this.setState({
          names : promise         
      });
    }); 
  
    contract.methods.getAllowedAddresses().call().then((promise) =>{       
      this.setState({
          addresses : promise         
      });
    });      
  }

  render() {
    var tableRows = [];
    _.each(this.state.names, (value, index) => {
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
          <h1 className="App-title">Welcome to Children Wallet DAPP</h1>
        </header>
        <div className="App-Content">
          <table>
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
        <div>
          <h1>Can I buy? </h1>
          <input placeholder="Address" id="address-can-i-buy"/>
          <button onClick={canIBuy}>OK</button><br/>
          <label id="result-address-can-i-buy"></label>
        </div>
        <div>
          <h1>Add allowed</h1>
          <input placeholder="Name" id="name-add-allowed"/>
          <input placeholder="Account" id="account-add-allowed"/>
          <button onClick={addAllowed}>ADD</button><br/>
        </div>
      </div>
    );
  }
}

export default App;
