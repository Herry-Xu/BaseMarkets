const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts to mainnet...");

  // Get the Chainlink price feed address from env
  const chainlinkFeed = process.env.CHAINLINK_CONTRACT_ADDRESS;
  if (!chainlinkFeed) {
    throw new Error("CHAINLINK_CONTRACT_ADDRESS not set in environment");
  }

  // Deploy PredictionMarket with Chainlink price feed
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(chainlinkFeed);
  await predictionMarket.waitForDeployment();
  console.log(`PredictionMarket deployed to: ${await predictionMarket.getAddress()}`);

  // Wait for a few blocks for verification
  await predictionMarket.deploymentTransaction().wait(5);

  // Verify contract
  console.log("Verifying contract...");
  try {
    await hre.run("verify:verify", {
      address: await predictionMarket.getAddress(),
      constructorArguments: [chainlinkFeed],
    });
  } catch (error) {
    console.error("Verification error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 