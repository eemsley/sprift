/* eslint-disable @typescript-eslint/no-unsafe-return */
import { type AxiosInstance } from "axios";

import {
  ADD_LISTING_TO_CART_ROUTE,
  ADD_LISTING_TO_SAVED_FOR_LATER_ROUTE,
  ADD_USER_STYLE_TAGS,
  CREATE_LISTING,
  CREATE_MESSAGE_IN_CHAT_ROUTE,
  CREATE_PAYMENT_INTENT_ROUTE,
  DELETE_LISTING_BY_ID_ROUTE,
  DELETE_NOTIFICATION_BY_ID_ROUTE,
  DISLIKE_LISTING_ROUTE,
  ENABLE_NOTIFICATIONS_ROUTE,
  EXPLORE_SCREEN_LISTINGS_ROUTE,
  FAILED_CHECKOUT_ROUTE,
  GET_ALL_MESSAGES_IN_CHAT_ROUTE,
  GET_ALL_PROFILES_ROUTE,
  GET_CART_ROUTE,
  GET_CHAT_LIST_ROUTE,
  GET_CHEAPEST_SHIPPING_RATE_ROUTE,
  GET_FILTER,
  GET_FOLLOWING_LISTINGS_ROUTE,
  GET_IMAGE_UPLOAD_URL_ROUTE,
  GET_LIKED_LISTINGS_ROUTE,
  GET_LISTING_BY_ID_ROUTE,
  GET_ORDER_BY_ID_ROUTE,
  GET_POPULAR_LISTINGS_ROUTE,
  GET_PROFILE_BY_ID_ROUTE,
  GET_RANDOM_LISTINGS_ROUTE,
  GET_SAVED_FOR_LATER_ROUTE,
  GET_SELLING_SOON_LISTINGS_ROUTE,
  GET_USER_BILLING_DETAILS_ROUTE,
  GET_USER_LISTINGS_ROUTE,
  GET_USER_NOTIFICATIONS_ROUTE,
  GET_USER_PURCHASES_ROUTE,
  GET_USER_SALES_ROUTE,
  IS_LISTING_DISLIKED_ROUTE,
  IS_LISTING_IN_CART_ROUTE,
  IS_LISTING_LIKED_ROUTE,
  IS_LISTING_SAVED_FOR_LATER_ROUTE,
  LIKE_LISTING_ROUTE,
  PURCHASE_ROUTE,
  READ_USER_NOTIFICATIONS_ROUTE,
  RECOMMEND_LISTINGS_ROUTE,
  REMOVE_DISLIKE_FROM_LISTING_ROUTE,
  REMOVE_LIKE_FROM_LISTING_ROUTE,
  REMOVE_LISTING_FROM_CART_ROUTE,
  REMOVE_LISTING_FROM_SAVED_FOR_LATER_ROUTE,
  SEARCH_LISTINGS_ROUTE,
  SEARCH_PROFILES_ROUTE,
  UPDATE_FILTER_ROUTE,
  UPDATE_FOLLOW_ROUTE,
  UPDATE_USER_BILLING_DETAILS_ROUTE,
  UPDATE_USER_PROFILE_PIC_ROUTE,
  UPDATE_USER_PROFILE_ROUTE,
  VALIDATE_USER_ADDRESS_ROUTE,
} from "~/utils/constants";
import {
  type AllProfilesType,
  type ListingType,
  type NotificationType,
  type OrderType,
  type ProfileType,
} from "~/utils/mockData";
import { type CartItemType } from "~/app/cart";

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

export const getAllListings = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  filter: boolean,
  cursorListingId: string | null | undefined,
) => {
  try {
    const response = await apiInstance.post<{
      listings: ListingType[];
      cursorListingId: string;
    }>(RECOMMEND_LISTINGS_ROUTE, {
      clerkId,
      filter,
      cursorListingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExploreScreenListings = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  filter: boolean,
  cursorListingId: string | null | undefined,
) => {
  try {
    const response = await apiInstance.post<{
      listings: ListingType[];
      cursorListingId: string;
    }>(EXPLORE_SCREEN_LISTINGS_ROUTE, {
      clerkId,
      filter,
      cursorListingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFollowingListings = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  cursorListingId: string | null | undefined,
) => {
  try {
    const response = await apiInstance.post<{
      listings: ListingType[];
      cursorListingId: string;
    }>(GET_FOLLOWING_LISTINGS_ROUTE, {
      clerkId,
      cursorListingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getPopularListings = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  cursorListingId: string | null | undefined,
) => {
  try {
    const response = await apiInstance.post<{
      listings: ListingType[];
      cursorListingId: string;
    }>(GET_POPULAR_LISTINGS_ROUTE, {
      clerkId,
      cursorListingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getSellingSoonListings = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  cursorListingId: string | null | undefined,
) => {
  try {
    const response = await apiInstance.post<{
      listings: ListingType[];
      cursorListingId: string;
    }>(GET_SELLING_SOON_LISTINGS_ROUTE, {
      clerkId,
      cursorListingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getRandomListings = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  cursorListingId: string | null | undefined,
) => {
  try {
    const response = await apiInstance.post<{
      listings: ListingType[];
      cursorListingId: string;
    }>(GET_RANDOM_LISTINGS_ROUTE, {
      clerkId,
      cursorListingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchListings = async (
  apiInstance: AxiosInstance,
  search: string,
) => {
  try {
    const response = await apiInstance.post<ListingType[]>(
      SEARCH_LISTINGS_ROUTE,
      {
        search,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListingById = async (
  apiInstance: AxiosInstance,
  listingId: string,
) => {
  try {
    const response = await apiInstance.get<ListingType>(
      GET_LISTING_BY_ID_ROUTE(listingId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteListingById = async (
  apiInstance: AxiosInstance,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(
      DELETE_LISTING_BY_ID_ROUTE(listingId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const likeListing = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(LIKE_LISTING_ROUTE, {
      listingId,
      clerkId,
    });
    return response.data;
  } catch (error) {
    console.warn(JSON.stringify(error));
    throw error;
  }
};

export const removeLike = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(REMOVE_LIKE_FROM_LISTING_ROUTE, {
      clerkId,
      listingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const dislikeListing = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(DISLIKE_LISTING_ROUTE, {
      clerkId,
      listingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeDislike = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(REMOVE_DISLIKE_FROM_LISTING_ROUTE, {
      clerkId,
      listingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addListingToCart = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(ADD_LISTING_TO_CART_ROUTE, {
      clerkId,
      listingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getListingsInCart = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.post<CartItemType[]>(GET_CART_ROUTE, {
      clerkId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const failedCheckout = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  cart: string[],
) => {
  try {
    const response = await apiInstance.post(FAILED_CHECKOUT_ROUTE, {
      clerkId,
      cart,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLikedListings = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.post<ListingType[]>(
      GET_LIKED_LISTINGS_ROUTE,
      { clerkId },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isListingLiked = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post<boolean>(IS_LISTING_LIKED_ROUTE, {
      clerkId,
      listingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isListingDisliked = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post<boolean>(
      IS_LISTING_DISLIKED_ROUTE,
      {
        clerkId,
        listingId,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isListingInCart = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post<boolean>(IS_LISTING_IN_CART_ROUTE, {
      clerkId,
      listingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeListingFromCart = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(REMOVE_LISTING_FROM_CART_ROUTE, {
      clerkId,
      listingId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSavedForLater = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.post<ListingType[]>(
      GET_SAVED_FOR_LATER_ROUTE,
      { clerkId },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addToSavedForLater = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(
      ADD_LISTING_TO_SAVED_FOR_LATER_ROUTE,
      {
        clerkId,
        listingId,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFromSavedForLater = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post(
      REMOVE_LISTING_FROM_SAVED_FOR_LATER_ROUTE,
      {
        clerkId,
        listingId,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const isListingSavedForLater = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  listingId: string,
) => {
  try {
    const response = await apiInstance.post<boolean>(
      IS_LISTING_SAVED_FOR_LATER_ROUTE,
      {
        clerkId,
        listingId,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserListings = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.post<ListingType[]>(
      GET_USER_LISTINGS_ROUTE,
      { clerkId },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserNotifications = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.post<NotificationType[]>(
      GET_USER_NOTIFICATIONS_ROUTE,
      { clerkId },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const readUserNotifications = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.put<NotificationType[]>(
      READ_USER_NOTIFICATIONS_ROUTE,
      { clerkId },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createListing = async (
  apiInstance: AxiosInstance,
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
) => {
  try {
    const response = await apiInstance.post<ListingType>(CREATE_LISTING, {
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
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteNotificationById = async (
  apiInstance: AxiosInstance,
  notificationId: string,
) => {
  try {
    const response = await apiInstance.post(DELETE_NOTIFICATION_BY_ID_ROUTE, {
      notificationId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfileById = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.get<ProfileType>(
      GET_PROFILE_BY_ID_ROUTE(clerkId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const searchProfiles = async (
  apiInstance: AxiosInstance,
  search: string,
) => {
  try {
    const response = await apiInstance.post<AllProfilesType[]>(
      SEARCH_PROFILES_ROUTE,
      {
        search,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface UpdateUserProfileInput {
  bio: string;
  profilePic: string;
  username: string;
}

export const updateUserProfile = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  profile: UpdateUserProfileInput,
) => {
  try {
    const response = await apiInstance.put(
      UPDATE_USER_PROFILE_ROUTE(clerkId),
      profile,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateFollow = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  targetUserId: string,
) => {
  try {
    const response = await apiInstance.put(UPDATE_FOLLOW_ROUTE(clerkId), {
      targetUserId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateFilters = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  filters: {
    gender: string;
    maxPrice: number;
    types: string[];
    sizes: string[];
  },
) => {
  try {
    const response = await apiInstance.put(UPDATE_FILTER_ROUTE(clerkId), {
      filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getFilters = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.get<{
      gender: string;
      maxPrice: number;
      types: string[];
      sizes: string[];
    }>(GET_FILTER(clerkId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProfiles = async (apiInstance: AxiosInstance) => {
  try {
    const response = await apiInstance.get<AllProfilesType[]>(
      GET_ALL_PROFILES_ROUTE,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const enableNotifications = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  notificationsEnabled: boolean,
) => {
  try {
    const response = await apiInstance.put(
      ENABLE_NOTIFICATIONS_ROUTE(clerkId),
      { notificationsEnabled },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

interface StripePaymentIntentResponse {
  paymentIntentClientSecret: string;
  ephemeralKey: string;
  customer: string;
  orderId: string;
}

export const createPaymentIntent = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  cart: string[],
) => {
  try {
    const response = await apiInstance.post<StripePaymentIntentResponse>(
      CREATE_PAYMENT_INTENT_ROUTE,
      {
        clerkId,
        cart,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const purchase = async (
  apiInstance: AxiosInstance,
  clerkId: string,

  paymentIntent: string,
) => {
  try {
    const response = await apiInstance.post(PURCHASE_ROUTE, {
      paymentIntent,
      clerkId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getOrderById = async (
  apiInstance: AxiosInstance,
  orderId: string,
) => {
  try {
    const response = await apiInstance.get(GET_ORDER_BY_ID_ROUTE(orderId));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserBillingDetails = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.get<BillingDetails>(
      GET_USER_BILLING_DETAILS_ROUTE(clerkId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const validateUserAddress = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.post(VALIDATE_USER_ADDRESS_ROUTE, {
      clerkId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const updateUserBillingDetails = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  billingDetails: BillingDetails,
) => {
  try {
    const response = await apiInstance.put(
      UPDATE_USER_BILLING_DETAILS_ROUTE(clerkId),
      billingDetails,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

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

export const getCheapestShippingRate = async (
  apiInstance: AxiosInstance,
  buyerId: string,
  sellerId: string,
  listingIds: string[],
) => {
  try {
    const response = await apiInstance.post<Rate>(
      GET_CHEAPEST_SHIPPING_RATE_ROUTE,
      {
        buyerId,
        sellerId,
        listingIds,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getImageUploadLink = async (
  apiInstance: AxiosInstance,
  name: string,
  type: string,
) => {
  try {
    const response = await apiInstance.post<{ url: string }>(
      GET_IMAGE_UPLOAD_URL_ROUTE,
      {
        name,
        type,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const uploadImageToS3 = async (
  apiInstance: AxiosInstance,
  presignedUrl: string,
  file: unknown,
) => {
  try {
    const response = await apiInstance.post(presignedUrl, {
      method: "PUT",
      body: file,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfilePic = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  newProfilePicUrl: string,
) => {
  try {
    const response = await apiInstance.post<unknown>(
      UPDATE_USER_PROFILE_PIC_ROUTE,
      {
        clerkId,
        newProfilePicUrl,
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addUserStyleTags = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  tags: string[],
) => {
  try {
    const response = await apiInstance.post<unknown>(ADD_USER_STYLE_TAGS, {
      clerkId,
      tags,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPurchases = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.get<OrderType[]>(
      GET_USER_PURCHASES_ROUTE(clerkId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserSales = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.get<OrderType[]>(
      GET_USER_SALES_ROUTE(clerkId),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllMessagesInChat = async (
  apiInstance: AxiosInstance,
  senderId: string,
  recipientId: string,
) => {
  try {
    const response = await apiInstance.get<Message[]>(
      GET_ALL_MESSAGES_IN_CHAT_ROUTE,
      { params: { senderId, recipientId } },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createMessageInChat = async (
  apiInstance: AxiosInstance,
  clerkId: string,
  recipientId: string,
  content: string,
  listingId?: string,
) => {
  try {
    const response = await apiInstance.post<Message>(
      CREATE_MESSAGE_IN_CHAT_ROUTE,
      {
        clerkId,
        recipientId,
        content,
        listingId
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getChatList = async (
  apiInstance: AxiosInstance,
  clerkId: string,
) => {
  try {
    const response = await apiInstance.get<
      { externalId: string; username: string }[]
    >(GET_CHAT_LIST_ROUTE(clerkId));
    return response.data;
  } catch (error) {
    throw error;
  }
};
