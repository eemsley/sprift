import { type NextPage } from "next";
import Head from "next/head";
import { BlogPosts } from "~/components/BlogPosts";

// import { BlogPosts } from "~/components/BlogPosts";
import { CircleBackground } from "~/components/CircleBackground";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

const Blog: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sprift - Swipe, Shop, Save!</title>
        <meta name="description" content="Sprift" />
      </Head>
      <main>
        <Header />
        <div className="pb-16">
          <div className="bg-gray-900 flex transform flex-col justify-center overflow-hidden py-16 text-center">
            <div className="absolute left-0 top-0 ">
                <CircleBackground color={"#49bab4"} className={"animate-spin-slower w-96"}/>
            </div>
            <div className="absolute right-0 bottom-0">
                <CircleBackground color={"#49bab4"} className={"animate-spin-slower w-96"}/>
            </div>
            <h1 className="font-satoshi-bold z-0 text-4xl text-primary-100">
              Sprift Blog
            </h1>
          </div>
          <BlogPosts />
        </div>

        <Footer />
      </main>
    </>
  );
};

export default Blog;
