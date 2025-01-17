import { Head, Html, Main, NextScript } from "next/document";

const Document = () => {
  return (
    <Html className="h-full bg-gray-50 antialiased" lang="en">
      <Head>
        <script
          async
          defer
          data-domain="thesprift.com"
          src="https://plausible.io/js/script.js"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className="flex h-full flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
