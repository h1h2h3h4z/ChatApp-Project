import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../rtk/slices/AuthorizationSlice";
import { clearChatState } from "../rtk/slices/ChatSlice";
import Noti from "./chat/Notifications";
const NavBar = () => {
  const dispatch = useDispatch();
  const handlelogout = () => {
    dispatch(logout());
    dispatch(clearChatState());
  };
  const { user } = useSelector((state) => state.auth);
  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to={"/"} className="link-light text-decoration-none">
            ChatApp
          </Link>
        </h2>
        {user && <span className="text-warning">Logged in as {user.name}</span>}

        <Nav>
          <Stack direction="horizontal" gap={3}>
            {user ? (
              <>
              <Noti />
                <Link
                  to={"/login"}
                  className="link-light text-decoration-none btn btn-link"
                  onClick={handlelogout}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link to={"/login"} className="link-light text-decoration-none">
                  Login
                </Link>
                <Link
                  to={"/register"}
                  className="link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
