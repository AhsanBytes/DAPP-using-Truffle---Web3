import './App.css';
import { useState, useEffect } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [reload, shouldReload] = useState(false);//to reload page for ether transfer and withdraw check

  const reloadEffect = () => shouldReload(!reload);

  useEffect(() => {
    const loadProvider = async () => {
      let provider = await detectEthereumProvider();
      const contract = await loadContract("Funder", provider);
      if (provider) {
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
        });
      }
      else {
        console.error("Please install MetaMask!", error);
      }

      // if(window.ethereum){
      //   provider = window.ethereum;
      //   try{
      //     await provider.enable();
      //   }catch{
      //     console.error("User is not allowed");
      //   }
      // }else if(window.web3){
      //   provider = window.web3.currentProvider;
      // }else if(!process.env.production){
      //   provider = new Web3.providers.HttpProvider("http://localhost:7545")
      // }

      // console.log(window.web3);
      // console.log(window.ethereum);
    };

    loadProvider();

  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const {contract, web3} = web3Api;//we are getting web3 object from web3Api 
      const balance = await web3.eth.getBalance(contract.address);//here we r using web to access contract address
      setBalance(web3.utils.fromWei(balance, "ether"));
    }
    web3Api.contract && loadBalance();//if we have web3Api then we will call ladbalance function 
  },[web3Api,reload])//dependencies for function of useffect
  //when reload happen the load function should work also 


  const transferFund = async () => {
    const {contract, web3} = web3Api;
    await contract.transfer({//we gwet contract from web3Api, now we r 
      //using transfer function of our smart contract, it takes two parameters
      from: account,
      value: web3.utils.toWei("2","ether"),
    });
    reloadEffect();//when transfer happens the toggling function calls
  }

  const withdrawFund = async () => {
    const {contract, web3} = web3Api;
    const withdrawAmount = web3.utils.fromWei("2","ether");//withdraw Amount
    await contract.withdraw(withdrawAmount,{//withdraw function of contract
      from: account
    })
    reloadEffect();
  };

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }

    web3Api.web3 && getAccount();//if we have web3Api.web3 then we go to getAccount

  }, [web3Api.web3])

  //console.log(web3Api.web3);

  return (
    <>
      <div class="card text-center">
        <div class="card-header">Funding</div>
        <div class="card-body">
          <h5 class="card-title">Balance: {balance} ETH </h5>
          <h6 class="card-title">Account Balance: 99 ETH</h6> 
          <p class="card-text">
            Account : {account ? account : "not connected"}
          </p>
          {/* <button
            type="button"
            class="btn btn-success"
            onClick={async () => {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });
              console.log(accounts);
            }}
          >
            Connect to metamask
          </button> */}
          &nbsp;
          <button type="button" class="btn btn-success "
          onClick={transferFund}>
            Transfer
          </button>
          &nbsp;
          <button type="button" class="btn btn-primary "
          onClick={withdrawFund}>
            Withdraw
          </button>
        </div>
        <div class="card-footer text-muted">Ahsan Anwar</div>
      </div>
    </>
  );
}

export default App;
