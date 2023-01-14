import styled from "styled-components";
import copy from "clipboard-copy";

import ResultView from "../components/ResultView";
import { useOcrResultsValue, useShowCopiedState } from "../store";
import { useState } from "react";

export const ResultContainer = () => {
  const [timer, setTimer] = useState(-1);
  const [showCopied, setShowCopied] = useShowCopiedState();
  const ocrResults = useOcrResultsValue();

  return (
    <Container>
      <ResultTitle>結果</ResultTitle>
      {ocrResults.map((result, i) => (
        <>
          <ResultView
            onClick={(text) => {
              if (timer !== -1) {
                clearTimeout(timer);
              }
              copy(text);
              setShowCopied(i);
              setTimer(
                setTimeout(() => {
                  setShowCopied(-1);
                  setTimer(-1);
                }, 1000)
              );
            }}
            isComplete={result.isCompleted}
            progress={result.progress}
            text={result.text}
            key={`result-${i}`}
          />
          {showCopied === i ? (
            <Overlay key={`overlay-${i}`}>コピーしました</Overlay>
          ) : null}
        </>
      ))}
    </Container>
  );
};

const ResultTitle = styled.h2`
  margin-top: 3px;
  font-size: 15px;
  color: #777;
  font-weight: bold;
  text-align: center;
`;

const Container = styled.div`
  background-color: #efefef;
  justify-content: center;
  min-width: 100px;
  max-width: 200px;
  flex-grow: 1;
  overflow-y: scroll;
  @media (max-width: 768px) {
    flex: initial;
    max-width: 100%;
    min-width: 0px;
    width: 100%;
    height: 20%;
  }
`;

const Overlay = styled.div`
  user-select: none;
  background-color: rgba(128, 128, 128, 0.3);
  color: white;
  font-weight: bold;
  text-align: center;
  width: 100%;
  margin-top: -15%;
  margin-bottom: 4px;
  @media (max-width: 768px) {
    background-color: rgba(200, 200, 200, 1);
    color: #777;
    font-size: 27px;
    height: 30px;
    margin-top: 0;
    padding-bottom: 10px;
    position: fixed;
    bottom: 0;
  }
`;
