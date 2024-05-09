import { useId } from "react";

import { Container } from "~/components/Container";

const features = [
  // {
  //   name: "Thrift with Your Community",
  //   description:
  //     "Join a vibrant community of like-minded thrifters. Sell your pieces and discover new ones from other users.",
  //   icon: DeviceListIcon,
  // },
  {
    name: "Build a Sustainable Wardrobe",
    description:
      "Discover pieces from different fashion eras and trends, and create a diverse, sustainable wardrobe.",
    icon: DeviceCardsIcon,
  },
  // {
  //   name: "Shop in Real-Time",
  //   description:
  //     "Get instant access to unique pieces from sellers across the globe and add them to your wardrobe in seconds.",
  //   icon: DeviceClockIcon,
  // },
  {
    name: "Secure and Private",
    description:
      "We utilize top-tier security technology to ensure your personal information and transactions are protected.",
    icon: DeviceLockIcon,
  },
  {
    name: "Personal Style Tracking",
    description:
      "Sprift’s curated algorithm takes note of your preferences as you swipe, learning from your choices to fine-tune its recommendations.",
    icon: DeviceChartIcon,
  },
  {
    name: "Unleash Your Creativity",
    description:
      "We encourage the repurposing of clothing through the transformative art of upcycling, fostering sustainability and reducing waste.",
    icon: DeviceArrowIcon,
  },
];

function DeviceArrowIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <path
        d="M12 25l8-8m0 0h-6m6 0v6"
        stroke="#171717"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
    </svg>
  );
}

function DeviceCardsIcon(props) {
  const id = useId();

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 13a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H10a1 1 0 01-1-1v-2zm1 5a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2a1 1 0 00-1-1H10z"
        fill={`url(#${id}-gradient)`}
      />
      <rect x={9} y={6} width={14} height={4} rx={1} fill="#171717" />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <defs>
        <linearGradient
          id={`${id}-gradient`}
          x1={16}
          y1={12}
          x2={16}
          y2={28}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#737373" />
          <stop offset={1} stopColor="#737373" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

// function DeviceClockIcon(props) {
//   return (
//     <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
//       <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M5 4a4 4 0 014-4h14a4 4 0 014 4v10h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h5v2H9a4 4 0 01-4-4V4z"
//         fill="#737373"
//       />
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M24 32a8 8 0 100-16 8 8 0 000 16zm1-8.414V19h-2v5.414l4 4L28.414 27 25 23.586z"
//         fill="#171717"
//       />
//     </svg>
//   );
// }

// function DeviceListIcon(props) {
//   return (
//     <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
//       <path
//         fillRule="evenodd"
//         clipRule="evenodd"
//         d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
//         fill="#737373"
//       />
//       <circle cx={11} cy={14} r={2} fill="#171717" />
//       <circle cx={11} cy={20} r={2} fill="#171717" />
//       <circle cx={11} cy={26} r={2} fill="#171717" />
//       <path
//         d="M16 14h6M16 20h6M16 26h6"
//         stroke="#737373"
//         strokeWidth={2}
//         strokeLinecap="square"
//       />
//       <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
//     </svg>
//   );
// }

function DeviceLockIcon(props) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 4a4 4 0 014-4h14a4 4 0 014 4v10h-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9a2 2 0 00-2 2v24a2 2 0 002 2h5v2H9a4 4 0 01-4-4V4z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 19.5a3.5 3.5 0 117 0V22a2 2 0 012 2v6a2 2 0 01-2 2h-7a2 2 0 01-2-2v-6a2 2 0 012-2v-2.5zm2 2.5h3v-2.5a1.5 1.5 0 00-3 0V22z"
        fill="#171717"
      />
    </svg>
  );
}

function DeviceChartIcon(props) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0a4 4 0 00-4 4v24a4 4 0 004 4h14a4 4 0 004-4V4a4 4 0 00-4-4H9zm0 2a2 2 0 00-2 2v24a2 2 0 002 2h14a2 2 0 002-2V4a2 2 0 00-2-2h-1.382a1 1 0 00-.894.553l-.448.894a1 1 0 01-.894.553h-6.764a1 1 0 01-.894-.553l-.448-.894A1 1 0 0010.382 2H9z"
        fill="#737373"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 13.838V26a2 2 0 01-2 2H11a2 2 0 01-2-2V15.65l2.57 3.212a1 1 0 001.38.175L15.4 17.2a1 1 0 011.494.353l1.841 3.681c.399.797 1.562.714 1.843-.13L23 13.837z"
        fill="#171717"
      />
      <path
        d="M10 12h12"
        stroke="#737373"
        strokeWidth={2}
        strokeLinecap="square"
      />
      <circle cx={16} cy={16} r={16} fill="#A3A3A3" fillOpacity={0.2} />
    </svg>
  );
}

export function SecondaryFeatures() {
  return (
    <section
      id="secondary-features"
      aria-label="Features for building a portfolio"
      className="py-20 sm:py-32 bg-gradient-to-b from-[#b5e3df] to-primary-500"
    >
      <Container>
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-satoshi-bold font-medium tracking-tight text-gray-900">
            Now is the time to discover your style.
          </h2>
          <p className="mt-2 font-general-sans-regular text-lg text-gray-700">
            With traditional shopping, finding unique clothing can be a daunting task,
            Sprift is redefining your thrifting experience. It&apos;s the time to discover your
            personal style and build a fashionable wardrobe you love.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 text-sm sm:mt-20 sm:grid-cols-2 md:gap-y-10 lg:max-w-none lg:grid-cols-2"
        >
          {features.map((feature) => (
            <div key={feature.name} className="w-full flex justify-center">
            <li
              key={feature.name}
              className="rounded-2xl max-w-md bg-neutral-50/80  shadow-xl shadow-primary-600 p-8"
            >
              <feature.icon className="h-8 w-8" />
              <h3 className="mt-4 text-lg font-satoshi-bold font-semibold text-gray-800">
                {feature.name}
              </h3>
              <p className="mt-1 font-general-sans-regular text-gray-600">{feature.description}</p>
            </li>
            </div>
          ))}
        </ul>
      </Container>
    </section>
  );
}
