import { useCallback } from "react";
import {
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";

type PageNum = number;

const pageNumState = atom<PageNum>({
  key: "pageNumb",
  default: 1,
});

export const usePageNumValue = () => useRecoilValue(pageNumState);
export const usePageNum = () => useRecoilState(pageNumState);

type MaxPages = number;

const maxPagesState = atom<MaxPages>({
  key: "maxPages",
  default: 1,
});

export const useMaxPagesValue = () => useRecoilValue(maxPagesState);
export const useMaxPages = () => useRecoilState(maxPagesState);
export const useMaxPagesMutation = () => useSetRecoilState(maxPagesState);

type Rotate = number;

const rotateState = atom<Rotate>({
  key: "rotate",
  default: 0,
});

export const useRotateValue = () => useRecoilValue(rotateState);

export const useRotate = () => {
  const [rotate, set] = useRecoilState(rotateState);

  const turnLeft = useCallback(() => {
    const next = rotate - 1;
    set(next <= -1 ? 3 : next);
  }, []);

  const turnRight = useCallback(() => {
    const next = (rotate + 1) % 4;
    set(next);
  }, []);

  return { turnLeft, turnRight };
};

export type AcceptFileType = "image" | "pdf";

type FileType = AcceptFileType;

const fileTypeState = atom<FileType>({
  key: "fileType",
  default: "image",
});

export const useFileTypeValue = () => useRecoilValue(fileTypeState);

type ImageSrc = string | null;

const imageSrcState = atom<ImageSrc>({
  key: "imageSrc",
  default: null,
});

export const useImageValue = () => useRecoilValue(imageSrcState);

type ShowCopied = number;

const showCopiedState = atom<ShowCopied>({
  key: "showCopied",
  default: -1,
});

export const useShowCopiedState = () => useRecoilState(showCopiedState);

export const useShowCopied = () => {
  const set = useSetRecoilState(showCopiedState);

  const setShow = useCallback((index: number) => {
    set(index);
  }, []);

  return setShow;
};

export const useImageLoad = () => {
  const setImageSrc = useSetRecoilState(imageSrcState);
  const setFileType = useSetRecoilState(fileTypeState);

  const loadImage = useCallback((src: ImageSrc, fileType: FileType) => {
    setImageSrc(src);
    setFileType(fileType);
  }, []);

  return loadImage;
};

export const useOcrResultsValue = () => useRecoilValue(ocrResultsState);

export type OCRResult = {
  text: string;
  jobId: string;
  progress: number;
  isCompleted: boolean;
};

const ocrResultsState = atom<OCRResult[]>({
  key: "ocrResults",
  default: [],
});
export const useOcrResults = () => {
  const [ocrResults, setOcrResults] = useRecoilState(ocrResultsState);
  const getTargetAndOthers = (jobId: string) => {
    const target = ocrResults.find((r) => r.jobId === jobId);
    const others = ocrResults.filter((r) => r.jobId !== jobId);
    return { target, others };
  };

  const startJob = useCallback((jobId: string) => {
    setOcrResults((prev) => [
      ...prev,
      {
        jobId,
        isCompleted: false,
        progress: 0,
        text: "",
      },
    ]);
  }, []);

  const updateProgress = useCallback((jobId: string, progress: number) => {
    const { target, others } = getTargetAndOthers(jobId);
    if (!target) return;
    const newOcrResult = {
      ...target,
      progress,
    };
    setOcrResults([...others, newOcrResult]);
  }, []);

  const filterOKResult = useCallback((jobId: string) => {
    const { others } = getTargetAndOthers(jobId);
    setOcrResults([...others]);
  }, []);

  const completeJob = useCallback((jobId: string, text: string) => {
    const { target, others } = getTargetAndOthers(jobId);
    if (!target) return;
    const newOcrResult = {
      ...target,
      text,
      isCompleted: true,
    };
    setOcrResults([...others, newOcrResult]);
  }, []);

  const addResult = useCallback((newResult: OCRResult) => {
    setOcrResults([...ocrResults, newResult]);
  }, []);

  return {
    ocrResults,
    startJob,
    updateProgress,
    filterOKResult,
    completeJob,
    addResult,
  };
};
