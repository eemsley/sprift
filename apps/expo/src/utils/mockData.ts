import { type User } from ".prisma/client";

export interface ListingType {
  id: string;
  description: string;
  price: number;
  sellerName: string;
  seller: User;
  sellerProfilePicUrl: string;
  address: string;
  imagePaths: string[];
  likes: number;
  dislikes: number;
  carts: number;
  size: string;
  gender: string;
  clothingType: string;
}
export interface ProfileType {
  id: string;
  username: string;
  bio: string;
  profilePic: string;
  notificationsEnabled: boolean;
  following: User[];
  followers: User[];
  numSales: number;
}

export interface AllProfilesType {
  id: string;
  username: string;
  profilePic: string;
  email: string;
}
export interface NotificationType {
  id: string;
  message: string;
  viewed: boolean;
  createdAt: string;
  notificationType: string;
}

export const listings: ListingType[] = [
  {
    id: "1",
    description: "test listing one",
    price: 30.99,
    sellerName: "user123",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://freerangestock.com/sample/126658/nike-shoes-.jpg",
      "https://cdn.pixabay.com/photo/2017/08/07/17/17/nike-2605887_1280.jpg",
    ],
    likes: 245,
    dislikes: 24,
    carts: 6,
    size: "9",
    seller: {} as User,
    gender: "M",
    clothingType: "Shirt",
  },
  {
    id: "2",
    description: "test listing two",
    price: 7.98,
    sellerName: "user456",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/fl8489490503-image-kybehsua.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=80cf8a19a2d87016abbed3449e7a65cd",
    ],
    likes: 500,
    dislikes: 31,
    carts: 4,
    size: "S",
    seller: {} as User,
    gender: "M",
    clothingType: "Shirt",
  },
  {
    id: "3",
    description: "test listing three",
    price: 999.99,
    sellerName: "tallenlol",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://process.fs.grailed.com/AJdAgnqCST4iPtnUxiGtTz/auto_image/cache=expiry:max/rotate=deg:exif/resize=height:1400/output=quality:50/no_metadata/compress/IWTrHNxBRb2RESu3cjNS",
      "https://s7d1.scene7.com/is/image/MoosejawMB/10479500x1081539_zm?$product1500$",
    ],
    likes: 503,
    dislikes: 31,
    carts: 4,
    size: "M",
    seller: {} as User,
    gender: "M",
    clothingType: "Shirt",
  },
  {
    id: "4",
    description: "test listing four",
    price: 30.99,
    sellerName: "user123",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://media-photos.depop.com/b1/21942273/1536727012_f3ece9aefd7d443e992448d6232bdb21/P0.jpg",
      "https://media-photos.depop.com/b1/21942273/1536727049_146ed11a4ae949b687f495b3218c4be2/P0.jpg",
      "https://media-photos.depop.com/b1/21942273/1536727090_cb1f63e202554c22b8d22e9844c807a6/P0.jpg",
    ],
    likes: 2,
    dislikes: 24,
    carts: 6,
    seller: {} as User,
    size: "9",
    gender: "M",
    clothingType: "Shirt",
  },
  {
    id: "5",
    description: "test listing five",
    price: 30.99,
    sellerName: "user123",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://media-photos.depop.com/b1/12762588/1536929073_4d9b4859654e4db191631940ea378820/P0.jpg",
      "https://media-photos.depop.com/b1/12762588/1536929089_84580b6c5b8a49368948f02135c8a746/P0.jpg",
    ],
    likes: 25,
    dislikes: 24,
    carts: 6,
    seller: {} as User,
    size: "9",
    gender: "M",
    clothingType: "Shirt",
  },
  {
    id: "6",
    description: "test listing five",
    price: 30.99,
    sellerName: "user123",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://s7d1.scene7.com/is/image/MoosejawMB/10479500x1081539_zm?$product1500$",
    ],
    likes: 27,
    dislikes: 24,
    carts: 6,
    size: "9",
    seller: {} as User,
    gender: "M",
    clothingType: "Shirt",
  },
  {
    id: "9",
    description: "test listing five",
    price: 30.99,
    sellerName: "user123",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://media-photos.depop.com/b0/21560847/1141105064_3a6c0170978d41da8f5ba5b373f6a6f9/P0.jpg",
    ],
    likes: 321,
    dislikes: 24,
    carts: 6,
    seller: {} as User,
    size: "9",
    gender: "M",
    clothingType: "Shirt",
  },
  {
    id: "8",
    description: "test listing five",
    price: 30.99,
    sellerName: "user123",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://pixnio.com/free-images/2017/07/11/2017-07-11-10-34-32.jpg",
    ],
    likes: 322,
    dislikes: 24,
    seller: {} as User,
    carts: 6,
    size: "9",
    gender: "M",
    clothingType: "Shirt",
  },
  {
    id: "7",
    description: "test listing five",
    price: 30.99,
    sellerName: "user123",
    sellerProfilePicUrl:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    address: "123 First Street",
    imagePaths: [
      "https://p1.pxfuel.com/preview/580/348/988/shirts-things-top-view-denim.jpg",
    ],
    likes: 22,
    dislikes: 24,
    carts: 6,
    seller: {} as User,
    size: "9",
    gender: "M",
    clothingType: "Shirt",
  },
];

interface StyleSelection {
  name: string;
  tagName: string;
  imageSrc: string;
  selected: boolean;
}

export const mockStyleSelection: StyleSelection[] = [
  {
    name: "Streetwear",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/hanger-356109.appspot.com/o/mock-styles%2Fstreetwear.jpeg?alt=media&token=f0afc4e9-1582-467f-b987-207876021385",
    tagName: "streetwear",
    selected: false,
  },
  {
    name: "Archive",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/hanger-356109.appspot.com/o/mock-styles%2Farchive.jpeg?alt=media&token=eb65a61d-70da-484e-8a76-5e84da70e30a",
    tagName: "archive",
    selected: false,
  },
  {
    name: "Workwear",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/hanger-356109.appspot.com/o/mock-styles%2Fworkwear.jpeg?alt=media&token=95dfb2a1-9826-447d-9e5d-39ecadc9da08",
    tagName: "workwear",
    selected: false,
  },
  {
    name: "Y2K",
    imageSrc:
      "https://firebasestorage.googleapis.com/v0/b/hanger-356109.appspot.com/o/mock-styles%2Fy2k.jpeg?alt=media&token=88aa25d5-800b-431a-be49-0280e6cf26b9",
    tagName: "y2k",
    selected: false,
  },
];

interface KeywordSelection {
  keyword: string;
  selected: boolean;
}

export const mockKeywords: KeywordSelection[] = [
  { keyword: "Classic", selected: false },
  { keyword: "Vintage", selected: false },
  { keyword: "Minimalist", selected: false },
  { keyword: "Bohemian", selected: false },
  { keyword: "Edgy", selected: false },
  { keyword: "Preppy", selected: false },
  { keyword: "Chic", selected: false },
  { keyword: "Sporty", selected: false },
  { keyword: "Romantic", selected: false },
  { keyword: "Casual", selected: false },
  { keyword: "Glamorous", selected: false },
  { keyword: "Retro", selected: false },
  { keyword: "Artsy", selected: false },
  { keyword: "Urban", selected: false },
  { keyword: "Eclectic", selected: false },
  { keyword: "Sophisticated", selected: false },
  { keyword: "Grunge", selected: false },
  { keyword: "Contemporary", selected: false },
  { keyword: "Elegant", selected: false },
  { keyword: "Whimsical", selected: false },
  { keyword: "Avant-garde", selected: false },
  { keyword: "Boho", selected: false },
  { keyword: "Masculine", selected: false },
  { keyword: "Feminine", selected: false },
  { keyword: "Streetwear", selected: false },
  { keyword: "Traditional", selected: false },
  { keyword: "Experimental", selected: false },
  { keyword: "Polished", selected: false },
  { keyword: "Playful", selected: false },
];

export interface OrderType {
  id: string;
  date: string;
  price: number;
  items: ListingType[];
  status: "Processing" | "Shipped" | "Delivered";
}

export const mockOrders: OrderType[] = [
  {
    id: "1234567890",
    date: "May 23, 2023",
    price: 1038.99,
    status: "Processing",
    items: [
      {
        id: "1",
        description: "test listing one",
        price: 30.99,
        sellerName: "user123",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 First Street",
        imagePaths: [
          "https://freerangestock.com/sample/126658/nike-shoes-.jpg",
          "https://cdn.pixabay.com/photo/2017/08/07/17/17/nike-2605887_1280.jpg",
        ],
        likes: 245,
        dislikes: 24,
        carts: 6,
        size: "9",
        seller: {} as User,
        gender: "M",
        clothingType: "Shirt",
      },
      {
        id: "2",
        description: "test listing two",
        price: 7.98,
        sellerName: "user123",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 First Street",
        imagePaths: [
          "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/fl8489490503-image-kybehsua.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=80cf8a19a2d87016abbed3449e7a65cd",
        ],
        likes: 500,
        dislikes: 31,
        carts: 4,
        seller: {} as User,
        size: "S",
        gender: "M",
        clothingType: "Shirt",
      },
      {
        id: "3",
        description: "test listing three",
        price: 999.99,
        sellerName: "tallenlol",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 First Street",
        imagePaths: [
          "https://process.fs.grailed.com/AJdAgnqCST4iPtnUxiGtTz/auto_image/cache=expiry:max/rotate=deg:exif/resize=height:1400/output=quality:50/no_metadata/compress/IWTrHNxBRb2RESu3cjNS",
          "https://s7d1.scene7.com/is/image/MoosejawMB/10479500x1081539_zm?$product1500$",
        ],
        likes: 503,
        dislikes: 31,
        carts: 4,
        seller: {} as User,
        size: "M",
        gender: "M",
        clothingType: "Shirt",
      },
    ],
  },
  {
    id: "1234567891",
    date: "May 23, 2023",
    price: 1100.97,
    status: "Delivered",
    items: [
      {
        id: "1",
        description: "test listing one",
        price: 30.99,
        sellerName: "user123",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 First Street",
        imagePaths: [
          "https://freerangestock.com/sample/126658/nike-shoes-.jpg",
          "https://cdn.pixabay.com/photo/2017/08/07/17/17/nike-2605887_1280.jpg",
        ],
        likes: 245,
        dislikes: 24,
        carts: 6,
        seller: {} as User,
        size: "9",
        gender: "M",
        clothingType: "Shirt",
      },
      {
        id: "2",
        description: "test listing two",
        price: 7.98,
        sellerName: "user456",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 First Street",
        imagePaths: [
          "https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/fl8489490503-image-kybehsua.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=80cf8a19a2d87016abbed3449e7a65cd",
        ],
        likes: 500,
        dislikes: 31,
        carts: 4,
        size: "S",
        seller: {} as User,
        gender: "M",
        clothingType: "Shirt",
      },
      {
        id: "3",
        description: "test listing three",
        price: 999.99,
        sellerName: "tallenlol",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 First Street",
        imagePaths: [
          "https://process.fs.grailed.com/AJdAgnqCST4iPtnUxiGtTz/auto_image/cache=expiry:max/rotate=deg:exif/resize=height:1400/output=quality:50/no_metadata/compress/IWTrHNxBRb2RESu3cjNS",
          "https://s7d1.scene7.com/is/image/MoosejawMB/10479500x1081539_zm?$product1500$",
        ],
        likes: 503,
        dislikes: 31,
        carts: 4,
        seller: {} as User,
        size: "M",
        gender: "M",
        clothingType: "Shirt",
      },
      {
        id: "4",
        description: "test listing four",
        price: 30.99,
        sellerName: "user123",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 First Street",
        imagePaths: [
          "https://freerangestock.com/sample/126658/nike-shoes-.jpg",
          "https://cdn.pixabay.com/photo/2017/08/07/17/17/nike-2605887_1280.jpg",
        ],
        likes: 2,
        dislikes: 24,
        carts: 6,
        size: "9",
        seller: {} as User,
        gender: "M",
        clothingType: "Shirt",
      },
      {
        id: "5",
        description: "test listing five",
        price: 30.99,
        sellerName: "user123",
        sellerProfilePicUrl:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        address: "123 First Street",
        imagePaths: [
          "https://freerangestock.com/sample/126658/nike-shoes-.jpg",
          "https://cdn.pixabay.com/photo/2017/08/07/17/17/nike-2605887_1280.jpg",
        ],
        likes: 25,
        dislikes: 24,
        carts: 6,
        seller: {} as User,
        size: "9",
        gender: "M",
        clothingType: "Shirt",
      },
    ],
  },
];
