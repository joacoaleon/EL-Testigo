import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { auth, db, isFirebaseConfigured } from './firebaseConfig';
import { PlayerSaveData } from '../types/game.types';

const LOCAL_STORAGE_KEY = 'el_testigo_cronicas_save_v1';

export class PersistenceService {
  private static currentUserId: string = 'local_witness_player';

  static async initializeSession(): Promise<{ mode: 'CLOUD_FIRESTORE' | 'LOCAL_STORAGE'; uid: string }> {
    if (isFirebaseConfigured && auth) {
      try {
        if (!auth.currentUser) {
          const cred = await signInAnonymously(auth);
          this.currentUserId = cred.user.uid;
        } else {
          this.currentUserId = auth.currentUser.uid;
        }
        return { mode: 'CLOUD_FIRESTORE', uid: this.currentUserId };
      } catch (err) {
        console.warn('[Persistence] Fallback a LocalStorage por permisos o red:', err);
      }
    }
    return { mode: 'LOCAL_STORAGE', uid: this.currentUserId };
  }

  static async saveProgress(saveData: PlayerSaveData): Promise<{ success: boolean; source: string }> {
    const payload: PlayerSaveData = {
      ...saveData,
      userId: this.currentUserId,
      updatedAt: Date.now(),
    };

    // 1. Guardado inmediato en LocalStorage (garantiza latencia cero y soporte offline)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('[Persistence] Error en LocalStorage:', e);
    }

    // 2. Sincronización en Cloud Firestore si está configurado
    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        const ref = doc(db, 'users', auth.currentUser.uid, 'saves', 'main_campaign');
        await setDoc(ref, payload, { merge: true });
        return { success: true, source: 'Cloud Firestore + Local' };
      } catch (err) {
        console.warn('[Persistence] Guardado en nube pendiente, mantenido en local:', err);
      }
    }

    return { success: true, source: 'Almacenamiento Local' };
  }

  static async loadProgress(): Promise<PlayerSaveData | null> {
    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        const ref = doc(db, 'users', auth.currentUser.uid, 'saves', 'main_campaign');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          return snap.data() as PlayerSaveData;
        }
      } catch (err) {
        console.warn('[Persistence] Leyendo desde respaldo local:', err);
      }
    }

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PlayerSaveData;
    } catch {
      return null;
    }
  }

  static clearLocalSave(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}