### 1. Reusable Process Modules

* **[MODULE: Browsing Advisor Offers]**
    1. The **User (Parent)** enters the "Financial Consultations" section in the **Mobile App**.
    2. The **Family Wallet Central System (FWCS)** displays a list of available **Financial Advisors** along with their specializations, ratings, and hourly rates.
    3. The **User** can filter and sort advisors based on their needs (e.g., credit specialist, investment advisor).

* **[MODULE: Consultation Activation]**
    1. After successful payment, the **FWCS** confirms the booking for the **Financial Consultation**.
    2. The **FWCS** provides the **User** and the **Financial Advisor** with a link to a video conference in the **Mobile Application** and **Advisor Panel**.
    3. The **FWCS** sends a notification to the **Financial Advisor** about the new client and the scheduled consultation time.

* **[MODULE: New Data Notification]**
    1.  The **Family Wallet Central System (FWCS)** detects new data or a status change in the **User's Family Financial Profile** (e.g., a new transaction, a generated financial alert, a change in subscription status).
    2.  **FWCS** generates a notification (push/email) to the **User's Mobile Application**.
    3.  The **User** is informed of the need to log in to view the details.

### 2. Main Scenarios

#### Flow: Booking and Conducting a Financial Consultation

* **Process: User books and participates in a consultation (happy path)**
    1. **[MODULE: Browsing Advisor Offers]**
    2. **Selection:** The **User** selects a preferred **Financial Advisor** and a convenient time, then proceeds to payment.
    3. **Payment:** The **User** pays for the consultation via the **Payment Module**.
    4. **[MODULE: Consultation Activation]**
    5. **[MODULE: New Data Notification]** (informs the user about the confirmed consultation).
    6. **Consultation:** The **User** and the **Financial Advisor** conduct the **Financial Consultation** at the scheduled time.
    7. **Summary:** The **Financial Advisor** provides a summary and recommendations in the **Advisor Panel**, which are then visible to the **User** in the **Mobile App**.