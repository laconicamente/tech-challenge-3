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
import { CategoryItemProps } from "../classes/models/category";
import { TransactionType } from "../classes/models/transaction";

const adapter = (
  doc: QueryDocumentSnapshot<DocumentData>
): CategoryItemProps => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    type: data.type,
  };
};

export const fetchCategories = async (filterType?: TransactionType) => {
  const categoriesRef = collection(firestore, "categories");
  const constraints = filterType ? [where("type", "==", filterType)] : [];
  const q = query(categoriesRef, ...constraints);

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(adapter);
};

export const getCategoryById = async (categoryId: string) => {
  if (categoryId) {
    const ref = doc(firestore, "categories", categoryId);
    const snap = await getDoc(ref);
    
    if (snap.exists()) {
      return adapter(snap);
    } else {
      return null;
    }
  }
};
