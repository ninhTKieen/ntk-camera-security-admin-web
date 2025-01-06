// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyB6WQtym9WROA6yK5zY_uphr4Bddxk3Fu4',
  authDomain: 'yootek-iot.firebaseapp.com',
  projectId: 'yootek-iot',
  storageBucket: 'yootek-iot.appspot.com',
  messagingSenderId: '245883089968',
  appId: '1:245883089968:web:4ff57a46206532ac5629f5',
  measurementId: 'G-GTXWL1P08S',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
