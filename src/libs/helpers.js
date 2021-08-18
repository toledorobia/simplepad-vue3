import firebase from "firebase/app";

export const firebaseDateNow = () => {
  return firebase.firestore.Timestamp.fromDate(new Date());
};