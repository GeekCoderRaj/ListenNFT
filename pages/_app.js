/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div className = "min-h-screen w-full bg-black ">
      <nav className="border-b p-6 bg-black">
        <p className="text-4xl font-bold text-white">ListenNFT</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-blue-500">
              HOME
            </a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-blue-500">
              MINT NFT
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-blue-500">
              COLLECTION
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="mr-6 text-blue-500">
              My-NFT
            </a>
          </Link>
        </div>
      </nav>
      
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp