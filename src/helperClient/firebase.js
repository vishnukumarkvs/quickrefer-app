import { db } from "@/lib/firebase";
import { ref, get, update } from "firebase/database";

// export const updateSeenStatus = async (chatId, userId) => {
//   const chatRef = ref(db, `chat/${chatId}/messages`);
//   const snapshot = await get(chatRef);
//   const updates = {};
//   let unseenCount = 0;

//   if (snapshot.exists()) {
//     snapshot.forEach((childSnapshot) => {
//       const message = childSnapshot.val();
//       const messageId = childSnapshot.key;
//       console.log("unseen messages", message, messageId);

//       if (message.recipientId === userId && !message.seen) {
//         updates[`${messageId}/seen`] = true;
//         unseenCount++;
//       }
//     });

//     if (Object.keys(updates).length > 0) {
//       await update(ref(db, `chat/${chatId}/messages`), updates);
//     }
//   }

//   return unseenCount;
// };

export const getUnseenCount = async (chatId, userId) => {
  const chatRef = ref(db, `chat/${chatId}/messages`);
  const snapshot = await get(chatRef);
  let unseenCount = 0;

  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      if (message.senderId !== userId && !message.seen) {
        unseenCount++;
      }
    });
  }

  return unseenCount;
};

export const updateSeenStatus = async (chatId, userId) => {
  const chatRef = ref(db, `chat/${chatId}/messages`);
  const snapshot = await get(chatRef);
  const updates = {};

  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      const messageId = childSnapshot.key;

      if (message.senderId !== userId && !message.seen) {
        updates[`${messageId}/seen`] = true;
      }
    });

    if (Object.keys(updates).length > 0) {
      await update(ref(db, `chat/${chatId}/messages`), updates);
    }
  }
};
