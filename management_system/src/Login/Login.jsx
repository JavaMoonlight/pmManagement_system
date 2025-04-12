import React from 'react';
import {Row, Col, Card, Form, Button, Checkbox, Input, message} from 'antd';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../img/1.jpg';
import { loginAPI } from '../Student/services/auth';
import { getToken, setToken } from '../Student/utils/tool';

function Login() {
  const navigate = useNavigate()
  const onFinish = async (values) => {
    const res = await loginAPI(values);
    console.log(res);
    if(res.code === 200){
      message.success('登陆成功');
      setToken(res.data.token);
      localStorage.setItem('currentUser', JSON.stringify({
        username: res.data.username,
        token: res.data.token,
        role: res.data.role // 确保包含角色信息
      }));
      
      // 增加角色校验
      if (res.data.role === "ADMIN") {
        navigate('/admin/announcement', { replace: true });
      } else if (res.data.role === "STUDENT") {
        navigate('/student/announcement', { replace: true });
      } else {
        message.error('未知用户角色');
      }
    }else{
      message.error(res.errorMessage);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return(
    <div className="background-container">
      <Row>
        <Col
          md={{
            span: 8,
            push: 8
          }}
          xs={{
            span: 22,
            push: 1
          }}
        >
          <img src={logo} alt="登录页logo" className='LoginImg'/>
          <Card title="党员信息管理平台">
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 600,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="用户名"
                name="username"
                rules={[
                  {
                    required: true,
                    message: '请输入用户名!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked" label={null}>
                <Checkbox>记住用户</Checkbox>
              </Form.Item>

              <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                  登录
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Login;  // 确保是默认导出