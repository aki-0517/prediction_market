const path = require("path")
const process = require("process")
const { networks } = require("../networks")
const { SubscriptionManager, SecretsManager, createGist } = require("@chainlink/functions-toolkit")

const generateEncryptedGist = async (secrets, githubApiToken, networkConfig) => {
  const provider = new ethers.providers.JsonRpcProvider(networkConfig.url)
  const signer = new ethers.Wallet(networkConfig.accounts[0], provider)

  const secretsManager = new SecretsManager({
    signer: signer,
    functionsRouterAddress: networkConfig.functionsRouter,
    donId: networkConfig.functionsDonId,
  })
  await secretsManager.initialize()

  const encryptedSecretsObj = await secretsManager.encryptSecrets(secrets)

  console.log(`Creating gist...`)
  if (!githubApiToken) throw new Error("githubApiToken not provided - check your environment variables")

  const gistURL = await createGist(githubApiToken, JSON.stringify(encryptedSecretsObj))
  console.log(`Gist created ${gistURL}`)
  const encryptedSecretsUrls = await secretsManager.encryptSecretsUrls([gistURL])

  return encryptedSecretsUrls
}

const addConsumerToSubscription = async (subscriptionId, consumerAddress, networkConfig) => {
  const provider = new ethers.providers.JsonRpcProvider(networkConfig.url)
  const signer = new ethers.Wallet(networkConfig.accounts[0], provider)

  const subscriptionManager = new SubscriptionManager({
    signer,
    linkTokenAddress: networkConfig.linkToken,
    functionsRouterAddress: networkConfig.functionsRouter,
  })
  await subscriptionManager.initialize()

  const addConsumerTxReceipt = await subscriptionManager.addConsumer({
    subscriptionId,
    consumerAddress,
  })
  console.log(`\nConsumer added to Functions subscription ${subscriptionId}`)

  return addConsumerTxReceipt
}

task("deploy-game", "Deploys the SportsPredictionGame contract")
  .addParam("subid", "Billing subscription ID used to pay for Functions requests")
  .addOptionalParam("verify", "Set to true to verify client contract", false, types.boolean)
  .addOptionalParam(
    "configpath",
    "Path to Functions request config file",
    `${__dirname}/../Functions-request-config.js`,
    types.string
  )
  .setAction(async (taskArgs) => {
    if (network.name === "hardhat") {
      throw Error(
        'This command cannot be used on a local hardhat chain.  Specify a valid network or simulate a SportsPredictionGame request locally with "npx hardhat functions-simulate".'
      )
    }

    console.log(`Deploying SportsPredictionGame contract to ${network.name}`)

    console.log("\n__Compiling Contracts__")
    await run("compile")

    const networkConfig = networks[network.name]

    const requestConfig = require(path.isAbsolute(taskArgs.configpath)
      ? taskArgs.configpath
      : path.join(process.cwd(), taskArgs.configpath))

    const encryptedSecrets = await generateEncryptedGist(
      requestConfig.secrets,
      process.env.GITHUB_API_TOKEN,
      networkConfig
    )

    const donIdBytes32 = ethers.utils.formatBytes32String(networkConfig.functionsDonId)

    const deployParams = {
      oracle: networkConfig.functionsRouter,
      donId: donIdBytes32,
      subscriptionId: taskArgs.subid,
      secrets: encryptedSecrets,
      source: requestConfig.source,
    }

    const gameContractFactory = await ethers.getContractFactory("PredictionMarket")
    const gameContract = await gameContractFactory.deploy(deployParams)

    console.log(`\nPredictionMarket contract deployed to ${gameContract.address} on ${network.name}`)

    await addConsumerToSubscription(taskArgs.subid, gameContract.address, networkConfig)
    // LINKトークンを送金
    const linkToken = await ethers.getContractAt("LinkToken", networkConfig.linkToken)
    await linkToken.transfer(gameContract.address, ethers.utils.parseEther(networkConfig.fundAmount))

    console.log(`\Funded game contract with ${networkConfig.fundAmount} LINK`)

    const verifyContract = taskArgs.verify

    if (verifyContract && !!networkConfig.verifyApiKey && networkConfig.verifyApiKey !== "UNSET") {
      try {
        console.log("\nVerifying contract...")
        await gameContract.deployTransaction.wait(Math.max(6 - networkConfig.confirmations, 0))
        await run("verify:verify", {
          address: gameContract.address,
          constructorArguments: [deployParams],
        })
        console.log("Contract verified")
      } catch (error) {
        if (!error.message.includes("Already Verified")) {
          console.log("Error verifying contract.  Delete the build folder and try again.")
          console.log(error)
        } else {
          console.log("Contract already verified")
        }
      }
    } else if (verifyContract) {
      console.log(
        "\nPOLYGONSCAN_API_KEY, ETHERSCAN_API_KEY or SNOWTRACE_API_KEY is missing. Skipping contract verification..."
      )
    }
  })
