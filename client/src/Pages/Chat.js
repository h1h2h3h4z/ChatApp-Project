import { useSelector, useDispatch } from "react-redux";
import { Container, Stack, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useEffect } from "react";
import UserChat from "../Components/chat/UserChat";
import { getMembers } from "../rtk/slices/ChatSlice";
import ChatBox from "../Components/chat/chatBox";

const Chat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userchat, loading, error, filterMembers,currentChat } = useSelector((state) => state.chats);

  useEffect(() => {
    if (user) {
      const otherMemberId = new Set();
      userchat.forEach((chat) => {
        const memberId = Object.values(chat?.members || {}).find(
          (userId) => userId !== user?.id
        );
        if (memberId) {
          otherMemberId.add(memberId);
        }
      });
      otherMemberId.forEach((id) => {
        dispatch(getMembers(id));
      });
    }
  }, [userchat, user, dispatch]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-4 text-center">
        {error}
      </Alert>
    );
  }

  if (!userchat || userchat.length === 0) {
    return (
      <p className="text-white text-center mt-5">No chats available.</p>
    );
  }

  return (
    <Container fluid className="py-3 chat-container">
      <Row className="h-100">
        {/* Sidebar */}
        <Col xs={12} md={5} lg={4} xl={4} style={{flex: '0 0 40%', maxWidth: '40%'}} className="border-end pe-4 chat-sidebar">
          <UserChat members={filterMembers} />
        </Col>

        {/* Chat Area */}
        <Col xs={12} md={7} lg={8} xl={8} style={{flex: '0 0 60%', maxWidth: '60%'}} className="chat-area">
          <ChatBox currentchat={currentChat} />
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
