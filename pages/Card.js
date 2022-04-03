import React from 'react';
import Aud from "./Aud.js"
const Card = ({nft,i}) => {
	return (
		<div key={i} className="p-2 border shadow rounded-xl overflow-hidden">
			<img src={nft.image} className="rounded" />\
			<Aud music={nft.audio} />
			<div className="p-4 bg-black">
				<p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
				<button
					className="mt-4 w-full bg-blue-500 text-white font-bold py-2 px-12 rounded"
					onClick={() => listNFT(nft)}
				>
					List
				</button>
			</div>
		</div>
	);
};

export default Card;
