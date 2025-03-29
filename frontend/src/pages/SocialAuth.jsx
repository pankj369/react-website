import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider , signInWithRedirect } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDdSwniTiYRHmpX3R5Az5lg_6jiSGSqUI",
  authDomain: "succeibrary.firebaseapp.com",
  projectId: "succeibrary",
  storageBucket: "succeibrary.firebasestorage.app",
  messagingSenderId: "150939715835",
  appId: "1:150939715835:web:5151b6cadced69bc11c85e",
  measurementId: "G-Z6J12211RL"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize auth

export const handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithRedirect(auth, provider);
    console.log("Google sign-in initiated...");

  } catch (error) {
    console.error("Error during Google sign-in:", error);

  }
};

export const handleGithubSignIn = async () => {
  const provider = new GithubAuthProvider();
  try {
    await signInWithRedirect(auth, provider);
    console.log("Redirecting to GitHub sign-in...");
  } catch (error) {
    console.error("GitHub sign-in error:", error);
  }
};

export const handleFacebookSignIn = async () => {
  const provider = new FacebookAuthProvider();
  try {
    console.log("Facebook sign-in successful:", user);
  } catch (error) {
    console.error("Facebook sign-in error:", error);
  }
};
