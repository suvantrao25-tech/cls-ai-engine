const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log(
  "RAZORPAY_KEY_ID =",
  process.env.RAZORPAY_KEY_ID ? "FOUND" : "MISSING"
);

console.log(
  "RAZORPAY_KEY_SECRET =",
  process.env.RAZORPAY_KEY_SECRET ? "FOUND" : "MISSING"
);

console.log(
  "SUPABASE_URL =",
  process.env.SUPABASE_URL ? "FOUND" : "MISSING"
);

console.log(
  "SUPABASE_SERVICE_ROLE_KEY =",
  process.env.SUPABASE_SERVICE_ROLE_KEY ? "FOUND" : "MISSING"
);


// =====================================================
// CREATE ORDER
// =====================================================

router.post("/create-order", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("========== CREATE ORDER AUTH ==========");
    console.log(
      "Authorization header exists:",
      !!authHeader
    );

    console.log(
      "Authorization starts with Bearer:",
      authHeader?.startsWith("Bearer ")
    );

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ AUTH HEADER MISSING");

      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    console.log("✅ TOKEN RECEIVED");
    console.log("Token length:", token.length);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    console.log("========== SUPABASE USER CHECK ==========");
    console.log("USER ID:", user?.id);
    console.log("USER EMAIL:", user?.email);
    console.log("USER ERROR:", userError);
    console.log("==========================================");

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login session",
      });
    }

    console.log("✅ USER AUTHENTICATED:", user.email);

    const options = {
      amount: 29900,
      currency: "INR",
      receipt: `cls_ai_creator_${Date.now()}`,
    };

    console.log("Creating Razorpay order...");

    const order = await razorpay.orders.create(options);

    console.log(
      "✅ RAZORPAY ORDER CREATED:",
      order.id
    );

    return res.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("========== CREATE ORDER ERROR ==========");
    console.error(error);
    console.error("Message:", error?.message);
    console.error("Status:", error?.statusCode);
    console.error(
      "Description:",
      error?.error?.description
    );
    console.error("========================================");

    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});


// =====================================================
// VERIFY PAYMENT + ACTIVATE / RENEW CREATOR PRO
// =====================================================

router.post("/verify-payment", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login session",
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details missing",
      });
    }

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("❌ INVALID RAZORPAY SIGNATURE");

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    console.log(
      "✅ PAYMENT SIGNATURE VERIFIED:",
      paymentResponseSafe(razorpay_payment_id)
    );

    // Get current profile
    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "id, plan, credits, subscription_status, subscription_plan, subscription_start, subscription_end"
      )
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error(
        "Profile fetch error:",
        profileError
      );

      return res.status(500).json({
        success: false,
        message: "Could not load account",
      });
    }

    const now = new Date();

    let startDate = now;
    let endDate = new Date(now);

    // If existing Pro subscription is still active
    // or inside grace period, extend from existing end date.
    if (
      profile.subscription_end &&
      new Date(profile.subscription_end) > now
    ) {
      startDate = new Date(profile.subscription_start || now);
      endDate = new Date(profile.subscription_end);
    }

    // Add one month
    endDate.setMonth(endDate.getMonth() + 1);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        plan: "CREATOR PRO",
        credits: 50000,
        subscription_status: "active",
        subscription_plan: "CREATOR PRO",
        subscription_start: startDate.toISOString(),
        subscription_end: endDate.toISOString(),
        last_payment_id: razorpay_payment_id,
        payment_provider: "razorpay",
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(
        "Profile update error:",
        updateError
      );

      return res.status(500).json({
        success: false,
        message:
          "Payment verified but account activation failed",
      });
    }

    console.log(
      "✅ CREATOR PRO ACTIVATED:",
      user.email
    );

    console.log(
      "Subscription ends:",
      endDate.toISOString()
    );

    return res.json({
      success: true,
      message: "Creator Pro activated successfully",
      subscription_end: endDate.toISOString(),
    });

  } catch (error) {
    console.error(
      "========== VERIFY PAYMENT ERROR =========="
    );
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
});

// =====================================================
// CHECK SUBSCRIPTION EXPIRY
// =====================================================

router.post("/check-subscription", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Login required",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid login session",
      });
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(
        "id, plan, credits, subscription_status, subscription_end"
      )
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
  return res.status(404).json({
    success: false,
    message: "Profile not found",
  });
}

console.log("SUBSCRIPTION PROFILE DEBUG:");
console.log("PLAN:", profile.plan);
console.log("SUBSCRIPTION END:", profile.subscription_end);

// Not a CREATOR PRO subscription
if (
  profile.plan !== "CREATOR PRO" ||
  !profile.subscription_end
) {
  return res.json({
    success: true,
    status: "free",
    message: "Free plan",
  });
}
    const now = new Date();

    const subscriptionEnd = new Date(
      profile.subscription_end
    );

    console.log("========== SUBSCRIPTION DEBUG ==========");
    console.log("NOW:", now.toISOString());
    console.log(
      "SUBSCRIPTION END:",
      subscriptionEnd.toISOString()
    );

    // Grace period = 7 days
    const GRACE_PERIOD_DAYS = 7;

    const graceEnd = new Date(subscriptionEnd);

    graceEnd.setDate(
      graceEnd.getDate() + GRACE_PERIOD_DAYS
    );

    console.log(
      "GRACE END:",
      graceEnd.toISOString()
    );

    console.log(
      "NOW < SUBSCRIPTION END:",
      now < subscriptionEnd
    );

    console.log(
      "NOW < GRACE END:",
      now < graceEnd
    );

    console.log("========================================");

    // Still active
    if (now < subscriptionEnd) {
      return res.json({
        success: true,
        status: "active",
        plan: "CREATOR PRO",
        subscription_end:
          subscriptionEnd.toISOString(),
      });
    }

    // Inside 7-day grace period
    if (now < graceEnd) {
      await supabase
        .from("profiles")
        .update({
          subscription_status: "grace",
        })
        .eq("id", user.id);

      return res.json({
        success: true,
        status: "grace",
        plan: "CREATOR PRO",
        grace_end: graceEnd.toISOString(),
        message:
          "Subscription expired. You are in the 7-day grace period.",
      });
    }

    // Grace period finished
    await supabase
      .from("profiles")
      .update({
        plan: "FREE",
        credits: 5000,
        subscription_status: "expired",
        subscription_plan: "FREE",
      })
      .eq("id", user.id);

    console.log(
      "CREATOR PRO -> FREE:",
      user.email
    );

    return res.json({
      success: true,
      status: "free",
      plan: "FREE",
      message:
        "Grace period ended. Account returned to FREE.",
    });
  } catch (error) {
    console.error(
      "Subscription check error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Subscription check failed",
    });
  }
});

// =====================================================
// HELPER
// =====================================================

function paymentResponseSafe(paymentId) {
  if (!paymentId) return "UNKNOWN";

  return `${paymentId.substring(0, 8)}...`;
}

module.exports = router;