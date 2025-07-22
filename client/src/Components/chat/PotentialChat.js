import { useSelector, useDispatch } from "react-redux";
import { CreateChat } from "../../rtk/slices/ChatSlice";
import React from "react";

const PotentialChat = () => {
  const { Allusers, OnlineUsers } = useSelector((state) => state.chats);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Function to start a new chat
  const handleChat = (userid) => {
    const objectId = {
      firstId: user.id,
      secondId: userid,
    };
    dispatch(CreateChat(objectId));
  };


  return (
    <>
      <div className="all-users advanced-all-users">
        {Allusers && Allusers.length > 0 ? (
          Allusers.map((chatUser) => {
            const isOnline = OnlineUsers.some((u) => parseInt(u.userId) === chatUser.userid);
           
            return (
              <div
                className="single-user advanced-single-user"
                key={chatUser.userid}
                onClick={() => handleChat(chatUser.userid)}
              >
                {chatUser.name}

                <div
                  className={
                    isOnline
                      ? "user-online"
                      : "user-offline"
                  }
                ></div>
              </div>
            );
          })
        ) : (
          <p className="text-muted">No users available.</p>
        )}
      </div>
    </>
  );
};

export default PotentialChat;
