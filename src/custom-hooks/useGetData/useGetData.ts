"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase.config";
import { collection, onSnapshot } from "firebase/firestore";

/**
 * Custom hook to fetch data from a Firebase Firestore collection.
 *
 * Subscribes to realtime collection updates and handles loading and error states.
 *
 * @param {string} collectionName - The name of the Firestore collection to fetch.
 * @returns {{ data: any[], loading: boolean, error: string | null }}
 * - Object containing the fetched data, loading state, and error message.
 */
export default function useGetData(collectionName: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setData([]);

    const collectionRef = collection(db, collectionName);

    /**
     * Subscribes to realtime updates from the selected collection.
     */
    const unsubscribe = onSnapshot(
      collectionRef,
      (snapshot) => {
        setData(
          snapshot.docs.map((document) => ({
            ...document.data(),
            id: document.id,
          })),
        );
        setError(null);
        setLoading(false);
      },
      (snapshotError) => {
        console.error(
          `Failed to fetch "${collectionName}" collection:`,
          snapshotError,
        );

        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}
