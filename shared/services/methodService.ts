import { firestore } from "@/firebaseConfig";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { MethodItemProps } from "../classes/models/method";
import { TransactionType } from "../classes/models/transaction";

const adapter = (
  doc: QueryDocumentSnapshot<DocumentData>
): MethodItemProps => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    type: data.type,
  };
};

export const fetchMethods = async (filterType?: TransactionType) => {
  const methodsRef = collection(firestore, "methods");
  const constraints = filterType ? [where("type", "==", filterType)] : [];
  const q = query(methodsRef, ...constraints);
console.log(constraints)
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(adapter);
};

export const getMethodById = async (methodId: string) => {
  if (methodId) {
    const ref = doc(firestore, "methods", methodId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return adapter(snap);
    } else {
      return null;
    }
  }
};
