import React, { useState, useEffect } from 'react';
import { List, Pagination, Typography, Modal, Flex } from 'antd';
import '../css/announcement.css';
import { loadDataByIdAPI } from '../services/announce';
import { useNavigate } from 'react-router-dom';
import { NotificationOutlined } from '@ant-design/icons';
import DOMPurify from 'dompurify';

const { Title } = Typography;

const Announcement = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [pageNum, setpageNum] = useState(1);
  const [size, setsize] = useState(5);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState({ title: '', content: '' });

  // 获取公告数据
  useEffect(() => {
    loadDataByIdAPI(pageNum, size).then((res) => {
      setData(res.data.records);
      setTotal(res.data.total);
    });
  }, [pageNum, size]);

  // 显示详情弹窗
  const showDetail = (item) => {
     // 使用DOMPurify过滤所有HTML标签
     const pureContent = DOMPurify.sanitize(item.content, {
      ALLOWED_TAGS: [] // 强制移除所有HTML标签
    });
    setCurrentContent({
      title: item.title,
      content: pureContent
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
    setpageNum(1); // 重置到第一页
    setsize(newSize);
  };

  return (
    <div className="announcement-container">
      <Title level={3} className="announcement-title">通知公告</Title>
      
      <List
        itemLayout="vertical"
        dataSource={data}
        renderItem={(item) => (
          <List.Item className="announcement-item">
            <div className="list-item-content">
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
                  <a className="item-title" onClick={() => showDetail(item)}>
                    {item.title}
                  </a>
                }
              />
            </div>
          </List.Item>
        )}
      />

      <Modal
        title={currentContent.title}
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        className="announcement-modal"
        width={680} // 加宽弹窗
      >
        <div className="modal-content-container">
          <pre className="modal-content-text">
            <NotificationOutlined />  {currentContent.content}
          </pre>
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
        // onShowSizeChange={handlePageChange}
        onShowSizeChange={handleSizeChange}
      />
    </div>
  );
};

export default Announcement;