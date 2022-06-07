import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { ConnectContext } from "../context/conntectProvider";

const NFTCard = ({
  image,
  name,
  description,
  attributes,
  ownerAmount,
  tokenId,
}) => {
  const { handler } = useContext(ConnectContext);

  const [amount, setAmount] = useState(0);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    const getAmount = async () => {
      const amount = await ownerAmount();
      setAmount(amount);
      setExist(amount > 0);
    };
    getAmount();
  }, []);

  return exist ? (
    <div
      className="card border mb-3"
      style={{ borderRadius: "20px", maxWidth: "18rem" }}
    >
      <img
        src={image}
        className="card-img-top"
        alt="..."
        style={{ borderRadius: "20px 20px 0px 0px" }}
      />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        {attributes.map((attribute, key) => {
          return (
            <p key={key} className="card-text">
              {attribute["trait_type"]}: {attribute["value"]}
            </p>
          );
        })}
        <p className="card-text">Manager amount: {amount}</p>
        <form action="">
          <label htmlFor="code">
            <span>Code </span>
            <input type="text" id="code" placeholder="Mint code"></input>
          </label>
        </form>
        <button className="card-button" onClick={() => handler.mint(tokenId)}>
          MINT
        </button>
        <button className="card-button" onClick={() => handler.burn(tokenId)}>
          BURN
        </button>
      </div>
    </div>
  ) : (
    <div>hey</div>
  );
};

export { NFTCard };
