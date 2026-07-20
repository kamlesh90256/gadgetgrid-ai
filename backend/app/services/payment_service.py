import hmac
import hashlib

from app.core.config import RAZORPAY_KEY_SECRET


def verify_payment_signature(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
):
    body = f"{razorpay_order_id}|{razorpay_payment_id}"

    generated_signature = hmac.new(
        bytes(RAZORPAY_KEY_SECRET, "utf-8"),
        bytes(body, "utf-8"),
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(
        generated_signature,
        razorpay_signature,
    )