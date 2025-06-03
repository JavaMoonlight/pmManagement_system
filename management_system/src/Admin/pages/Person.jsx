import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker, Button, Avatar, message, Flex } from 'antd';
import { loadProfileByTokenAPI, updatePersonAPI } from '../services/personUtil';
import moment from 'moment';    // 日期处理库
import '../css/person.css';
import { getToken } from '../utils/tool';

const Person = () => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);    // 是否处于编辑模式
  const [loading, setLoading] = useState(false);
  const token = getToken();      // 从本地存储获取用户token
  // 在组件状态中添加日期面板控制
  const [datePanel, setDatePanel] = useState({
    currentDate: moment(),    // 当前显示的时间
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
      currentDate: date.clone(),  // 保持选中日期所在月份
      selectedDate: date.clone()  // 记录选中日期
    }));
    form.setFieldValue('birthday', date);
  };
  
  // 修改月份切换逻辑
  const handleMonthChange = (isNext) => {
    setDatePanel(prev => ({
      ...prev,
      currentDate: isNext 
        ? prev.currentDate.clone().add(1, 'month')  // 下个月
        : prev.currentDate.clone().subtract(1, 'month') // 上个月
    }));
  };

  // 修改年份切换逻辑
  const handleYearChange = (isNext) => {
    setDatePanel(prev => ({
      ...prev,
      currentDate: isNext 
        ? prev.currentDate.clone().add(1, 'year')   // 下一年
        : prev.currentDate.clone().subtract(1, 'year')  // 上一年
    }));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await loadProfileByTokenAPI();
        console.log('原始API数据:', data);  // 关键调试点
        // 字段名称修正
      const processedData = {
        username: data.username.trim(), // 处理前导空格
        realName: data.realName, // 兼容拼写错误
        gender: data.gender,
        department: data.department,
        birthday: data.birthday ? moment(data.birthday) : null,
        status: data.status
      };

      console.log('修正后的数据:', processedData); // 验证数据结构
      form.setFieldsValue(processedData);
      } catch (error) {
        message.error('数据加载失败');
      }
    };

    if(token) fetchProfile();   // 仅在token存在时加载
  }, [token, form]);

  const handleEdit = () => {
    setIsEditing(true);  // 启用表单编辑
    form.setFieldsValue(form.getFieldsValue());    // 直接解除禁用状态
  };

  // 提交更新
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();   // 表单验证
      const submitData = {
        ...values,
        birthday: values.birthday?.isValid?.() 
          ? values.birthday.format('YYYY-MM-DD')
          : null
      };
      await updatePersonAPI(submitData);
      message.success('更新成功');
      setIsEditing(false);
      const { data } = await loadProfileByTokenAPI();   // 重新加载数据
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
        <Avatar     //头像组件
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
            renderExtraFooter={() => (      // 自定义底部控制按钮
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