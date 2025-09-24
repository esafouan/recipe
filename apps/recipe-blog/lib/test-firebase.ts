// Test Firebase connection
import { db } from './firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function testFirebaseConnection() {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to connect to the recipes collection
    const recipesRef = collection(db, 'recipes');
    const snapshot = await getDocs(recipesRef);
    
    console.log(`Successfully connected to Firebase!`);
    console.log(`Found ${snapshot.size} documents in the 'recipes' collection`);
    
    // Log all documents to see their structure
    snapshot.forEach((doc) => {
      console.log('Document ID:', doc.id);
      console.log('Document data:', doc.data());
    });
    
    return {
      success: true,
      documentCount: snapshot.size,
      documents: snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
    };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
