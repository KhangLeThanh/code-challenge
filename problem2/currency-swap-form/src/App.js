import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css"; // Import the styling

const pricesUrl = "https://interview.switcheo.com/prices.json";

function App() {
  const [tokens, setTokens] = useState([]);
  const [prices, setPrices] = useState({});
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [amountToSend, setAmountToSend] = useState("");
  const [amountToReceive, setAmountToReceive] = useState("");
  const [errors, setErrors] = useState({ amountToSend: "" });
  const [message, setMessage] = useState("");

  // Fetch prices from API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get(pricesUrl);
        const tokenPrices = response.data;

        // Extract the latest prices for each token
        const latestPrices = tokenPrices.reduce((acc, token) => {
          if (!acc[token.currency] || new Date(token.date) > new Date(acc[token.currency].date)) {
            acc[token.currency] = token;
          }
          return acc;
        }, {});

        setPrices(latestPrices);
        setTokens(Object.keys(latestPrices));
        setFromToken(Object.keys(latestPrices)[0]);
        setToToken(Object.keys(latestPrices)[1]);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  // Recalculate amount to receive when dependencies change
  useEffect(() => {
    calculateAmountToReceive();
  }, [amountToSend, fromToken, toToken, prices]);

  // Validate form inputs
  const validateForm = () => {
    let isValid = true;
    const newErrors = { amountToSend: "" };

    if (!amountToSend) {
      newErrors.amountToSend = "Please enter a valid amount.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Calculate the amount to receive
  const calculateAmountToReceive = () => {
    if (fromToken && toToken && amountToSend) {
      const fromPrice = prices[fromToken]?.price;
      const toPrice = prices[toToken]?.price;

      if (fromPrice && toPrice) {
        const exchangeRate = toPrice / fromPrice;
        const result = parseFloat(amountToSend) * exchangeRate;
        setAmountToReceive(result.toFixed(6)); // Format to 6 decimal places
      } else {
        setAmountToReceive("Price not available");
      }
    } else {
      setAmountToReceive("");
    }
  };

  // Handle form submission
  const handleSwapSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && amountToSend && amountToReceive) {
      setMessage(true);
    } else {
      setMessage(false);
    }
  };

  // Handle token selection from dropdown
  const handleDropdownSelect = (token, type) => {
    if (type === "from") {
      setFromToken(token);
    } else {
      setToToken(token);
    }
  };

  // Convert token names for image URLs
  const convertedToken = (token) => {
    switch (token) {
      case "RATOM":
        return "rATOM";
      case "STEVMOS":
        return "stEVMOS";
      case "STOSMO":
        return "stOSMO";
      case "STATOM":
        return "stATOM";
      case "STLUNA":
        return "stLUNA";
      default:
        return token;
    }
  };

  return (
    <div className="App">
      <h1>Currency Swap</h1>
      <form onSubmit={handleSwapSubmit}>
        {/* From Currency */}
        <div className="section-input">
          <label htmlFor="from-token">From Currency:</label>
          <div className="custom-dropdown">
            <div className="dropdown-selected">{fromToken}</div>
            <ul className="dropdown-menu">
              {tokens.map((token) => (
                <li
                  key={token}
                  onClick={() => handleDropdownSelect(token, "from")}
                >
                  <img
                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${convertedToken(token)}.svg`}
                    alt={token}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                  {token}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* To Currency */}
        <div className="section-input">
          <label htmlFor="to-token">To Currency:</label>
          <div className="custom-dropdown">
            <div className="dropdown-selected">{toToken}</div>
            <ul className="dropdown-menu">
              {tokens.map((token) => (
                <li
                  key={token}
                  onClick={() => handleDropdownSelect(token, "to")}
                >
                  <img
                    src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${convertedToken(token)}.svg`}
                    alt={token}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                  />
                  {token}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Amount to Send */}
        <div className="section-input">
          <label htmlFor="input-amount">Amount to Send:</label>
          <input
            id="input-amount"
            type="number"
            min="0"
            step="any"
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
          />
          {errors.amountToSend && (
            <p className="error-message">{errors.amountToSend}</p>
          )}
        </div>

        {/* Amount to Receive */}
        <div className="section-input">
          <label htmlFor="output-amount">Amount to Receive:</label>
          <input id="output-amount" type="text" value={amountToReceive} readOnly />
        </div>

        {/* Confirmation Message */}
        {message && (
          <p>
            Swapped {amountToSend} {fromToken} for {amountToReceive} {toToken}
          </p>
        )}

        {/* Submit Button */}
        <button type="submit">CONFIRM SWAP</button>
      </form>
    </div>
  );
}

export default App;
