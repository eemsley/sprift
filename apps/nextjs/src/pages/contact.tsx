import { type NextPage } from "next";
import Head from "next/head";

import ContactForm from "~/components/ContactForm";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

const Contact: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sprift - Swipe, Shop, Save!</title>
        <meta name="description" content="Sprift" />
      </Head>
      <div className="lg:h-screen">
        <Header />
        <main>
          <div className="isolate px-6 py-3 sm:py-4 lg:px-8 bg-gradient-to-t from-[#b5e3df] to-neutral-50">
            {/* <div
              className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]"
              aria-hidden="true"
            >
              <div
                className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-500 to-primary-700 opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div> */}
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-satoshi-medium font-bold tracking-tight text-gray-900 sm:text-4xl">
                Contact us
              </h2>
              <p className="mt-2 font-general-sans-regular text-lg leading-8 text-gray-600">
                Send us a message by filling out the form below.
              </p>
            </div>
            <ContactForm />
            <div className="p-3"/>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
