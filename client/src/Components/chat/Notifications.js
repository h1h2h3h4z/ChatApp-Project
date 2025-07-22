import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getCurrentChatMessages, getUser } from "../../rtk/slices/ChatSlice";
import { markNotificationsAsRead ,UnreadNotifications,markasread,markNotificationAsRead,updateCurrentChat} from "../../rtk/slices/ChatSlice";
const Noti = () => {
  const dispatch = useDispatch()
  const { Notifications, Allusers, UnreadNotification ,AllSavedUsers,userchat,currentChat,currentChatMessages} = useSelector(state => state.chats);
  const {user} = useSelector((state)=>state.auth)
  const [isOpen, setIsOpen] = useState(false);
  const handlereadclick=()=>{
    dispatch(markNotificationsAsRead(Notifications))
  }
  const handlenotificlick = (n)=>{
    const desiredChat = markNotificationAsRead(n,userchat,user,Notifications);
    dispatch(updateCurrentChat(desiredChat))
    dispatch(markasread(n))
    dispatch(getUser(n.senderId))
    setIsOpen(false)
  }
  useEffect(()=>{
    console.log('cr',currentChat);
  
  },[currentChat])
 
  useEffect(()=>{
    dispatch(UnreadNotifications(Notifications))    
  },[Notifications])
  const modifiedNotification = Notifications.map((n) => {
    const sender = AllSavedUsers.find((u) => u.userid === n.senderId);
    
    return {
      ...n,
      senderName: sender?.name || "Unknown"
    };
  });

  return (
    <div className="notifications position-relative">
      <div className="notifications-icons position-relative" onClick={() => setIsOpen(!isOpen)}>
        <i className="bi bi-bell-fill fs-5 text-white"></i>
        {UnreadNotification.length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {UnreadNotification.length}
          </span>
        )}
      </div>

      {isOpen &&
        <div className="notifications-box">
          <h3>Notifications</h3>
          <div className="mark-as-read" onClick={handlereadclick}>
            Mark all as read 
          </div>
          {modifiedNotification.length === 0 ? <span className="notification">No Notifications Yet ...</span> : 
          null
          }
          {modifiedNotification && modifiedNotification.map((n,index)=>{
            return(
              <div key={index} className={n.isRead ? 'notification' : 'notification not-read'} onClick={()=>{handlenotificlick(n)}}>
                <span>{n.senderName} sent you a new message</span>
                <span className="notification-time">{moment(n.date).calendar()}</span>
              </div>
            )
          })}
        </div>

      }
    </div>
  );
}

export default Noti;
