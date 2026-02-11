# Fix Cart Issue - Instructions

## Problem
Products cannot be added to cart because they don't exist in the MongoDB database.

## Solution

### Step 1: Whitelist Your IP in MongoDB Atlas
1. Go to MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to your cluster
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Either:
   - Click "Add Current IP Address" OR
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for testing

### Step 2: Run the Seed Script
Open terminal in the server folder and run:
```bash
cd server
npm run seed
```

This will populate the database with all 9 products.

### Step 3: Test
- If NOT logged in: Cart works with local storage (should work now)
- If logged in: Cart syncs with database (will work after seeding)

## Alternative: Test Without Login
If you don't want to seed the database right now:
1. Make sure you're logged out
2. The cart will work with local storage only
3. Products will be added to cart successfully

## Files Modified
- server/scripts/seedDatabase.js - Added all 9 products
- server/models/Product.js - Added missing occasion types
- server/.env - Created with MongoDB credentials
- frontend/src/pages/SampleKit.jsx - Added cart functionality
- frontend/src/App.jsx - Passed onAdd prop to SampleKit
