// Use the web-push library to hide the implementation details of the communication
// between the application server and the push service.
// For details, see https://tools.ietf.org/html/draft-ietf-webpush-protocol and
// https://tools.ietf.org/html/draft-ietf-webpush-encryption.
const webPush = require("web-push");

if (!"BOzqUCX3uWaxtN8rF063PYylpJWHLsTiiaWf3Td4QMIwPLDPKHJ_ARopT_1W0lfSBKk3sIhd7CaF7BZf2pX3NKg" || !"_V6ffDG8Slay8hD2mH-uKPey_JR--nHsI3hbix6YfjE") {
  console.log(
    "You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY " +
      "environment variables. You can use the following ones:"
  );
  console.log(webPush.generateVAPIDKeys());
  return;
}
// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  "https://example.com/",
  "BOzqUCX3uWaxtN8rF063PYylpJWHLsTiiaWf3Td4QMIwPLDPKHJ_ARopT_1W0lfSBKk3sIhd7CaF7BZf2pX3NKg",
  "_V6ffDG8Slay8hD2mH-uKPey_JR--nHsI3hbix6YfjE"
);

module.exports = function (app, route) {
  app.get(route + "vapidPublicKey", function (req, res) {
    res.send("BOzqUCX3uWaxtN8rF063PYylpJWHLsTiiaWf3Td4QMIwPLDPKHJ_ARopT_1W0lfSBKk3sIhd7CaF7BZf2pX3NKg");
  });

  app.post(route + "register", function (req, res) {
    // A real world application would store the subscription info.
    res.sendStatus(201);
  });

  app.post(route + "sendNotification", function (req, res) {
    const subscription = req.body.subscription;
    const payload = req.body.payload;
    const options = {
      TTL: req.body.ttl,
    };

    setTimeout(function () {
      webPush
        .sendNotification(subscription, payload, options)
        .then(function () {
          res.sendStatus(201);
        })
        .catch(function (error) {
          console.log(error);
          res.sendStatus(500);
        });
    }, req.body.delay * 1000);
  });
};