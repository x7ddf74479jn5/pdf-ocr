import styled from "styled-components";

export const HowTo = () => (
  <Container>
    <h2>使い方</h2>
    <h3>概要</h3>
    <p>
      画像やPDFを読み込み、範囲を指定した場所の文字を読み取って文章データ化します。
    </p>
    <p>
      読み込んだ画像、PDF、及び結果は一切外部には送信しません。処理はすべてクライアントで完結します。
      ※処理中の通信は、文字解析ライブラリが文字を分析するときに必要なデータをダウンロードするために発生します。
    </p>
    <p>
      読み取った文章は、結果が表示されている部分をクリックするとコピペ出来ます。
    </p>
    <p>
      文字は、あらかじめ正しい向きになるようにしておいてください。現在、左回転や右回転、上下逆だと読み取れません。
    </p>
    <p>
      また、文字が上手く読み取れないときは画像サイズを工夫したり、一度に読み取る範囲を小さくすると上手く行くかもしれません。
    </p>
    <h3>手順</h3>
    <ul>
      <li>
        「ここをクリックして画像かPDFを選択」を押して画像かPDFファイルを選ぶ（PCの場合はドラッグアンドドロップでもOK）
      </li>
      <li>
        画像が表示されたら、読み取る範囲をタッチやドラッグアンドドロップで選択
      </li>
      <li>しばらくすると、「結果」という欄に読み取り結果が出てきます。</li>
    </ul>
    <h3>ソースコード</h3>
    <p>
      <a
        href="https://github.com/x7ddf74479jn5/pdf-ocr"
        about="_blank"
        rel="noopener noreferrer"
      >
        https://github.com/x7ddf74479jn5/pdf-ocr
      </a>
    </p>
  </Container>
);

const Container = styled.article`
  color: #fefefe;
  > a,
  a:visited {
    color: #99f;
  }
`;
