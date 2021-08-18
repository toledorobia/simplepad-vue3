import firebase from "firebase/app";
import _ from "lodash";

export const clearFirebaseUser = (fbuser) => {
  if (fbuser == null) {
    return null;
  }

  return {
    uid: fbuser.uid,
    email: fbuser.email,
    displayName: fbuser.displayName,
    photoURL: fbuser.photoURL,
    phoneNumber: fbuser.phoneNumber,
  }
}

export const clearFirebaseError = (error) => {
  return error == null ? null : { code: error.code, message: error.message };
};

export const firebaseDocToObject = (doc, extraData = {}) => {
  if (doc == null) {
    return null;
  }

  let d = doc.data();
  let id = doc.id;
  return { ...d, ...extraData, id };
};

export const firebaseDateNow = () => {
  return firebase.firestore.Timestamp.fromDate(new Date());
};

export const isNothing = (obj) => {
  return _.isUndefined(obj) || _.isNull(obj) || _.isNaN(obj);
};

export const isSomething = (obj) => {
  return !isNothing(obj);
};

export const isSomethingWithId = (obj) => {
  return isSomething(obj) && isSomething(obj.id);
};