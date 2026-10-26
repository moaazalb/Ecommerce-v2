import { useEffect, useState } from "react";
import {db} from  "../firebase.config"
import { collection, onSnapshot } from "firebase/firestore";

/**
 * Custom hook to fetch data from Firebase Firestore collection.
 * 
 * @param {string} collectionName - The name of the Firestore collection to fetch.
 * @returns {{ data: any[], loading: boolean }} - Object containing the fetched data and loading state.
 */
export default function useGetData(collectionName: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const collectionRef = collection(db, collectionName);

  useEffect(() => {
    const getData = async () => {
      //===== firebase firestore realtime data update
      await onSnapshot(collectionRef, (snapshot) => {
        setData(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      });
    };

    getData();
  }, [collectionName]);

  return { data, loading };
}