import { Result, Button } from 'antd';

export default () => (
  <Result
    status="403"
    title="403"
    subTitle="Sorry, you are not authorized to access this page. Please Login to Continue"
    extra={<Button type="primary"
    onClick={() => (window.location = "http://localhost:3000/")}
    >Login</Button>}
  />
);