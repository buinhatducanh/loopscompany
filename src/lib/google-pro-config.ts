export interface GoogleProConfig {
  price: number;
  originalPrice: number;
  durationMonths: number;
  storageGb: number;
  bankId: string; // Mã ngân hàng VietQR (VD: MB, VCB, TCB, VPB, TPB, ACB)
  bankName: string;
  accountNumber: string;
  accountName: string;
  defaultActivationLink: string;
  zaloSupport: string;
  hotline: string;
  adVideoUrl: string;
  adVideoLocalUrl: string;
  adPosterUrl: string;
}

export const GOOGLE_PRO_MEDIA = {
  // 1. BANNER VIDEO (Woman advertising Google Gemini Pro)
  banner: {
    videoUrl: "https://res.cloudinary.com/dhlmvawmi/video/upload/f_auto,q_auto/v1791971694/loop_ads/google_pro_banner_advertising.mp4",
    videoLocalUrl: "/videos/Woman_advertising_Google_Gemini_Pro.mp4",
    posterUrl: "/img/woman_office_google_pro.jpg",
  },

  // 2. CARD ADS SPOTLIGHT VIDEO (Woman holding smartphone showing ad)
  cardSpotlight: {
    videoUrl: "https://res.cloudinary.com/dhlmvawmi/video/upload/f_auto,q_auto/v1791969423/loop_ads/google_pro_holding_smartphone.mp4",
    videoLocalUrl: "/videos/Woman_holding_smartphone_showing_ad.mp4",
    posterUrl: "/img/ads-google-pro-stopped.jpg",
  },

  // Default / Backwards compatibility
  videoUrl: "https://res.cloudinary.com/dhlmvawmi/video/upload/f_auto,q_auto/v1791969423/loop_ads/google_pro_holding_smartphone.mp4",
  videoLocalUrl: "/videos/Woman_holding_smartphone_showing_ad.mp4",
  posterUrl: "/img/ads-google-pro-stopped.jpg",
};

export const GOOGLE_PRO_CONFIG: GoogleProConfig = {
  price: 299000,
  originalPrice: 1850000,
  durationMonths: 18,
  storageGb: 5000,
  bankId: process.env.NEXT_PUBLIC_GOOGLE_PRO_BANK_ID || "TCB",
  bankName: process.env.NEXT_PUBLIC_GOOGLE_PRO_BANK_NAME || "Techcombank",
  accountNumber: process.env.NEXT_PUBLIC_GOOGLE_PRO_ACCOUNT_NO || "3378443602",
  accountName: process.env.NEXT_PUBLIC_GOOGLE_PRO_ACCOUNT_NAME || "BUI NHAT DUC ANH",
  defaultActivationLink: process.env.NEXT_PUBLIC_GOOGLE_PRO_ACTIVATION_LINK || "https://one.google.com/family/join?token=ACTIVE_LOOP_GOOGLE_PRO_18M",
  zaloSupport: process.env.NEXT_PUBLIC_GOOGLE_PRO_ZALO || "https://zalo.me/0378443602",
  hotline: process.env.NEXT_PUBLIC_GOOGLE_PRO_HOTLINE || "0378 443 602",
  adVideoUrl: GOOGLE_PRO_MEDIA.videoUrl,
  adVideoLocalUrl: GOOGLE_PRO_MEDIA.videoLocalUrl,
  adPosterUrl: GOOGLE_PRO_MEDIA.posterUrl,
};

export function generateOrderCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let random = "";
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GG18M-${random}`;
}

export function getVietQrUrl(
  bankId: string,
  accountNo: string,
  accountName: string,
  amount: number,
  orderCode: string
): string {
  const cleanBank = encodeURIComponent(bankId.trim());
  const cleanAcc = encodeURIComponent(accountNo.trim());
  const memo = encodeURIComponent(`GGPRO ${orderCode}`);
  const name = encodeURIComponent(accountName.trim());
  return `https://img.vietqr.io/image/${cleanBank}-${cleanAcc}-compact2.png?amount=${amount}&addInfo=${memo}&accountName=${name}`;
}
