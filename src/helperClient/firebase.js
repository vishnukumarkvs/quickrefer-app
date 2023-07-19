import { db } from "@/lib/firebase";
import { get, ref, update } from "firebase/database";

export const updateSeenStatus = async (chatId, userId) => {
  const chatRef = ref(db, `chat/${chatId}/messages`);
  const snapshot = await get(chatRef);
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      const messageId = childSnapshot.key;
      if (message.recipientId === userId && !message.seen) {
        update(ref(db, `chat/${chatId}/messages/${messageId}`), {
          seen: true,
        });
      }
    });
  }
};
