import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getLuckyNumber,getTreasureChest } from "./rule";

const ScratchCard = () => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const isFullyRevealed = useRef(false);
  const isPrizeRevealed = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [luckyNumbers,setLuckyNumbers] = useState(getLuckyNumber(4));
  const [prizes, setPrizes] = useState({});
  const [amountWon, setAmountWon] = useState(0);

  useEffect(() => {
    const treasureChest = getTreasureChest(7, [...luckyNumbers], 1);
    setPrizes(treasureChest);
  }, [luckyNumbers]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 300;
    canvas.height = 200;

    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const resetGame = () => {
    // 重設遊戲狀態
    setLuckyNumbers(getLuckyNumber(4));
    setPrizes({});
    setRevealed(false);

    // 重設畫布
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 300;
    canvas.height = 200;
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    isPrizeRevealed.current=false;
    // 重置畫圖狀態
    isFullyRevealed.current = false;
    isDrawing.current = false;
  };

  const startScratching = () => {
      isDrawing.current = true;
  };

  const stopScratching = () => {    
    isDrawing.current = false;

    if (isFullyRevealed.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setRevealed(true);
      if(!isPrizeRevealed.current){
        isPrizeRevealed.current=true;
        revealPrize();
      }
      
    }
  };

  const handleScratch = (e) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    checkScratchProgress(ctx, canvas);
  };

  const checkScratchProgress = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let total = pixels.length / 4;
    let clearPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) clearPixels++;
    }

    const clearRatio = (clearPixels / total) * 100;
    if (clearRatio > 85) {
      isFullyRevealed.current = true; // 記錄「該清除」但不馬上執行
    }
  };

  const revealPrize = () => {
    let totalPrize = amountWon;
    luckyNumbers.forEach((num) => {
      if (prizes[num]) {
        totalPrize += prizes[num];
      }
    });
    setAmountWon(totalPrize);
  };

  return (
    <Container>
      <h2>獎金：${amountWon}</h2>
      <h3>你的鑰匙:{[...luckyNumbers].map(String).join(",")}</h3>
      <Card>
        <Background>
          <h3>寶箱：</h3>
          <PrizeGrid>
            {Object.keys(prizes).map((num,idx) => (
                <Prize key={num} oddRow={num % 2 === 0}>
                    <Money 
                      $large={prizes[num]?.toString().length > 5} 
                    >
                      ${prizes[num] || 0}
                    </Money>
                    <Number>{num}</Number>
                </Prize>
                ))}
          </PrizeGrid>
        </Background>

        <ScratchCanvas
          ref={canvasRef}
          onMouseDown={startScratching}
          onMouseUp={stopScratching}
          onMouseMove={handleScratch}
          onTouchStart={startScratching}
          onTouchEnd={stopScratching}
          onTouchMove={handleScratch}
        />
      </Card>
      {revealed && (
        <NextRoundButton onClick={resetGame}>繼續下一局</NextRoundButton>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Card = styled.div`
  position: relative;
  width: 300px;
  height: 200px;
  margin: auto;
  border: 2px solid #000;
  border-radius: 10px;
  overflow: hidden;
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PrizeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: px;
  max-width: 260px;
`;

const Prize = styled.div.attrs((props) => ({
  $oddRow: props.oddRow,
}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  margin: 5px;
  height: 50px;
`;

const Money = styled.span`
  font-weight: bold;
  color: green;
  font-size: ${(props) => (props.$large ? "14px" : "18px")}; 
  transform: ${(props) => (props.$large ? "scale(0.8)" : "scale(1)")}; 
  display: inline-block;
  transition: transform 0.2s ease-out; // 過渡效果
`;

const Number = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: blue;
`;

const ScratchCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
const NextRoundButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;
export default ScratchCard;
