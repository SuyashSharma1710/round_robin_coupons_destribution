# 📖 Round-Robin Coupon Distribution with Abuse Prevention – How It Works

In this guide, I'll walk you through how the Round-Robin Coupon Distribution system is built, explaining each part step by step. This system ensures that coupons are distributed evenly while preventing users from abusing the system by refreshing the page or using multiple browsers.

try it here [Get Coupons](https://round-robin-coupons-destribution.vercel.app/)

There is the whole [DOCUMENT](https://docs.google.com/document/d/1RJwS49Jv4IcAm-IAiDfkpdETTkhWPrFbnTQr4fIZN_M/edit?usp=sharing)

## 🌟 Overview

The main goal of this system is to distribute a set of coupons to guest users, ensuring:

* ✔ Round-robin assignment → Coupons are given out in order, one by one.
* ✔ Guest access → Users don’t need to log in.
* ✔ Abuse prevention → Users can’t claim multiple coupons in a short time.

To achieve this, we use Next.js API routes to handle coupon distribution, Supabase to store and retrieve coupon data, and cookies & IP tracking to prevent abuse.

## 📌 1. How the System Works

Here’s a step-by-step breakdown:

1.  A user clicks the "Claim Coupon" button on the webpage.
2.  The frontend sends a request to the API.
3.  The API checks for abuse prevention using IP tracking & cookies.
4.  If the user hasn’t claimed recently, the API fetches the next available coupon using a round-robin method from the database.
5.  The coupon is marked as claimed and assigned to the user.
6.  A cookie is set to prevent multiple claims.
7.  The coupon code is displayed on the UI.

## 🔄 2. How Round-Robin Distribution Works

The round-robin algorithm ensures that coupons are distributed in a sequential manner, meaning every user gets a coupon in order without skipping.

### 🔹 How It Works in the Database

* Coupons are stored in a table with a unique ID and "claimed" status.
* The API selects the next unclaimed coupon in ascending order of ID.
* Once assigned, the coupon is marked as claimed, and the process continues.

### 🔹 Why Round-Robin?

* ✅ Ensures equal distribution (no random selection).
* ✅ Prevents coupon hoarding by always moving to the next available coupon.
* ✅ Works efficiently with databases using indexed queries.

## 🛠️ 3. Backend - API Logic

The backend handles coupon distribution and abuse prevention.

### 🔹 Key Responsibilities of the API

* Retrieves the next available coupon using the round-robin method.
* Checks if the user has already claimed a coupon (via IP & cookies).
* Assigns the coupon to the user and marks it as "claimed".
* Prevents multiple claims using cookies and time-based restrictions.

### 🔹 How It Prevents Abuse

* **IP Tracking** → The API records the user's IP address when they claim a coupon.
* **Cookie Tracking** → A cookie is stored in the user’s browser to block repeated claims.
* **Time Restriction** → Users can only claim once per hour.

## 🎨 4. Frontend - How the User Interacts

The frontend consists of a simple button-based UI that allows users to claim a coupon.

### 🔹 How It Works

* Users see a "Claim Coupon" button on the webpage.
* Clicking the button sends a request to the API.
* The API either returns a coupon or an error message (if abuse is detected).
* The response is displayed on the screen.

## 🗄️ 5. Database - Managing Coupons

We use Supabase to store and manage coupon data.

### 🔹 Coupons Table Structure

The database stores coupon information, including:

* Unique coupon codes
* Whether a coupon has been claimed
* The IP address of the user who claimed it
* The timestamp of when it was claimed

### 🔹 Adding New Coupons

New coupons can be added to the database in bulk, ensuring a continuous supply for users.

## 🎯 Summary

* ✅ Round-robin coupon distribution ensures fairness
* ✅ Abuse prevention stops users from claiming repeatedly
* ✅ Supabase efficiently stores and retrieves data
* ✅ Users interact with a simple button-based UI


# 🚀 Setup Guide

Follow these steps to set up and run the project:

## Prerequisites

- Node.js and npm installed.
- A Supabase account and project.
- A GitHub account (for Vercel deployment).

## Clone the Repository

```
git clone https://github.com/SuyashSharma1710/round_robin_coupons_destribution.git
cd round_robin_coupons_destribution
```

## Install Dependencies

```
npm install
```

## Configure Supabase

Create a .env.local file in the root of your project.

### Add your Supabase URL and Anon Key:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### In your Supabase project, create a coupons table with the following structure:

| Column        | Type      | Description                               |
| ------------- | --------- | ----------------------------------------- |
| id          | UUID      | Unique coupon identifier (Primary Key)    |
| code        | TEXT      | Coupon code                               |
| claimed_by_ip | TEXT      | User's IP address (if claimed)            |
| claimed_at  | TIMESTAMP | Claim time                                |

Optionally, add an order column (INTEGER) if you want to explicitly order the coupons.

### Add Initial Coupons
Use the Supabase SQL Editor to add initial coupons:

```SQL
INSERT INTO coupons (id, code) VALUES
(uuid_generate_v4(), 'COUPON123'),
(uuid_generate_v4(), 'COUPON456'),
(uuid_generate_v4(), 'COUPON789');
```

### If you added an order column, include that in the insert as well.

Run the Development Server

```
npm run dev
```

Open your browser and navigate to http://localhost:3000.

## Deploy to Vercel (Optional)

1. Push your code to a GitHub repository.
2. Go to Vercel and create a new project.
3. Select your GitHub repository.
4. In the Vercel project settings, add the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.
5. Click "Deploy".