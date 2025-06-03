import React, { useEffect, useState } from 'react';
import { Button, Table, Tag, message, Modal, Form, Input, Select, DatePicker } from 'antd';
import { delUserAPI, getAllPerson, insertAPI, putAPI } from '../services/personAllUtil';
import { useNavigate } from 'react-router-dom';
import '../css/PersonAll.css'; // 样式文件
import moment from 'moment';
const { Option } = Select;  // 解构Select组件

const PersonAll = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [modalType, setModalType] = useState('add');
    // 删除相关状态
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deletingUsername, setDeletingUsername] = useState('');

    const navigate = useNavigate(); 
  // 状态管理分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,  // 改为8条/页
    total: 0
  });

  // 列定义
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      render: (text) => <Tag color={text === '男' ? 'blue' : 'pink'}>{text}</Tag>,    // 条件渲染颜色
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Tag color={status === 0 ? 'green' : 'red'}>
            {status === 0 ? '学生' : '管理员'}
          </Tag>
        ),
      },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="action-buttons">
          <Button 
            type="primary" 
            ghost 
            onClick={() => handleEdit(record)}
          >
            修改
          </Button>
          <Button 
            danger 
            onClick={() => handleDeleteClick(record.username)}
          >
            删除
          </Button>
        </div>
      ),
    }
  ];

  //获取数据
  const fetchData = async (params = {}) => {
      setLoading(true);
      try {
      const res = await getAllPerson({
          pageNum: params.pageNum || pagination.current,
          pageSize: params.pageSize || 8 // 默认8条请求
      });
      // console.log(res)
      if (res.code === 200) {
          setDataSource(res.data.records);
          setPagination(prev => ({
          ...prev,
          total: res.data.total,
          current: res.data.current || 1,
          pageSize: 8 // 强制保持8条/页
          }));
      }
      } finally {
      setLoading(false);
      }
  };

  // 更新分页处理
  const handleTableChange = (newPagination) => {
      setPagination(newPagination);   // 更新分页状态
      fetchData({
          pageNum: newPagination.current,
          pageSize: newPagination.pageSize
      });
  };

  // 修改删除处理函数
  const handleDeleteClick = (username) => {
    setDeletingUsername(username);     // 记录待删除用户
    setDeleteModalVisible(true);       // 显示确认弹窗
  };

  // 删除处理
  const handleConfirmDelete = async () => {
    try {
      await delUserAPI([deletingUsername]);
      message.success('删除成功');
      // 立即更新本地数据
      setDataSource(prev => prev.filter(item => item.username !== deletingUsername));
      
      // 保持分页一致性
      const newTotal = pagination.total - 1;
      // const shouldDecreasePage = newTotal <= (pagination.current - 1) * pagination.pageSize;

      setPagination(prev => ({
        ...prev,
        total: prev.total + 1,
        current: Math.ceil((prev.total + 1) / prev.pageSize)
      }));

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      message.error(`删除失败: ${errorMsg}`);

    } finally {
      setDeleteModalVisible(false);
    }
  };

  // 编辑处理
  const handleEdit = (record) => {
    setModalType('edit');
    setCurrentRecord(record);
    form.setFieldsValue({
        ...record,
        birthday: moment(record.birthday, 'YYYY-MM-DD') // 需要处理日期格式
    });
    setModalVisible(true);
  };

  // 添加处理
  const handleAdd = () => {
    setModalType('add');
    form.resetFields();
    setModalVisible(true);
  };

  // 表单提交处理
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        birthday: values.birthday.format('YYYY-MM-DD'),
        status: Number(values.status) // 确保转换为数字类型
      };
  
      if (modalType === 'add') {
        // 添加新用户逻辑
        const res = await insertAPI(formattedValues);
        if (res.code === 200) {
          // 添加成功后刷新数据
          await fetchData({
            pageNum: Math.ceil((pagination.total + 1) / pagination.pageSize),
            pageSize: pagination.pageSize
          });
          message.success('添加成功');
        }
      } else {
        const res = await putAPI({
          ...currentRecord,   // 保留原有数据
          ...formattedValues  // 合并修改后的字段
        });
        if (res.code === 200) {
          setDataSource(prev =>         //更新本地数据
            prev.map(item => 
              item.username === currentRecord.username ? 
              { ...item, ...res.data } : item 
            )
          );
          message.success('修改成功');
          
          // 强制刷新当前页数据
          await fetchData({
            pageNum: pagination.current,
            pageSize: pagination.pageSize
          });
        }
      }
      
      setModalVisible(false);
    } catch (error) {
      message.error(`操作失败: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const PersonModal = ({ visible, onCancel, onOk, initialValues }) => (
    <Modal
      title={modalType === 'add' ? '新用户注册' : '修改用户信息'}
      visible={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onOk}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true }]}
        >
          <Input disabled={modalType === 'edit'} />
        </Form.Item>
  
        <Form.Item
          label="真实姓名"
          name="realName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="性别"
          name="gender"
          rules={[{ required: true }]}
        >
          <Select>
            <Option value="男">男</Option>
            <Option value="女">女</Option>
          </Select>
        </Form.Item>
  
        <Form.Item
          label="部门"
          name="department"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item
          label="生日"
          name="birthday"
          rules={[{ required: true }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
  
        <Form.Item
            label="用户权限"
            name="status"
            rules={[{ required: true }]}
        >
        <Select>
            <Option value={0}>学生</Option>   {/* 对应后端值 */}
            <Option value={1}>管理员</Option>
        </Select>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <div className="person-all-container">
      <div className="table-header">
        <h2 className="table-title">用户信息</h2>
        <Button 
          type="primary"
          className="add-button"
          onClick={handleAdd}
        >
          添加+
        </Button>
      </div>
     
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="username"
          loading={loading}
          bordered
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['8', '10', '20']
          }}
          onChange={handleTableChange}
        />

        <PersonModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        />

        <Modal
          title="确认删除"
          visible={deleteModalVisible}
          onOk={handleConfirmDelete}
          onCancel={() => setDeleteModalVisible(false)}
          okText="确认"
          cancelText="取消"
        >
          <p>确定要删除用户 {deletingUsername} 吗？</p>
          <p style={{ color: 'red' }}>此操作不可撤销！</p>
        </Modal>
    </div>
  );
};

export default PersonAll;