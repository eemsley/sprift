import { type NextPage } from "next";
import Head from "next/head";
// import { AdvisorCards } from "~/components/AdvisorCards";

import { CircleBackground } from "~/components/CircleBackground";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { TeamMemberCards } from "~/components/TeamMemberCards";


const Background = () => {
  return (
    <div>
      <div className="absolute left-[15%] top-[20%] -translate-x-1/2 -translate-y-1/2">
        <CircleBackground
          color="#fff"
          className={"animate-spin-slow w-[1000px]"}
        />
      </div>
      <div className="absolute left-[8%] top-[60%] -translate-x-1/2 -translate-y-1/2">
        <CircleBackground
          color="#fff"
          className={"animate-spin-slower w-[380px]"}
        />
      </div>
      <div className="absolute left-[88%] top-[78%] -translate-x-1/2 -translate-y-1/2">
        <CircleBackground
          color="#fff"
          className={"animate-spin-slow w-[1000px]"}
        />
      </div>
      <div className="absolute left-[95%] top-[40%] -translate-x-1/2 -translate-y-1/2">
        <CircleBackground
          color="#fff"
          className={"animate-spin-slower w-[380px] "}
        />
      </div>
    </div>
  );
};

const Team: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sprift - Swipe, Shop, Save!</title>
        <meta name="description" content="Sprift" />
      </Head>
      <Header />
      <main>
        <div className="isolate">
          <div className="bg-primary-500 flex items-center transform flex-col justify-center overflow-hidden py-40 text-center">
            <Background/>
            <Background/>
            <h1 className="z-0 font-satoshi-bold text-5xl text-gray-900">
              We Are Sprift
            </h1>
            <p className="z-0 w-2/3 font-general-sans-medium pt-5 text-xl text-gray-700">
              Our mission is to provide an online marketplace that offers an enjoyable and<br/>
              personalized thrifting experience to buyers and sellers by utilizing innovative<br/>
              technologies and fostering a community of passionate thrifters.
            </p>
          </div>
          <div>
            <h2 className="font-satoshi-bold pt-32 pb-8 text-center text-4xl text-gray-900">
            Meet the Team
          </h2>
          <TeamMemberCards />
          </div>
          
          {/* Add advisors later with below */}
          {/* <h2 className="font-satoshi-bold pt-8 pb-8 text-center text-3xl text-gray-900">
            Advisors
          </h2>
          <AdvisorCards/> */}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Team;
