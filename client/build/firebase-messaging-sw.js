importScripts("https://www.gstatic.com/firebasejs/7.14.5/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.14.5/firebase-messaging.js"
);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./firebase-messaging-sw.js")
    .then(function (registration) {
      console.log("Registration successful, scope is:", registration.scope);
    })
    .catch(function (err) {
      console.log("Service worker registration failed, error:", err);
    });
}

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyBYh4kM41BWVUf7tF_RB56QxYK9Ua3CFXI",
  authDomain: "tryfirebaseproject-34025.firebaseapp.com",
  databaseURL: "https://tryfirebaseproject-34025.firebaseio.com",
  projectId: "tryfirebaseproject-34025",
  storageBucket: "tryfirebaseproject-34025.appspot.com",
  messagingSenderId: "242828897331",
  appId: "1:242828897331:web:e6a77f6a72affb02438746",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker
//   `messaging.setBackgroundMessageHandler` handler.

messaging.setBackgroundMessageHandler(function (payload) {
  console.log("Received background message ", payload);

  //Customize notification here
  const title =payload.data.title

  const options = {
    body: payload.data.message,
    click_action: "https://sswm-administration-dashboard.herokuapp.com/",
    icon: "https://res.cloudinary.com/dqtwwjmht/image/upload/v1597132441/jzomwpcgd2by0c1ta3tz.png",
    // icon: payload.notification.icon,
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", function (event) {
  console.log(event);
  clients.openWindow("/");
});
