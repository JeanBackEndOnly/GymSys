# Iron Gym Management System
## Presentation Overview

Welcome to the Iron Gym Management System. This platform is thoughtfully designed to streamline your gym's daily operations, centralizing everything from member registrations to attendance tracking, staff management, and point-of-sale (POS) transactions.

## Problems Solved
Traditional gym management often suffers from fragmented systems, leading to inefficiencies and lost revenue. This system solves several key problems:
* **Manual Tracking Errors:** Eliminates paper-based attendance and membership tracking.
* **Payment Inconsistencies:** Secures revenue by strictly recording face-to-face payments and instant approvals.
* **Unauthorized Access:** Prevents users with expired contracts from accessing the gym through automated QR code locking.
* **Disjointed Sales:** Integrates POS directly into the gym's management interface, keeping merchandise and membership sales in one place.

## Key Features
* **Automated Expirations & Renewals:** The system automatically manages contract lifecycles.
* **QR Code Attendance:** Fast, secure, and touch-free check-ins for active members.
* **Role-Based Access Control:** Strict permissions ensure that cashiers only handle daily operations while admins retain full financial and system control.
* **Integrated Point of Sale (POS):** Manage and sell physical products (supplements, gear) directly over the counter.
* **Walk-in & Court Rental Modules:** Seamlessly handle one-time visitors and facility bookings.

## Core Benefits
* **Increased Efficiency:** Reduces the time staff spends on administrative tasks, allowing them to focus on member experience.
* **Enhanced Security:** Face-to-face payment verification minimizes fraud and ensures all transactions are accounted for.
* **Better User Experience:** Members can easily view their workout plans, attendance, and payment history in a clean interface.
* **Data-Driven Decisions:** Comprehensive admin reports provide insights into revenue, attendance, and product sales.

### Who Uses the System?

The system is built for three primary types of users (Actors):

1. **Administrator (Admin):** Has full control over the system. This includes managing staff, viewing comprehensive reports, overriding system settings, configuring pricing, and handling full financial records.
2. **Cashier (Staff):** The face of the front desk. Cashiers handle daily operations such as member registration, recording physical payments, scanning QR codes for attendance, processing walk-ins, and handling POS purchases.
3. **Member:** The gym client. Members can view their active membership, access their unique QR code for attendance, track their workout plans, and view their payment transaction history.

---

## Detailed System Workflows

The system operates on a few core, easy-to-follow workflows. These workflows ensure that all operations are tracked and authorized correctly.

### 1. Member Registration & Membership Flow
Before a client can use the gym, they must become an official member by paying a one-time membership fee.

* **Step 1:** The user registers their details in the system (or the cashier registers them).
* **Step 2:** A unique QR code is automatically generated for the user.
* **Step 3:** The user pays the one-time membership fee face-to-face at the counter (Cash or GCash).
* **Step 4:** The cashier records the payment, enters the reference code (OR Number or GCash Reference Number), and approves the payment immediately.
* **Step 5:** The account is activated as an official Gym Member.

*Note: There are two types of memberships - Regular and Student (which requires a valid Student ID).*

### 2. Contract Subscription Flow
A Contract dictates the duration a member is allowed to access the gym (Monthly, Quarterly, or Yearly). 

* **Step 1:** The member selects a contract plan (e.g., Monthly). They can optionally add a **Trainer Package** and select a specific assigned trainer.
* **Step 2:** The member makes a face-to-face payment.
* **Step 3:** The cashier creates the contract transaction, inputs the payment reference code, and approves the transaction.
* **Step 4:** The contract becomes active, allowing gym access.
* **Step 5:** Once the contract expires, the member’s QR code is locked and blurred out. A new renewal transaction must be made to create a new contract.

### 3. QR Attendance Flow
Attendance is seamlessly tracked using the member's unique QR code.

* **Step 1:** The member presents their QR code to the scanner at the front desk.
* **Step 2:** The system automatically verifies their Membership and Contract status.
* **Step 3:** If the contract is active, the system records the "Time In" and logs the attendance.

### 4. Walk-in Flow
For clients who do not want a subscription, a walk-in system is available.

* **Step 1:** The cashier identifies if the client is an existing expired member or a completely new walk-in.
* **Step 2:** The cashier registers the walk-in and collects the per-visit fee (₱50 for expired members, ₱60 for new walk-ins).
* **Step 3:** Payment is recorded, and the walk-in attendance is successfully logged in the system.

### 5. Point of Sale (POS) Flow
The gym can sell physical products (supplements, merchandise, water, etc.) directly from the counter.

* **Step 1:** The cashier adds the desired products to the system's POS cart.
* **Step 2:** The client makes the payment (Cash/GCash).
* **Step 3:** The cashier checks out, logging the sale. The system records who bought it (if they are a member) and who sold it.
* **Step 4:** Inventory is automatically updated, and the transaction is finalized.

### 6. Court Rentals (Optional Module)
If the gym includes a basketball court, it can be rented out.

* **Step 1:** A specific time slot is booked.
* **Step 2:** Payment is collected physically by the Cashier/Admin.
* **Step 3:** The schedule is confirmed.

---

## Important System Rules & Highlights

* **Face-to-Face Payments Only:** To ensure complete financial security, all payments (Memberships, Contracts, POS, Walk-ins) are handled physically at the counter. The system does not accept online uploads of payment proofs. Cashiers authorize the payment immediately upon receiving cash or verifying a GCash transfer on the spot.
* **Instant Approval:** Because payments are made in person, there is no "pending" status. Payments are instantly marked as approved.
* **Automated Expirations:** The system runs background checks continuously. Once a contract reaches its end date, it is automatically marked as expired, restricting access until renewed.
* **Strict Security & Access Control:** Cashiers only have access to daily operations. Only Administrators can access sensitive financial reports, adjust pricing settings, manage system users, or override contracts.

---

**Thank you for choosing the Iron Gym Management System.**
This structured workflow ensures a seamless experience for both your staff and your gym members.
