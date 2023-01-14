import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  GlobalWorkerOptions,
  getDocument,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist";
import PdfJsWorker from "pdfjs-dist/build/pdf.worker.js?worker";

import Loading from "./Loading";
import { useRotateValue, usePageNumValue, useMaxPagesMutation } from "../store";

type Props = {
  src: string;
};
export default React.forwardRef<HTMLImageElement, Props>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderResults, setRenderResults] = useState<
    ({ url: string; rotate: number } | null)[]
  >([]);
  const [renderQueue, setRenderQueue] = useState<number[]>([]);
  const [pdfDoc, setPDFDoc] = useState<PDFDocumentProxy | null>(null);
  const [{ width, height }, setViewPort] = useState({ width: 0, height: 0 });
  const rotate = useRotateValue();
  const page = usePageNumValue();
  const [prevRotate, setPrevRotate] = useState(rotate);
  const setMaxPages = useMaxPagesMutation();

  const renderPage = useCallback(
    (page: PDFPageProxy) => {
      const container = containerRef.current;
      console.log(`Start rendering: ${page.pageNumber}`);
      if (!pdfDoc || !container) return;
      const fixedViewPort = page.getViewport({
        scale: 2.0,
        rotation: rotate * 90,
      });
      const canvas = document.createElement("canvas");
      setViewPort(fixedViewPort);
      canvas.height = fixedViewPort.height;
      canvas.width = fixedViewPort.width;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const task = page.render({
        canvasContext: ctx,
        viewport: fixedViewPort,
      });
      task.promise.then(() => {
        renderResults[page.pageNumber - 1] = {
          url: canvas.toDataURL(),
          rotate: rotate,
        };
        setRenderResults([...renderResults]);
        renderQueue.splice(
          renderQueue.findIndex((v) => v === page.pageNumber),
          1
        );
        setRenderQueue([...renderQueue]);
        console.log(`Finish rendering: ${page.pageNumber}`);
        if (renderQueue.length > 0) {
          pdfDoc.getPage(renderQueue[0]).then(renderPage);
        }
      });
    },
    [pdfDoc, renderResults, rotate]
  );

  useEffect(() => {
    if (!pdfDoc) {
      GlobalWorkerOptions.workerPort = new PdfJsWorker();
      const CMAP_URL = import.meta.env.DEV
        ? "../../node_modules/pdfjs-dist/cmaps/"
        : "./assets/cmaps/";
      getDocument({
        url: props.src,
        cMapUrl: CMAP_URL,
        cMapPacked: true,
        useWorkerFetch: false,
      }).promise.then((doc) => {
        setPDFDoc(doc);
        setRenderResults(new Array(doc.numPages).fill(null));
        setMaxPages(doc.numPages);
      });
    } else {
      if (rotate !== prevRotate) {
        setRenderResults(new Array(pdfDoc.numPages).fill(null));
      }

      // まだそのページを描画してない && そのページが描画中でない
      if (
        !renderResults[page - 1] &&
        renderQueue.findIndex((v) => v === page) < 0
      ) {
        setRenderQueue([...renderQueue, page]);
        if (renderQueue.length === 0) {
          setTimeout(() => {
            // レンダリング待ちが一つも無ければレンダリング開始
            pdfDoc.getPage(page).then(renderPage);
          });
        } else {
          // すでに進行中のレンダータスクがあればキューイング
          setRenderQueue([...renderQueue, page]);
        }
      }
    }
    setPrevRotate(rotate);
  }, [pdfDoc, renderQueue, renderResults, page, rotate]);

  return (
    <Container ref={containerRef}>
      {!renderResults[page - 1] ? (
        <DummyContainer width={width} height={height}>
          <Loading />
        </DummyContainer>
      ) : null}
      {renderResults.map((result, i) =>
        i === page - 1 && !!result ? (
          <Img key={`pdf-result-${i}`} ref={ref} src={result.url} />
        ) : null
      )}
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

type ViewPort = {
  width: number;
  height: number;
};

const DummyContainer = styled.div`
  max-width: 100vh;
  width: ${({ width }: ViewPort) => `${width}px`};
  height: ${({ height }: ViewPort) => `${height}px`};
`;

const Img = styled.img`
  max-width: 100%;
`;

function getViewPortScale(src: ViewPort, target: ViewPort) {
  if (src.width > src.height) {
    return src.width / target.width;
  } else {
    return src.height / target.height;
  }
}
