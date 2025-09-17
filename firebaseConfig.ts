import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyADz3kiKoiFaT7tfGxMaU9vm1--X6dLm2Q",
  authDomain: "bytebank-5dba7.firebaseapp.com",
  projectId: "bytebank-5dba7",
  storageBucket: "bytebank-5dba7.firebasestorage.app",
  messagingSenderId: "597904779384",
  appId: "1:597904779384:web:63fcd93bcd5ab2c544258d",
  measurementId: "G-SS5BCYWM8M",
};
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };
