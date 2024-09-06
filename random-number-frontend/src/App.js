import React, { useState } from 'react';
import axios from 'axios';
import Wheel from './Wheel';
import './App.css';

function App() {
  const [randomNumber, setRandomNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const getRandomNumber = async () => {
    setLoading(true);
    setErrorMessage(null);  // Resetea el mensaje de error
    try {
      const response = await axios.post('http://localhost:3000/random');
      setRandomNumber(response.data.value);
    } catch (error) {
      console.error('Error fetching random number:', error);
      setErrorMessage('Error fetching random number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Random Number Generator</h1>
      
      <div class="wrapper">
        <div className="container">
         
          {randomNumber !== null && (
            <div>
              <Wheel randomNumber={randomNumber} />
              
              <h2>Random Number: {randomNumber}</h2>
              
            </div>
            
          )}<button id='spin-btn' onClick={getRandomNumber} disabled={loading}>
          {loading ? 'Loading...' : 'Get Random Number'}
        </button>
        </div>
      </div>
    </div>
  );
}

export default App;
