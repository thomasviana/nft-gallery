import React, { useContext } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { NFTGalery } from "./components/NFTGalery";
import { ConnectContext } from "./context/conntectProvider";

const App = () => {
  const { state } = useContext(ConnectContext);
  return (
    <div className="App">
      <Header className="Header" />
      <main>
        {state.isManager ? (
          <section>
            <h1 className="NFTGalery-Title">
              Collection Management {state.account}
            </h1>
            <NFTGalery className="NFTGalery" address={state.ownerAddress} />
          </section>
        ) : (
          <section>
            <h1 className="NFTGalery-Title">My NFTs</h1>
            <NFTGalery className="NFTGalery" address={state.account} />
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
