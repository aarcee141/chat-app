import express from "express";
import admin from "../config/firebase/firebase-config";


class Middleware {
	async decodeToken(req: express.Request, res: express.Response, next: express.NextFunction) {
		try {
            // Token should be defined as "Bearer ${tokenData}"
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
                const token = req.headers.authorization.split(" ")[1];
                req.params.token = token;
            }
			const decodeValue = await admin.auth().verifyIdToken(req.params.token);
			if (decodeValue) {
				req.body.user = decodeValue;
				console.log("Auth successful");
				return next();
			}
			return res.status(400).json({ message: 'Un authorize' });
		} catch (e) {
			return res.json({ message: 'Internal Error' });
		}
	}
}

export default new Middleware();