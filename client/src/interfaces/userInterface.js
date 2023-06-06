import { db } from "../lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc } from "firebase/firestore";

export const createUser = async (uid, name, email) => {
  if(uid === "" || name === "" || email === "") {
    console.error("uid, name, or email is not set")
    return
  }

  try {
      await setDoc(doc(db, "User", uid), {
          name: name,
          email: email,
          date: new Date(),
      })
  }
  catch (e) {
      console.log(e)
      setError("Failed to register")
  }
}

export const getUserData = async (uid) => {
  if(uid === "") {
    console.error("uid is not set")
    return
  }

  const userDoc = doc(db, "User", uid)
  const userDocSnap = await getDoc(userDoc)

  if (userDocSnap.exists()) {
    let data = userDocSnap.data();
    return data
  } else {
    console.log("No user data found");
    return
  }
}

export const getUserCurrentHabits = async (uid) => {
  if(uid === "") {
    console.error("uid is not set")
    return
  }

  const habitRef = collection(db, "Habit")
  const q = query(habitRef, where('userId', '==', uid), where('active', '==', true))
  const querySnapshot = await getDocs(q)
  const habits = []
  querySnapshot.forEach(doc => {
    habits.push(doc.data())
  })

  return habits
}

export const addHabit = async (uid, task) => {
  if(uid === "" || task === null){
    console.error("uid or task is not set")
    return 
  }

  await addDoc(collection(db, "Habit"), {
    color: task.color,
    title: task.title,
    active : true,
    dateCreated : new Date(),
    userId: uid
  })
}