import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Avatar, message, Flex } from 'antd';
import { loadProfileByTokenAPI, updatePersonAPI } from '../services/personUtil';
import moment from 'moment';
import '../css/person.css';
import { getToken } from '../utils/tool';

const Person = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = getToken();
  // 在组件状态中添加日期面板控制
  const [datePanel, setDatePanel] = useState({
    currentDate: moment(),
    selectedDate: null
  });

  // 处理日期面板变化
  const handlePanelChange = (date, mode) => {
    setDatePanel(prev => ({
      ...prev,
      currentDate: date
    }));
  };

  // 处理日期选择
  const handleDateSelect = date => {
    setDatePanel(prev => ({
      currentDate: date.clone(), // 保持选中日期所在月份
      selectedDate: date.clone()
    }));
    form.setFieldValue('birthday', date);
  };
  
  // 修改月份切换逻辑
  const handleMonthChange = (isNext) => {
    setDatePanel(prev => ({
      ...prev,
      currentDate: isNext 
        ? prev.currentDate.clone().add(1, 'month')
        : prev.currentDate.clone().subtract(1, 'month')
    }));
  };

  // 修改年份切换逻辑
  const handleYearChange = (isNext) => {
    setDatePanel(prev => ({
      ...prev,
      currentDate: isNext 
        ? prev.currentDate.clone().add(1, 'year')
        : prev.currentDate.clone().subtract(1, 'year')
    }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await loadProfileByTokenAPI();
        console.log(data);
        const profileData = data.userProfile || data;

        const processedData = {
          ...profileData,
          birthday: profileData.birthday 
            ? moment(profileData.birthday, 'YYYY-MM-DD')  // 明确指定输入格式
            : null
        };

        form.setFieldsValue(processedData);
      } catch (error) {
        message.error('数据加载失败');
      }
    };

    if(token) fetchProfile();
  }, [token, form]);

  const handleEdit = () => {
    setIsEditing(true);
    // 直接通过resetFields解除禁用状态
    form.setFieldsValue(form.getFieldsValue());
  };

  // 提交更新
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 安全处理日期字段
      const submitData = {
        ...values,
        birthday: values.birthday?.isValid?.() 
          ? values.birthday.format('YYYY-MM-DD')  // 明确输出格式
          : null
      };
  
      await updatePersonAPI(submitData);
      message.success('更新成功');
      setIsEditing(false);
      
      // 重新加载数据
      const { data } = await loadProfileByTokenAPI();
      form.setFieldsValue({
        ...data.userProfile,
        birthday: data.userProfile.birthday ? moment(data.userProfile.birthday) : null
      });
    } catch (error) {
      message.error('更新失败');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="profile-container">
      <div className="avatar-section">
        <Avatar
          src={form.getFieldValue('profilePhoto')}
          size={128}
          className="profile-avatar"
        >
          {!form.getFieldValue('profilePhoto') && '用户'}
        </Avatar>
        <div className="verified-tag">已通过</div>
      </div>

      <Form form={form} layout="vertical">
        {/* 各表单项添加disabled状态控制 */}
        <Form.Item label="用户名" name="username" tooltip="通常为学号">
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item label="真实姓名" name="realName">
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item label="性别" name="gender">
          <Select 
            disabled={!isEditing}
            options={[
              { value: '男', label: '男' },
              { value: '女', label: '女' }
            ]}
          />
        </Form.Item>

        <Form.Item label="部门" name="department">
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item label="生日" name="birthday">
          <DatePicker
            disabled={!isEditing}
            value={datePanel.selectedDate}
            format="YYYY-MM-DD"
            onChange={isEditing ? handleDateSelect : undefined}
            onPanelChange={isEditing ? handlePanelChange : undefined}
            renderExtraFooter={() => (
              <div className="custom-controls">
                <Flex justify="space-between" align="center">
                  {/* 年份切换 */}
                  <Button 
                    disabled={!isEditing}
                    onClick={() => handleYearChange(false)}
                    style={{ padding: '0 8px' }}
                  >
                    «
                  </Button>
                  
                  {/* 月份切换 */}
                  <Flex gap={8}>
                    <Button 
                      disabled={!isEditing}
                      onClick={() => handleMonthChange(false)}
                    >
                      ‹
                    </Button>
                    <Button 
                      disabled={!isEditing}
                      onClick={() => handleMonthChange(true)}
                    >
                      ›
                    </Button>
                  </Flex>
                  
                  {/* 今天按钮 */}
                  <Button 
                    type="link" 
                    disabled={!isEditing}
                    onClick={() => {
                      const now = moment();
                      setDatePanel({
                        currentDate: now,
                        selectedDate: now
                      });
                      form.setFieldValue('birthday', now);
                    }}
                  >
                    今天
                  </Button>
                </Flex>
              </div>
            )}
          />
        </Form.Item>

        <Form.Item label="身份" name="status">
          <Select 
            disabled={!isEditing}
            options={[
              { value: '党员', label: '党员' },
              { value: '预备党员', label: '预备党员' },
              { value: '发展对象', label: '发展对象' },
              { value: '积极分子', label: '积极分子' },
              { value: '共青团员', label: '共青团员' }
            ]}
          />
        </Form.Item>

        <div className="action-buttons">
          <Button 
            className="back-btn" 
            onClick={() => window.history.back()}
          >
            返回
          </Button>
          
          {/* 编辑按钮 */}
          {!isEditing && (
            <Button 
              className="edit-btn"
              onClick={handleEdit}
            >
              编辑
            </Button>
          )}

          {/* 完成按钮 */}
          {isEditing && (
            <Button 
              className="done-btn"
              type="primary" 
              loading={loading}
              onClick={handleSubmit}
            >
              完成
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default Person;