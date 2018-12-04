importScripts("https://www.gstatic.com/firebasejs/5.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.0.0/firebase-messaging.js");
firebase.initializeApp({ "messagingSenderId": "885201653526" });
var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log("Received notification through service worker", payload.data);
  var notificationTitle = payload.data.title;
  var notificationOptions = {
    body : "",
    data : { title : payload.data.title },
    icon : "/images/logo.png"
  };

  switch (payload.data.title) {
    case "account-activated":
      notificationTitle = "تم تفعيل الحساب بنجاح";
      notificationOptions.body = "لقد تم تفعيل حسابك بنجاح, يمكنك الآن رؤية معلومات الشركات.";
      break;
    case "subscription-approved":
      notificationTitle = "لقد تم قبول إشتراكك";
      notificationOptions.body = "سوف يتم إظهار شركتك في نتائج البحث";
      break;
  }

  return self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener("notificationclick", function(event) {
  event.notification.close();
  if (clients.openWindow)
    if (event.notification.data.title === "account-activated") {
      return clients.openWindow("http://127.0.0.1:8080/activate?success=1");
    } else {
      return clients.openWindow("http://127.0.0.1:8080/");
    }
});

// self.addEventListener("install", function(event) {
//   event.waitUntil(
//     caches.open("assets").then(function(cache) {
//       return cache.addAll(
//         [
//           "/css/main.css",
//           "/css/bootstrap.css",
//           "/images/logo.png",
//           "/bundle.min.js",
//           "/"
//         ]
//       );
//     })
//   );
// });

// self.addEventListener('fetch', function(event) {
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });