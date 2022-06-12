/* pages/_app.js */
import "../styles/globals.css";
import Link from "next/link";

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen w-full bg-black ">
      <nav className="flex border-b p-6 bg-black">
        <p
          style={{ marginRight: "10rem" }}
          className="text-4xl font-bold text-white"
        >
          ListenNFT
        </p>
        <div className="flex">
          <Link href="/">
            <a className=" navText mx-8 text-blue-500">HOME</a>
          </Link>
          <Link href="/create-nft">
            <a className=" navText mx-8 text-blue-500">MINT NFT</a>
          </Link>
          <Link href="/my-nfts">
            <a className=" navText mx-8 text-blue-500">COLLECTION</a>
          </Link>
          <Link href="/dashboard">
            <a className=" navText mx-8 text-blue-500">My-NFT</a>
          </Link>
        </div>
      </nav>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
