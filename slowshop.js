// slowshop.js
import { auth, db } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// --- AUTH FUNCTIONS ---
window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "player.html";
  } catch (error) {
    alert("Signup Error: " + error.message);
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "player.html";
  } catch (error) {
    alert("Login Error: " + error.message);
  }
};

window.logout = async function () {
  await signOut(auth);
  window.location.href = "slowshop.html";
};

// --- BEAT LOGIC ---
window.playBeat = async function (beatId, src) {
  const user = auth.currentUser;
  if (!user) {
    alert("Not logged in.");
    return;
  }

  const uid = user.uid;
  const docRef = doc(db, "playlogs", uid + "_" + beatId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    alert("You've already listened to this beat.");
    return;
  }

  // Play the beat
  const audio = document.getElementById("audio-" + beatId);
  audio.style.display = "block";
  audio.play();

  // Log play after playback ends
  audio.onended = async () => {
    await setDoc(docRef, {
      uid: uid,
      beatId: beatId,
      playedAt: new Date()
    });
    alert("Thanks for listening. You can’t replay this beat.");
  };
};

// --- AUTH GUARD & BEAT STATUS LOADING ---
if (window.location.pathname.includes("player.html")) {
  onAuthStateChanged(auth, async user => {
    if (!user) {
      window.location.href = "slowshop.html";
    } else {
      // Check beat playlogs on load
      const beats = ["beat1"]; // Add more beat IDs as you upload more
      for (let beatId of beats) {
        const uid = user.uid;
        const docRef = doc(db, "playlogs", uid + "_" + beatId);
        const docSnap = await getDoc(docRef);
        const btn = document.querySelector(`#${beatId} button`);
        const audio = document.querySelector(`#audio-${beatId}`);
        if (docSnap.exists()) {
          btn.disabled = true;
          btn.innerText = "Played";
          if (audio) audio.style.display = "none";
        }
      }
    }
  });
}
