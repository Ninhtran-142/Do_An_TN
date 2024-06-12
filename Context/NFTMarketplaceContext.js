import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import axios from "axios";

//INTERNAL  IMPORT
import {
  NFTMarketplaceAddress,
  NFTMarketplaceABI,
  transferFundsAddress,
  transferFundsABI,
} from "./constants";

//---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
  new ethers.Contract(
    NFTMarketplaceAddress,
    NFTMarketplaceABI,
    signerOrProvider
  );

//---CONNECTING WITH SMART CONTRACT

const connectingWithSmartContract = async () => {
  try {
    let contract;
    if (window.ethereum) {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();
      contract = fetchContract(signer);
    } else {
      // Sử dụng một node Ethereum công khai ở đây, ví dụ: Infura, Alchemy, ...
      const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/ARDDq0zYTkXSYjFZIrXpMz-joq07xKOo');
      contract = fetchContract(provider);
    }
    return contract;
  } catch (error) {
    console.log("Something went wrong while connecting with contract", error);
    // Nếu có lỗi, khởi tạo contract với provider không đăng nhập
    const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/ARDDq0zYTkXSYjFZIrXpMz-joq07xKOo');
    const contract = fetchContract(provider);
    return contract;
  }
};
export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvider = ({ children }) => {
  const titleData = "Discover, collect, and sell NFTs";

  //------USESTAT
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const router = useRouter();

  //---CHECK IF WALLET IS CONNECTD

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        console.log(accounts[0]);
      } else {
        // setError("No Account Found");
        // setOpenError(true);
        console.log("No account");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const getBalance = await provider.getBalance(accounts[0]);
      const bal = ethers.formatEther(getBalance);
      setAccountBalance(bal);
    } catch (error) {
      // setError("Something wrong while connecting to wallet");
      // setOpenError(true);
      console.log("not connected");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  const approveAllNFTs = async () => {
    try {
      const contract = await connectingWithSmartContract();
      const data = await contract.fetchMyNFTs();
  
      // Lấy danh sách tokenId
      const tokenIds = data.map((nft) => nft.tokenId.toString());
  
      // Approve từng NFT
      for (const tokenId of tokenIds) {
        const approvalTx = await contract.approve(contract.address, tokenId);
        await approvalTx.wait();
        console.log('Approved NFT with token ID ${tokenId}');
      }
    } catch (error) {
      console.error('Error approving NFTs:', error);
    }
  };
  //---CONNET WALLET FUNCTION
  const connectWallet = async () => {
    try {
      if (!window.ethereum)
        return setOpenError(true), setError("Install MetaMask");

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(accounts);
      setCurrentAccount(accounts[0]);

      // window.location.reload();
      connectingWithSmartContract();
      await approveAllNFTs();
    } catch (error) {
      // setError("Error while connecting to wallet");
      // setOpenError(true);
    }
  };

  //---UPLOAD TO IPFS FUNCTION
  const uploadToPinata = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `d2c77a08f8de766632d0`,
            pinata_secret_api_key: `
            9546cb69a8634229d95e750e526fedd14eeb7c8856c12e0ae9c4b1bd0e56744e`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        return ImgHash;
      } catch (error) {
        console.log("Unable to upload image to Pinata");
      }
    }
  };

  //---CREATENFT FUNCTION
  const createNFT = async (name, price, image, description, router) => {
    if (!name || !description || !price || !image)
      return setError("Data Is Missing"), setOpenError(true);

    const data = JSON.stringify({ name, description, image });

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: `d2c77a08f8de766632d0`,
          pinata_secret_api_key: `
          9546cb69a8634229d95e750e526fedd14eeb7c8856c12e0ae9c4b1bd0e56744e`,
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log(url);

      await createSale(url, price);
      router.push("/searchPage");
    } catch (error) {
      setError("Error while creating NFT");
      setOpenError(true);
    }
  };

  //--- createSale FUNCTION
  const createSale = async (url, formInputPrice, isReselling, id) => {
    try {
      console.log(url, formInputPrice, isReselling, id);
      const price = ethers.parseUnits(formInputPrice, "ether");

      const contract = await connectingWithSmartContract();

      const listingPrice = await contract.getListingPrice();

      const transaction = !isReselling
        ? await contract.createToken(url, price, {
            value: listingPrice.toString(),
          })
        : await contract.resellToken(id, price, {
            value: listingPrice.toString(),
          });

      await transaction.wait();
      console.log(transaction);
    } catch (error) {
      setError("error while creating sale");
      setOpenError(true);
      console.log(error);
    }
  };

  //--FETCHNFTS FUNCTION

  const fetchNFTs = async () => {
    try {
      const contract = await connectingWithSmartContract();

      const data = await contract.fetchMarketItems();

      console.log(data);

      const items = await Promise.all(
        data.map(
          async ({ tokenId, seller, owner, price: unformattedPrice }) => {
            if (tokenId === 0) {
              // Bỏ qua tokenId không hợp lệ
              return null;
            }
            const tokenURI = await contract.tokenURI(tokenId);

            const {
              data: { image, name, description },
            } = await axios.get(tokenURI, {});
            const price = ethers.formatUnits(
              unformattedPrice.toString(),
              "ether"
            );

            return {
              price,
              tokenId: tokenId.toString(),
              seller,
              owner,
              image,
              name,
              description,
              tokenURI,
            };
          }
        )
      );
      return items;

      // }
    } catch (error) {
      // setError("Error while fetching NFTS");
      // setOpenError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  //--FETCHING MY NFT OR LISTED NFTs
  const fetchMyNFTsOrListedNFTs = async (type) => {
    try {
      if (currentAccount) {
        const contract = await connectingWithSmartContract();

        const data =
          type == "fetchItemsListed"
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs();

        const items = await Promise.all(
          data.map(
            async ({ tokenId, seller, owner, price: unformattedPrice }) => {
              const tokenURI = await contract.tokenURI(tokenId);
              const {
                data: { image, name, description },
              } = await axios.get(tokenURI);
              const price = ethers.formatUnits(
                unformattedPrice.toString(),
                "ether"
              );

              return {
                price,
                tokenId: tokenId.toString(),
                seller,
                owner,
                image,
                name,
                description,
                tokenURI,
              };
            }
          )
        );
        return items;
      }
    } catch (error) {
      console.log(error);
      // setError("Error while fetching listed NFTs");
      // setOpenError(true);
    }
  };

  useEffect(() => {
    fetchMyNFTsOrListedNFTs();
  }, []);

  //---buy NFT
  const buyNFT = async (nft) => {
    try {
      const contract = await connectingWithSmartContract();
      const price = ethers.parseUnits(nft.price.toString(), "ether");

      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });

      await transaction.wait();
      router.push("/author");
    } catch (error) {
      setError("Error While buying NFT");
      setOpenError(true);
    }
  };

  // Delete NFT
const burnNFT = async (tokenId) => {
  try {
    const contract = await connectingWithSmartContract();
    const tx = await contract.burnNFT(tokenId);
    await tx.wait();
    router.push("/author");
    console.log("NFT burned successfully");
  } catch (error) {
    console.error("Error burning NFT:", error);
  }
};

// cancel Sale NFT
const cancelSale = async (tokenId) => {
  try {
    const contract = await connectingWithSmartContract();
    const tx = await contract.cancelSale(tokenId);
    await tx.wait();
    router.push("/author");
    console.log("NFT sale canceled successfully");
  } catch (error) {
    console.error("Error canceling NFT sale:", error);
  }
};
const getSigner = async () => {
  try {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    return signer;
  } catch (error) {
    console.error("Error getting signer:", error);
    throw error;
  }
};
const transferNFT = async (tokenId, address) => {
  try {
    console.log("Tranfer to: ",tokenId, address);
    const contract = await connectingWithSmartContract();
    const signer = await getSigner();

    const tx = await contract.connect(signer)["transferFrom(address,address,uint256)"](currentAccount, address, tokenId);
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("NFT transferred successfully!");
    } else {
      console.error("Transaction failed with error:", receipt.status);
    }
  } catch (error) {
    console.error("Error transferring NFT:", error);
  }
};

  return (
    <NFTMarketplaceContext.Provider
      value={{
        uploadToPinata,
        checkIfWalletConnected,
        connectWallet,
        createNFT,
        fetchNFTs,
        fetchMyNFTsOrListedNFTs,
        buyNFT,
        burnNFT,
        cancelSale,
        createSale,
        transferNFT,
        currentAccount,
        titleData,
        setOpenError,
        openError,
        error,
        accountBalance,
      }}
    >
      {children}
    </NFTMarketplaceContext.Provider>
  );
};