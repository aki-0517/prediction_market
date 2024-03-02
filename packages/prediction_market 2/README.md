# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

## 動かし方

- ローカルでのシミュレーション

  ```bash
  npx hardhat functions-simulate
  ```

- コントラクトのデプロイ(Sepolia)

  ```bash
  npx hardhat deploy-game --subid 2030 --verify true --network ethereumSepolia
  ```

  ```bash
  Deploying SportsPredictionGame contract to ethereumSepolia

  __Compiling Contracts__
  Nothing to compile
  Please set the encryption password by running: npx env-enc set-pw
  If you do not know your password, delete the file /Users/harukikondo/git/prediction_market/packages/prediction_market 2/.env.enc and set a new password. (Note: This will cause you to lose all encrypted variables.)

  Creating gist...
  Gist created https://gist.github.com/mashharuki/6a78f4e32d398ddb9a136b55ea89ba63/raw

  PredictionMarket contract deployed to 0xF51E4C9D1b09df0bE1Bad943cEa2F124d9947034 on ethereumSepolia

  Consumer added to Functions subscription 2030
  Funded game contract with 1 LINK

  Verifying contract...
  Nothing to compile
  Successfully submitted source code for contract
  contracts/PredictionMarket.sol:PredictionMarket at 0xF51E4C9D1b09df0bE1Bad943cEa2F124d9947034
  for verification on the block explorer. Waiting for verification result...

  Successfully verified contract PredictionMarket on Etherscan.
  https://sepolia.etherscan.io/address/0xF51E4C9D1b09df0bE1Bad943cEa2F124d9947034#code
  Contract verified
  ```

- コントラクトのデプロイ(ArbitrumSepolia)

  ```bash
  npx hardhat deploy-game --subid 28 --verify true --network arbitrumSepolia
  ```

  ```bash
  Deploying SportsPredictionGame contract to arbitrumSepolia

  __Compiling Contracts__
  Nothing to compile
  Please set the encryption password by running: npx env-enc set-pw
  If you do not know your password, delete the file /Users/harukikondo/git/prediction_market/packages/prediction_market 2/.env.enc and set a new password. (Note: This will cause you to lose all encrypted variables.)

  Creating gist...
  Gist created https://gist.github.com/mashharuki/639138353b9944267e2325306d4e61ce/raw

  PredictionMarket contract deployed to 0x9eCE03F901dFC53544E4abf610b6813c6305f262 on arbitrumSepolia

  Consumer added to Functions subscription 28
  Funded game contract with 1 LINK

  ```

  デプロイしたコントラクト 

  [0x9eCE03F901dFC53544E4abf610b6813c6305f262](https://sepolia.arbiscan.io/address/0x9eCE03F901dFC53544E4abf610b6813c6305f262)