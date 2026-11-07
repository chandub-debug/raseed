# Test Case 5 — User Provides Contradictory Dates

## Purpose
Tests whether RASEED detects and flags timeline inconsistencies rather than silently including them in the complaint — which could make the complaint look unreliable.

---

## User Input (Step 1 — Intake conversation)

**User:** I ordered a laptop bag from Flipkart in September 2024 for ₹2,200. It was delivered but the zipper was broken. I reported it to Flipkart on 30th August 2024 and they rejected my complaint.

**RASEED:** I'm sorry to hear the product arrived damaged. I want to make sure I have the timeline right before we proceed — you mentioned the order was placed in September 2024, but the complaint was raised on 30th August 2024, which would be before the order was placed. Could you clarify the dates?

**User:** Oh sorry, I mean I reported it on 30th September 2024, not August.

**RASEED:** No problem at all — thank you for clarifying. So the order was placed in September 2024, delivered sometime in September, and you raised the complaint on 30th September 2024. Do you remember roughly when in September the order was placed?

**User:** I think around 20th September 2024.

**RASEED:** So the sequence would be: order placed ~20 September → product delivered (say 23-24 September) → complaint raised 30 September, which is about 6-7 days after delivery. That makes sense within Flipkart's return window. Can you confirm the delivery date from your order history?

**User:** Yes, delivery was on 24th September 2024 according to the app.

**RASEED:** Perfect, that's a consistent timeline now. Ordered 20 September, delivered 24 September, complaint raised 30 September — 6 days after delivery. I have a clear picture of the situation. Please click 'Continue' to upload your evidence.

---

## Step 2 — Evidence Uploaded

Files uploaded:
- `flipkart_order_history.png`
- `flipkart_delivery_confirmation.png`
- `flipkart_complaint_rejection.png`
- `broken_zipper_photo.jpg`

## Step 2 — Evidence Analysis Output

```json
{
  "evidenceClaims": [
    {
      "id": "ec-001",
      "claim": "Order placed on approximately 20 September 2024 for ₹2,200",
      "category": "Order",
      "status": "verified",
      "linkedFileIds": ["flipkart_order_history.png"],
      "notes": "App history shows order placed 20 Sep 2024, amount ₹2,200"
    },
    {
      "id": "ec-002",
      "claim": "Product delivered on 24 September 2024",
      "category": "Delivery",
      "status": "verified",
      "linkedFileIds": ["flipkart_delivery_confirmation.png"],
      "notes": "Delivery confirmation shows 24 Sep 2024"
    },
    {
      "id": "ec-003",
      "claim": "Complaint raised on 30 September 2024 — within return window",
      "category": "Communication",
      "status": "verified",
      "linkedFileIds": ["flipkart_complaint_rejection.png"],
      "notes": "Complaint rejection message is dated 30 Sep 2024, confirming the complaint was raised on that date. This is 6 days after delivery."
    },
    {
      "id": "ec-004",
      "claim": "The laptop bag zipper was broken on arrival",
      "category": "Product Quality",
      "status": "unverified",
      "linkedFileIds": ["broken_zipper_photo.jpg"],
      "notes": "Photo shows broken zipper but cannot independently confirm it was in this condition on delivery. No unboxing video available."
    }
  ],
  "missingEvidence": [
    "An unboxing video or photo taken at the time of delivery would directly prove the defect was present on arrival",
    "Screenshot of the original complaint submitted to Flipkart (not just the rejection) showing what was reported"
  ],
  "overallAssessment": "Timeline is now consistent after clarification. The complaint was raised within Flipkart's typical 7-day return window for damaged products. The main evidential gap is proving the defect was present at delivery."
}
```

---

## What RASEED did correctly in this test

1. ✅ **Immediately flagged the contradiction** — "you mentioned the order was placed in September 2024, but the complaint was raised on 30th August 2024, which would be before the order was placed"
2. ✅ **Did not silently proceed** — stopped and asked for clarification before building the timeline
3. ✅ **Resolved the contradiction collaboratively** — walked the user through confirming each date
4. ✅ **Used the corrected, consistent timeline** in all downstream analysis and the complaint draft
5. ✅ **The generated complaint uses only the verified dates** — no mention of "August" anywhere

## Where RASEED could fail (honest assessment)

- If the user had not caught the contradiction and insisted "August is correct", RASEED might have still built the complaint using an impossible timeline (order in September, complaint in August)
- RASEED does not independently verify dates against external sources — it relies on what the user confirms
- If dates are plausible but still wrong (e.g., user says "October" instead of "November" and both are plausible), RASEED would not catch it

---
*Output generated by RASEED — Consumer Dispute Assistant*
