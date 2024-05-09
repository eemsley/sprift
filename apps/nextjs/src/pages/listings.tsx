import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ThumbsdownIcon, ThumbsupIcon } from "@primer/octicons-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ShoppingCart } from "react-feather";

import { GET_ALL_LISTINGS_ROUTE } from "~/utils/contants";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { LoadingSpinner } from "~/components/LoadingSpinner";

const ListingsPage: NextPage = () => {
  const { data: listings, isLoading } = useQuery({
    queryKey: ["get listings"],
    queryFn: () => {
      return axios
        .get<ListingType[]>(GET_ALL_LISTINGS_ROUTE, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((res) => res.data);
    },
  });

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Sprift - Swipe, Shop, Save!</title>
          <meta name="description" content="Sprift" />
        </Head>
        <Header />
        <div className="flex justify-center pt-64">
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (!listings) {
    return (
      <>
        <Head>
          <title>Sprift - Swipe, Shop, Save!</title>
          <meta name="description" content="Sprift" />
        </Head>
        <Header />
        <div className="flex justify-center pt-64">
          <h1>No listings!</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sprift - Swipe, Shop, Save!</title>
        <meta name="description" content="Spree" />
      </Head>
      <Header />
      <main>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
            <div className="mt-2 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {listings.map((listing: ListingType) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export interface ListingType {
  id: string;
  description: string;
  price: number;
  sellerName: string;
  sellerProfilePicUrl: string;
  address: string;
  imagePaths: string[];
  likes: number;
  dislikes: number;
  carts: number;
  size: string;
}

interface ListingCardProps {
  listing: ListingType;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { imagePaths, description, price } = listing;

  return (
    <div>
      <div className="relative">
        <div className="relative h-72 w-full overflow-hidden rounded-md">
          <Image
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            src={imagePaths[0]!}
            alt="Spree listing image"
            fill
            className="h-full w-full object-cover object-center"
          />
        </div>

        <div className="my-3 flex flex-row justify-center space-x-2">
          <div className="flex h-10 w-14 flex-row rounded-2xl bg-[#d3eddb]">
            <div className="flex h-full w-full flex-row items-center justify-center space-x-2">
              <ThumbsupIcon size="small" fill="#49A86B" />
              <h1 className="font-general-sans-bold text-[#49A86B]">
                {listing.likes}
              </h1>
            </div>
          </div>

          <div className="flex h-10 w-16 flex-row rounded-2xl bg-[#d1e9f0]">
            <div className="flex h-full w-full flex-row items-center justify-center space-x-2">
              <ShoppingCart size={16} color="#56adc8" />
              <h1 className="font-general-sans-bold text-[#56adc8]">
                {listing.likes}
              </h1>
            </div>
          </div>

          <div className="flex h-10 w-14 flex-row rounded-2xl bg-[#F0E2E8]">
            <div className="flex h-full w-full flex-row items-center justify-center space-x-2">
              <ThumbsdownIcon size="small" fill="#FD4B4B" />
              <h1 className="font-general-sans-bold text-[#FD4B4B]">
                {listing.likes}
              </h1>
            </div>
          </div>
        </div>

        <div className="relative">
          <h3 className="text-sm font-medium text-gray-900"></h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <p className="relative text-lg font-semibold text-white">
            {`$${price}`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
