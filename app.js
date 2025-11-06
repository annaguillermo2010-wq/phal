// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/* ===== CONFIG DE FIREBASE ===== */
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

/* ===== INICIALIZACIÓN ===== */
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);

/* ===== DOM ELEMENTS ===== */
const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const logoutBtn = document.getElementById("logoutBtn");
const authRow = document.getElementById("auth-row");
const userArea = document.getElementById("user-area");
const welcome = document.getElementById("welcome");
const photoForm = document.getElementById("photoForm");
const placeInput = document.getElementById("placeInput");
const photoInput = document.getElementById("photoInput");
const gallery = document.getElementById("gallery");

/* ===== LOGIN / REGISTER ===== */
loginBtn.addEventListener("click", () => signInWithPopup(auth, provider).catch(err => alert(err.message)));
registerBtn.addEventListener("click", () => signInWithPopup(auth, provider).catch(err => alert(err.message)));

/* ===== LOGOUT ===== */
logoutBtn.addEventListener("click", () => signOut(auth).catch(err => console.error(err)));

/* ===== AUTH STATE ===== */
onAuthStateChanged(auth, user => {
  if (user) {
    authRow.style.display = "none";
    userArea.style.display = "flex";
    photoForm.style.display = "flex";
    welcome.textContent = `Hola, ${user.displayName ?? "amigo"}`;
    loadPhotos(user.uid);
  } else {
    authRow.style.display = "flex";
    userArea.style.display = "none";
    photoForm.style.display = "none";
    gallery.innerHTML = "";
  }
});

/* ===== SUBIR FOTO ===== */
photoForm.addEventListener("submit", async e => {
  e.preventDefault();
  const file = photoInput.files[0];
  const place = placeInput.value.trim();
  const user = auth.currentUser;
  if (!user || !file || !place) return alert("Elegí una foto y escribí el lugar");

  const path = `photos/${user.uid}/${Date.now()}_${file.name}`;
  const sref = ref(storage, path);
  await uploadBytes(sref, file);
  const url = await getDownloadURL(sref);

  await addDoc(collection(db, "photos"), { uid: user.uid, name: user.displayName, url, place, createdAt: serverTimestamp() });

  placeInput.value = "";
  photoInput.value = "";
  loadPhotos(user.uid);
});

/* ===== CARGAR GALERÍA ===== */
async function loadPhotos(uid) {
  gallery.innerHTML = "<p>Cargando...</p>";
  const q = query(collection(db, "photos"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  gallery.innerHTML = "";
  if (snap.empty) return gallery.innerHTML = "<p>No hay fotos aún.</p>";

  snap.forEach((doc, i) => {
    const d = doc.data();
    const card = document.createElement("div");
    card.className = "photo-card" + (i === 0 ? " first" : "");
    card.innerHTML = `<img src="${d.url}" alt="Foto ${i+1}"><div class="caption"><strong>${d.place}</strong></div>`;
    gallery.appendChild(card);
  });
}
