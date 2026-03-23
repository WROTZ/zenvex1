const crypto = require("crypto");
const { initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const Razorpay = require("razorpay");
const challengeCatalog = require("./challengeCatalog");

initializeApp();

const db = getFirestore();
const razorpayKeyId = defineSecret("RAZORPAY_KEY_ID");
const razorpayKeySecret = defineSecret("RAZORPAY_KEY_SECRET");

function getChallengeOrThrow(challengeId) {
  const challenge = challengeCatalog.find((item) => item.id === challengeId);

  if (!challenge) {
    throw new HttpsError("invalid-argument", "Invalid challenge selected.");
  }

  return challenge;
}

function getRazorpayClient() {
  return new Razorpay({
    key_id: razorpayKeyId.value(),
    key_secret: razorpayKeySecret.value(),
  });
}

exports.createRazorpayOrder = onCall(
  {
    region: "asia-south1",
    secrets: [razorpayKeyId, razorpayKeySecret],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be logged in to create an order.");
    }

    const challenge = getChallengeOrThrow(request.data?.challengeId);
    const razorpay = getRazorpayClient();
    const receipt = `zenvex_${request.auth.uid.slice(0, 8)}_${Date.now()}`;

    const order = await razorpay.orders.create({
      amount: challenge.price * 100,
      currency: challenge.currency,
      receipt,
      notes: {
        challengeId: challenge.id,
        userId: request.auth.uid,
        accountSize: String(challenge.accountSize),
      },
    });

    return {
      amount: order.amount,
      currency: order.currency,
      razorpayOrderId: order.id,
    };
  },
);

exports.verifyRazorpayPayment = onCall(
  {
    region: "asia-south1",
    secrets: [razorpayKeySecret],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "You must be logged in to verify a payment.");
    }

    const challenge = getChallengeOrThrow(request.data?.challengeId);
    const razorpayOrderId = request.data?.razorpayOrderId;
    const razorpayPaymentId = request.data?.razorpayPaymentId;
    const razorpaySignature = request.data?.razorpaySignature;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      throw new HttpsError("invalid-argument", "Missing Razorpay payment payload.");
    }

    const generatedSignature = crypto
      .createHmac("sha256", razorpayKeySecret.value())
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature.length !== razorpaySignature.length) {
      throw new HttpsError("permission-denied", "Razorpay signature verification failed.");
    }

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature, "utf8"),
      Buffer.from(razorpaySignature, "utf8"),
    );

    if (!isSignatureValid) {
      throw new HttpsError("permission-denied", "Razorpay signature verification failed.");
    }

    const existingOrderSnapshot = await db
      .collection("orders")
      .where("razorpayPaymentId", "==", razorpayPaymentId)
      .limit(1)
      .get();

    if (!existingOrderSnapshot.empty) {
      return {
        orderId: existingOrderSnapshot.docs[0].id,
        paymentStatus: "paid",
      };
    }

    const orderReference = await db.collection("orders").add({
      userId: request.auth.uid,
      accountSize: challenge.accountSize,
      price: challenge.price,
      paymentStatus: "paid",
      challengeId: challenge.id,
      razorpayOrderId,
      razorpayPaymentId,
      createdAt: FieldValue.serverTimestamp(),
    });

    await db.collection("dashboard").add({
      userId: request.auth.uid,
      accountSize: challenge.accountSize,
      phase: "Phase 1",
      status: "Active",
      balance: challenge.accountSize,
      profitPercent: 0,
      maxDrawdown: challenge.maxDrawdown,
      dailyLoss: challenge.dailyLoss,
      createdAt: FieldValue.serverTimestamp(),
    });

    return {
      orderId: orderReference.id,
      paymentStatus: "paid",
    };
  },
);
