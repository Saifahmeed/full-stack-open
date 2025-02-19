import { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0);

  const [Votes, setVote] = useState(new Array(anecdotes.length).fill(0));

  const Voting = () => {
    const copy = [...Votes];
    copy[selected] += 1;
    setVote(copy);
  };

  const HighestVotes = () => {
    let HighVotes = 0;
    let Max = 0;

    Votes.forEach((Vote, num) => {
      if (Vote > HighVotes) {
        HighVotes = Vote;
        Max = num;
      }
    });
    return Max;
  };
  const AnecdoteNext = () => {
    const Randomm = Math.floor(Math.random() *anecdotes.length);
    setSelected(Randomm);
  };
  const HighestVotesAnecdote = HighestVotes();

  return (
    <div>
      <p>{anecdotes[selected]}</p>
      <p>has {Votes[selected]} Votes</p>
      <button onClick={Voting}>Vote</button>
      <button onClick={AnecdoteNext}>Next Anecdote</button>
      <h1>Anecdote with most Votes</h1>
      <p>{anecdotes[HighestVotesAnecdote]}</p>
      <p>has {Votes[HighestVotesAnecdote]} Votes</p>
    </div>
  );
}

export default App;
