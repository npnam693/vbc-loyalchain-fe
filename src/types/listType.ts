import { ROLE } from "../constants/role";
import { ImageAGD, ImageAGDObject } from "./image";

export interface ProductTypeProps {
  options?: any;
  name: string;
  description?: string;
  dynamicContent?: string;
  expireUnit?: string;
  gtin?: string;
  imageLanguage?: Array<ImageAGD>;
  certificatesLanguage?: Array<ImageAGD>;
  uuid?: string;
  ownedBy?: string;
  status?: number;
  unit: number;
  createdAt?: string;
  category: number;
  expireTime?: number | null;
  imageBoxLanguage?: Array<ImageAGD>;
  showOrigin: boolean;
  video?: string;
  proposedPrice: number;
  certificates?: Array<string>,
  image?:Array<string>,
  imageBox?: Array<string>;
  origin?: {
    address: string;
    avatarLanguage: Array<ImageAGD>;
    bannerLanguage: Array<ImageAGD>;
    certificatesLanguage: Array<ImageAGD>;
    description: string;
    dynamicDescription: string;
    name: string;
    phone: string;
    representation: string;
    website: string;
    email: string;
    tax: string;
  };
}

export interface AreaTypeProps {
  name: string;
  description: string;
  dynamicContent: string;
  gln: string;
  imageLanguage: Array<ImageAGD>;
  uuid: string;
  ownedBy: string;
  status: number;
  createdAt: string;
  type: number;
  address: {
    city: string;
  };
  objectRegistered: number;
}

export interface ObjectTypeProps {
  name: string;
  description: string;
  dynamicContent: string;
  gln: string;
  imagesLanguage: Array<ImageAGD>;
  images360Language: Array<ImageAGD>;
  uuid: string;
  ownedBy: string;
  status: number;
  createdAt: string;
  type: number;
  nameOfProcess: string;
  nameOfProduct: string;
  nameOfZone: string;
  processCode: string;
  processCodeOfCrop: string;
  productType: string;
  statusOfCurrentCrop: number;
  zoneUuid: string;
  totalAction: number;
  totalQuality: number;
  registeredDate: string;
}

export interface ProcessProps {
  bizProcessCode: string;
  businessProcess: Array<{
    name: string;
    description: string;
  }>;
  createdAt: string;
  processName: string;
  type: number;
}

export interface EmployeeProps {
  address: string;
  date: string;
  avatar: ImageAGDObject;
  email: string;
  manageZone: Array<string>;
  name: string;
  ownedBy: string;
  password: string;
  path: number;
  phone: number;
  privateEncrypted: string;
  publicKey: string;
  role: ROLE;
  username: string;
  uuid: string;
  status: number;
  lock: boolean;
}

export interface PartnerProps {
  address: any;
  totalNumberCase: number;
  totalNumberUnit: number;
  partnerRole: ROLE;
  imagesLanguage: Array<ImageAGD>;
  name: string;
  ownedBy: string;
  uuid: string;
  branchs: Array<{
    address: string;
    description: string;
    name: string;
    ownedBy: string;
    phone: string;
    uuid: string;
    website: string;
    image: Array<ImageAGD>;
  }>;
  producttypes: Array<string>;
  hide: boolean;
}

export interface FeedbackProps {
  content: string;
  date: string;
  feedbackPoint: number;
  productUuid: string;
  productName: string;
  type: string;
}

export interface StampProps {
  amount: number;
  date: string;
  endId: string;
  endTime: number;
  ownedBy: string;
  startId: string;
  startTime: number;
  type: string;
  used: number;
}

export interface ActionProps {
  date: number;
  from_id: string;
  from_name: string;
  images: [];
  moreInfo: { harvestId: string; quantity: number };
  ownedBy: string;
  step: string;
  step_desc: string;
  toObject: { uuid: string; name: string };
  to_id: string;
}

export interface NotificationProps {
  description: string;
  documentPath: Array<string>;
  dynamicDescription: string;
  noType: number;
  notiCategory: number;
  notificationId: string;
  priorityToShowPopup: number;
  readTime: number;
  receiver: Array<{
    language: {
      vi: {
        address: string;
        description: string;
        dynamicDescription: string;
        name: string;
      };
      en: {
        address: string;
        description: string;
        dynamicDescription: string;
        name: string;
      };
    };
    uuid: string;
  }>;
  receiverOwnedBy: string;
  sendTime: number;
  sender: {
    uuid: string;
    language: {
      vi: {
        address: string;
        description: string;
        dynamicDescription: string;
        name: string;
      };
      en: {
        address: string;
        description: string;
        dynamicDescription: string;
        name: string;
      };
    };
  };
  senderOwnedBy: string;
  status: number;
  title: string;
  type: number;
}
