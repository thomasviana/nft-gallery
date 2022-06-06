import React, { Component } from "react";
import "../App.css";

class Header extends Component {
  render() {
    let isConnected;
    if (this.props.account.length > 0) {
      isConnected = true;
    } else {
      isConnected = false;
    }
    return (
      <div className="Header">
        <div className="Header-Title">
          <h1>NFT GALLERY</h1>
        </div>
        {isConnected ? (
          <ul>
            <li>Your Address: {this.props.account}</li>
            <li>Contract: {this.props.contractAddress}</li>
            <li>Owner: {this.props.contractOwner}</li>
          </ul>
        ) : (
          <button
            className="log"
            onClick={(event) => {
              event.preventDefault();
              this.props.connectWallet();
            }}
          >
            Connect Wallet
          </button>
        )}
      </div>
    );
  }
}

export default Header;
