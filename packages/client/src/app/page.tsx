"use client";

import { Footer } from "@/components/Footer";
import { WalletActionsMock } from "@/components/WalletActionsMock";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegCheckSquare, FaRegSquare } from "react-icons/fa";
import { useAccount, useBalance, useContractRead, useContractWrite } from "wagmi";
import { PREDICT_CONTRACT_ADDRESS } from "@/utils/constants";
import predictContractJson from "@/app/contracts/PredictionMarket.sol/PredictionMarket.json"
import { parseEther } from "ethers";

export default function Detail() {
  const [selectedOption, setSelectedOption] = useState("");
  const [betAmount, setBetAmount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const router = useRouter(); // useRouterフックの使用

  const account = useAccount();
  const balance = useBalance({
    address: account.address
  })

  // ベッティングした結果を取得する。
  const {
    data: games
  }: any = useContractRead({
    address: PREDICT_CONTRACT_ADDRESS,
    abi: predictContractJson.abi,
    functionName: 'getActivePredictions',
    args: [account.address],
  });

  // コントラクトにベッティングの情報を書き込む
  const {
    data: result,
    isSuccess,
    isError,
    isLoading,
    status,
    write,
    writeAsync
  } = useContractWrite({
    address: PREDICT_CONTRACT_ADDRESS,
    abi: predictContractJson.abi,
    functionName: 'registerAndPredict',
    args: [
      BigInt(4),
      BigInt(42143),
      BigInt(1711136100),
      1, // win
    ],
    value: parseEther(`${betAmount}`),
  });

  /**
   * predict ボタンを押した時の処理
   */
  const execute_predict = async() => {
    setShowPopup(true);
    console.log("status:", status)
    // write();
    await writeAsync();
    console.log("status:", status)
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  // 数値への変換を行うためのハンドラー関数
  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBetAmount(parseFloat(value)); // 空文字の場合は0をセット
  };

  useEffect(() => {
    console.log("games:", games)
    // ベッティングしたものが一件でもあれば遷移する。
    if(games != undefined) {
      if(games.length > 0) {
        setTimeout(() => {
          // router.push('/result');  
        }); 
      }
    }
  }, [games])

  useEffect(() => {
    if (isLoading) setPopupMessage('Please wait...');
  }, [isLoading])

  useEffect(() => {
    if (isSuccess) {
      setPopupMessage('Predict successful!');
      setTimeout(() => {
        router.push('/result');  // 成功時は指定のページに遷移
      }, 3000); // ポップアップを表示した後、少し遅延してから遷移
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      setPopupMessage('Predict failed. Try again.');
    }
  }, [isError])

  return (
    <div className="font-sans min-h-screen" style={{ background: 'linear-gradient(to right, #6a11cb 33%, #2575fc 66%)', opacity: 0.8 }}>
      <header className="bg-white/80 backdrop-blur-md shadow-md p-4">
        <div className="text-right">
          <WalletActionsMock />
        </div>
      </header>
      <div className="p-4 text-white">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-white shadow-md">
          This is a Stormers vs Edinburgh game
        </h1>
        <img
          className="mt-4 max-w-full h-auto object-contain rounded-lg shadow-lg"
          src="/main_rugby2.PNG"
          alt="rugby image"
        />
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="w-full mb-4 sm:mb-0 sm:mr-4">
              <label htmlFor="betAmount" className="block text-sm font-medium text-white">Bet Amount (ETH)</label>
              <input
                type="number"
                id="betAmount"
                value={betAmount}
                onChange={handleBetAmountChange}
                className="mt-1 py-3 px-4 shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 block w-full sm:text-lg border-2 border-gray-300 rounded-lg text-black placeholder-gray-400"
                placeholder="0.00"
                min="0"
                step="0.01" // 小数点以下の入力を許可
              />
            </div>

            <div className="text-center">
              <div className="text-sm font-medium">Your Balance:</div>
              <div className="text-sm font-medium">{balance.data?.formatted} ETH</div>
              
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <button
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-base font-medium rounded-lg shadow-md ${
              selectedOption === "Stormers"
                ? "bg-blue-700 hover:bg-blue-800"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            onClick={() => handleSelectOption("Stormers")}
          >
            {selectedOption === "Stormers" ? <FaRegCheckSquare size={20} /> : <FaRegSquare size={20} />}
            Stormers
          </button>
          <button
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 text-base font-medium rounded-lg shadow-md ${
              selectedOption === "Edinburgh"
                ? "bg-blue-700 hover:bg-blue-800"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
            onClick={() => handleSelectOption("Edinburgh")}
          >
            {selectedOption === "Edinburgh" ? <FaRegCheckSquare size={20} /> : <FaRegSquare size={20} />}
            Edinburgh
          </button>
        </div>
        <button 
          className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent rounded-lg shadow-md text-base font-medium bg-blue-700 hover:bg-blue-800"
          onClick={async() => await execute_predict()}
        >
          Predict
        </button>
        <Footer />
      </div>

      {showPopup && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow">
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
