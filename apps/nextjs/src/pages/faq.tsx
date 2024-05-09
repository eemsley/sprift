import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { CircleBackground } from "~/components/CircleBackground";
import { Faqs } from "~/components/Faqs";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

const Faq: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sprift - Swipe, Shop, Save!</title>
        <meta name="description" content="Sprift" />
      </Head>
      <main>
        <Header />
        <div className="pb-16">
          <div className="bg-primary-500 flex transform flex-col justify-center overflow-hidden py-16 text-center">
            <div className="absolute left-0 top-0 ">
              <CircleBackground
                color={"#fff"}
                className={"animate-spin-slower w-96"}
              />
            </div>
            <div className="absolute bottom-0 right-0">
              <CircleBackground
                color={"#fff"}
                className={"animate-spin-slower w-96"}
              />
            </div>
            <div className="absolute left-0 top-0 ">
              <CircleBackground
                color={"#fff"}
                className={"animate-spin-slower w-96"}
              />
            </div>
            <div className="absolute bottom-0 right-0">
              <CircleBackground
                color={"#fff"}
                className={"animate-spin-slower w-96"}
              />
            </div>
            <h1 className="font-satoshi-bold z-0 text-3xl text-gray-900">
              Frequently Asked Questions
            </h1>
            <p className="text-md font-general-sans-medium mt-2 text-gray-700">
              For any further questions,{" "}
              <Link href="/contact" className="underline">
                please contact us
              </Link>
              .
            </p>
          </div>
          <Faqs />
        </div>
        <Footer />
      </main>
    </>
  );
};

export default Faq;
