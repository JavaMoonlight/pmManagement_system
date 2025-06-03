import React, { useState, useEffect } from 'react';
import { List, Pagination, Typography, Modal, Flex, Button, Input } from 'antd';
import '../css/announcement.css';
import { delByIdAPI, insertAPI, loadDataByIdAPI, updateByIdAPI } from '../services/announce';
import { useNavigate } from 'react-router-dom';
import { NotificationOutlined } from '@ant-design/icons';
import MyEditor from '../components/MyEditor';  // 引入富文本编辑器

const { Title } = Typography;

const Announcement = () => {
  const [data, setData] = useState([]);
  const [pageNum, setpageNum] = useState(1);
  const [size, setsize] = useState(5);  // 每页显示条目数
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);  // 控制详情弹窗的显示
  const [currentContent, setCurrentContent] = useState({ title: '', content: '' });
  const [isModalVisible, setIsModalVisible] = useState(false);   // 控制编辑/新增弹窗的显示
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);   // 当前编辑的公告ID
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');

  // 获取公告数据
  useEffect(() => {
    loadDataByIdAPI(pageNum, size).then((res) => {
      // console.log(res)
      setData(res.data.records);
      setTotal(res.data.total);
    });
  }, [pageNum, size]);

  // 显示编辑/新增弹窗
  const showEditModal = (item) => {
    if (item) {   // 编辑模式
      setFormTitle(item.title);
      setFormContent(item.content);
      setCurrentId(item.id);    
      setEditMode(true);
    } else {      // 新增模式
      setFormTitle('');
      setFormContent('');
      setCurrentId(null);
      setEditMode(false);
    }
    setIsModalVisible(true);
  };

  // 提交表单
  const handleSubmit = () => {
    const payload = editMode ? {
      id: currentId.toString(),
      title: formTitle,
      content: formContent,
      publisher: "总管理员",
      createTime: new Date().toISOString()    // 生成ISO格式时间
    } : {
      title: formTitle,
      content: formContent,
      publisher: "总管理员",
      createTime: new Date().toISOString()
    };
    
    (editMode ? updateByIdAPI(payload) : insertAPI(payload))
    .then(() => {
      if (!editMode) {      // 新增后重置页码到第一页
        setpageNum(1);
      }
      setFormTitle('');
      setFormContent('');
      setCurrentId(null);
      
      return loadDataByIdAPI(pageNum, size);
    })
      .then(res => {
        setData(res.data.records);
        setTotal(res.data.total);
        setIsModalVisible(false);
      }
    ).catch(err => {
        Modal.error({
          title: '操作失败',
          content: err.response?.data?.message || '服务器内部错误'
        });
      });
    };

  // 删除处理
  const handleDelete = (id) => {
    // console.log(id)
    delByIdAPI(id).then(() => {
      setData(prev => prev.filter(item => item.id !== id));
    });
  };

  // 显示详情弹窗
  const showDetail = (item) => {
    setCurrentContent({
      title: item.title,
      content: item.content
    });
    setModalVisible(true);
  };

    // 处理页码变化
    const handlePageChange = (page, newSize) => {
      setpageNum(page);
      setsize(newSize);
    };

    // 处理每页大小变化
    const handleSizeChange = (current, newSize) => {
      setpageNum(1); 
      setsize(newSize);
    };

  return (
    <div className="announcement-container">
      <Flex justify="space-between" align="center">
        <Title level={3} className="announcement-title">通知公告</Title>
        <Button className='announcementbutton' type="primary" onClick={() => showEditModal(null)}>新增公告</Button>
      </Flex>

      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => (
          <List.Item className="announcement-item">
            <div className="list-item-content">
              <Flex justify="space-between" align="center">
                <div>
                  <div className="item-header">
                    <span className="item-publisher">总管理员</span>
                    <span className="item-time">
                      {new Date(item.createTime).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <List.Item.Meta
                    title={
                      <div className="title-container">
                        <a className="item-title" onClick={() => showDetail(item)}>
                          {item.title}
                        </a>
                      </div>
                    }
                  />
                </div>
                <div>
                  <Button type="link" onClick={() => showEditModal(item)} style={{ color: '#1890ff' }}>修改</Button>
                  <Button type="link" onClick={() => handleDelete(item.id)} style={{ color: '#ff4d4f' }}>删除</Button>
                </div>
              </Flex>
            </div>
          </List.Item>
        )}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editMode ? "编辑公告" : "新增公告"}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Input
          placeholder="公告标题"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}    // 绑定标题输入
          style={{ marginBottom: 16 }}
        />
        <MyEditor 
          key={editMode ? currentId : 'new'} // 强制重新挂载
          value={formContent} 
          onChange={setFormContent}
          style={{ height: 400 }}
        />
      </Modal>

      <Modal
        title={
          <>
            <NotificationOutlined style={{ marginRight: 8 }} />
            {currentContent.title}
          </>
        }
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        className="announcement-modal"
        width={680} // 加宽弹窗
      >
        <div className="modal-content-container">
        <div 
          className="modal-content-text"
          dangerouslySetInnerHTML={{ __html: currentContent.content }}    
        />      {/* 渲染富文本HTML */}
        </div>
      </Modal>

      <Pagination
        className="announcement-pagination"
        current={pageNum}
        // size={size}
        pageSize={size}
        total={total}
        showSizeChanger
        showQuickJumper
        onChange={handlePageChange}
        onShowSizeChange={handleSizeChange}
      />
    </div>
  );
};

export default Announcement;