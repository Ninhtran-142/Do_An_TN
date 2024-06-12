import React, { useState, useEffect, useContext } from "react";

//INTERNAL IMPORT
import Style from "../styles/collection.module.css";
import images from "../img";
import {
  Banner,
  CollectionProfile,
  NFTCardTwo,
} from "../collectionPage/collectionIndex";
import { Slider, Brand } from "../components/componentsindex";
import Filter from "../components/Filter/Filter";
import { NFTMarketplaceContext } from "../Context/NFTMarketplaceContext";
import { getTopCreators } from "../TopCreators/TopCreators";

const collection = () => {
  const { checkIfWalletConnected, currentAccount } = useContext(
    NFTMarketplaceContext
  );
  useEffect(() => {
    checkIfWalletConnected();
  }, []);

  const { fetchNFTs } = useContext(NFTMarketplaceContext);
  const [nfts, setNfts] = useState([]);
  const [nftsCopy, setNftsCopy] = useState([]);
  const [creators, setCreators] = useState([]);
  
  useEffect(() => {
    // if (currentAccount) {
    fetchNFTs().then((items) => {
      console.log(nfts);
      setNfts(items?.reverse());
      setNftsCopy(items);
  
      // Tạo biến creators sau khi đã lấy được dữ liệu nfts
      const newCreators = getTopCreators(items);
      setCreators(newCreators);
    });
    // }
  }, []);
    console.log(creators);
  return (
    <div className={Style.collection}>
      <Banner bannerImage={images.creatorbackground1} />
      <CollectionProfile />
      <Filter />
      <NFTCardTwo NFTData={nfts} />

      <Slider />
      <Brand />
    </div>
  );
};

export default collection;