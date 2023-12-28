const express = require("express");
const { VNPay } = require("vnpay");
const app = express();
const port = 3000;

const vnp_TmnCode = "2SSQ88M4";
const vnp_HashSecret = "NVPJRJWYZKKQBVHVDIOOGSPSTNYZOZRD";
const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
//check env production or development
if (process.env.NODE_ENV === "production") {
  vnp_Returnurl = "https://moviebookingapp.vercel.app/";
} else {
  vnp_Returnurl = "http://localhost:8100/";
}

vnp_Returnurl +="paymentStatus"


// Create instance
const vnpayInstance = new VNPay({
  paymentGateway: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html", //your payment gateway, default is sandbox
  tmnCode: vnp_TmnCode, // your tmn code
  secureSecret: vnp_HashSecret, // your secure secret
  returnUrl: vnp_Returnurl, // return url
});

app.get("/", async (req, res, next) => {
  // Build payment url with params (ORDER_ID, AMOUNT, BANK_CODE, IP, ...)

  //get order id from req.query
  const ORDER_ID = req.query.order_id; // https://localhost:3000/?order_id=123456
  if (!ORDER_ID) {
    return res.status(400).send("Missing order id");
  }

  const urlString = await vnpayInstance.buildPaymentUrl({
    vnp_Amount: 100000, // amount in VND
    vnp_IpAddr: req.ip, // user ip address
    vnp_TxnRef: ORDER_ID, // order id
    vnp_OrderInfo: `Thanh toan mua ve xem phim`, // order info
  });
  console.log(urlString);

  await res.redirect(urlString);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
