import * as functions from "firebase-functions";
import next from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextApp = next({
  dev: isDev,
  conf: {
    distDir: ".next",
  },
});

const handle = nextApp.getRequestHandler();

exports.nextApp = functions.https.onRequest(async (req, res) => {
  await nextApp.prepare();
  return handle(req, res);
});
