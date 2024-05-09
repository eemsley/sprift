import Image from "next/image";
import { AppStoreLink } from "~/components/AppStoreLink";
import { CircleBackground } from "~/components/CircleBackground";
import { Container } from "~/components/Container";

export function CallToAction() {
  return (
    <section
      id="get-free-shares-today"
      className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
    >
      <div className="absolute left-10 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground color="#7acdc8" className="animate-spin-slower" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md text-center">
          <h2 className="text-3xl font-satoshi-bold font-medium tracking-tight text-primary-300 sm:text-4xl">
            Discover your style today
          </h2>
          <p className="mt-4 text-lg font-general-sans-regular text-gray-200">
            It only takes 30 seconds to sign up. Download the Sprift app and create
            an account today! We&apos;ll curate a selection of personalized
            fashion recommendations guaranteed to enhance your wardrobe.
          </p>
          <p className="mt-6 text-sm font-general-sans-light text-gray-200">Available soon on:</p>
          <div className="mt-2 flex justify-center gap-x-6">
            <AppStoreLink color="white" />
            <Image
                src="/google-play-store.png"
                alt="Download on Google Play Store"
                width={150}
                height={50}
              />
          </div>
        </div>
      </Container>
    </section>
  );
}
