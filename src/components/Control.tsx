import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { useMaxPagesValue, usePageNum, useRotate } from "../store";
import TurnArrow from "./TurnArrow";

type Props = {
  disabled?: boolean;
};

export default (props: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const maxPage = useMaxPagesValue();
  const [pageNum, setPageNum] = usePageNum();
  const { turnLeft, turnRight } = useRotate();

  const onClickPlus = useCallback(() => {
    if (pageNum < maxPage) {
      setPageNum((prev) => prev + 1);
    }
  }, [pageNum, maxPage]);

  const onClickMinus = useCallback(() => {
    if (pageNum > 1) {
      setPageNum((prev) => prev - 1);
    }
  }, [pageNum]);

  const onClickTurnLeft = useCallback(() => {
    turnLeft();
  }, []);

  const onClickTurnRight = useCallback(() => {
    turnRight();
  }, []);

  const changePage = (value: number) => {
    if (value <= 0) {
      setPageNum(1);
    } else if (value > maxPage) {
      setPageNum(maxPage);
    } else {
      setPageNum(value);
    }
  };

  const onKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      const input = event.target as HTMLInputElement;
      switch (event.key) {
        case "Enter": {
          const value = parseInt(input.value);
          changePage(value);
        }
      }
    },
    [maxPage]
  );

  const onBlur = useCallback(
    (event: React.FocusEvent) => {
      const input = event.target as HTMLInputElement;
      const value = parseInt(input.value);
      changePage(value);
    },
    [maxPage]
  );

  useEffect(() => {
    if (inputRef.current == null) return;
    inputRef.current.value = pageNum.toString();
  }, [pageNum]);

  return (
    <Container>
      <Button onClick={onClickTurnLeft} disabled={props.disabled}>
        <TurnArrow dir="left" />
      </Button>
      <Button onClick={onClickMinus} disabled={props.disabled}>
        -
      </Button>
      <Input
        ref={inputRef}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
        defaultValue={pageNum}
        disabled={props.disabled}
        type="number"
      />
      <Divider>/</Divider>
      <Input value={maxPage} disabled />
      <Button onClick={onClickPlus} disabled={props.disabled}>
        +
      </Button>
      <Button onClick={onClickTurnRight} disabled={props.disabled}>
        <TurnArrow dir="right" />
      </Button>
    </Container>
  );
};

const Container = styled.div`
  user-select: none;
  width: 100%;
  text-align: center;
  background-color: rgba(200, 200, 200, 0.8);
  position: fixed;
  bottom: 0;
`;

const Button = styled.button`
  height: 30px;
  width: 30px;
  size: 24px;
  font-weight: bold;
  border: 2px gray solid;
`;

const Input = styled.input`
  size: 24px;
  font-weight: bold;
  height: 24px;
  width: 30px;
`;

const Divider = styled.span`
  display: inline-block;
  margin: 0 4px 0;
  size: 24px;
  color: #ddd;
  font-weight: bold;
`;
