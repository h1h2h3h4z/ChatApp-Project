import { useEffect, useState} from "react";
import { Alert, Button, Form, Row, Col, Stack ,Spinner} from "react-bootstrap";
import { register } from "../rtk/slices/AuthorizationSlice";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const [RegisterInfo , setRegisterInfo] = useState({
    name :"",
    email :"",
    password :""
  })
  const dispatch = useDispatch()
  const {registerError ,loading} = useSelector(state => state.auth)
 const [Err  , setErr] = useState(false)

 const handleSubmit = (e)=>{
  e.preventDefault();
  dispatch(register(RegisterInfo))
 }
  useEffect(()=>{
    if(registerError){
      setErr(true)
    }
    else{
      setErr(false)
    }
  },[registerError])
  return (
    
    <>
      <Form onSubmit={handleSubmit}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control type="text" placeholder="Name" onChange={(e)=>setRegisterInfo(prev=>({...prev,name:e.target.value}))}/>
              <Form.Control type="email" placeholder="Email" onChange={(e)=>setRegisterInfo(prev=>({...prev,email:e.target.value}))} />
              <Form.Control type="password" placeholder="Password" onChange={(e)=>setRegisterInfo(prev=>({...prev,password:e.target.value}))} />
              <Button variant="primary" type="submit">{
                loading ? (
                  <>
                    <Spinner as="span" animation="border" size="xl" role="status" aria-hidden="true"/>
                  </>
                ):"Register"
              }</Button>

              {Err &&<Alert variant="danger"><p>{registerError}</p></Alert>}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Register;
