// All supported networks and related contract addresses are defined here.
//
// LINK token addresses: https://docs.chain.link/resources/link-token-contracts/
// Price feeds addresses: https://docs.chain.link/data-feeds/price-feeds/addresses
// Chain IDs: https://chainlist.org/?testnets=true

// require("@chainlink/env-enc").config()
require("dotenv").config();

const DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS = 2

const npmCommand = process.env.npm_lifecycle_event
const isTestEnvironment = npmCommand == "test" || npmCommand == "test:unit"

// Set EVM private key (required)
const PRIVATE_KEY = process.env.PRIVATE_KEY
if (!isTestEnvironment && !PRIVATE_KEY) {
  throw Error("Set the PRIVATE_KEY environment variable with your EVM wallet private key")
}

const networks = {
  ethereumSepolia: {
    url: process.env.ETHEREUM_SEPOLIA_RPC_URL || "UNSET",
    gasPrice: undefined,
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey: process.env.ETHERSCAN_API_KEY || "UNSET",
    chainId: 11155111,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    linkToken: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    linkPriceFeed: "0x42585eD362B3f1BCa95c640FdFf35Ef899212734",
    functionsRouter: "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0",
    functionsDonId: "fun-ethereum-sepolia-1",
    ccipRouter: "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59",
    ccipChainSelector: "16015286601757825753",
    ccipTestToken: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
    uniswapV3Router: "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    weth9: "0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534",
    fundAmount: "1", // 1 LINK
  },
  polygonMumbai: {
    url: process.env.POLYGON_MUMBAI_RPC_URL || "UNSET",
    gasPrice: undefined,
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey: process.env.POLYGONSCAN_API_KEY || "UNSET",
    chainId: 80001,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "MATIC",
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    linkPriceFeed: "0x12162c3E810393dEC01362aBf156D7ecf6159528", // LINK/MATIC
    functionsRouter: '0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C',
    functionsDonId: 'fun-polygon-mumbai-1',
    ccipRouter: "0x1035CabC275068e0F4b745A29CEDf38E13aF41b1",
    ccipChainSelector: "12532609583862916517",
    ccipTestToken: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
    uniswapV3Router: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    weth9: "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889",
    fundAmount: "1", // 1 LINK
  },
  avalancheFuji: {
    url: "https://api.avax-test.network/ext/bc/C/rpc",
    gasPrice: undefined,
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey: process.env.SNOWTRACE_API_KEY || "UNSET",
    chainId: 43113,
    confirmations: 2 * DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "AVAX",
    linkToken: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    linkPriceFeed: "0x79c91fd4F8b3DaBEe17d286EB11cEE4D83521775", // LINK/AVAX
    functionsRouter: "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0",
    functionsDonId: "fun-avalanche-fuji-1",
    ccipRouter: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
    ccipChainSelector: "14767482510784806043",
    ccipTestToken: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
    uniswapV3Router: "0x6EE6e170636Aee203a4079498361936984ea64B3",
    weth9: "0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3",
    fundAmount: "1", // 1 LINK
  },
  arbitrumSepolia: {
    url: 'https://sepolia-rollup.arbitrum.io/rpc',
    gasPrice: undefined,
    accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    verifyApiKey: process.env.ARBITRUMSCAN_API_KEY || "UNSET",
    chainId: 421614,
    confirmations: DEFAULT_VERIFICATION_BLOCK_CONFIRMATIONS,
    nativeCurrencySymbol: "ETH",
    linkToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    linkPriceFeed: "0x3ec8593F930EA45ea58c968260e6e9FF53FC934f", // LINK/ETH
    functionsRouter: "0x65Dcc24F8ff9e51F10DCc7Ed1e4e2A61e6E14bd6",
    functionsDonId: "fun-arbitrum-sepolia-1",
    ccipRouter: "0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165",
    ccipChainSelector: "3478487238524512106",
    ccipTestToken: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E",
    uniswapV3Router: "0x101F443B4d1b059569D643917553c771E1b9663E",
    weth9: "0xE591bf0A0CF924A0674d7792db046B23CEbF5f34",
    fundAmount: "1", // 1 LINK
  }
}

module.exports = {
  networks,
}
