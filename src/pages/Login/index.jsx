import { useContext, useRef, useState } from "react";
import { userContext } from "../../components/UserProvider";
import { Form, Input, Button, Row, Col, message } from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons/lib/icons";
import { getVerificationCode } from "../../api/verificationCode";
import { login } from "../../api/user";
import "./index.less";

function Login() {
  // state
  const [timer, setTimer] = useState(0);
  const [verificationCodeLoading, setVerificationCodeLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // context
  const { setIsLogin } = useContext(userContext);

  // ref
  const usernameRef = useRef();

  // callback
  const onLogin = (values) => {
    setLoginLoading(true);
    login(
      values.username,
      values.verificationCode,
      data => {
        localStorage.setItem("token", data.token);
        setLoginLoading(false);
        setIsLogin(true);
      },
      reason => {
        // onFailed
        message.error(reason);
        setLoginLoading(false);
      }
      );
  };
  const onGetVerificationCode = () => {
    setVerificationCodeLoading(true);
    const username = usernameRef.current.input.value;
    getVerificationCode(
      username,
      () => {
        setVerificationCodeLoading(false);
        message.success("短信验证码已发送！");
        setTimer(60);
      },
      reason => {
        setVerificationCodeLoading(false);
        message.error(reason);
      }
    );
  };
  const startTimer = () => {
    if (timer === 0) {
      return "发送";
    } else {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return timer;
    }
  }

  return (
    <Row
      align="middle"
      className="login-root"
    >
      <Col
        span={6}
        offset={9}
      >
        <Form
          onFinish={onLogin}
        >
          <Form.Item
            name="username"
            rules={[{
              required: true,
              message: "请输入正确的手机号！",
              pattern: /^1[3456789]\d{9}$/,
            }]}
            >
            <Input
              prefix={<UserOutlined className="form-item-icon" />}
              placeholder="手机号"
              maxLength={11}
              ref={usernameRef}
              size="large"
            />
          </Form.Item>
          <Row gutter={8}>
            <Col span={16}>
              <Form.Item
              name="verificationCode"
              rules={[
                {
                  required: true,
                  message: "请输入验证码！",
                },
                {
                  min: 6,
                  message: "请输入六位验证码！",
                },
              ]}
              >
                <Input
                  prefix={<MessageOutlined className="form-item-icon" />}
                  placeholder="验证码"
                  maxLength={6}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button
                className="send-verification-code"
                onClick={onGetVerificationCode}
                loading={verificationCodeLoading}
                disabled={timer !== 0}
                size="large"
              >
                {startTimer()}
              </Button>
            </Col>
          </Row>
          <Row gutter={8}>
            <Col span={2}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loginLoading}
              >
                登陆
              </Button>
            </Col> 
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
