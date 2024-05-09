import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import blogs from "public/blogs";

import { CircleBackground } from "~/components/CircleBackground";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

const BlogPage: NextPage = () => {
  const router = useRouter();
  const { post } = router.query;
  const blog = blogs.find((blog) => blog.key === post);
  if (!blog) {
    return (
      <>
        <Head>
          <title>Sprift - Swipe, Shop, Save!</title>
          <meta name="description" content="Sprift" />
        </Head>
        <main>
          <Header />
          <div className="py-16 pl-12 text-lg">404 page not found</div>
        </main>
      </>
    );
  }

  // const lines = blog.post.split("\n");

  return (
    <>
      <Head>
        <title>Sprift - Swipe, Shop, Save!</title>
        <meta name="description" content="Sprift" />
      </Head>
      <main>
        <Header />
        <div className="pb-16">
          <div className="bg-netural-50 flex transform flex-col justify-center overflow-hidden py-16 text-center">
            <div className="absolute left-0 top-0 ">
              <CircleBackground
                color={"#49bab4"}
                className={"animate-spin-slower w-96"}
              />
            </div>
            <div className="absolute bottom-0 right-0">
              <CircleBackground
                color={"#49bab4"}
                className={"animate-spin-slower w-96"}
              />
            </div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="font-satoshi-bold text-primary-500 z-0 w-2/3 text-4xl">
                {blog.title}
              </h1>
              <h2 className="font-general-sans-regular text-md pt-8 italic text-gray-500">
                {blog.date}
              </h2>
            </div>
          </div>

          <div className="flex justify-center">
            <p className="font-general-sans-regular text-lg w-2/3 text-center text-gray-600">
              <div>
                Happy National Thrift Shop Day! 🎉 At Sprift, we&apos;re not
                just about selling secondhand clothing; we&apos;re about
                celebrating the rich tapestry of history that thrifting weaves.
                Today, let&apos;s take a moment to appreciate the transformative
                journey of thrift shopping.
                <br />
                <br /> The concept of repurposing and reusing old clothes has
                deep roots. As early as the 1800s, pawnshops across America were
                already in the business of collecting and reselling used
                clothing. However, this practice wasn&apos;t always viewed in a
                positive light. There was a time when wearing pre-owned clothes
                was stigmatized, seen as a sign of financial struggle rather
                than a conscious choice.
                <br />
                <br /> The tides began to turn during the Great Depression. With
                economic hardships making new clothing purchases a luxury many
                couldn&apos;t afford, thrift shopping became a necessity. It was
                during this era that iconic stores like Goodwill and Salvation
                Army planted their seeds. But the question remains: how did
                thrift shops transition from being a last resort to a beloved
                part of our modern culture?
                <br />
                <br /> By 1935, the nation saw the establishment of nearly 100
                Goodwill stores. These thrift shops became beacons of hope
                during the challenging times of the Great Depression and World
                War II, offering affordable alternatives to full-priced stores.
                As the years rolled on, the allure of thrift shops expanded
                beyond mere affordability. They became treasure troves for
                vintage enthusiasts and those hunting for unique finds.
                <br />
                <br /> The 1950s marked another pivotal moment in the thrift
                shop narrative. High-end consignment shops began to sprout,
                attracting a wealthier clientele and cementing the idea that
                &quot;vintage&quot; wasn&apos;t just old – it was chic.
                <br />
                <br />
              </div>
              <h2 className="font-general-sans-bold text-center pb-3 text-xl">
                The Modern Thrift Movement<br/>
              </h2>
              <div>
                Fast forward to recent years, and the thrift shop narrative has
                taken another profound turn. As society becomes increasingly
                aware of the environmental toll of fast fashion, thrift shops
                have emerged as champions of sustainability. They offer a
                platform for individuals to express their unique style while
                making eco-friendly choices.
                <br />
                <br />
                The numbers speak for themselves. The secondhand market, once a
                niche segment, is now projected to reach over $60 billion by
                2025. Major cities around the world boast thriving thrift
                districts, and online platforms dedicated to pre-loved items are
                witnessing exponential growth.
                <br />
                <br />
                Celebrities and influencers are proudly flaunting thrifted
                outfits, further propelling the industry into mainstream
                consciousness.
                <br />
                <br />
                Moreover, the appeal of thrift shops extends beyond mere
                affordability. They challenge the rampant culture of
                consumerism, offering a platform for individuals to not only
                express their unique style but also make eco-friendly choices.
                Every item purchased secondhand means one less new item
                produced, reducing the demand on resources and energy.
                <br />
                <br />
                The meteoric rise in thrift shopping&apos;s popularity isn&apos;t just a
                fleeting trend; it&apos;s a reflection of a global paradigm shift. As
                consumers, we&apos;re becoming more discerning, prioritizing the
                health of our planet over fast and disposable fashion.
                Thrifting, in this context, isn&apos;t just an act of shopping; it&apos;s
                a statement, a commitment to a more sustainable and conscious
                future.
                <br />
                <br />
              </div>
              <h2 className="font-general-sans-bold text-center pb-3 text-xl">
                Pioneering the Future of Thrifting
              </h2>
              <div>
                While we deeply respect and honor the rich history of thrifting,
                we believe that the most exciting chapter is yet to be written.
                At Sprift, we&apos;re on a mission to revolutionize secondhand
                clothing. We&apos;re not just looking back; we&apos;re forging ahead,
                shaping the future of thrifting. Join us in this journey.
                Celebrate National Thrift Shop Day by embracing the sustainable,
                creative, and transformative world of thrift shopping. With
                Sprift, the future of thrifting is now.
              </div>
              {/* {lines.map((line, index) => (
                <div key={index}>{line}</div>
              ))} */}
            </p>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
};

export default BlogPage;
