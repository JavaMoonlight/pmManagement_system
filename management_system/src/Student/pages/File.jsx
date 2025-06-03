import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { 
  loadDataByUserNameAPI,
  insertAPI,
  delByIdAPI,
  getByTokenAPI
} from '../services/fileUtil';
import { getToken } from '../utils/tool';
import '../css/file.css';

const FilePage = () => {
  const [files, setFiles] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadUserAndFiles = async () => {
      try {
        // 先获取用户信息
        const profileRes = await getByTokenAPI();
        // console.log(profileRes)
        const username = profileRes.data.username;     
        // 再加载文件列表（带username参数）
        const fileRes = await loadDataByUserNameAPI({
          username,
          pageNum: 1,
          pageSize: 10
        });
        console.log(fileRes)
        setFiles(fileRes.data.records);
      } catch (error) {
        message.error('初始化失败');
      }
    };
    loadUserAndFiles();
  }, []);

  useEffect(() => {
    loadFiles();
  }, []);

  // 加载文件列表
  const loadFiles = async () => {
    try {
      const profileRes = await getByTokenAPI();
      const username = profileRes.data.username;     
      const res = await loadDataByUserNameAPI({
        username,
        pageNum: 1,
        pageSize: 10
      });
      setFiles(res.data.records || []);
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
    fetch(`/profile/download/${filename}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  // 文件删除
  const handleDelete = async (fileId) => {
    try {
      await delByIdAPI(fileId);
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