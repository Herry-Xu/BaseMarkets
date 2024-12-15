const hre = require("hardhat");

async function main() {
  // Deploy PriceFeed first
  const PriceFeed = await hre.ethers.getContractFactory("ChainlinkPriceFeed");
  const priceFeed = await PriceFeed.deploy(
    "0x6550bc2301936011c1334555e62A87705A81C12C" // BTC/USD price feed on Base
  );
  await priceFeed.deployed();
  console.log("PriceFeed deployed to:", priceFeed.address);

  // Deploy PredictionMarket
  const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy(priceFeed.address);
  await predictionMarket.deployed();
  console.log("PredictionMarket deployed to:", predictionMarket.address);

  // Set up initial configuration
  const [owner, admin, operator] = await ethers.getSigners();
  
  await predictionMarket.setAdmin(admin.address);
  await predictionMarket.connect(admin).setOperator(operator.address);
  
  // Verify contracts on Etherscan
  await hre.run("verify:verify", {
    address: priceFeed.address,
    constructorArguments: [
      "0x6550bc2301936011c1334555e62A87705A81C12C"
    ],
  });

  await hre.run("verify:verify", {
    address: predictionMarket.address,
    constructorArguments: [priceFeed.address],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 