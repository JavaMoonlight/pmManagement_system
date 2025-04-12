import React, { useState, useEffect } from 'react';
import { Avatar, Table, Typography } from 'antd';
import { loadProfileByTokenAPI, ByTokenAPI } from '../services/processUtil';
import '../css/process.css';

const { Title } = Typography;

const processStages = [
  { key: 'activeMember', label: '积极分子' },
  { key: 'developing', label: '发展对象' },
  { key: 'probationary', label: '预备党员' },
  { key: 'fullMember', label: '党员' }
];

const ProcessPage = () => {
  const [currentStage, setCurrentStage] = useState('');
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);

  // 新增分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5
  });

  // 获取用户发展状态
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const { data } = await loadProfileByTokenAPI();
        setCurrentStage(data.status);
      } catch (error) {
        console.error('获取状态失败:', error);
      }
    };
    fetchUserStatus();
  }, []);

  // 获取奖惩记录
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        // 1. 获取用户信息
        const { data: profileData } = await loadProfileByTokenAPI();
        console.log('用户信息:', profileData);
        
        if (!profileData?.username) {
          throw new Error('用户信息缺失username字段');
        }
    
        // 2. 调用奖惩接口
        const response = await ByTokenAPI({
          username: profileData.username,
          pageNum: pagination.current,
          pageSize: pagination.pageSize
        });
        console.log('接口原始响应:', response);
    
        // 3. 验证接口状态码
        if (response.code !== '200') {
          throw new Error(response.message || '接口返回异常状态码');
        }
    
        // 4. 安全访问数据字段
        const rewardData = response.data?.data || [];
        console.log('处理后的数据:', rewardData);
    
        // 5. 数据转换
        const formattedData = rewardData.map(item => ({
          id: item.id,
          type: item.type?.includes('奖') ? '奖' : '惩', // 容错处理
          name: item.name || '无名称',
          description: item.description || '无描述',
          time: item.time ? new Date(item.time).toLocaleDateString() : '无时间'
        }));
    
        setRewards(formattedData);
        setLoading(false);
      } catch (error) {
        console.error('完整错误信息:', error);
        setRewards([]);
        setLoading(false);
      }
    };
    fetchRewards();
  }, [pagination]); // 依赖分页状态

  //添加分页变更处理
  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      render: text => (
        <span className={`type-${text === '奖' ? 'award' : 'punish'}`}>
          {text}
        </span>
      )
    },
    { title: '名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description' },
    { title: '时间', dataIndex: 'time' }
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

      {/* 奖惩记录表格 */}
      <Title level={4} className="reward-title">奖惩情况</Title>
      <Table
        columns={columns}
        dataSource={rewards}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: rewards.length,
          showSizeChanger: true
        }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
};

export default ProcessPage;