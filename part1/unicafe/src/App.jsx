import { useState } from "react";

const Button = ({ handleClick, FeedBack }) => (
  <button onClick={handleClick}>{FeedBack}</button>
);

const StatisticLine = ({ name, quantity }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{quantity}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;

  const positive = ((good / all) * 100).toFixed(1);
  
  const average = ((good - bad) / all).toFixed(1);

  if (all == 0) {
    return <p>No FeedBack given</p>;
  }

  return (
    <table>
      <tbody>
        <StatisticLine name="good:" quantity={good} />
        <StatisticLine name="neutral:" quantity={neutral} />
        <StatisticLine name="bad:" quantity={bad} />
        <StatisticLine name="all:" quantity={all} />
        <StatisticLine name="average:" quantity={average} />
        <StatisticLine name="positive:" quantity={positive + " %"} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const PlusGood = () => {
    setGood(good + 1);
  };

  const PlusNeutral = () => {
    setNeutral(neutral + 1);
  };

  const PlusBad = () => {
    setBad(bad + 1);
  };

  return (
    <>
      <h1>give FeedBack</h1>
      <Button handleClick={PlusGood} FeedBack="good" />
      <Button handleClick={PlusNeutral} FeedBack="neutral" />
      <Button handleClick={PlusBad} FeedBack="bad" />
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;