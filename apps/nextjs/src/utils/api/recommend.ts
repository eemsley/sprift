import { Prisma } from "@spree/db";

export interface PrismaListingRaw {
  id: string;
  description: string;
  price: number;
  saveForLaterCount: number;
  archived: number;
  status: string;
  gender: string;
  weight: number;
  weightUnit: string;
  listingType: string;
  sellerId: string;
  sellerExternalId: string;
  sellerExternalAttributes: unknown;
  sellerBio: string;
  sellerFilters: string;
  sellerStripeCustomerId: string | null;
  sellerEmail: string;
  sellerNumSales: number;
  sellerNotificationsEnabled: number;
  sellerName: string;
  sellerCity: string;
  sellerCountry: string;
  sellerPhone: string;
  sellerState: string;
  sellerStreet1: string;
  sellerStreet2: string | null;
  sellerZip: string;
  sellerProfilePicUrl: string;
  // Comma seperated
  imagePaths: string;
  likes: bigint;
  dislikes: bigint;
  carts: bigint;
  size: string;
  clothingType: string;
}

export const recommendNativeSQL = (userId: string) => Prisma.sql`
    SELECT
      lst.id AS id,
      lst.description AS description,
      lst.price AS price,
      lst.saveForLaterCount AS saveForLaterCount,
      lst.archived AS archived,
      lst.status AS status,
      lst.gender AS gender,
      lst.weight AS weight,
      lst.weightUnit AS weightUnit,
      lst.listingType AS listingType,
      -- 	Seller Info
      s.id as sellerId,
      s.externalId as sellerExternalId,
      s.externalAttributes as sellerExternalAttributes,
      s.stripeCustomerId as sellerStripeCustomerId,
      s.notificationsEnabled as sellerNotificationsEnabled,
      s.bio as sellerBio,
      s.filters as sellerFilters,
      s.email as sellerEmail,
      s.numSales as sellerNumSales,
      s.notificationsEnabled as sellerNotificationsEnabled,
      s.name as sellerName,
      s.city as sellerCity,
      s.country as sellerCountry,
      s.phone as sellerPhone,
      s.state as sellerState,
      s.street1 as sellerStreet1,
      s.street2 as sellerStreet2,
      s.zip as sellerZip,
      s.bio as sellerBio,
	    s.filters as sellerFilters,
      -- If seller has username, returns that, if not returns everything before the @ in the seller email. 	
      IF(s.username != "", s.username, SUBSTRING_INDEX(s.email, '@', 1)) AS sellerName,
      s.profilePic AS sellerProfilePicUrl,
      GROUP_CONCAT(lip.path) AS imagePaths,
      count(sl.listingId) AS likes,
      count(sd.listingId) AS dislikes,
      count(sc.listingId) AS carts,
      lst.size AS size,
      lst.listingType AS clothingType,
      -- 	Data addressing if query is TagsMatched or Liked
      count(stt.tag) AS tagsMatched,
        0 AS liked
    FROM
      Listing lst
      JOIN StyleTag stt ON lst.id = stt.listingId
      JOIN UserStyleTag ust ON stt.tag = ust.tag
      LEFT JOIN ListingImagePath lip ON lst.id = lip.listingId
      LEFT JOIN spree.Like sl ON lst.id = sl.listingId
      LEFT JOIN Dislike sd ON lst.id = sd.listingId
      LEFT JOIN Cart sc ON lst.id = sc.listingId
      JOIN User s ON lst.sellerId = s.id
    WHERE
      ust.userId = ${userId} AND
      lst.status = 'STAGING' AND
      sellerId != ${userId}
    GROUP BY
      lst.id, lst.createdAt, lst.updatedAt, lst.sellerId, lst.listingType,
      lst.size, lst.price, lst.description, lst.saveForLaterCount,
      lst.archived, lst.status, lst.gender, lst.weight, lst.weightUnit,
      s.stripeCustomerId, s.email, s.numSales, s.notificationsEnabled, s.name,
      s.city, s.country, s.phone, s.state, s.street1, s.street2, s.zip,
      s.bio, s.filters, s.username, s.profilePic
    UNION
    -- 2nd  query returns Listings for a user based on their Likes of a Listing
    SELECT
      lst.id AS id,
       lst.description AS description,
      lst.price AS price,
      lst.saveForLaterCount AS saveForLaterCount,
      lst.archived AS archived,
      lst.status AS status,
      lst.gender AS gender,
      lst.weight AS weight,
      lst.weightUnit AS weightUnit,
      lst.listingType AS listingType,
      -- 	Seller Info
      s.id as sellerId,
      s.externalId as sellerExternalId,
      s.externalAttributes as sellerExternalAttributes,
      s.stripeCustomerId as sellerStripeCustomerId,
      s.notificationsEnabled as sellerNotificationsEnabled,
      s.bio as sellerBio,
      s.filters as sellerFilters,
      s.email as sellerEmail,
      s.numSales as sellerNumSales,
      s.notificationsEnabled as sellerNotificationsEnabled,
      s.name as sellerName,
      s.city as sellerCity,
      s.country as sellerCountry,
      s.phone as sellerPhone,
      s.state as sellerState,
      s.street1 as sellerStreet1,
      s.street2 as sellerStreet2,
      s.zip as sellerZip,
      s.bio as sellerBio,
      s.filters as sellerFilters,
      -- If seller has username, returns that, if not returns everything before the @ in the seller email. 	
      IF(s.username != "", s.username, SUBSTRING_INDEX(s.email, '@', 1)) AS sellerName,
      s.profilePic AS sellerProfilePicUrl,
      GROUP_CONCAT(lip.path) AS imagePaths,
      count(sl.listingId) AS likes,
      count(sd.listingId) AS dislikes,
      count(sc.listingId) AS carts,
      lst.size AS size,
      lst.listingType AS clothingType,	
      -- 	Data addressing if query is TagsMatched or Liked
      0 AS TagsMatched,
        1 AS Liked
    FROM
      Listing lst
      LEFT JOIN ListingImagePath lip ON lst.id = lip.listingId
      JOIN StyleTag stt ON lst.id = stt.listingId
      JOIN UserStyleTag ust ON stt.tag = ust.tag
      LEFT JOIN spree.Like sl ON lst.id = sl.listingId
      LEFT JOIN Dislike sd ON lst.id = sd.listingId
      LEFT JOIN Cart sc ON lst.id = sc.listingId
      JOIN User s ON lst.sellerId = s.id
    WHERE
      sl.userId = ${userId} AND
      lst.status = 'STAGING' AND
      sellerId != ${userId}
    GROUP BY
      lst.id, lst.createdAt, lst.updatedAt, lst.sellerId, lst.listingType,
      lst.size, lst.price, lst.description, lst.saveForLaterCount,
      lst.archived, lst.status, lst.gender, lst.weight, lst.weightUnit,
      s.stripeCustomerId, s.email, s.numSales, s.notificationsEnabled, s.name,
      s.city, s.country, s.phone, s.state, s.street1, s.street2, s.zip,
      s.bio, s.filters, s.username, s.profilePic;
    `;
