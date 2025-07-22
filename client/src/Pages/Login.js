import { useEffect, useState } from "react";
import { Alert, Button, Form, Row, Col, Stack ,Spinner} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../rtk/slices/AuthorizationSlice";
import { getUsersChat } from "../rtk/slices/ChatSlice";
const Login = () => {
    const dispatch = useDispatch();
    const [state , setState]= useState({email:"",password : ""})
    const [Err , setErr] = useState(false)
    const {loginError ,loading} = useSelector((state) => state.auth);
    
    
    
    useEffect(() => {
      if (loginError) {
          setErr(true);
      } else {
          setErr(false);
      }
  }, [loginError]);

    const handlesubmit =(e)=>{
        e.preventDefault()
        dispatch(login(state))
        
        
    }
    

  return (
    <>
      <Form onSubmit={(e)=>{handlesubmit(e)}}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Login</h2>
             <Form.Control 
  type="email" 
  placeholder="Email" 
  onChange={(e) => setState(prev => ({ ...prev, email: e.target.value }))}
/>
<Form.Control 
  type="password" 
  placeholder="Password" 
  onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
/>

              <Button variant="primary" type="submit" disabled={loading}>{
                loading ? (
                  <>
                    <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true"/>
                  </>
                ):"login"
              }</Button>
              
              {Err && <Alert variant='danger'>{loginError}</Alert>}

            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
