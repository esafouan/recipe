import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Standalone function for getting user role (for easier import)
export async function getUserRole(uid: string): Promise<string | null> {
  const profile = await AuthService.getUserProfile(uid);
  return profile?.role || null;
}

export class AuthService {
  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  // Sign out
  static async signOut(): Promise<void> {
    await signOut(auth);
  }

  // Create new user (admin only)
  static async createUser(
    email: string, 
    password: string, 
    displayName: string,
    role: UserProfile['role'] = 'editor'
  ): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);

    return user;
  }

  // Get user profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  }

  // Update user profile
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      ...updates,
      updatedAt: new Date()
    });
  }

  // Check if user has permission
  static async hasPermission(uid: string, requiredRole: UserProfile['role']): Promise<boolean> {
    const profile = await this.getUserProfile(uid);
    if (!profile || !profile.isActive) return false;

    const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };
    return roleHierarchy[profile.role] >= roleHierarchy[requiredRole];
  }

  // Send password reset email
  static async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  // Get current user
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Check if user is admin
  static async isAdmin(uid?: string): Promise<boolean> {
    const userId = uid || auth.currentUser?.uid;
    if (!userId) return false;
    
    const profile = await this.getUserProfile(userId);
    return profile?.role === 'admin' && profile?.isActive === true;
  }

  // Check if user is authenticated and active
  static async isAuthenticated(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;

    const profile = await this.getUserProfile(user.uid);
    return profile?.isActive === true;
  }
}
