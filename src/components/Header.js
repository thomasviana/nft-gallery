import React, { useContext, useEffect, useState } from "react";
import { ConnectContext } from "../context/conntectProvider";

const Header = () => {
  const { state, handler } = useContext(ConnectContext);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (state.account && state.account.length > 0) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [state.account]);

  return (
    <div className="Header">
      <div className="Header-Title">
        <h1>NFT GALLERY</h1>
      </div>
      {isConnected ? (
        <ul>
          <li>Your Address: {state.account}</li>
          <li>Contract: {state.contractAddress}</li>
          <li>Owner: {state.ownerAddress}</li>
        </ul>
      ) : (
        <button
          className="log"
          onClick={(event) => {
            event.preventDefault();
            handler.connectWallet();
          }}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export { Header };
