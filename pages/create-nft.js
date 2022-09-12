import { useState } from 'react'
import { ethers } from 'ethers'
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import Aud from "./Aud"

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [AudioUrl, setAudioUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChangeImage(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
        //upload the file to IPFS
        const response = await uploadFileToIPFS(file);
        if(response.success === true) {
            console.log("Uploaded image to Pinata: ", response.pinataURL)
            setFileUrl(response.pinataURL);
        }
    }
    catch(e) {
        console.log("Error during file upload", e);
    }
    // const file = e.target.files[0]
    // console.log(file)
    // try {
    //   const added = await client.add(
    //     file,
    //     {
    //       progress: (prog) => console.log(`received: ${prog}`)
    //     }
    //   )
    //   console.log(added)
    //   const url = `https://infura-ipfs.io/ipfs/${added.path}`
    //   console.log(url);
    //   setFileUrl(url)
    // } catch (error) {
    //   console.log('Error uploading file: ', error)
    // }  
  }
  async function onChangeAudio(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
        //upload the file to IPFS
        const response = await uploadFileToIPFS(file);
        if(response.success === true) {
            console.log("Uploaded image to Pinata: ", response.pinataURL)
            setAudioUrl(response.pinataURL);
        }
    }
    catch(e) {
        console.log("Error during file upload", e);
    }
  }
  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl || !AudioUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl, audio: AudioUrl
    })
      try {
        //upload the metadata JSON to IPFS
        const response = await uploadJSONToIPFS(data);
        if(response.success === true){
            console.log("Uploaded JSON to Pinata: ", response)
            return response.pinataURL;
        }
      // const added = await client.add(data)
      // const url = `https://infura-ipfs.io/ipfs/${added.path}`
      // /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      // console.log(data);
      // console.log(url);
      // return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    /* next, create the item */
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(url, price, { value: listingPrice })
    await transaction.wait()
   
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Asset Price in MATIC"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChangeImage}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChangeAudio}
        />
        {
          AudioUrl && (
             <Aud music={AudioUrl}/>
          )
        }
        <button onClick={listNFTForSale} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
          Create NFT
        </button>
      </div>
    </div>
  )
}