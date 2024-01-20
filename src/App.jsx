import React, { useState, useEffect } from 'react';
import getDAOContract from './DAOContract';
import './App.css'; 

function App() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [daoContract, setDaoContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const contract = await getDAOContract();
        setDaoContract(contract);
      } catch (error) {
        console.error('Error initializing DAO Contract:', error);
      }
    };
    init();
  }, []);

  const fetchProposals = async () => {
    if (!daoContract) return;

    setLoading(true);
    try {
      const proposalCount = await daoContract.methods.proposalCount().call();
      const fetchedProposals = [];
      for (let i = 1; i <= proposalCount; i++) {
        const proposal = await daoContract.methods.proposals(i).call();
        const votePercentage = await daoContract.methods.getVotePercentage(i).call();
        fetchedProposals.push({ id: i, ...proposal, votePercentage });
      }
      setProposals(fetchedProposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
    setLoading(false);
  };

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      if (daoContract) {
        fetchProposals();
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const voteOnProposal = async (proposalId) => {
    if (!daoContract) return;

    setLoading(true);
    try {
      await daoContract.methods.voteOnProposal(proposalId).send({ from: account });
      fetchProposals();
    } catch (error) {
      console.error('Error voting on proposal:', error);
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>DAO Voting System</h1>

      {!account && (
        <button className="connect-wallet-btn" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}

      {loading && <p>Loading...</p>}

      {account && daoContract && (
        <div className="proposals-list">
          <h2>Proposals</h2>
          {proposals.map(proposal => (
            <div className="proposal-item" key={proposal.id}>
              <p>{proposal.description} - Votes: {proposal.voteCount}</p>
              <p>Vote Percentage: {proposal.votePercentage}%</p>
              {!proposal.executed && (
                <button className="vote-btn" onClick={() => voteOnProposal(proposal.id)}>
                  Vote
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
