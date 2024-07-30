import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

function useCollection(currentCollection, userParams) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let q;
    if (userParams[2]) {
      q = query(collection(db, currentCollection), where(...userParams));
      onSnapshot(q, (querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() });
        });
        setData(tasks);
      });
    }
  }, [currentCollection, userParams[2]]);

  return { data };
}

export { useCollection };
