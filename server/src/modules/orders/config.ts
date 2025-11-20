// server/src/modules/orders/config.js

export const config =  {
    hasOrderResult: false, // true: 有回傳結果，false: 不會任何回傳結果(用ClientBackURL)
    
    // (二選一) 前端成功頁面api路由 (我們這次選 false，所以這行不會被用到)
     OrderResultURL : 'http://localhost:3000/ecpay/api', 
     
     // (二選一) 前端成功頁面 (付款完成後，綠界會把使用者帶回這裡)
     // [注意] 請確保您的前端真的有這個頁面，或者您可以改成 '/checkout/success' 之類
     ClientBackURL : 'http://localhost:3000/checkout/success' 
}