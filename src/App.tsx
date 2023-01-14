import { RecoilRoot } from "recoil";
import styled from "styled-components";

import { HowTo } from "./container/HowTo";
import { ImageContainer } from "./container/ImageContainer";
import { ResultContainer } from "./container/ResultContainer";

export default () => {
  return (
    <RecoilRoot>
      <RootContainer>
        <ImageContainer />
        <ResultContainer />
      </RootContainer>
      <HowTo />
    </RecoilRoot>
  );
};

const RootContainer = styled.main`
  background-color: #333;
  display: flex;
  height: 100%;
  min-height: 92vh;
  width: 100%;
  @media (max-width: 768px) {
    display: block;
    height: auto;
  }
`;
