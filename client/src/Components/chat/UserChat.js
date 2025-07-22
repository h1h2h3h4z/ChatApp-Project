import { Stack } from "react-bootstrap";
import pic from "../../image/avatar.jpg";
import { useSelector, useDispatch } from "react-redux";
import {
  updateCurrentChat,
  getCurrentChatMessages,
  getUser,
} from "../../rtk/slices/ChatSlice";
import "./UserChat.css";
import { markNotificationsAsReadfromuser } from "../../rtk/slices/ChatSlice";
const UserChat = ({ members }) => {
  const dispatch = useDispatch();
  const {
    userchat,
    currentChat,
    OnlineUsers,
    UnreadNotification,
  } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.auth);

  const handleChat = (memberId) => {
    if (!Array.isArray(userchat)) return;

    dispatch(getUser(memberId));
    dispatch(markNotificationsAsReadfromuser(memberId))
    const selectedChat = userchat.find((chat) => {
      const { firstuser, seconduser } = chat.members;
      const isCurrentUserInChat = firstuser === user.id || seconduser === user.id;
      const isClickedUserInChat = firstuser === memberId || seconduser === memberId;
      return isCurrentUserInChat && isClickedUserInChat;
    });

    if (selectedChat) {
      dispatch(updateCurrentChat(selectedChat));
      dispatch(getCurrentChatMessages(selectedChat.chat_id));
    }
  };

  const getNotificationCount = (memberId) => {
    return UnreadNotification?.filter((n) => n.senderId === memberId)?.length || 0;
  };

  return (
    <>
      {members.map((member, index) => {
        const notificationCount = getNotificationCount(member.userid);
        const isOnline = OnlineUsers.some((on) => parseInt(on.userId) === member.userid);
        const isActiveChat =
          currentChat?.members?.firstuser === member.userid ||
          currentChat?.members?.seconduser === member.userid;

        return (
          <Stack
            key={index}
            direction="horizontal"
            gap={3}
            className={`user-card align-items-center p-2 justify-content-between ${
              isActiveChat ? "active-chat" : ""
            }`}
            role="button"
            onClick={() => handleChat(member.userid)}
          >
            {/* Left */}
            <div className="d-flex">
              <div className="me-2">
                <img
                  src={pic}
                  alt={`${member.name}'s avatar`}
                  className="user-pic rounded-circle"
                  height="40"
                  width="40"
                />
              </div>
              <div className="text-content">
                <div className="fw-bold text-black">{member.name}</div>
                <div className="text-muted small">Text Message</div>
              </div>
            </div>

            {/* Right */}
            <div className="d-flex flex-column align-items-end text-end">
              <div className="text-muted small">12/12/2022</div>
              {notificationCount > 0 && (
                <div className="badge bg-primary rounded-pill small">
                  {notificationCount}
                </div>
              )}
              <span className={isOnline ? "user-online mt-1" : "user-ofline mt-1"}></span>
            </div>
          </Stack>
        );
      })}
    </>
  );
};

export default UserChat;
