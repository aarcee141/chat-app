var admin = require("firebase-admin");

import serviceAccount from "./serviceAccount.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;
