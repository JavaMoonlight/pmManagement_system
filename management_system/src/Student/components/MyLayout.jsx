import React, { useEffect, useState } from 'react';
import '../css/MyLayout.css';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  FileOutlined,
  NotificationOutlined,
  ApartmentOutlined,
  DownOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Dropdown, Breadcrumb, message  } from 'antd';
import logo from '../../img/1.jpg';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const sideMenuData = [
  {
    key: '/student/announcement',
    icon: <NotificationOutlined />,
    label: '通知公告',
  },
  { 
    key: '/student/develop',
    icon: <ApartmentOutlined />,
    label: '党员发展',
    children:[{
      label:'发展进程',
      key:'/student/develop/process'
    },{
      label:'党费缴纳',
      key:'/student/develop/change'
    }]
  },
  {
    key: '/student/file',
    icon: <FileOutlined />,
    label: '党建材料',
  },
  {
    key: '/student/person',
    icon: <UserOutlined />,
    label: '个人信息',
  },
]

const findOpenKeys = (key) =>{
  const result = [];
  const findInfo = (arr) =>{
    arr.forEach(item => {
      if(key.includes(item.key)){
        result.push(item.key)
        if(item.children){
          findInfo(item.children);
        }
      }      
    });
  }

  findInfo(sideMenuData)
  return result
}

/**
 * 获取当前选中的数据的所有的父节点
 * @param {*} key 
 * @returns 
 */
const findDeepPath = (key) => {
  const result = [];

  const findInfo = (arr) =>{
    arr.forEach(item => {
      const {children, ...info} = item;
      result.push(info);
      if(children){
        findInfo(children)    //递归处理子节点
      } 
    });
  };
  findInfo(sideMenuData)
  const tmpData = result.filter(item => key.includes(item.key))
  if(tmpData.length > 0){
    return [{label:'首页', key:'/student/announcement'}, ...tmpData];
  }
  return[]
}

const MyLayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();   //获取Location中的数据
  const tmpOpenKeys = findOpenKeys(pathname);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const items = [
    {
      label: (
        <a href="/student/person">
          个人中心
        </a>
      ),
      key: '0',
    },
    {
      label: (
        <a href="/">
          退出
        </a>
      ),
      key: '1',
    },
  ];
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(()=>{
    setBreadcrumbs(findDeepPath(pathname))
  },[pathname])
  
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical">
          <img src={logo} alt='人物头像'/>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={tmpOpenKeys}
          defaultSelectedKeys={tmpOpenKeys}
          onClick={({key})=>{
            navigate(key);
          }}
          items={sideMenuData}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <span className='app-title'>党员信息管理平台</span>
          {/* 右上角个人按钮 */}
          <Dropdown
            menu={{
              items,
            }}
            trigger={['click']}
            className='app-drop'
          >
            <a onClick={(e) => e.preventDefault()}>
              <img src={logo} alt='个人中心logo' className='title-img' />
            </a>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
        {/* 面包屑 */}
        <Breadcrumb className='BreadC'>
          {breadcrumbs.map((item) => (
            <Breadcrumb.Item key={item.key}>
              <a href="">{item.label}</a>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};
export default MyLayout;