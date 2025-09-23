import { Timestamp } from "firebase/firestore";

export const toDateFromFirestore = (raw: any): Date | null => {
  if (!raw) return null;
  if (raw instanceof Timestamp) return raw.toDate();
  if (
    typeof raw === "object" &&
    typeof raw.seconds === "number" &&
    typeof raw.nanoseconds === "number"
  ) {
    return new Date(
      raw.seconds * 1000 + Math.floor(raw.nanoseconds / 1_000_000)
    );
  }
  if (typeof raw === "string") {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
};

export const formatDateISO = (d: Date | null) => (d ? d.toISOString() : "");
export const formatDate = (d: Date | string | null) =>
  d ? new Date(d).toLocaleDateString("pt-BR") : "";
