import { User as FirebaseUser } from 'firebase/auth';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export type { FirebaseUser };
export type FirebaseDocumentData = DocumentData;
export type FirebaseQueryDocumentSnapshot = QueryDocumentSnapshot<DocumentData, DocumentData>;