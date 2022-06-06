import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import "../App.css";
import NFTCard from "../components/NFTCard";

class NFTGalery extends Component {
  render() {
    return (
      <div className="card-group">
        {this.props.nftsMetadata.map((nft, key) => {
          return (
            <NFTCard
              key={key}
              name={nft["name"]}
              image={nft["image"]}
              description={nft["description"]}
              attributes={nft["attributes"]}
              ownerAmount={this.props.ownerAmounts[key].toNumber()}
            />
          );
        })}
      </div>
    );
  }
}

export default NFTGalery;
