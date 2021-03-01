import { getInitialProps } from "@expo/next-adapter/document";
import Document, { Head, Main, NextScript, Html } from "next/document";
import React from "react";

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="icon"
            type="image/png"
            href={require("../assets/noise-rounded-64.png")}
          />
          <link
            rel="icon"
            type="image/png"
            href={require("../assets/noise-rounded-64.png")}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

CustomDocument.getInitialProps = getInitialProps;
