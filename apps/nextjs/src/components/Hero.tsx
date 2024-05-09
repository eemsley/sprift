/* eslint-disable @typescript-eslint/no-explicit-any */
import { useId } from "react";
import Image from "next/image";
import clsx from "clsx";

import { AppScreen } from "~/components/AppScreen";
import { AppStoreLink } from "~/components/AppStoreLink";
import { Container } from "~/components/Container";

function Phone() {
  return (
    <div className={clsx("relative aspect-[366/729]", "mx-auto max-w-[366px]")}>
      <div className="absolute inset-y-[calc(1/729*100%)] left-[calc(7/729*100%)] right-[calc(5/729*100%)] rounded-[calc(58/366*100%)/calc(58/729*100%)] shadow-2xl" />
      <div className="absolute left-[calc(23/366*100%)] top-[calc(23/729*100%)] grid h-[calc(686/729*100%)] w-[calc(318/366*100%)] transform grid-cols-1 overflow-hidden bg-neutral-50">
        <AppDemo />
      </div>
      <Image
        src={require("../images/dark-mode-phone-frame2.svg")}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full"
        unoptimized
        priority={true}
      />
    </div>
  );
}

function BackgroundIllustration(props: any) {
  const id = useId();

  return (
    <div {...props}>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="animate-spin-slow absolute inset-0 mt-2 h-full w-full"
      >
        <path
          d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M513 1025C230.23 1025 1 795.77 1 513"
          stroke={`url(#${id}-gradient-1)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-1`}
            x1="1"
            y1="513"
            x2="1"
            y2="1025"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#49BAB4" />
            <stop offset="1" stopColor="#49BAB4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="animate-spin-reverse-slower absolute inset-0 mt-2 h-full w-full"
      >
        <path
          d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M913 513c0 220.914-179.086 400-400 400"
          stroke={`url(#${id}-gradient-2)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-2`}
            x1="913"
            y1="513"
            x2="913"
            y2="913"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#49BAB4" />
            <stop offset="1" stopColor="#49BAB4" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function AppDemo() {
  return (
    <AppScreen>
      <AppScreen.Header>
        {/* <img
          src="https://firebasestorage.googleapis.com/v0/b/Sprift-a842f.appspot.com/o/main-screen-ss.png?alt=media&token=b8b2e0c9-b7a7-4dca-9d20-cc041482b9eb&_gl=1*9nol4c*_ga*MTg1ODE1ODY3OS4xNjgyOTk1NTk4*_ga_CW55HF8NVT*MTY4NTYwNzMzNC41LjEuMTY4NTYwNzQ1My4wLjAuMA.."
          alt=""
        /> */}
        {/* <Image
          src="/animations/swiper-deck.svg"
          alt="animated"
          height={812}
          width={375}
          unoptimized
        /> */}
        <Image src={require("../images/app-images/main-screen2.svg")} alt="" />
      </AppScreen.Header>
    </AppScreen>
  );
}

export function Hero() {
  return (
    <div className="py-15 from-primary-50 overflow-hidden bg-gradient-to-t to-neutral-50 sm:py-12 lg:pb-32 xl:pb-36">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <h1 className="font-satoshi-bold pb-6 text-6xl text-gray-800">
              Swipe. Shop. Save.
            </h1>
            {/* <h1 className="text-3xl font-itim-regular tracking-tight text-gray-800">
              Your Personalized{" "}
              <span className="relative whitespace-nowrap text-primary-600">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-[#b5e3e0]"
                  preserveAspectRatio="none"
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </svg>
                <span className="relative font-semibold">Thrifting</span>
              </span>{" "}
              Spree
            </h1> */}
            <p className="font-general-sans-regular mt-6 text-lg text-gray-600">
              Experience effortless thrifting as you swipe through our tailored
              recommendations! Discover pre-loved pieces that embrace and expand
              your personal style without the hassle of overwhelming racks.
            </p>
            <p className="font-general-sans-semibold mt-8 text-sm text-gray-900">
              Available soon on:
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-4">
              <AppStoreLink />
              <Image
                src="/google-play-store.png"
                alt="Download on Google Play Store"
                width={150}
                height={50}
              />
            </div>
          </div>
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <BackgroundIllustration className="stroke-primary-300/70 absolute left-1/2 top-4 h-[1026px] w-[1026px] -translate-x-1/3 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0" />
            <div className="-mx-4 h-[448px] px-9 [mask-image:linear-gradient(to_bottom,white_60%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-bottom-20 lg:-top-10 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
              <Phone />
            </div>
          </div>
          {/* <div className="relative mb-4 mt-0 lg:col-span-7 lg:mb-0 xl:col-span-6">
            <p className="text-center text-sm font-general-sans-regular font-semibold text-gray-900 lg:text-left">
              As featured in
            </p>
            <ul
              role="list"
              className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-10 gap-y-8 lg:mx-0 lg:justify-start"
            >
              {[
                ["Forbes", logoForbes],
                ["TechCrunch", logoTechcrunch],
                ["Wired", logoWired],
                ["CNN", logoCnn, "hidden xl:block"],
                ["BBC", logoBbc],
                ["CBS", logoCbs],
                ["Fast Company", logoFastCompany],
                ["HuffPost", logoHuffpost, "hidden xl:block"],
              ].map(([name, logo, className]) => (
                <li key={name} className={clsx("flex", className)}>
                  <Image src={logo} alt={name} className="h-8" unoptimized />
                </li>
              ))}
            </ul>
          </div> */}
        </div>
      </Container>
    </div>
  );
}
