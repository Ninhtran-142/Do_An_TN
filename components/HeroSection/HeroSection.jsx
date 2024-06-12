import React, {useState, useEffect, useContext} from "react";
import Image from "next/image";


// INTERNAL IMPORT
import Style from "./HeroSection.module.css";
import { Button } from "../componentsindex";
import images from "../../img";
import { useRouter } from "next/router";

//Smart contract import
import { NFTMarketplaceContext } from "../../Context/NFTMarketplaceContext";

const HeroSection = () => {
  const router = useRouter();
  const {titleData} = useContext(NFTMarketplaceContext);
  return (
    <div className={Style.heroSection}>
      <div className={Style.heroSection_box}>
        <div className={Style.heroSection_box_left}>
          <h1>{titleData}🖼️</h1>
          <p>
            Discover the most outstanding NFTs in all topics of life. Create your own NFTs and sell them.
          </p>
          <Button btnName="Start your search" 
              handleClick={() => router.push("/searchPage")}
            />
        </div>
        
      </div>
    </div>
  );
};

export default HeroSection;