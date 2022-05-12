import {
    Result,
    Button,
  } from "antd";
function Notfound(){
return(
    <>
     <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you are looking for is either removed or not found"
        extra={
          <Button
            type="primary"
            onClick={() => (window.location = "http://localhost:3000/")}
          >
            Back Home
          </Button>
        }
      />
    </>
)
}
export default Notfound;