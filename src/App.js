import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Header from "./components/Header";
import NFTGalery from "./components/NFTGalery";
import nftContractAbi from "./ethereum//nft_contract_abi";
import networks from "./ethereum/networks";

class App extends Component {
  state = {};
  async componentWillMount() {}

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      contractAddress: "",
      contractOwner: "",
      ownerAmounts: [],
      nfts: [],
      nftsMetadata: [],
      loading: true,
    };

    this.connectWallet = this.connectWallet.bind(this);
    this.fetchNFTMetadata = this.fetchNFTMetadata.bind(this);
  }

  async connectWallet() {
    this.setState({ loading: true });
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error(error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log("Injected web3 detected.");
    }
    // Fallback to localhost; use dev console port by default...
    else {
      const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
      window.web3 = new Web3(provider);
      console.log("No web3 instance injected, using Local web3.");
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = networks[networkId];
    if (networkData) {
      const nftContract = web3.eth.Contract(
        nftContractAbi,
        networkData.address
      );
      const contractOwner = await nftContract.methods.owner.call();

      this.setState({
        nftContract: nftContract,
        contractAddress: nftContract.address,
        contractOwner: contractOwner,
      });

      const { nfts, ownerAmounts } = this.state;
      for (let i = 1; i < 4; i++) {
        const nft = await nftContract.methods.uri(i).call();
        nfts.push(nft);
        const ownerAmount = await nftContract.methods
          .balanceOf(contractOwner, i)
          .call();
        ownerAmounts.push(ownerAmount);
        this.setState({ nfts: nfts, ownerAmounts: ownerAmounts });
      }
      const nftsMetadata = await this.fetchNFTMetadata();
      this.setState({ nftsMetadata });
    } else {
      window.alert("Marketplace contract not deployed to detected network");
    }
    this.setState({ loading: false });
  }

  async fetchNFTMetadata() {
    const { nfts, ownerAmounts, nftContract } = this.state;
    const contractOwner = await nftContract.methods.owner.call();
    for (let i = 1; i < 4; i++) {
      const nft = await nftContract.methods.uri(i).call();
      nfts.push(nft);
      const ownerAmount = await nftContract.methods
        .balanceOf(contractOwner, i)
        .call();
      ownerAmounts.push(ownerAmount);
      this.setState({ nfts: nfts, ownerAmounts: ownerAmounts, contractOwner });
    }
    let promises = [];
    for (let i = 1; i < 4; i++) {
      let nftUri = nfts[i];
      promises.push(
        fetch(nftUri)
          .then((res) => res.json())
          .then((res) => {
            return res;
          })
      );
    }
    return Promise.all(promises);
  }

  render() {
    return (
      <div className="App">
        <Header
          className="Header"
          connectWallet={this.connectWallet}
          account={this.state.account}
          contractAddress={this.state.contractAddress}
          contractOwner={this.state.contractOwner}
        />
        <main>
          <section>
            <h1 className="NFTGalery-Title">Collection</h1>
            <NFTGalery
              className="NFTGalery"
              nftsMetadata={this.state.nftsMetadata}
              contractOwner={this.state.contractOwner}
              ownerAmounts={this.state.ownerAmounts}
            />
          </section>
        </main>
      </div>
    );
  }
}

export default App;
