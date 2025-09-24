import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot 
} from 'firebase/firestore';
import { db } from './config';
import { Recipe } from '@/types';

// Extended Recipe type for Firebase
export interface FirebaseRecipe extends Omit<Recipe, 'datePublished' | 'dateModified'> {
  datePublished: Timestamp;
  dateModified: Timestamp;
  publishedAt?: Timestamp; // For blog compatibility
  slug: string;
  status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  canonicalUrl?: string;
  schema?: string; // JSON-LD structured data
  readingTime?: number;
  authorId: string;
  notes?: string;
  images?: string[]; // Additional images beyond featuredImage
}

const RECIPES_COLLECTION = 'recipes';

export class RecipeService {
  // Get all published recipes (simplified to avoid composite index requirement)
  static async getPublishedRecipes(): Promise<FirebaseRecipe[]> {
    try {
      // Try the optimized query first (requires composite index)
      const q = query(
        collection(db, RECIPES_COLLECTION),
        where('status', '==', 'published'),
        orderBy('datePublished', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseRecipe));
    } catch (error) {
      console.log('Composite index not available, using fallback query...', error);
      
      // Fallback: Get all published recipes without ordering
      const q = query(
        collection(db, RECIPES_COLLECTION),
        where('status', '==', 'published')
      );
      const snapshot = await getDocs(q);
      const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseRecipe));
      
      // Sort client-side by datePublished
      return recipes.sort((a, b) => {
        const getDate = (timestamp: Timestamp) => {
          try {
            return timestamp?.toDate?.() || new Date();
          } catch {
            return new Date();
          }
        };
        
        const dateA = getDate(a.datePublished);
        const dateB = getDate(b.datePublished);
        return dateB.getTime() - dateA.getTime();
      });
    }
  }

  // Get recipe by ID
  static async getRecipeById(id: string): Promise<FirebaseRecipe | null> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirebaseRecipe;
    }
    return null;
  }

  // Get recipe by slug
  static async getRecipeBySlug(slug: string): Promise<FirebaseRecipe | null> {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('slug', '==', slug),
      where('status', '==', 'published'),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as FirebaseRecipe;
    }
    return null;
  }

  // Search recipes
  static async searchRecipes(searchTerm: string): Promise<FirebaseRecipe[]> {
    // Note: This is a basic implementation. For production, consider using 
    // Algolia, Elasticsearch, or Firebase's full-text search solutions
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('status', '==', 'published'),
      orderBy('datePublished', 'desc')
    );
    const snapshot = await getDocs(q);
    
    const allRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseRecipe));
    
    // Client-side filtering (for now)
    return allRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Get recipes by category
  static async getRecipesByCategory(category: string): Promise<FirebaseRecipe[]> {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      where('category', '==', category),
      where('status', '==', 'published'),
      orderBy('datePublished', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseRecipe));
  }

  // Admin methods
  static async createRecipe(recipe: Omit<FirebaseRecipe, 'id' | 'datePublished' | 'dateModified'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, RECIPES_COLLECTION), {
      ...recipe,
      datePublished: now,
      dateModified: now,
    });
    return docRef.id;
  }

  static async updateRecipe(id: string, updates: Partial<FirebaseRecipe>): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      dateModified: Timestamp.now(),
    });
  }

  static async deleteRecipe(id: string): Promise<void> {
    const docRef = doc(db, RECIPES_COLLECTION, id);
    await deleteDoc(docRef);
  }

  // Get all recipes (admin only)
  static async getAllRecipes(): Promise<FirebaseRecipe[]> {
    const q = query(
      collection(db, RECIPES_COLLECTION),
      orderBy('dateModified', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseRecipe));
  }

  // Pagination
  static async getRecipesPaginated(
    pageSize: number = 10,
    lastDoc?: DocumentSnapshot
  ): Promise<{ recipes: FirebaseRecipe[]; lastDoc: DocumentSnapshot | null }> {
    let q = query(
      collection(db, RECIPES_COLLECTION),
      where('status', '==', 'published'),
      orderBy('datePublished', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const recipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseRecipe));
    const lastDocument = snapshot.docs[snapshot.docs.length - 1] || null;

    return { recipes, lastDoc: lastDocument };
  }
}
