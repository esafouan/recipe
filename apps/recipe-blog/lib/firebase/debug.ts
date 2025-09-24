// Simple test script to check what's in the Firebase database
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config';

export async function debugDatabase() {
  try {
    console.log('🔍 Checking Firebase database...');
    
    const recipesRef = collection(db, 'recipes');
    const snapshot = await getDocs(recipesRef);
    
    console.log(`📊 Total documents in recipes collection: ${snapshot.size}`);
    
    if (snapshot.empty) {
      console.log('❌ No recipes found in database');
      return;
    }
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📝 Recipe found:`, {
        id: doc.id,
        title: data.title,
        status: data.status,
        category: data.category,
        datePublished: data.datePublished?.toDate?.() || data.datePublished
      });
    });
    
  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}
