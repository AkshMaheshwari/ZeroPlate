# Deployment instructions for Firestore security rules

To deploy these security rules to your Firebase project:

1. Install Firebase CLI (if not already installed):
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project (if not already done):
```bash
firebase init firestore
```
   - Select your Firebase project
   - Accept default filenames (firestore.rules and firestore.indexes.json)

4. Deploy the security rules:
```bash
firebase deploy --only firestore:rules
```

## Testing Security Rules

You can test these rules in the Firebase Console:
1. Go to Firestore Database > Rules
2. Click "Simulator" tab
3. Test different scenarios:
   - Student trying to read all feedback (should fail)
   - Admin reading feedback (should succeed)
   - Student creating feedback (should succeed)
   - Anyone updating feedback (should fail)

## Security Rule Overview

- **Users Collection**: Users can only read/write their own data
- **Feedback Collection**: 
  - Admins: Read all feedback
  - Students: Create feedback and read only their own
  - Feedback is immutable (no updates/deletes)
- **Analytics Collection**: Admin read-only (writes via Cloud Functions)
