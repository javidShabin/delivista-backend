import { Chat } from "../models/chatModel";

// Controller to handle storing messages from users
export const storeMessage = async (userId, message, adminId = null) => {
  try {
    const chat = new Chat({  // Change 'chatModel' to 'Chat'
      userId,
      message,
      adminId,
      status: adminId ? "answered" : "pending", // If admin has replied, set the status as 'answered'
    });

    await chat.save();
    console.log("Chat message stored successfully");
  } catch (error) {
    console.error("Error storing chat message:", error);
  }
};

// Controller to handle storing replies from admin
export const storeReply = async (userId, replyMessage, adminId) => {
  try {
    // Find the latest message from this user that hasn't been answered yet
    const chat = await Chat.findOne({ userId, status: "pending" }).sort({
      timestamp: -1,
    });

    if (chat) {
      chat.replyMessage = replyMessage;
      chat.status = "answered"; // Mark as answered
      await chat.save();
      console.log("Admin reply stored successfully");
    } else {
      console.log("No pending chat found for this user.");
    }
  } catch (error) {
    console.error("Error storing admin reply:", error);
  }
};

// Controller to get all chats for a user (optional)
export const getUserChats = async (userId) => {
  try {
    const chats = await Chat.find({ userId }).sort({ timestamp: -1 });
    return chats;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
};
