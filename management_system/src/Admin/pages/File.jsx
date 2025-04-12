import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { 
  loadDataByUserNameAPI,
  insertAPI,
  delByIdAPI
} from '../services/fileUtil';
import { getToken } from '../utils/tool';
import '../css/file.css';

const FilePage = () => {
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  // 加载文件列表
  const loadFiles = async () => {
    try {
      const res = await loadDataByUserNameAPI({
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });
      setFiles(res.data?.data || []);
    } catch (error) {
      message.error('文件加载失败');
    }
  };

  // 文件上传
  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await insertAPI(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${getToken()}`
        }
      });
      
      message.success('上传成功');
      setModalOpen(false);
      loadFiles();
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 文件下载
  const handleDownload = (filename) => {
    const link = document.createElement('a');
    link.href = `/profile/download/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 文件删除
  const handleDelete = async (id) => {
    try {
      await delByIdAPI(
        { id },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      message.success('删除成功');
      loadFiles();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <div className="actions">
          <Button 
            type="link"
            onClick={() => handleDownload(record.fileName)}
          >
            下载
          </Button>
          <Button 
            type="link" 
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="file-container">
      {/* 标题区域 */}
      <div className="header-section">
        <h2 className="page-title">党建材料</h2>
        <Button
          type="primary"
          onClick={() => setModalOpen(true)}
          className="upload-btn"
        >
          上传
        </Button>
      </div>

      {/* 文件表格 */}
      <Table
        bordered
        rowKey="id"
        columns={columns}
        dataSource={files}
        locale={{ emptyText: '暂无数据' }}
      />

      {/* 上传弹窗 */}
      <Modal
        title="文件上传"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Upload
          accept="*"
          showUploadList={false}
          customRequest={({ file }) => handleUpload(file)}
        >
          <Button 
            block 
            icon={<UploadOutlined />}
            loading={uploading}
          >
            选择文件
          </Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default FilePage;