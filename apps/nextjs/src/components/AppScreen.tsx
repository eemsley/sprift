/* eslint-disable @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any */
import { forwardRef } from "react";
import clsx from "clsx";

// function Logo(props: any) {
//   return (
//     <div {...props}>
//       <h1 className="font-satoshi-bold text-primary-500 text-2xl underline">
//         Sprift
//       </h1>
//     </div>
//   );
// }

// function MenuIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
//       <path
//         d="M5 6h14M5 18h14M5 12h14"
//         stroke="#fff"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

// function UserIcon(props) {
//   return (
//     <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
//       <path
//         d="M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.696 19h10.608c1.175 0 2.08-.935 1.532-1.897C18.028 15.69 16.187 14 12 14s-6.028 1.689-6.836 3.103C4.616 18.065 5.521 19 6.696 19Z"
//         stroke="#fff"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );
// }

export function AppScreen({ children, className, ...props }: any) {
  return (
    <div className={clsx("flex flex-col", className)} {...props}>
      <div className="flex justify-between px-5">
        {/* <Logo className="pl-1 pt-2 h-0" />
        <div className="flex flex-row space-x-2 h-3 pt-7 items-center">
          <FilterIcon className="h-4 w-4 text-offBlack-500" />
          <CommentDiscussionIcon className="h-4 w-4 text-offBlack-500"/>
          <BellIcon className="h-4 w-4 text-offBlack-500"/>
        </div> */}
      </div>
      {children}
    </div>
  );
}

AppScreen.Header = forwardRef(function AppScreenHeader(
  { children }: any,
  ref: any,
) {
  return (
    <div ref={ref} className="text-white">
      {children}
    </div>
  );
});

// AppScreen.Title = forwardRef(function AppScreenTitle(
//   { children }: any,
//   ref: any,
// ) {
//   return (
//     <div ref={ref} className="text-2xl text-white">
//       {children}
//     </div>
//   );
// });

// AppScreen.Subtitle = forwardRef(function AppScreenSubtitle(
//   { children }: any,
//   ref: any,
// ) {
//   return (
//     <div ref={ref} className="text-sm text-gray-500">
//       {children}
//     </div>
//   );
// });

AppScreen.Body = forwardRef(function AppScreenBody(
  { children, className }: { children: any; className?: string },
  ref: any,
) {
  return (
    <div
      ref={ref}
      className={clsx("mt-6 flex-auto rounded-t-2xl bg-white", className)}
    >
      {children}
    </div>
  );
});
