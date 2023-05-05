// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the

const { waffle } = require("hardhat");

// global scope, and execute the script.
//npx hardhat run scripts/deploy.js --network localhost

async function main(){
  [signer1,signer2] = await ethers.getSigners();

  const Staking = await ethers.getContractFactory("Staking",signer1);

  staking = await Staking.deploy({
    value:ethers.utils.parseEther("10")
  })

  console.log("Staking contract deploy to:",staking.address, "by",signer1.address)

  const provider = waffle.provider
  let data;
  let transaction;
  let receipt;
  let block;
  let newUnLockDate;

  data = {value:ethers.utils.parseEther("0.5")}
  transaction = await staking.connect(signer2).stakeEther(30,data)

  data = {value:ethers.utils.parseEther("1")}
  transaction = await staking.connect(signer2).stakeEther(180,data)

  data = {value:ethers.utils.parseEther("1.5")}
  transaction = await staking.connect(signer2).stakeEther(180,data)

  data = {value:ethers.utils.parseEther("0.5")}
  transaction = await staking.connect(signer2).stakeEther(90,data)
  receipt = await transaction.wait();
  block = await provider.getBlock(receipt.blockNumber);
  newUnLockDate = block.timestamp - (60*60*24*100);
  await staking.connect(signer1).changeUnlockDate(3,newUnLockDate);

  data = {value:ethers.utils.parseEther("0.5")}
  transaction = await staking.connect(signer2).stakeEther(180,data)
  receipt = await transaction.wait();
  block = await provider.getBlock(receipt.blockNumber);
  newUnLockDate = block.timestamp - (60*60*24*100);
  await staking.connect(signer1).changeUnlockDate(3,newUnLockDate);
}

main().then(()=> process.exit(0)).catch((error)=>{
  console.error(error);
  process.exit(1);
})
// const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const unlockTime = currentTimestampInSeconds + 60;

//   const lockedAmount = hre.ethers.utils.parseEther("0.001");

//   const Lock = await hre.ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(
//     `Lock with ${ethers.utils.formatEther(
//       lockedAmount
//     )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
//   );
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
