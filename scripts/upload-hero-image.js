// Script to upload a hero image to Firebase Storage
const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const fs = require('fs');
const path = require('path');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZEHX0W0LHSkwJdDUdz82-n4XwYdJqdY0",
  authDomain: "manage-a0f99.firebaseapp.com",
  projectId: "manage-a0f99",
  storageBucket: "manage-a0f99.appspot.com",
  messagingSenderId: "284206270474",
  appId: "1:284206270474:web:f246ac83064849d45937f3",
  measurementId: "G-JQM4GY06QE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Path to the local SVG file
const localFilePath = path.join(__dirname, '..', 'public', 'images', 'hero-jewelry.jpg.svg');

// Function to upload the file to Firebase Storage
async function uploadHeroImage() {
  try {
    // Check if the file exists
    if (!fs.existsSync(localFilePath)) {
      console.error('File not found:', localFilePath);
      return;
    }

    // Read the file
    const fileContent = fs.readFileSync(localFilePath);
    
    // Create a storage reference
    const storageRef = ref(storage, 'hero/hero-image.jpg');
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, fileContent);
    console.log('Uploaded hero image successfully!');
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Hero image available at:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading hero image:', error);
  }
}

// Execute the upload
uploadHeroImage();