import React, { useEffect, useState, useRef } from "react";
import { Stack, Form, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import EmojiPicker from "./EmojiPicker";
import "./chatBox.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import moment from "moment";
import { createMessage, pushTocurrentMessage, addNotification, getSocketInstance } from "../../rtk/slices/ChatSlice";

const ChatBox = ({ currentchat }) => {
  const scroll = useRef();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentChatMessages, recipientUser } = useSelector((state) => state.chats);
  const [textMessage, setTextMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socket = getSocketInstance();

  // 👉 ref لحفظ أحدث قيمة من currentchat
  const currentChatRef = useRef(null);

  // تحديث قيمة ref كل ما currentchat تتغير
  useEffect(() => {
    currentChatRef.current = currentchat;
  }, [currentchat]);

  let receiverid;
  if (currentchat) {
    receiverid = Object.values(currentchat.members).find((id) => id !== user.id);
  }

  // استقبال Notifications
  useEffect(() => {
    if (!socket) return;

    const handleNotification = (res) => {
      console.log("📨 Notification received:", res);
      const isChatOpen = currentChatRef.current && Object.values(currentChatRef.current.members).some(id => id === res.senderId);
      dispatch(addNotification({ ...res, isRead: isChatOpen ? true : false }));
        };

    socket.on("getNotifications", handleNotification);

    return () => {
      socket.off("getNotifications", handleNotification);
    };
  }, [socket, dispatch]);

  // استقبال رسائل
  useEffect(() => {
    if (!socket) return;

    const handleGetMessage = (res) => {
      if (res.senderid !== user.id) {
        dispatch(pushTocurrentMessage(res));
      }
    };

    socket.on("getMessage", handleGetMessage);

    return () => {
      socket.off("getMessage", handleGetMessage);
    };
  }, [dispatch, user.id, socket]);

  // Scroll لآخر رسالة
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChatMessages]);

  if (!recipientUser) {
    return (
      <div className="text-center w-100 py-5">
        <p className="text-white fs-5">No Conversation Selected Yet...</p>
      </div>
    );
  }

  const handleEmojiSelect = (emoji) => {
    setTextMessage((prev) => prev + emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleSendMessage = async () => {
    if (!textMessage.trim() || !currentchat) return;

    const messageData = {
      text: textMessage,
      chatid: currentchat.chat_id,
      senderid: user.id,
      receiverid: receiverid
    };

    const immediateMessage = {
      ...messageData,
      createdAt: new Date().toISOString()
    };

    dispatch(pushTocurrentMessage(immediateMessage));

    if (socket) {
      socket.emit("SendMessage", messageData);
    }

    try {
      await dispatch(createMessage(messageData)).unwrap();
    } catch (error) {
      console.error("Failed to save message:", error);
    }

    setTextMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Stack className="chat-box border rounded p-3 advanced-chat-box" gap={3} style={{ width: "100%" }}>
      <div className="chat-header border-bottom pb-2 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img src={recipientUser?.avatar || require('../../image/avatar.jpg')} alt="avatar" className="chat-header-avatar me-2 rounded-circle" height="40" width="40" />
          <h5 className="mb-0 me-2">{recipientUser?.name}</h5>
          <button className="btn btn-link p-0 ms-1 chat-star-btn" title="Favorite">
            <i className="bi bi-star"></i>
          </button>
        </div>
      </div>

      <div className="chat-messages flex-grow-1 overflow-auto px-1" style={{ minHeight: "300px" }}>
        {currentChatMessages?.length > 0 ? (
          currentChatMessages.map((message, index) => (
            <div
              key={`${message.senderid}-${message.text}-${message.createdAt}-${index}`}
              className={`message-row ${message.senderid === user.id ? "sent" : "received"}`}
            >
              <div className={`message-bubble ${message.senderid === user.id ? "sent" : "received"}`}>
                <span>{message.text}</span>
                <span className="message-time">{moment(message.createdAt).calendar()}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted text-center mt-4">No messages yet.</p>
        )}
        <div ref={scroll}></div>
      </div>

      <Stack direction="horizontal" gap={2} className="chat-input flex-grow-0 align-items-center pt-2 sticky-chat-input position-relative">
        <Form.Control
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          as="textarea"
          rows={1}
          style={{ resize: "none", minHeight: "38px" }}
        />
        <div className="position-relative">
          <Button variant="light" onClick={toggleEmojiPicker} className="emoji-toggle-btn" title="Add emoji">🙂</Button>
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              onClose={() => setShowEmojiPicker(false)}
            />
          )}
        </div>
        <Button className="send-btn d-flex align-items-center justify-content-center ms-2" type="button" onClick={handleSendMessage} disabled={!textMessage.trim()}>
          <i className="bi bi-send"></i>
        </Button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
