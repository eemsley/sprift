// Indicate if the application is launched in development mode and environment

export const IN_DEV = process.env.NODE_ENV === "development";

// Default port app is running on
const DEFAULT_PORT = 3000;

// Change to env vars later
export const CLERK_PUBLISHABLE_KEY = IN_DEV
  ? "pk_test_dXNlZnVsLW1pbm5vdy05MS5jbGVyay5hY2NvdW50cy5kZXYk"
  : "pk_live_Y2xlcmsuc3ByZWUtY29tbWVyY2UuY29tJA";

export const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51NMlV4GW5MLrEd98zdP4FgCmRDcY9TyySPf7nYHZ8hI93s6btupwIUu5vbQNzpUjZoUGFBsXpFfzjVzYj3cU7o4e00FH754AsP";

/**
 * This is the API base url for development. There are issues running the expo server and api in parallel,
 * as expo cannot resolve localhost as the api url. To get around this, we use the local ip address.
 * This looks for EXPO_PUBLIC_DEV_BASE_URL, an optional env var, so set this to your local ip address.
 * See this for reference: https://stackoverflow.com/q/72798337
 *
 * NOTE: Later we are going to store the dev url in the env var, it currently does not
 * read from the file so just hardcode it for now
 */

// https://ngrok.com/
const NGROK_URL = "https://ade6-195-252-220-159.ngrok.io";

const EXPO_PUBLIC_DEV_BASE_URL =
  NGROK_URL ?? `http://192.168.4.40:${DEFAULT_PORT}`;
export const DEV_BASE_URL = EXPO_PUBLIC_DEV_BASE_URL
  ? `${EXPO_PUBLIC_DEV_BASE_URL}`
  : `http://localhost:${DEFAULT_PORT}`;

const PROD_BASE_URL = "https://www.spree-commerce.com";

// This is the base URL for our api. The routes are appended to this.
// This is a source of many errors so if the api is not being called from
// the mobile app make sure your dev url is configured correctly.
export const API_BASE_URL = IN_DEV ? DEV_BASE_URL : PROD_BASE_URL;

export const WELCOME_SCREEN_SVGS_TO_PRELOAD = [
  "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/likedislike.gif",
  "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/cart.gif",
  "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/saved.gif",
  "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/revert.gif",
  "http://d1z9kibbxyrrgi.cloudfront.net/onboarding/chat.gif",
];

/**
 * API ROUTES
 * These are all of the routes for our API.
 */

// User routes
export const GET_USER_LISTINGS_ROUTE = `${API_BASE_URL}/api/user/listings`;
export const GET_USER_BILLING_DETAILS_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/user/${clerkId}/billing-details`;
export const UPDATE_USER_BILLING_DETAILS_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/user/${clerkId}/billing-details/update`;
export const GET_USER_PURCHASES_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/user/${clerkId}/purchases`;
export const GET_USER_SALES_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/user/${clerkId}/sales`;
export const ADD_USER_STYLE_TAGS = `${API_BASE_URL}/api/user/add-style-tags`;

// Profile routes
export const GET_PROFILE_BY_ID_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/profile/${clerkId}`;
export const SEARCH_PROFILES_ROUTE = `${API_BASE_URL}/api/profile/search`;
export const UPDATE_USER_PROFILE_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/profile/${clerkId}/update`;
export const UPDATE_USER_PROFILE_PIC_ROUTE = `${API_BASE_URL}/api/s3/profile/image/upload`;
export const UPDATE_FOLLOW_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/profile/${clerkId}/update-follow`;
export const UPDATE_FILTER_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/profile/${clerkId}/update-filter`;
export const GET_FILTER = (clerkId: string) =>
  `${API_BASE_URL}/api/profile/${clerkId}/filters`;

export const GET_ALL_PROFILES_ROUTE = `${API_BASE_URL}/api/profile/all-profiles`;

// Listing Routes
export const RECOMMEND_LISTINGS_ROUTE = `${API_BASE_URL}/api/recommend/main`;
export const EXPLORE_SCREEN_LISTINGS_ROUTE = `${API_BASE_URL}/api/recommend/explore`;
export const GET_FOLLOWING_LISTINGS_ROUTE = `${API_BASE_URL}/api/listings/following`;
export const GET_POPULAR_LISTINGS_ROUTE = `${API_BASE_URL}/api/listings/popular`;
export const GET_SELLING_SOON_LISTINGS_ROUTE = `${API_BASE_URL}/api/listings/sellingsoon`;
export const GET_RANDOM_LISTINGS_ROUTE = `${API_BASE_URL}/api/listings/random`;
export const SEARCH_LISTINGS_ROUTE = `${API_BASE_URL}/api/listings/search`;
export const GET_LISTING_BY_ID_ROUTE = (listingId: string) =>
  `${API_BASE_URL}/api/listings/${listingId}`;
export const CREATE_LISTING = `${API_BASE_URL}/api/listings/create`;
export const DELETE_LISTING_BY_ID_ROUTE = (listingId: string) =>
  `${API_BASE_URL}/api/listings/${listingId}/delete`;

// Cart Routes
export const ADD_LISTING_TO_CART_ROUTE = `${API_BASE_URL}/api/listings/add-to-cart`;
export const GET_CART_ROUTE = `${API_BASE_URL}/api/cart`;
export const REMOVE_LISTING_FROM_CART_ROUTE = `${API_BASE_URL}/api/cart/remove`;
export const IS_LISTING_IN_CART_ROUTE = `${API_BASE_URL}/api/cart/is-listing-in-cart`;
export const FAILED_CHECKOUT_ROUTE = `${API_BASE_URL}/api/cart/failed-checkout`;

// Save For Later Routes
export const ADD_LISTING_TO_SAVED_FOR_LATER_ROUTE = `${API_BASE_URL}/api/listings/add-to-saved`;
export const GET_SAVED_FOR_LATER_ROUTE = `${API_BASE_URL}/api/saved`;
export const REMOVE_LISTING_FROM_SAVED_FOR_LATER_ROUTE = `${API_BASE_URL}/api/saved/remove`;
export const IS_LISTING_SAVED_FOR_LATER_ROUTE = `${API_BASE_URL}/api/saved/is-listing-saved`;

// Like routes
export const LIKE_LISTING_ROUTE = `${API_BASE_URL}/api/listings/like`;
export const GET_LIKED_LISTINGS_ROUTE = `${API_BASE_URL}/api/liked`;
export const REMOVE_LIKE_FROM_LISTING_ROUTE = `${API_BASE_URL}/api/listings/like/remove`;
export const IS_LISTING_LIKED_ROUTE = `${API_BASE_URL}/api/liked/is-listing-liked`;

// Dislike routes
export const DISLIKE_LISTING_ROUTE = `${API_BASE_URL}/api/listings/dislike`;
export const REMOVE_DISLIKE_FROM_LISTING_ROUTE = `${API_BASE_URL}/api/listings/dislike/remove`;
export const IS_LISTING_DISLIKED_ROUTE = `${API_BASE_URL}/api/disliked/is-listing-disliked`;

// Image Upload Routes
export const GET_IMAGE_UPLOAD_URL_ROUTE = `${API_BASE_URL}/api/s3/upload`;

// Order routes
export const GET_ORDER_BY_ID_ROUTE = (orderId: string) =>
  `${API_BASE_URL}/api/order/${orderId}`;
export const VALIDATE_USER_ADDRESS_ROUTE = `${API_BASE_URL}/api/address/validate`;

// Payment routes
export const PURCHASE_ROUTE = `${API_BASE_URL}/api/cart/purchase`;
export const CREATE_PAYMENT_INTENT_ROUTE = `${API_BASE_URL}/api/stripe/create-payment-intent`;

// Shipping routes
export const GET_CHEAPEST_SHIPPING_RATE_ROUTE = `${API_BASE_URL}/api/shipping/cheapest`;

// Contact/Newsletter Routes
export const SEND_CONTACT_MESSAGE_ROUTE = `${API_BASE_URL}/api/contact/messages/send`;

// Notifications Route
export const GET_USER_NOTIFICATIONS_ROUTE = `${API_BASE_URL}/api/user/notifications`;
export const DELETE_NOTIFICATION_BY_ID_ROUTE = `${API_BASE_URL}/api/notifications/delete`;
export const ENABLE_NOTIFICATIONS_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/profile/${clerkId}/enable-notifications`;
export const READ_USER_NOTIFICATIONS_ROUTE = `${API_BASE_URL}/api/notifications/update-read`;

// Chat routes
export const CREATE_MESSAGE_IN_CHAT_ROUTE = `${API_BASE_URL}/api/chat/message/create`;
export const GET_ALL_MESSAGES_IN_CHAT_ROUTE = `${API_BASE_URL}/api/chat/message/all-messages-in-chat`;
export const GET_CHAT_LIST_ROUTE = (clerkId: string) =>
  `${API_BASE_URL}/api/chat/message/${clerkId}`;

// Constants for now because of simplicity, later abstract to db
export const sizeOptions = [
  { key: 1, value: "YXS" },
  { key: 2, value: "YS" },
  { key: 3, value: "YM" },
  { key: 4, value: "YL" },
  { key: 5, value: "YXL" },
  { key: 6, value: "XXS" },
  { key: 7, value: "XS" },
  { key: 8, value: "S" },
  { key: 9, value: "M" },
  { key: 10, value: "L" },
  { key: 11, value: "XL" },
  { key: 12, value: "XXL" },
  { key: 13, value: "XXXL" },
  { key: 14, value: "28-28" }, // Pants Sizes
  { key: 15, value: "28-29" },
  { key: 16, value: "28-30" },
  { key: 17, value: "28-31" },
  { key: 18, value: "28-32" },
  { key: 19, value: "28-33" },
  { key: 20, value: "28-34" },
  { key: 21, value: "28-35" },
  { key: 22, value: "28-36" },
  { key: 23, value: "29-29" },
  { key: 24, value: "29-30" },
  { key: 25, value: "29-31" },
  { key: 26, value: "29-32" },
  { key: 27, value: "29-33" },
  { key: 28, value: "29-34" },
  { key: 29, value: "29-35" },
  { key: 30, value: "29-36" },
  { key: 31, value: "30-30" },
  { key: 32, value: "30-31" },
  { key: 33, value: "30-32" },
  { key: 34, value: "30-33" },
  { key: 35, value: "30-34" },
  { key: 36, value: "30-35" },
  { key: 37, value: "31-31" },
  { key: 38, value: "31-32" },
  { key: 39, value: "31-33" },
  { key: 40, value: "31-34" },
  { key: 41, value: "31-35" },
  { key: 42, value: "32-30" },
  { key: 43, value: "32-31" },
  { key: 44, value: "32-32" },
  { key: 45, value: "32-33" },
  { key: 46, value: "32-34" },
  { key: 47, value: "32-35" },
  { key: 48, value: "32-36" },
  { key: 49, value: "33-33" },
  { key: 50, value: "33-34" },
  { key: 51, value: "33-35" },
  { key: 52, value: "33-36" },
  { key: 53, value: "34-34" },
  { key: 54, value: "34-35" },
  { key: 55, value: "34-36" },
  { key: 56, value: "35-35" },
  { key: 57, value: "35-36" },
  { key: 58, value: "36-36" },
  { key: 59, value: "37-37" },
  { key: 60, value: "38-38" },
  { key: 61, value: "39-39" },
  { key: 62, value: "40-40" },
  { key: 63, value: "41-41" },
  { key: 64, value: "42-42" },
  { key: 65, value: "43-43" },
  { key: 66, value: "44-44" },
  { key: 67, value: "5 Mens" },
  { key: 68, value: "5.5 Mens" },
  { key: 69, value: "6 Mens" },
  { key: 70, value: "6.5 Mens" },
  { key: 71, value: "7 Mens" },
  { key: 72, value: "7.5 Mens" },
  { key: 73, value: "8 Mens" },
  { key: 74, value: "8.5 Mens" },
  { key: 75, value: "9 Mens" },
  { key: 76, value: "9.5 Mens" },
  { key: 77, value: "10 Mens" },
  { key: 78, value: "10.5 Mens" },
  { key: 79, value: "11 Mens" },
  { key: 80, value: "11.5 Mens" },
  { key: 81, value: "12 Mens" },
  { key: 82, value: "12.5 Mens" },
  { key: 83, value: "13 Mens" },
  { key: 84, value: "13.5 Mens" },
  { key: 85, value: "14 Mens" },
  { key: 86, value: "14.5 Mens" },
  { key: 87, value: "15 Mens" },
  { key: 88, value: "3 Womens" },
  { key: 89, value: "3.5 Womens" },
  { key: 90, value: "4 Womens" },
  { key: 91, value: "4.5 Womens" },
  { key: 92, value: "5 Womens" },
  { key: 93, value: "5.5 Womens" },
  { key: 94, value: "6 Womens" },
  { key: 95, value: "6.5 Womens" },
  { key: 96, value: "7 Womens" },
  { key: 97, value: "7.5 Womens" },
  { key: 98, value: "8 Womens" },
  { key: 99, value: "8.5 Womens" },
  { key: 100, value: "9 Womens" },
  { key: 101, value: "9.5 Womens" },
  { key: 102, value: "10 Womens" },
  { key: 103, value: "10.5 Womens" },
  { key: 104, value: "11 Womens" },
  { key: 105, value: "11.5 Womens" },
  { key: 106, value: "12 Womens" },
  { key: 107, value: "12.5 Womens" },
  { key: 108, value: "13 Womens" },
  { key: 109, value: "13.5 Womens" },
  { key: 110, value: "14 Womens" },
  { key: 111, value: "One-Size-Fits-All" },
];

export const clothingTypes = [
  "Shortsleeves",
  "Longsleeves",
  "Pants",
  "Shorts",
  "Outerwear",
  "Dresses",
  "Shoes",
  "Swimwear",
  "Accessories",
  "Skirts",
  "Dresses",
  "Tops",
  "Sweaters",
  "Jackets",
  "Coats",
  // Add more clothing types as needed
];

export const genders = ["Men", "Women", "Unisex"];
