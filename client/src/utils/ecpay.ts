// client/src/utils/ecpay.ts

interface ECPayData {
  apiUrl: string;
  formData: Record<string, string | number>;
}

/**
 * 接收後端傳來的 ECPay 參數，並動態建立表單以跳轉至 ECPay 付款頁面
 */
export function redirectToECPay(ecpayData: ECPayData) {
  const { apiUrl, formData } = ecpayData;

  // 1. 建立隱藏表單
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = apiUrl;
  form.style.display = 'none';

  // 2. 填入所有參數
  for (const [key, value] of Object.entries(formData)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  }

  // 3. 加入 Body 並提交
  document.body.appendChild(form);
  form.submit();
  
  // (提交後頁面會跳轉，不需要移除 form)
}