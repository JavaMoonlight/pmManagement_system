import React, { useState, useEffect } from 'react';
import { Avatar, Table, Typography, Modal, Button, Form, Input, message, Pagination } from 'antd';
import { loadByTokenAPI, ByTokenAPI, getAllUsersAPI, getUserRewardsAPI, addRewardAPI, updateRewardAPI, deleteRewardAPI } from '../services/processUtil';
import '../css/process.css';

const { Title } = Typography;
const { Column } = Table;

const processStages = [
  { key: 'activeMember', label: '积极分子' },
  { key: 'developing', label: '发展对象' },
  { key: 'probationary', label: '预备党员' },
  { key: 'fullMember', label: '党员' }
];

const ProcessPage = () => {
  // 发展状态相关
  const [currentStage, setCurrentStage] = useState('');   // 当前用户的发展阶段
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({  // 分页配置
    current: 1,
    pageSize: 6,
    total: 0
  });
  const [userLoading, setUserLoading] = useState(false);

  // 奖惩信息相关
  const [selectedUser, setSelectedUser] = useState(null);
  const [rewardPagination, setRewardPagination] = useState({
    current: 1,
    pageSize: 3,
    total: 0
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [form] = Form.useForm();

  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true); 

  // 获取用户发展状态
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const { data } = await loadByTokenAPI();
        setCurrentStage(data.status);
      } catch (error) {
        console.error('获取状态失败:', error);
      }
    };
    fetchUserStatus();
  }, []);

  // 初始化数据加载
  useEffect(() => {
    fetchUsers(userPagination);           // 调用获取用户函数
  }, []); 

  // 监听选中奖励变化
  useEffect(() => {
    if (editModalVisible && selectedReward) {
      form.setFieldsValue(selectedReward); // 设置表单值
    }
  }, [selectedReward, editModalVisible, form]);

  // 获取所有用户
  const fetchUsers = async (pagination) => {
    setUserLoading(true); 
    try {
      const { data } = await getAllUsersAPI({
        pageNum: pagination.current,
        pageSize: pagination.pageSize
      });
      // console.log(data)
      setUsers(data.records || []);     // 更新用户列表
      setUserPagination({               // 更新分页配置
        ...pagination,
        total: data.total || 0
      });
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }finally {
      setUserLoading(false);
    }
  };

  // 获取用户奖惩信息
  const fetchRewards = async (username, pagination) => {
    try {
      const { data } = await getUserRewardsAPI(username, {
        pageNum: pagination.current || 1,
        pageSize: pagination.pageSize || 3
      });
      // console.log(data)
      setRewards(data.records);         // 更新奖惩列表
      setRewardPagination({             // 更新分页配置
        current: data.current || 1,
        pageSize: data.size || 3,
        total: data.total || 0
      });
    } catch (error) {
      // console.error('获取用户列表失败:', error);
      message.error("获取用户列表失败");
    }
  };

  // 处理用户表格分页变化
  const handleUserPageChange = (page) => {
    fetchUsers({
      ...userPagination,
      current: page
    });
  };

  // 处理查看用户奖惩
  const handleViewRewards = (user) => {
    setSelectedUser(user);  // 记录选中用户
    setModalVisible(true);
    fetchRewards(user.username, rewardPagination);  // 加载数据
  };

  // 新增奖惩
  const handleAddReward = async (values) => {
    // console.log(values)
    try {
      await addRewardAPI({
        ...values,
        username: selectedUser.username  // 添加当前用户的username
      });
      // 重置分页到第一页
      const newPagination = { ...rewardPagination, current: 1 };
      setRewardPagination(newPagination);
      fetchRewards(selectedUser.username, newPagination);
      setAddModalVisible(false);
      form.resetFields(); // 重置表单字段

    } catch (error) {
      message.error('新增失败');
    }
  };

  // 更新奖惩
  const handleUpdateReward = async (values) => {
    try {
      await updateRewardAPI(values);
      message.success('更新成功');
      fetchRewards(selectedUser.username, rewardPagination);    // 刷新数据
      setEditModalVisible(false);
    } catch (error) {
      message.error('更新失败');
    }
  };

  // 删除奖惩
  const handleDeleteReward = async (id) => {
    try {
      await deleteRewardAPI(id);
      message.success('删除成功');
      fetchRewards(selectedUser.username, rewardPagination);
    } catch (error) {
      message.error('删除失败');
    }
  };

   // 用户表格列配置
   const userColumns = [
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '真实姓名', dataIndex: 'realName', key: 'realName' },
    { title: '部门', dataIndex: 'department', key: 'department' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (        // 自定义渲染操作列
        <Button type="link" onClick={() => handleViewRewards(record)}>
          查看奖惩
        </Button>
      )
    }
  ];  

  return (
    <div className="process-container">
      {/* 发展进程展示 */}
      <div className="stage-flow">
        {processStages.map((stage, index) => (
          <div key={stage.key} className="stage-container">
            <div className={`stage-item ${currentStage === stage.label ? 'active' : ''}`}>
              <Avatar 
                size={64}
                className="stage-icon"
                style={{ backgroundColor: currentStage === stage.label ? '#52c41a' : '#f5f5f5' }}
              >
                {index + 1}
              </Avatar>
              <div className="stage-label">{stage.label}</div>
            </div>
            {index < 3 && <div className="stage-arrow">➔</div>}
          </div>
        ))}
      </div>

      {/* 用户信息表格 */}
      <Title level={4} className="reward-title">用户列表</Title>
      <Table
        loading={userLoading}
        columns={userColumns}
        dataSource={users}
        rowKey="username"
        pagination={{
          ...userPagination,
          current: userPagination.current, // 显式绑定当前页
          showSizeChanger: false,
          onChange: (page) => fetchUsers({ ...userPagination, current: page })
        }}
        bordered
      />

      {/* 奖惩信息弹窗 */}
      <Modal
        title={`${selectedUser?.realName} 的奖惩记录`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}     // 隐藏默认底部按钮
        width={800}
      >
        <Button 
          type="primary" 
          style={{ marginBottom: 16 }}
          onClick={() => setAddModalVisible(true)}
        >
          新增奖惩
        </Button>
        
        <Table
          dataSource={rewards}
          rowKey="id"
          pagination={{
            ...rewardPagination,
            onChange: (page) => fetchRewards(selectedUser.username, {
              ...rewardPagination,
              current: page
            }),
            showSizeChanger: false
          }}
        >
          <Column
            title="类型"
            dataIndex="type"
            render={(text) => (
              <span className={`type-${text === '奖' ? 'award' : 'punish'}`}>
                {text}
              </span>
            )}
          />
          <Column title="名称" dataIndex="name" />
          <Column title="时间" dataIndex="time" />
          <Column
            title="操作"
            render={(_, record) => (
              <>
                <Button type="link" onClick={() => {
                  setSelectedReward(record);
                  setEditModalVisible(true);
                }}>
                  更新
                </Button>
                <Button 
                  type="link" 
                  danger 
                  // onClick={() => handleDeleteReward(record.id)}
                  onClick={(e) => {
                    e.stopPropagation();  // 阻止事件冒泡
                    handleDeleteReward(record.id);
                  }}
                >
                  删除
                </Button>
              </>
            )}
          />
        </Table>
      </Modal>

      {/* 新增奖惩弹窗 */}
      <Modal
        title="新增奖惩"
        visible={addModalVisible}
        destroyOnClose  // 关闭时销毁表单
        onCancel={() => {
          setAddModalVisible(false);
          form.resetFields();  // 重置表单
        }}
        // onCancel={() => setAddModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleAddReward}>
          <Form.Item label="类型" name="type">
            <Input />
          </Form.Item>
          <Form.Item label="名称" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="时间" name="time">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 更新奖惩弹窗 */}
      <Modal
        title="更新奖惩"
        visible={editModalVisible}
        // onCancel={() => setEditModalVisible(false)}
        destroyOnClose  //关闭时销毁表单
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields(); // 关闭时重置表单
        }}
        onOk={() => form.submit()}
      >
        <Form 
          form={form} 
          // initialValues={selectedReward}
          onFinish={handleUpdateReward}
        >
          <Form.Item label="ID" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="类型" name="type">
            <Input />
          </Form.Item>
          <Form.Item label="名称" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="时间" name="time">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProcessPage;