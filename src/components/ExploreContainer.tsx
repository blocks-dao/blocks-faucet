import React, { useState, useEffect } from 'react';
import { IonButton } from '@ionic/react';
import './ExploreContainer.css';
import * as ethers from "ethers";
import blocksData from "../blocksDetails";

declare const window: any;

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {

  const [address, setAddress] = useState("");
  const [network, setNetwork] = useState("");

  const addBlocksToMetamask = async () => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }], // chainId must be in hexadecimal numbers
    }).then((res:any) =>{
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: '0x8a6d4c8735371ebaf8874fbd518b56edd66024eb',
            symbol: 'BLOCKS',
            decimals: 18,
            image: 'https://ipfs.io/ipfs/QmRTDA6Z8ggARb1jAC4F6T3oa2hwAGi59Myc7oe8xd94Gk?filename=Blocks%20Etherscan%20Logo.png',
          },
        },
      })
      .then((success:any) => {
        if (success) {
          console.log('BLOCKS successfully added to wallet!')
        } else {
          throw new Error('Something went wrong.')
        }
      })
      .catch(console.error)
    });
  }

  const blocksDataTransaction = () => {
    //Connect to Ethereum through the Metamask Provider
    let provider: any;
    provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    //Connect to the BLOCKS Smart Contract via the contract address, abi and provider
    const contract = new ethers.Contract(blocksData.blocksFaucetAddress, blocksData.blocksFaucetAbi, provider);
    let contractSigner = contract.connect(signer);

    contractSigner.send().then((tx: any)=>{
      if(tx){
        //View the transaction response and get the transaction hash
        console.log(tx)
        alert(tx.hash);
      }
    }).catch((e: any) => {
      alert(e.message);
    });
}

  useEffect(() => {
    if (window.ethereum ) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
      .then((res:any) => {
        console.log(res[0]);
        setAddress(res[0])
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          alert('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
      });
      window.ethereum.on('connect', (connectInfo: any) => {
        console.log(connectInfo.chainId)
        switch(connectInfo.chainId){
          case '0x4':
            setNetwork("Rinkeby Ethereum");
            break;
          default:
            alert("Please Switch to Rinkeby Network in Metamask.");
            setNetwork("Mainnet Ethereum");  
        }
      });
    }
    window.ethereum.on('chainChanged', (chainId: string) => {
      console.log(chainId)
      switch(chainId){
        case '0x4':
          setNetwork("Rinkeby Ethereum");
          break;
      }
      window.location.reload();
    });
    window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
      console.log(accounts)
      setAddress(accounts[0])
    });
  }, []);

  return (
    <div className="body">  
      <div className="intro">
        <strong>BLOCKS Rinkeby Faucet</strong>
        {address &&
         <>
          <p>Connected: {address}</p>
          {network &&
            <p>You are on {network}</p>
          }
         </> 
        }
      </div>
        <div className="col">
        <strong>Add Token</strong>
        <IonButton
          className="button-choose"
          color="danger"
          onClick={addBlocksToMetamask}>Add BLOCKS Rinkeby to Metamask</IonButton>
        </div>
        <div className="col">
        <strong>Get 2 BLOCKS testnet tokens.</strong>
        <IonButton
          className="button-choose"
          color="danger"
          onClick={blocksDataTransaction}>Get BLOCKS</IonButton>
        </div>
      <div className="footer">
        <a href="https://blocks.io">Blocks.io</a>
      </div>
    </div>  
  );
};

export default ExploreContainer;
