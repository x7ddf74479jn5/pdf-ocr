import { useRef, useCallback } from "react";
import styled from "styled-components";

import { useImageLoad, useImageValue } from "../store";
import DnDArea from "../components/DnDArea";
import ImageCropper from "../components/ImageCropper";

const validateFileType = (mime: string) => {
  const acceptableFiletypeList = [
    "image/jpeg",
    "image/webp",
    "image/heic",
    "image/png",
    "image/svg+xml",
  ];
  if (acceptableFiletypeList.includes(mime)) {
    return "image";
  } else if (mime === "application/pdf") {
    return "pdf";
  }

  throw new Error("Invalid file");
};

const loadFile = async (file: File, onLoad: (...args: any[]) => void) => {
  const reader = new FileReader();
  const pdfOrImage = validateFileType(file.type);
  reader.onload = () => {
    onLoad(reader.result as string, pdfOrImage);
  };

  reader.readAsDataURL(file);
};

export const ImageContainer = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageSrc = useImageValue();
  const load = useImageLoad();

  const onClick = useCallback(async () => {
    const input = inputRef.current;
    if (!input) return;
    input.accept = "image/*,.pdf";
    input.click();
  }, []);

  const onChangeFile = useCallback(async (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files) return;
    const file = input.files[0];
    try {
      loadFile(file, load);
    } catch {
      alert("画像かPDFを選択してください");
    }
  }, []);

  const onDrop = useCallback(async (event: React.DragEvent) => {
    const files = event.dataTransfer.files;
    const file = files.item(0);
    if (!file) return;
    try {
      loadFile(file, load);
    } catch {
      alert("画像かPDFを選択してください");
    }
  }, []);

  return (
    <Container>
      {!imageSrc ? (
        <>
          <DnDArea onClick={onClick} onDrop={onDrop}>
            ここをクリックして画像かPDFを選択
          </DnDArea>
          <Input ref={inputRef} onChange={onChangeFile} />
        </>
      ) : (
        <ImageCropper />
      )}
    </Container>
  );
};

const Input = styled.input.attrs(() => ({
  type: "file",
  accept: "image/*",
}))`
  display: none;
`;

const Container = styled.div`
  flex: 5 1;
  @media (max-width: 768px) {
    height: 60vh;
    width: 100%;
    flex: initial;
  }
`;
