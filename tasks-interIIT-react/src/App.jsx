import React, { useEffect, useState } from "react";
import "./App.css";
import abi from "./utils/task.json";
import {ethers} from "ethers";

const getEthereumObject = () => window.ethereum;

/*
 * This function returns the first linked account found.
 * If there is no account linked, it will return null.
 */
const findMetaMaskAccount = async () => {
  try {
    const ethereum = getEthereumObject();

    /*
     * First make sure we have access to the Ethereum object.
     */
    if (!ethereum) {
      console.error("Make sure you have Metamask!");
      return null;
    }

    console.log("We have the Ethereum object", ethereum);
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      return account;
    } else {
      console.error("No authorized account found");
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [age, setAge] = useState(0);
  const [name, setName] = useState("");
  const [id, setId] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentTotalSubmissions, setCurrentTotalSubmissions] = useState(0)
  const contractAddress = "0x9a90f86Ff91e25E6CeAC11Ca8C5d9C8530271d34";
  const contractABI = abi.abi;

  const connectWallet = async () => {
    try {
      const ethereum = getEthereumObject();
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

 const submit = async()=>{
    try {
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

     
        const taskTxn = await taskPortalContract.submit(name,age,{ gasLimit: 300000 });
        console.log("Mining...", taskTxn.hash);

        await taskTxn.wait();
        console.log("Mined", taskTxn.hash);

        let count = await taskPortalContract.getTotalSubmissions();
        console.log("Retrieved total submissions count...", count.toNumber());
        setCurrentTotalSubmissions(count.toNumber());

        setName("");
        setAge(0);        
        
      } else{
        console.log("ETH object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
 const fetch = async()=>{
    try {
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let info = await taskPortalContract.fetchUserInfo(id);
        console.log("info : ", info);
        alert("name : " + info.name + " age : "+ info.age);

        setName("");
        setAge(0);        
        
      } else{
        console.log("ETH object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

const setSerialNumber = async()=>{
    try {
      const {ethereum} = window;

      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const taskPortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await taskPortalContract.getTotalSubmissions();
        console.log("Retrieved total submissions count...", count.toNumber());
        setCurrentTotalSubmissions(count.toNumber());
        setName("");
        setAge(0);        
        
      } else{
        console.log("ETH object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(async () => {
    setSerialNumber();
    const account = await findMetaMaskAccount();
    if (account !== null) {
      setCurrentAccount(account);
    }
  }, []);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
         Enter your name and age in the first section.
         Fetch details about a particular serial number in the second section.
        </div>
        <div className="bio">
        <h3>Current Serial Number : {currentTotalSubmissions + 1}</h3>
        </div>
        Name :
        <input type="text" value={name} onChange={(e) => { setName(e.target.value) }} className="form-control" id="desc" />
          Age :
        <input type="number" value={age} onChange={(e) => { setAge(e.target.value) }} className="form-control" id="desc" />
        <button className="taskButton" onClick={submit} style={{background: "black", color: "white", font: "monospace"}}>
          Submit
        </button>
        <hr style={{width:"100%"}}/><hr style={{width:"100%"}}/>
        <hr/>
          ID :
        <input type="number" value={id} onChange={(e) => { setId(e.target.value) }} className="form-control" id="desc" />        
        <button className="taskButton" style={{background: "black", color: "white", font: "monospace"}} onClick={fetch}>
          fetch details
        </button>
  
        {/*
         * If there is no currentAccount render this button
         */}
        {!currentAccount && (
          <button className="taskButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default App;