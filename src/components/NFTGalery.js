import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext } from "react";
import { ConnectContext } from "../context/conntectProvider";
import { NFTCard } from "./NFTCard";

const NFTGalery = ({ address }) => {
  const { state, handler } = useContext(ConnectContext);
  if (!state.nftsMetadata) return null;
  return (
    <div className="card-group">
      {state.nftsMetadata.map((nft, key) => {
        return (
          <NFTCard
            key={key}
            name={nft["name"]}
            image={nft["image"]}
            description={nft["description"]}
            attributes={nft["attributes"]}
            ownerAmount={() => handler.balanceOf(address, nft["id"])}
            tokenId={[key + 1]}
          />
        );
      })}
    </div>
  );
};

export { NFTGalery };
