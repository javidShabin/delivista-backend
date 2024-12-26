import mongoose from "mongoose";

// Chat Schema
const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User's ID
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  }, // Admin's ID (optional if admins are not tracked per message)
  message: { type: String, required: true },
  replyMessage: { type: String }, // Admin's reply message
  status: { type: String, enum: ["pending", "answered"], default: "pending" }, // 'pending' if not answered, 'answered' if admin replied
  timestamp: { type: Date, default: Date.now },
});

// Chat Model
const Chat = mongoose.model("Chat", chatSchema);

export default { Chat };
