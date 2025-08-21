import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

admin.initializeApp();

export const createUser = functions.https.onRequest(
  async (req: any, res: any) => {
    if (req.method !== "POST")
      return res.status(405).send("Method Not Allowed");

    const { name, username, email, password } = req.body;

    try {
      const user = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });

      // Optional: save extra fields in Firestore
      await admin.firestore().collection("users").doc(user.uid).set({
        name,
        username,
        email,
        createdAt: FieldValue.serverTimestamp(),
        uid: user.uid,
      });

      res.json({ uid: user.uid, email: user.email, name, username });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
);
