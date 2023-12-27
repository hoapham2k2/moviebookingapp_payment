const express = require("express");
const { VNPay } = require("vnpay");
const app = express();
const port = 3000;

const vnp_TmnCode = "2SSQ88M4";
const vnp_HashSecret = "NVPJRJWYZKKQBVHVDIOOGSPSTNYZOZRD";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const vnp_Returnurl = "http://localhost:3000/order/vnpay_return";
const vnp_apiUrl = "http://sandbox.vnpayment.vn/merchant_webapi/merchant.html";

// Create instance
const vnpayInstance = new VNPay({
  paymentGateway: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", //your payment gateway, default is sandbox
  tmnCode: vnp_TmnCode, // your tmn code
  secureSecret: vnp_HashSecret, // your secure secret
  returnUrl: vnp_Returnurl, // return url
});

app.get("/", async (req, res) => {
  const urlString = await vnpayInstance.buildPaymentUrl({
    vnp_Amount: 100000, // amount in VND
    vnp_IpAddr: req.ip, // user ip address
    vnp_TxnRef: "111111", // ma hoa don
    vnp_OrderInfo: `Thanh toan cho ma GD: `,
  });
  console.log(urlString);

  await res.redirect(urlString);
});

app.get("/order/vnpay_return", async (req, res) => {
  // `req.query` is the query string from VNPay
  const verifyResult = await vnpayInstance.verifyReturnUrl(req.query);
  console.log(verifyResult);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
