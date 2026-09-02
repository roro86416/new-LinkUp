// server/src/modules/orders/ecpay.service.ts
/**
 * @fileoverview ECPay 金流服務模組 (老師版本)
 */

import * as crypto from 'crypto';
import { config } from './config.js';

/**
 * 產生 ECPay 金流參數
 */
export const getECPayParams = (amount = 0, items = '') => {
  let itemName =
    items.split(',').length > 1
      ? items.split(',').join('#')
      : '線上商店購買一批';

  if (items.length > 0 && items.split(',').length === 1)  {
    itemName = items;
  }

  // 除錯資訊
  console.log('ECPay Service - amount:', amount);
  console.log('ECPay Service - items:', items);

  if (!amount) {
    return {
      status: 'error',
      message: '缺少總金額',
      payload: { amount, items },
    };
  }

  // ==================== 可調整參數區域 ====================
  // 請填入您的測試帳號資料
  const MerchantID = '3002607'; 
  const HashKey = 'pwFHCqoQZGmho4w6'; 
  const HashIV = 'EkRm7iFT261dpevs'; 
  let isStage = true; // 測試環境

  // 二、輸入參數
  const TotalAmount = amount;
  const TradeDesc = 'LinkUp 活動購票'; 
  const ItemName = itemName; 
  const ReturnURL = 'https://www.ecpay.com.tw'; // 因為我們用 ClientBackURL，這裡先填官方預設

  const hasOrderResult = config.hasOrderResult || false;
  const OrderResultURL = config.OrderResultURL || 'http://localhost:3000/ecpay/api';
  const ClientBackURL = config.ClientBackURL || 'http://localhost:3000/shop/cart/success';
  const ChoosePayment = 'ALL';

  // ==================== 固定參數區域 ====================
  const stage = isStage ? '-stage' : '';
  const algorithm = 'sha256';
  const digest: crypto.BinaryToTextEncoding = 'hex'; // 明確指定型別
  const APIURL = `https://payment${stage}.ecpay.com.tw/Cashier/AioCheckOut/V5`;
  
  // 產生唯一的 MerchantTradeNo
  const MerchantTradeNo = `od${new Date().getFullYear()}${(
    new Date().getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}${new Date()
    .getDate()
    .toString()
    .padStart(2, '0')}${new Date()
    .getHours()
    .toString()
    .padStart(2, '0')}${new Date()
    .getMinutes()
    .toString()
    .padStart(2, '0')}${new Date()
    .getSeconds()
    .toString()
    .padStart(2, '0')}${new Date().getMilliseconds().toString().padStart(2)}`;

  const MerchantTradeDate = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // 三、準備 CheckMacValue 計算參數
  let ParamsBeforeCMV: any = {
    MerchantID: MerchantID,
    MerchantTradeNo: MerchantTradeNo,
    MerchantTradeDate: MerchantTradeDate.toString(),
    PaymentType: 'aio',
    EncryptType: 1,
    TotalAmount: TotalAmount,
    TradeDesc: TradeDesc,
    ItemName: ItemName,
    ReturnURL: ReturnURL,
    ChoosePayment: ChoosePayment,
  };

  if (config.hasOrderResult) {
    ParamsBeforeCMV.OrderResultURL = OrderResultURL;
  } else {
    ParamsBeforeCMV.ClientBackURL = ClientBackURL;
  }

  /**
   * 產生 CheckMacValue 驗證碼
   */
  function CheckMacValueGen(parameters: any, algorithm: string, digest: crypto.BinaryToTextEncoding) {
    let Step0;

    Step0 = Object.entries(parameters)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    function DotNETURLEncode(string: string) {
      const list: Record<string, string> = {
        '%2D': '-',
        '%5F': '_',
        '%2E': '.',
        '%21': '!',
        '%2A': '*',
        '%28': '(',
        '%29': ')',
        '%20': '+',
      };

      Object.entries(list).forEach(([encoded, decoded]) => {
        const regex = new RegExp(encoded, 'g');
        string = string.replace(regex, decoded);
      });

      return string;
    }

    const Step1 = Step0.split('&')
      .sort((a, b) => {
        const keyA = a.split('=')[0];
        const keyB = b.split('=')[0];
        return keyA.localeCompare(keyB);
      })
      .join('&');
    const Step2 = `HashKey=${HashKey}&${Step1}&HashIV=${HashIV}`;
    const Step3 = DotNETURLEncode(encodeURIComponent(Step2));
    const Step4 = Step3.toLowerCase();
    const Step5 = crypto.createHash(algorithm).update(Step4).digest(digest);
    const Step6 = Step5.toUpperCase();
    return Step6;
  }

  const CheckMacValue = CheckMacValueGen(ParamsBeforeCMV, algorithm, digest);
  const AllParams = { ...ParamsBeforeCMV, CheckMacValue };

  return {
    status: 'success',
    message: '取得ecpay金流參數成功',
    payload: { action: APIURL, params: AllParams },
  };
};