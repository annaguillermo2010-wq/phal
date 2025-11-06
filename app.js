<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDD81maTjt_uUtNhOR4mvjhF0_vQYwqeic",
    authDomain: "phal-88bd8.firebaseapp.com",
    databaseURL: "https://phal-88bd8-default-rtdb.firebaseio.com",
    projectId: "phal-88bd8",
    storageBucket: "phal-88bd8.firebasestorage.app",
    messagingSenderId: "542012665295",
    appId: "1:542012665295:web:811b6ab845a22debea76ba",
    measurementId: "G-4G3WE7J5J0"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
