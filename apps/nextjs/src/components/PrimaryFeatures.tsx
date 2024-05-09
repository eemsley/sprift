/* eslint-disable @typescript-eslint/no-explicit-any,  @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, react/no-unescaped-entities */
import { Fragment, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useDebouncedCallback } from "use-debounce";

import { AppScreen } from "~/components/AppScreen";
import { CircleBackground } from "~/components/CircleBackground";
import { Container } from "~/components/Container";
import { PhoneFrame } from "~/components/PhoneFrame";

const MotionAppScreenBody = motion(AppScreen.Body);

interface Features {
  name: string;
  description: string;
  icon: React.FC<any>;
  screen: React.FC<any>;
}

const features: Features[] = [
  {
    name: "Swipe. Shop. Save.",
    description:
      " Start Sprifting today! Simply swipe right to like or left to dislike listings to unlock unique recommendations tailored exclusively for you! The more you engage, the more Sprift can curate your style and help you build a wardrobe you love. Swipe, shop, save - welcome to Sprift!",
    icon: DeviceTouchIcon,
    screen: MainScreen,
  },
  {
    name: "Thrifters' Social Network",
    description:
      "Embrace the community spirit and connect with like-minded buyers and sellers. Follow your favorite sellers, gain followers, and explore a vibrant network of thrifting enthusiasts. Share your finds, inspire others, and embark on a social thrifting adventure.",
    icon: DeviceUserIcon,
    screen: AccountScreen,
  },
  {
    name: "Revitalize Your Closet",
    description:
      "Recycle and sell your unwanted clothing by seamlessly uploading it to Sprift. Then browse through our curated assortment of thrifted items to cultivate a sustainable and budget-friendly wardrobe that reflects you.",
    icon: DeviceNotificationIcon,
    screen: CreateListingScreen,
  },
  
    {
    name: "Instant Buyer-Seller Chat",
    description:
      "Integrated real-time chat feature lets you connect with sellers effortlessly. Ask questions about the item's condition, measurements, or simply exchange a friendly chat. Building connections and trust within our thrifting community has never been easier. Enjoy a delightful, interactive shopping experience!",
    icon: DeviceListIcon,
    screen: ChatScreen,
  },
];

function DeviceUserIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 23a3 3 0 100-6 3 3 0 000 6zm-1 2a4 4 0 00-4 4v1a2 2 0 002 2h6a2 2 0 002-2v-1a4 4 0 00-4-4h-2z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v24a4.002 4.002 0 01-3.01 3.877c-.535.136-.99-.325-.99-.877s.474-.98.959-1.244A2 2 0 0025 28V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 001.041 1.756C8.525 30.02 9 30.448 9 31s-.455 1.013-.99.877A4.002 4.002 0 015 28V4z"
        fill="#A3A3A3"
      />
    </svg>
  );
}

function DeviceNotificationIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#A3A3A3"
      />
      <path
        d="M9 8a2 2 0 012-2h10a2 2 0 012 2v2a2 2 0 01-2 2H11a2 2 0 01-2-2V8z"
        fill="#737373"
      />
    </svg>
  );
}

function DeviceTouchIcon(props) {
  const id = useId();

  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <defs>
        <linearGradient
          id={`${id}-gradient`}
          x1={14}
          y1={14.5}
          x2={7}
          y2={17}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#737373" />
          <stop offset={1} stopColor="#D4D4D4" stopOpacity={0} />
        </linearGradient>
      </defs>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v13h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h4v2H9a4 4 0 01-4-4V4z"
        fill="#A3A3A3"
      />
      <path
        d="M7 22c0-4.694 3.5-8 8-8"
        stroke={`url(#${id}-gradient)`}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 20l.217-5.513a1.431 1.431 0 00-2.85-.226L17.5 21.5l-1.51-1.51a2.107 2.107 0 00-2.98 0 .024.024 0 00-.005.024l3.083 9.25A4 4 0 0019.883 32H25a4 4 0 004-4v-5a3 3 0 00-3-3h-5z"
        fill="#A3A3A3"
      />
    </svg>
  );
}

function DeviceListIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <circle cx={11} cy={14} r={2} fill="#171717" />
      <circle cx={11} cy={20} r={2} fill="#171717" />
      <circle cx={11} cy={26} r={2} fill="#171717" />
      <path
        d="M16 14h6M16 20h6M16 26h6"
        stroke="#737373"
        strokeWidth={2}
        strokeLinecap="square"
      />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
    </svg>
  );
}

const maxZIndex = 2147483647;

const bodyVariantBackwards = {
  opacity: 0.4,
  scale: 0.8,
  zIndex: 0,
  filter: "blur(4px)",
  transition: { duration: 0.4 },
};

const bodyVariantForwards = (custom) => ({
  y: "100%",
  zIndex: maxZIndex - custom.changeCount,
  transition: { duration: 0.4 },
});

const bodyAnimation = {
  initial: "initial",
  animate: "animate",
  exit: "exit",
  variants: {
    initial: (custom) =>
      custom.isForwards ? bodyVariantForwards(custom) : bodyVariantBackwards,
    animate: (custom) => ({
      y: "0%",
      opacity: 1,
      scale: 1,
      zIndex: maxZIndex / 2 - custom.changeCount,
      filter: "blur(0px)",
      transition: { duration: 0.4 },
    }),
    exit: (custom) =>
      custom.isForwards ? bodyVariantBackwards : bodyVariantForwards(custom),
  },
};

function ChatScreen({ custom, animated = false }: any) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenBody {...(animated ? { ...bodyAnimation, custom } : {})}>
        {/* <img
          src="https://firebasestorage.googleapis.com/v0/b/Sprift-a842f.appspot.com/o/style-quiz-screen-ss.png?alt=media&token=0a846c2e-9a9c-4fbd-aaba-2b781bf5b21e&_gl=1*1vcgfff*_ga*MTg1ODE1ODY3OS4xNjgyOTk1NTk4*_ga_CW55HF8NVT*MTY4NTYwNzMzNC41LjEuMTY4NTYwNzU3NC4wLjAuMA.."
          alt=""
        /> */}
        <Image
          src={require("../images/app-images/chat-screen.svg")}
          alt=""
        />
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function AccountScreen({ custom, animated = false }: any) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenBody {...(animated ? { ...bodyAnimation, custom } : {})}>
        {/* <img
          src="https://firebasestorage.googleapis.com/v0/b/Sprift-a842f.appspot.com/o/style-quiz-screen-ss-2.png?alt=media&token=44108c62-cd28-4ec6-9bee-418ab09de61e&_gl=1*e98e3n*_ga*MTg1ODE1ODY3OS4xNjgyOTk1NTk4*_ga_CW55HF8NVT*MTY4NTYwNzMzNC41LjEuMTY4NTYwNzYyOS4wLjAuMA.."
          alt=""
        /> */}
        <Image
          src={require("../images/app-images/account-screen.svg")}
          alt=""
        />
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function MainScreen({ custom, animated = false }: any) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenBody {...(animated ? { ...bodyAnimation, custom } : {})}>
        {/* <img
          src="https://firebasestorage.googleapis.com/v0/b/Sprift-a842f.appspot.com/o/welcome-screen-ss.png?alt=media&token=5d335382-071b-4c98-b710-1a4bfa6b1f81&_gl=1*l06vzo*_ga*MTg1ODE1ODY3OS4xNjgyOTk1NTk4*_ga_CW55HF8NVT*MTY4NTYwNzMzNC41LjEuMTY4NTYwNzY0MC4wLjAuMA.."
          alt=""
        /> */}
        <Image
          src={require("../images/app-images/main-screen.svg")}
          alt=""
        />
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function CreateListingScreen({ custom, animated = false }: any) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenBody {...(animated ? { ...bodyAnimation, custom } : {})}>
        <Image
          src={require("../images/app-images/create-listing-screen.svg")}
          alt=""
        />
      </MotionAppScreenBody>
    </AppScreen>
  );
}

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

function FeaturesDesktop() {
  const [changeCount, setChangeCount] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const prevIndex = usePrevious(selectedIndex);
  const isForwards = prevIndex === undefined ? true : selectedIndex > prevIndex;

  const onChange = useDebouncedCallback(
    (selectedIndex) => {
      setSelectedIndex(selectedIndex);
      setChangeCount((changeCount) => changeCount + 1);
    },
    100,
    { leading: true },
  );

  return (
    <Tab.Group
      as="div"
      className="grid grid-cols-12 items-center gap-8 lg:gap-16 xl:gap-24"
      selectedIndex={selectedIndex}
      onChange={onChange}
      vertical
    >
      <Tab.List className="relative z-10 order-last col-span-6 space-y-6">
        {features.map((feature, featureIndex) => (
          <div
            key={feature.name}
            className="relative rounded-2xl transition-colors hover:bg-gray-800/30"
          >
            {featureIndex === selectedIndex && (
              <motion.div
                layoutId="activeBackground"
                className="absolute inset-0 bg-gray-800"
                initial={{ borderRadius: 16 }}
              />
            )}
            {/* <div className="relative z-10 p-8"> */}
            {/* <feature.icon className="h-8 w-8" />
              <h3 className="mt-6 text-lg font-satoshi-bold text-primary-50">
                <Tab className="text-left [&:not(:focus-visible)]:focus:outline-none">
                  <span className="absolute inset-0 rounded-2xl" />
                  {feature.name}
                </Tab>
              </h3> */}
            {featureIndex === selectedIndex ? (
              <div className="relative z-10 p-8">
                <feature.icon className="h-8 w-8" />
                <h3 className="font-satoshi-bold text-primary-200 mt-6 text-lg">
                  <Tab className="text-left [&:not(:focus-visible)]:focus:outline-none">
                    <span className="absolute inset-0 rounded-2xl" />
                    {feature.name}
                  </Tab>
                </h3>
                <p className="font-general-sans-medium mt-2 text-sm text-gray-400">
                  {feature.description}
                </p>
              </div>
            ) : (
              <div className="flex flex-row items-center p-8">
                <feature.icon className="h-8 w-8" />
                <h3 className="font-satoshi-bold text-primary-50 pl-4 text-lg">
                  <Tab className="text-left [&:not(:focus-visible)]:focus:outline-none">
                    <span className="absolute inset-0 rounded-2xl" />
                    {feature.name}
                  </Tab>
                </h3>
              </div>
            )}

            {/* </div> */}
          </div>
        ))}
      </Tab.List>
      <div className="relative col-span-6">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <CircleBackground color="#49bab4" className="animate-spin-slower" />
        </div>
        <PhoneFrame className="z-10 aspect-[366/729] h-[727px] w-auto mx-auto">
          <Tab.Panels as={Fragment}>
            <AnimatePresence
              initial={false}
              custom={{ isForwards, changeCount }}
            >
              {features.map((feature, featureIndex) =>
                selectedIndex === featureIndex ? (
                  <Tab.Panel
                    static
                    key={`${feature.name} ${changeCount}`}
                    className="col-start-1 row-start-1 flex focus:outline-offset-[32px] [&:not(:focus-visible)]:focus:outline-none"
                  >
                    <feature.screen
                      animated
                      custom={{ isForwards, changeCount }}
                    />
                  </Tab.Panel>
                ) : null,
              )}
            </AnimatePresence>
          </Tab.Panels>
        </PhoneFrame>
      </div>
    </Tab.Group>
  );
}

function FeaturesMobile() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideContainerRef = useRef<any>();
  const slideRefs = useRef<any>([]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveIndex(slideRefs.current.indexOf(entry.target));
            break;
          }
        }
      },
      {
        root: slideContainerRef.current,
        threshold: 0.6,
      },
    );

    for (const slide of slideRefs.current) {
      if (slide) {
        observer.observe(slide);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [slideContainerRef, slideRefs]);

  return (
    <>
      <div
        ref={slideContainerRef}
        className="-mb-4 flex snap-x snap-mandatory -space-x-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-4 [scrollbar-width:none] sm:-space-x-6 [&::-webkit-scrollbar]:hidden"
      >
        {features.map((feature, featureIndex: number) => (
          <div
            key={featureIndex}
            ref={(ref) => (slideRefs.current[featureIndex] = ref)}
            className="w-full flex-none snap-center px-4 sm:px-6"
          >
            <div className="relative transform overflow-hidden rounded-2xl bg-gray-800 px-5 py-6">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <CircleBackground
                  color="#49bab4"
                  className={"animate-spin-slower"}
                />
              </div>
              <PhoneFrame className="relative mx-auto aspect-[366/729] h-[727px] w-auto max-w-[366px]">
                <feature.screen />
              </PhoneFrame>
              <div className="absolute inset-x-0 bottom-0 bg-gray-800/95 p-6 backdrop-blur sm:p-10">
                <feature.icon className="h-8 w-8" />
                <h3 className="mt-6 text-sm font-semibold text-white sm:text-lg">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-3">
        {features.map((_, featureIndex) => (
          <button
            type="button"
            key={featureIndex}
            className={clsx(
              "relative h-0.5 w-4 rounded-full",
              featureIndex === activeIndex ? "bg-gray-300" : "bg-gray-500",
            )}
            aria-label={`Go to slide ${featureIndex + 1}`}
            onClick={() => {
              slideRefs.current[featureIndex].scrollIntoView({
                block: "nearest",
                inline: "nearest",
              });
            }}
          >
            <span className="absolute -inset-x-1.5 -inset-y-3" />
          </button>
        ))}
      </div>
    </>
  );
}

export function PrimaryFeatures() {
  return (
    <section
      id="features"
      aria-label="Features for investing all your money"
      className="bg-gray-900 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-3xl">
          <h2 className="font-satoshi-bold text-primary-400 text-3xl tracking-tight">
            Every feature you need to elevate your style. Experience it for
            yourself.
          </h2>
          <p className="font-general-sans-regular mt-2 text-lg text-gray-300">
            Sprift was created for fashion enthusiasts like you, who value
            individuality and aren't going to let traditional shopping
            limitations dampen their style ambitions. If other thrifting
            platforms are hesitant to innovate, Sprift has already done it.
          </p>
        </div>
      </Container>
      <div className="mt-16 md:hidden">
        <FeaturesMobile />
      </div>
      <Container className="hidden md:mt-20 md:block">
        <FeaturesDesktop />
      </Container>
    </section>
  );
}
