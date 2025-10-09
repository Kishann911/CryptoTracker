"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateWallet = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const ethers_1 = require("ethers");
// Initialize Firebase Admin SDK
admin.initializeApp();
// Initialize Firestore
const db = admin.firestore();
/**
 * authenticateWallet - Verifies wallet signatures and creates custom Firebase tokens
 */
exports.authenticateWallet = functions.https.onRequest(async (req, res) => {
    try {
        // Set CORS headers
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }
        if (req.method !== 'POST') {
            res.status(405).send('Method Not Allowed');
            return;
        }
        const { address, signature, message } = req.body;
        if (!address || !signature || !message) {
            res.status(400).send('Missing required parameters: address, signature, message');
            return;
        }
        // Verify the signature using ethers.js
        const recoveredAddress = ethers_1.ethers.verifyMessage(message, signature);
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
            res.status(401).send('Signature verification failed');
            return;
        }
        // Check if user exists in Firestore
        const usersRef = db.collection('users');
        const userQuery = await usersRef.where('walletAddress', '==', address).limit(1).get();
        let userDoc;
        if (userQuery.empty) {
            // Create new user document
            const newUser = {
                walletAddress: address,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastLogin: admin.firestore.FieldValue.serverTimestamp(),
                preferences: {
                    currency: 'USD',
                    theme: 'dark',
                    notifications: true
                }
            };
            const newUserRef = await usersRef.add(newUser);
            userDoc = await newUserRef.get();
        }
        else {
            // Update existing user's lastLogin
            userDoc = userQuery.docs[0];
            await userDoc.ref.update({
                lastLogin: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        // Create custom token for the user
        const customToken = await admin.auth().createCustomToken(userDoc.id);
        res.status(200).send({ token: customToken, uid: userDoc.id });
    }
    catch (error) {
        console.error('Error in authenticateWallet:', error);
        res.status(500).send('Internal server error');
    }
});
//# sourceMappingURL=index.js.map