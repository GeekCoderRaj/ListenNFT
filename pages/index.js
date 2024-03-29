import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Aud from "./Aud";
import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/HXppMyS9DXP6baHkWcIZ5vs3B9FaMpbv"
    );
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          audio: meta.data.audio,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-20 pt-4 dark">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="shadow rounded-xl overflow-hidden"
              style={{
                boxShadow: "rgb(0 210 255 / 75%) 0px 8px 20px",
                marginTop: "2rem",
              }}
            >
              <img
                style={{
                  width: "7rem",
                  height: "7rem",
                  margin: "auto",
                  marginTop: "2rem",
                  borderRadius: "1rem",
                }}
                src={nft.image}
              />
              <div className="p-4">
                {/* <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p> */}
                <div style={{ height: "55px", overflow: "hidden" }}>
                  <p
                    style={{
                      textAlign: "center",
                      backgroundColor: "black",
                      margin: "1rem 5rem",
                      borderRadius: "1rem",
                      boxShadow: "0px 1px 12px mediumpurple",
                      padding: "3px",
                      fontWeight: "bold",
                    }}
                    className="text-gray-400"
                  >
                    {nft.description}
                  </p>
                </div>
              </div>
              <Aud music={nft.audio} />
              <div className="p-4 bg-black">
                <p
                  className="text-2xl font-bold text-white"
                  style={{ textAlign: "center", margin: "1rem" }}
                >
                  {nft.price} MATIC
                </p>
                <button
                  className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded mb-4"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
