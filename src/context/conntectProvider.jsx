import React, { createContext, useState } from "react";
import Web3 from "web3";
import networks from "../ethereum/networks";
import nftContractAbi from "../ethereum/nft_contract_abi";

const ConnectContext = createContext({
  state: {
    account: "",
    contractAddress: "",
    ownerAddress: "",
    nfts: [],
    nftsMetadata: [],
    isManager: [],
  },
  handler: {
    connectWallet: () => { },
    balanceOf: () => { },
    mint: () => { },
    burn: () => { },
  }
})

const ConnectProvider = ({ children }) => {
  const [nftContract, setNftContract] = useState();
  const [account, setAccount] = useState();
  const [contractAddress, setContractAddress] = useState();
  const [ownerAddress, setOwnerAddress] = useState();
  const [nfts, setNfts] = useState([]);
  const [nftsMetadata, setNftsMetadata] = useState();
  const [isManager, setIsManager] = useState();

  const connectWallet = async () => {
    await loadWeb3();
    await loadBlockchainData();
  }

  const loadWeb3 = async () => {
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

  const getContract = async () => {
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = networks[networkId];
    if (networkData) {
      return web3.eth.Contract(
        nftContractAbi,
        networkData.address
      );
    } else {
      window.alert("Marketplace contract not deployed to detected network");
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    const nftContract = await getContract();
    setNftContract(nftContract);
    setContractAddress(nftContract.address);

    const ownerAddress = await nftContract.methods.owner.call();
    setOwnerAddress(ownerAddress);
    setIsManager(accounts[0] === ownerAddress);

    for (let i = 1; i < 4; i++) {
      const nft = await nftContract.methods.uri(i).call();
      const nftsUris = nfts.push(nft)
      setNfts(nftsUris);
    }

    const nftsMetadata = await fetchNFTMetadata();
    setNftsMetadata(nftsMetadata);

  }

  const fetchNFTMetadata = async () => {
    let promises = [];
    for (let i = 0; i < 3; i++) {
      let nftUri = nfts[i];
      promises.push(
        fetch(nftUri)
          .then((res) => res.json())
          .then((res) => {
            console.log(res)
            return res;
          })
      );
    }
    return Promise.all(promises);
  }

  const balanceOf = async (address, tokenId) => {
    const amount = await nftContract.methods
      .balanceOf(address, tokenId).call();
    return amount.toNumber();
  }

  const mint = async (tokenId) => {
    await nftContract.methods.mint(account, tokenId, 1).send({ from: account });
  }

  const burn = async (tokenId) => {
    await nftContract.methods.burn(account, tokenId, 1).send({ from: account });
  }

  return (
    <ConnectContext.Provider value={{
      state: {
        account,
        contractAddress,
        ownerAddress,
        nfts,
        nftsMetadata,
      },
      handler: {
        connectWallet,
        balanceOf,
        mint,
        burn,
      }

    }}>{children}</ConnectContext.Provider>
  );
}

export { ConnectContext, ConnectProvider };

