import * as React from "react";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";

import {
  type Cart,
  type Dislike,
  type Like,
  type Listing,
  type Order,
  type OrderLine,
  type SubOrder,
  type User,
} from "@spree/db";

import {
  type AllProfilesType,
  type ListingType,
  type NotificationType,
  type OrderType,
  type ProfileType,
} from "~/utils/mockData";
import { type CartItemType } from "~/app/cart";
import * as API from "~/services/api";

interface BillingDetails {
  name?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  state?: string;
  street1?: string;
  street2?: string;
  zip?: string;
}

interface Rate {
  object_created: string;
  object_id: string;
  object_owner: string;
  shipment: string;
  attributes: [string];
  amount: number;
  currency: string;
  amount_local: number;
  currency_local: string;
  provider: string;
  provider_image_75: string;
  provider_image_200: string;
  servicelevel: object;
  estimated_days: number;
  arrives_by: string | null;
  duration_terms: string | null;
  messages: [];
  carrier_account: string;
  test: boolean;
  zone: string;
}

type APIProviderProps = { children: React.ReactNode };

interface Message {
  id: string | number;
  senderExternalId: string | number;
  recipientExternalId: string | number;
  createdAt: number | Date;
  updatedAt: number | Date;
  content: string;
  listingDescription: string | null;
  image: string | null;
}

export type OrderListings = Listing & {
  cart: Cart[];
  likes: Like[];
  dislikes: Dislike[];
  imagePaths: {
    path: string;
  }[];
};

export type PrismaOrder = Order & {
  suborders: (SubOrder & {
    lines: (OrderLine & {
      listing: Listing & {
        cart: Cart[];
        likes: Like[];
        dislikes: Dislike[];
        imagePaths: {
          path: string;
        }[];
        seller: User;
      };
    })[];
  })[];
};

type StripePaymentIntentResponse = {
  paymentIntentClientSecret: string;
  ephemeralKey: string;
  customer: string;
  orderId: string;
};

type APICalls = {
  // Define the types for your API function queries and mutations
  getAllListings: (
    clerkId: string,
    filter: boolean,
    cursorListingId: string | null | undefined,
  ) => Promise<{ listings: ListingType[]; cursorListingId: string }>;
  getExploreScreenListings: (
    clerkId: string,
    filter: boolean,
    cursorListingId: string | null | undefined,
  ) => Promise<{ listings: ListingType[]; cursorListingId: string }>;
  getFollowingListings: (
    clerkId: string,
    cursorListingId: string | null | undefined,
  ) => Promise<{ listings: ListingType[]; cursorListingId: string }>;
  getPopularListings: (
    clerkId: string,
    cursorListingId: string | null | undefined,
  ) => Promise<{ listings: ListingType[]; cursorListingId: string }>;
  getSellingSoonListings: (
    clerkId: string,
    cursorListingId: string | null | undefined,
  ) => Promise<{ listings: ListingType[]; cursorListingId: string }>;
  getRandomListings: (
    clerkId: string,
    cursorListingId: string | null | undefined,
  ) => Promise<{ listings: ListingType[]; cursorListingId: string }>;
  searchListings: (search: string) => Promise<ListingType[]>;
  getListingById: (listingId: string) => Promise<ListingType>;
  deleteListingById: (listingId: string) => Promise<unknown>;
  likeListing: (clerkId: string, listingId: string) => Promise<unknown>;
  removeLike: (clerkId: string, listingId: string) => Promise<unknown>;
  dislikeListing: (clerkId: string, listingId: string) => Promise<unknown>;
  removeDislike: (clerkId: string, listingId: string) => Promise<unknown>;
  isListingDisliked: (clerkId: string, listingId: string) => Promise<boolean>;
  failedCheckout: (clerkId: string, cart: string[]) => Promise<unknown>;
  addListingToCart: (clerkId: string, listingId: string) => Promise<unknown>;
  getListingsInCart: (clerkId: string) => Promise<CartItemType[]>;
  isListingInCart: (clerkId: string, listingId: string) => Promise<boolean>;
  getLikedListings: (clerkId: string) => Promise<ListingType[]>;
  isListingLiked: (clerkId: string, listingId: string) => Promise<boolean>;
  removeListingFromCart: (
    clerkId: string,
    listingId: string,
  ) => Promise<unknown>;
  addToSavedForLater: (clerkId: string, listingId: string) => Promise<unknown>;
  getSavedForLater: (clerkId: string) => Promise<ListingType[]>;
  removeFromSavedForLater: (
    clerkId: string,
    listingId: string,
  ) => Promise<unknown>;
  isListingSavedForLater: (
    clerkId: string,
    listingId: string,
  ) => Promise<boolean>;
  getUserListings: (clerkId: string) => Promise<ListingType[]>;
  createListing: (
    clerkId: string,
    listingType: string,
    size: string,
    price: number,
    description: string,
    gender: string,
    weight: number,
    weightUnit: string,
    imagePaths: string[],
    tags: string[],
  ) => Promise<ListingType>;
  getUserNotifications: (clerkId: string) => Promise<NotificationType[]>;
  readUserNotifications: (clerkId: string) => Promise<NotificationType[]>;
  deleteNotificationById: (notificationId: string) => Promise<unknown>;
  enableNotifications: (
    clerkId: string,
    notificationsEnabled: boolean,
  ) => Promise<unknown>;
  getProfileById: (clerkId: string) => Promise<ProfileType>;
  getAllProfiles: () => Promise<AllProfilesType[]>;
  searchProfiles: (search: string) => Promise<AllProfilesType[]>;
  updateUserProfile: (
    clerkId: string,
    profile: ProfileType,
  ) => Promise<unknown>;
  addUserStyleTags: (clerkId: string, tags: string[]) => Promise<unknown>;
  updateFollow: (clerkId: string, targetUserId: string) => Promise<unknown>;
  getFilters: (clerkId: string) => Promise<{
    gender: string;
    maxPrice: number;
    types: string[];
    sizes: string[];
  }>;
  updateFilters: (
    clerkId: string,
    filters: {
      gender: string;
      maxPrice: number;
      types: string[];
      sizes: string[];
    },
  ) => Promise<unknown>;
  createPaymentIntent: (
    clerkId: string,
    cart: string[],
  ) => Promise<StripePaymentIntentResponse>;
  purchase: (clerkId: string, paymentIntent: string) => Promise<PrismaOrder>;
  getUserPurchases: (clerkId: string) => Promise<OrderType[]>;
  getUserSales: (clerkId: string) => Promise<OrderType[]>;
  getOrderById: (orderId: string) => Promise<PrismaOrder | null>;
  getUserBillingDetails: (clerkId: string) => Promise<BillingDetails>;
  validateUserAddress: (clerkId: string) => Promise<{ valid: boolean }>;
  updateUserBillingDetails: (
    clerkId: string,
    billingDetails: BillingDetails,
  ) => Promise<unknown>;
  getCheapestShippingRate: (
    buyerId: string,
    sellerId: string,
    listingIds: string[],
  ) => Promise<Rate>;
  getImageUploadLink: (type: string, name: string) => Promise<{ url: string }>;
  updateUserProfilePic: (
    clerkId: string,
    newProfilePic: string,
  ) => Promise<unknown>;
  uploadImageToS3: (presignedUrl: string, file: unknown) => Promise<unknown>;
  getAllMessagesInChat: (
    senderId: string,
    recipientId: string,
  ) => Promise<Message[]>;
  createMessageInChat: (
    clerkId: string,
    recipientId: string,
    content: string,
    listingId?: string,
  ) => Promise<Message>;
  getChatList: (
    clerkId: string,
  ) => Promise<{ externalId: string; username: string }[]>;
};

// Create API context
// the type def is either an object of a key being the name of the api call and the value being the api call
// or the initial value that we init to undefined
const APIContext = React.createContext<APICalls | undefined>(undefined);

function APIProvider({ children }: APIProviderProps) {
  const { getToken } = useAuth();

  // Axios instance
  const apiInstance = axios.create();

  // Effect to set axios headers when token changes
  useEffect(() => {
    void (async () => {
      const authToken = await getToken();
      apiInstance.defaults.headers.common["Authorization"] =
        authToken ?? undefined;
    })();
  }, [apiInstance.defaults.headers.common, getToken]);

  // API calls to pass to children
  const getAllListings = (
    clerkId: string,
    filter: boolean,
    cursorListingId: string | null | undefined,
  ) => API.getAllListings(apiInstance, clerkId, filter, cursorListingId);
  const getExploreScreenListings = (
    clerkId: string,
    filter: boolean,
    cursorListingId: string | null | undefined,
  ) =>
    API.getExploreScreenListings(apiInstance, clerkId, filter, cursorListingId);
  const getFollowingListings = (
    clerkId: string,
    cursorListingId: string | null | undefined,
  ) => API.getFollowingListings(apiInstance, clerkId, cursorListingId);
  const getPopularListings = (
    clerkId: string,
    cursorListingId: string | null | undefined,
  ) => API.getPopularListings(apiInstance, clerkId, cursorListingId);
  const getSellingSoonListings = (
    clerkId: string,
    cursorListingId: string | null | undefined,
  ) => API.getSellingSoonListings(apiInstance, clerkId, cursorListingId);
  const getRandomListings = (
    clerkId: string,
    cursorListingId: string | null | undefined,
  ) => API.getRandomListings(apiInstance, clerkId, cursorListingId);

  const searchListings = (search: string) =>
    API.searchListings(apiInstance, search);
  const getListingById = (listingId: string) =>
    API.getListingById(apiInstance, listingId);
  const deleteListingById = (listingId: string) =>
    API.deleteListingById(apiInstance, listingId);
  const addUserStyleTags = (clerkId: string, tags: string[]) =>
    API.addUserStyleTags(apiInstance, clerkId, tags);
  const likeListing = (clerkId: string, listingId: string) =>
    API.likeListing(apiInstance, clerkId, listingId);
  const removeLike = (clerkId: string, listingId: string) =>
    API.removeLike(apiInstance, clerkId, listingId);
  const dislikeListing = (clerkId: string, listingId: string) =>
    API.dislikeListing(apiInstance, clerkId, listingId);
  const removeDislike = (clerkId: string, listingId: string) =>
    API.removeDislike(apiInstance, clerkId, listingId);
  const addListingToCart = (clerkId: string, listingId: string) =>
    API.addListingToCart(apiInstance, clerkId, listingId);
  const getListingsInCart = (clerkId: string) =>
    API.getListingsInCart(apiInstance, clerkId);
  const isListingInCart = (clerkId: string, listingId: string) =>
    API.isListingInCart(apiInstance, clerkId, listingId);
  const failedCheckout = (clerkId: string, cart: string[]) =>
    API.failedCheckout(apiInstance, clerkId, cart);

  const getLikedListings = (clerkId: string) =>
    API.getLikedListings(apiInstance, clerkId);
  const isListingLiked = (clerkId: string, listingId: string) =>
    API.isListingLiked(apiInstance, clerkId, listingId);
  const isListingDisliked = (clerkId: string, listingId: string) =>
    API.isListingDisliked(apiInstance, clerkId, listingId);
  const removeListingFromCart = (clerkId: string, listingId: string) =>
    API.removeListingFromCart(apiInstance, clerkId, listingId);
  const getSavedForLater = (clerkId: string) =>
    API.getSavedForLater(apiInstance, clerkId);
  const addToSavedForLater = (clerkId: string, listingId: string) =>
    API.addToSavedForLater(apiInstance, clerkId, listingId);
  const removeFromSavedForLater = (clerkId: string, listingId: string) =>
    API.removeFromSavedForLater(apiInstance, clerkId, listingId);
  const isListingSavedForLater = (clerkId: string, listingId: string) =>
    API.isListingSavedForLater(apiInstance, clerkId, listingId);
  const getUserListings = (clerkId: string) =>
    API.getUserListings(apiInstance, clerkId);
  const getUserNotifications = (clerkId: string) =>
    API.getUserNotifications(apiInstance, clerkId);
  const readUserNotifications = (clerkId: string) =>
    API.readUserNotifications(apiInstance, clerkId);

  const deleteNotificationById = (notificationId: string) =>
    API.deleteNotificationById(apiInstance, notificationId);
  const enableNotifications = (
    clerkId: string,
    notificationsEnabled: boolean,
  ) => API.enableNotifications(apiInstance, clerkId, notificationsEnabled);
  const createListing = (
    clerkId: string,
    listingType: string,
    size: string,
    price: number,
    description: string,
    gender: string,
    weight: number,
    weightUnit: string,
    imagePaths: string[],
    tags: string[],
  ) =>
    API.createListing(
      apiInstance,
      clerkId,
      listingType,
      size,
      price,
      description,
      gender,
      weight,
      weightUnit,
      imagePaths,
      tags,
    );
  const getProfileById = (clerkId: string) =>
    API.getProfileById(apiInstance, clerkId);
  const getAllProfiles = () => API.getAllProfiles(apiInstance);
  const searchProfiles = (search: string) =>
    API.searchProfiles(apiInstance, search);
  const updateUserProfile = (clerkId: string, profile: ProfileType) =>
    API.updateUserProfile(apiInstance, clerkId, profile);
  const updateFollow = (clerkId: string, targetUserId: string) =>
    API.updateFollow(apiInstance, clerkId, targetUserId);
  const getFilters = (clerkId: string) => API.getFilters(apiInstance, clerkId);
  const updateFilters = (
    clerkId: string,
    filters: {
      gender: string;
      maxPrice: number;
      types: string[];
      sizes: string[];
    },
  ) => API.updateFilters(apiInstance, clerkId, filters);

  const createPaymentIntent = (clerkId: string, cart: string[]) =>
    API.createPaymentIntent(apiInstance, clerkId, cart);
  const purchase = (clerkId: string, paymentIntent: string) =>
    API.purchase(apiInstance, clerkId, paymentIntent);
  const getUserPurchases = (clerkId: string) =>
    API.getUserPurchases(apiInstance, clerkId);
  const getUserSales = (clerkId: string) =>
    API.getUserSales(apiInstance, clerkId);
  const getOrderById = (orderId: string) =>
    API.getOrderById(apiInstance, orderId);
  const getUserBillingDetails = (clerkId: string) =>
    API.getUserBillingDetails(apiInstance, clerkId);
  const validateUserAddress = (clerkId: string) =>
    API.validateUserAddress(apiInstance, clerkId);
  const updateUserBillingDetails = (
    clerkId: string,
    billingDetails: BillingDetails,
  ) => API.updateUserBillingDetails(apiInstance, clerkId, billingDetails);
  const getCheapestShippingRate = (
    buyerId: string,
    sellerId: string,
    listingIds: string[],
  ) => API.getCheapestShippingRate(apiInstance, buyerId, sellerId, listingIds);
  const getImageUploadLink = (type: string, name: string) =>
    API.getImageUploadLink(apiInstance, type, name);
  const updateUserProfilePic = (clerkId: string, newProfilePic: string) =>
    API.updateUserProfilePic(apiInstance, clerkId, newProfilePic);
  const uploadImageToS3 = (presignedUrl: string, file: unknown) =>
    API.uploadImageToS3(apiInstance, presignedUrl, file);
  const getAllMessagesInChat = (senderId: string, recipientId: string) =>
    API.getAllMessagesInChat(apiInstance, senderId, recipientId);
  const createMessageInChat = (
    clerkId: string,
    recipientId: string,
    content: string,
    listingId?: string,
  ) => API.createMessageInChat(apiInstance, clerkId, recipientId, content, listingId);
  const getChatList = (clerkId: string) =>
    API.getChatList(apiInstance, clerkId);

  const apiFunctions = {
    getAllListings,
    getExploreScreenListings,
    getFollowingListings,
    getPopularListings,
    getSellingSoonListings,
    getRandomListings,
    searchListings,
    getListingById,
    deleteListingById,
    likeListing,
    removeLike,
    dislikeListing,
    removeDislike,
    failedCheckout,
    addListingToCart,
    getListingsInCart,
    getLikedListings,
    isListingLiked,
    addUserStyleTags,
    isListingDisliked,
    isListingInCart,
    isListingSavedForLater,
    removeListingFromCart,
    getSavedForLater,
    addToSavedForLater,
    removeFromSavedForLater,
    getUserListings,
    createListing,
    getUserNotifications,
    readUserNotifications,
    deleteNotificationById,
    enableNotifications,
    getProfileById,
    getAllProfiles,
    searchProfiles,
    updateUserProfile,
    updateFollow,
    getFilters,
    updateFilters,
    createPaymentIntent,
    purchase,
    getUserPurchases,
    getUserSales,
    getOrderById,
    getUserBillingDetails,
    validateUserAddress,
    updateUserBillingDetails,
    getCheapestShippingRate,
    getImageUploadLink,
    updateUserProfilePic,
    uploadImageToS3,
    getAllMessagesInChat,
    createMessageInChat,
    getChatList,
  };

  return (
    <APIContext.Provider value={apiFunctions}>{children}</APIContext.Provider>
  );
}

export { APIContext, APIProvider };
