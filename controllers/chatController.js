import chatModel from "../models/chatModel";

// Controller to handle storing messages from users
export const storeMessage = async (userId, message, adminId = null) => {
  try {
    const chat = new chatModel({
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
