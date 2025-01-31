import styled from "styled-components";
import ScratchCard from "./ScratchCard";

const Container = styled.div`
  text-align: center;
  background-color: red;  /* 設定紅色背景 */
  width: 100vw;  /* 讓它覆蓋整個視窗寬度 */
  height: 100vh; /* 讓它覆蓋整個視窗高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: white;
  font-size: 24px;
`;

function App() {
  return (
    <Container>
      <Title>刮刮樂</Title>
      <ScratchCard />
    </Container>
  );
}

export default App;
