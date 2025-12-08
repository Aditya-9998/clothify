
//clothify/client/frontedloadRazorpayScript.js

export async function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      console.log("✅ Razorpay SDK already loaded");
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("✅ Razorpay SDK Loaded");
      resolve(true);
    };
    script.onerror = () => {
      console.error("❌ Razorpay SDK failed to load");
      resolve(false);
    };
    document.body.appendChild(script);
  });
}
