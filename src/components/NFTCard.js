import "bootstrap/dist/css/bootstrap.min.css";
import React, { Component } from "react";
import "../App.css";

class NFTCard extends Component {
  render() {
    return (
      <div
        className="card border mb-3"
        style={{ borderRadius: "20px", maxWidth: "18rem" }}
      >
        <img
          src={this.props.image}
          className="card-img-top"
          alt="..."
          style={{ borderRadius: "20px 20px 0px 0px" }}
        />
        <div className="card-body">
          <h5 className="card-title">{this.props.name}</h5>
          <p className="card-text">{this.props.description}</p>
          {this.props.attributes.map((attribute, key) => {
            return (
              <p key={key} className="card-text">
                {attribute["trait_type"]}: {attribute["value"]}
              </p>
            );
          })}
          <p className="card-text">Manager amount: {this.props.ownerAmount}</p>
          {/* <form action="">
            <label htmlFor="code">
              <span>Code </span>
              <input type="text" id="code" placeholder="Mint code"></input>
            </label>
          </form> */}
          <button className="card-button">MINT</button>
          <button className="card-button">TRANSFER</button>
          <button className="card-button">BURN</button>
        </div>
      </div>
    );
  }
}

export default NFTCard;
