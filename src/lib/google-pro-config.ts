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
}

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
