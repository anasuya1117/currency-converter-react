import React, { Component } from "react";
import axios from "axios";
import styles from "./converter.module.css";

class Converter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: null,
      fromCurrency: "USD",
      toCurrency: "GBP",
      amount: 1,
      currencies: [],
    };
  }

  // Initializes the currencies
  componentDidMount() {
    console.log(process.env.REACT_APP_CURRCOV_API_KEY);
    axios
      .get(
        `https://free.currconv.com/api/v7/currencies?apiKey=${process.env.REACT_APP_CURRCOV_API_KEY}`
      )
      .then((response) => {
        const currencyAr = [];
        for (const key in response.data.results) {
          currencyAr.push(key);
        }
        this.setState({ currencies: currencyAr.sort() });
      })
      .catch((err) => {
        console.log("Opps", err.message);
      });
  }

  // conversion
  convertHandler = () => {
    if (this.state.fromCurrency !== this.state.toCurrency) {
      axios
        .get(
          `https://free.currconv.com/api/v7/convert?q=${this.state.fromCurrency}_${this.state.toCurrency}&compact=ultra&apiKey=${process.env.REACT_APP_CURRCOV_API_KEY}`
        )
        .then((response) => {
          const result =
            this.state.amount *
            response.data[
              this.state.fromCurrency + "_" + this.state.toCurrency
            ];
          this.setState({ result: result.toFixed(5) });
        })
        .catch((err) => {
          console.log("Opps", err.message);
        });
    } else {
      this.setState({ result: "You cant convert the same currency!" });
    }
  };

  // Updates the states based on the dropdown that was changed
  selectHandler = (event) => {
    if (event.target.name === "from") {
      this.setState({ fromCurrency: event.target.value });
    }
    if (event.target.name === "to") {
      this.setState({ toCurrency: event.target.value });
    }
  };

  render() {
    return (
      <div className={styles.Container}>
        <div className={styles.Converter}>
          <h2>Currency Converter</h2>
          <div className={styles.Form}>
            <input
              name="amount"
              type="text"
              value={this.state.amount}
              onChange={(event) =>
                this.setState({ amount: event.target.value })
              }
            />
            <select
              name="from"
              onChange={(event) => this.selectHandler(event)}
              value={this.state.fromCurrency}
            >
              {this.state.currencies.map((cur) => (
                <option key={cur}>{cur}</option>
              ))}
            </select>
            <select
              name="to"
              onChange={(event) => this.selectHandler(event)}
              value={this.state.toCurrency}
            >
              {this.state.currencies.map((cur) => (
                <option key={cur}>{cur}</option>
              ))}
            </select>
            <button onClick={this.convertHandler}>Convert</button>
          </div>
          <div className={styles.Result}>
            {this.state.result && <h3>{this.state.result}</h3>}
          </div>
        </div>
      </div>
    );
  }
}

export default Converter;
