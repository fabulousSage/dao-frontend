// src/DAOContract.js
import getWeb3 from './getWeb3';
import DAOContractABI from './DAOContractABI.json';

const getDAOContract = async () => {
  const web3 = await getWeb3();
  const address = '0x127b4F57fDfEF5200e1c8fbFE4e2574DEFBC3185';
  const daoContract = new web3.eth.Contract(DAOContractABI, address);
  return daoContract;
};

export default getDAOContract;
