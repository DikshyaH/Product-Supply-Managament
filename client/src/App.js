import React, { Component } from "react";
import ProductSupplyManagement from "./contracts/ProductSupplyManagement.json";
import ProductPaymentContract from "./contracts/ProductPaymentContract.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  // state = { storageValue: 0, web3: null, accounts: null, contract: null };
  state = { loaded:false, cost:0 ,ProductName : "FirstExample"};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      // const web3 = await getWeb3();
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      //const deployedNetwork = ProductSupplyManagement.networks[networkId];
      this.productsupplymanager = new this.web3.eth.Contract(
        ProductSupplyManagement.abi,
        ProductSupplyManagement.networks[this.networkId] && ProductSupplyManagement.networks[this.networkId].address,
      );

      this.productpayment = new this.web3.eth.Contract(
        ProductPaymentContract.abi,
        ProductPaymentContract.networks[this.networkId] && ProductSupplyManagement.networks[this.networkId].address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      // this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.setState({loaded:true});

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type == "checkbox" ? target.checked :target.value;
    const name  = target.name;
    this.state({
      [name] : value
    });
  }

  handleSubmit = async() => {
    const {price, productName} = this.state;
    await this.ProductSupplyManagement.methods.createProduct(productName,price).send({from: this.accounts[0]});
  }
  // runExample = async () => {
  //   const { accounts, contract } = this.state;

  //   // Stores a given value, 5 by default.
  //   await contract.methods.set(5).send({ from: accounts[0] });

  //   // Get the value from the contract to prove it worked.
  //   const response = await contract.methods.get().call();

  //   // Update state with the result.
  //   this.setState({ storageValue: response });
  // };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Product Supply Management</h1>
        <h2>Add Products</h2>
        <p>
          Price in Wei : <input type="text" name ="price" value = {this.state.cost} onChange={this.handleInputChange} />
        </p>
        <p>Product SKU : <input type="text" name ="name" value = {this.state.ProductName} onChange={this.handleInputChange} />
        </p>
        <button type="button" onClick={this.handleSubmit}> Add New Product to Warehouse</button>
      </div>
    );
  }
}

export default App;
