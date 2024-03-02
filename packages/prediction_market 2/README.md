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

- コントラクトのデプロイ

  ```bash
  npx hardhat deploy-game --subid 2030 --verify true --network ethereumSepolia
  ```