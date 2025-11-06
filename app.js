 // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
// SDK modular imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

/* ====== TU FIREBASE CONFIG (ya la pegaste) ====== */
const firebaseConfig = {
  apiKey: "AIzaSyDD81maTjt_uUtNhOR4mvjhF0_vQYwqeic",
  authDomain: "phal-88bd8.firebaseapp.com",
  projectId: "phal-88bd8",
  storageBucket: "phal-88bd8.firebasestorage.app",
  messagingSenderId: "542012665295",
  appId: "1:542012665295:web:811b6ab845a22debea76ba",
  measurementId: "G-4G3WE7J5J0"
};

/* Inicializar */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);

/* DOM */
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

/* LOGIN / REGISTER (ambos usan Google popup para simplificar) */
loginBtn.addEventListener("click", async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Login error:", err);
    alert("No se pudo iniciar sesión: " + (err.message || err));
  }
});
registerBtn.addEventListener("click", async () => {
  // misma experiencia: Google popup (registro con Google)
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error("Register error:", err);
    alert("No se pudo registrar: " + (err.message || err));
  }
});

/* SIGN OUT */
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error("Signout err:", err);
  }
});

/* auth state */
onAuthStateChanged(auth, (user) => {
  if (user) {
    authRow.style.display = "none";
    userArea.style.display = "flex";
    photoForm.style.display = "flex";
    welcome.textContent = `Hola, ${user.displayName ?? "amigo"}`;
    loadPhotosForUser(user.uid);
  } else {
    authRow.style.display = "flex";
    userArea.style.display = "none";
    photoForm.style.display = "none";
    gallery.innerHTML = "";
  }
});

/* SUBIR FOTO */
photoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = photoInput.files[0];
  const place = (placeInput.value || "").trim();
  const user = auth.currentUser;
  if (!user) return alert("Iniciá sesión primero");
  if (!file || !place) return alert("Elegí una foto y escribí el lugar");

  try {
    // subir al storage en carpeta por UID
    const path = `photos/${user.uid}/${Date.now()}_${file.name}`;
    const sref = ref(storage, path);
    await uploadBytes(sref, file);
    const url = await getDownloadURL(sref);

    // guardar metadatos en Firestore
    await addDoc(collection(db, "photos"), {
      uid: user.uid,
      name: user.displayName || null,
      url,
      place,
      createdAt: serverTimestamp()
    });

    placeInput.value = "";
    photoInput.value = "";
    loadPhotosForUser(user.uid);
  } catch (err) {
    console.error("Upload error:", err);
    alert("Error al subir la foto");
  }
});

/* CARGAR FOTOS DEL USUARIO (ordenadas por createdAt desc) */
async function loadPhotosForUser(uid) {
  gallery.innerHTML = "<p>Cargando...</p>";
  try {
    const q = query(collection(db, "photos"), where("uid", "==", uid), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    gallery.innerHTML = "";

    if (snap.empty) {
      gallery.innerHTML = "<p>No hay fotos aún.</p>";
      return;
    }

    let i = 0;
    snap.forEach(doc => {
      const d = doc.data();
      const card = document.createElement("div");
      const isFirst = (i === 0);
      card.className = "photo-card" + (isFirst ? " first" : "");
      // first photo: full-bleed img, no extra caption background
      card.innerHTML = `
        <img src="${d.url}" alt="Foto ${i+1}">
        ${isFirst ? `<div class="caption"><strong>${d.place}</strong></div>` : `<div class="caption"><strong>${d.place}</strong><div style="font-size:0.8rem;color:#b46a1c">${d.createdAt?.toDate?.()?.toLocaleString?.() ?? ""}</div></div>`}
      `;
      gallery.appendChild(card);
      i++;
    });
  } catch (err) {
    console.error("Load photos error:", err);
    gallery.innerHTML = "<p>Error al cargar fotos.</p>";
  }
}
