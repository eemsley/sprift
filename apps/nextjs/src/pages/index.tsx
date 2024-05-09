import { type NextPage } from "next";
import Head from "next/head";

import BetaBanner from "~/components/BetaBanner";
import { CallToAction } from "~/components/CallToAction";
// import { Faqs } from "~/components/Faqs";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Hero } from "~/components/Hero";
import { PrimaryFeatures } from "~/components/PrimaryFeatures";
import { SecondaryFeatures } from "~/components/SecondaryFeatures";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sprift - Swipe, Shop, Save!</title>
        <meta name="description" content="Sprift" />
      </Head>
      <BetaBanner />
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default Home;
