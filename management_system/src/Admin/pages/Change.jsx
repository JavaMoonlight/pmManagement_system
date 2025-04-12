import React from 'react';
import { Row, Col, Typography } from 'antd';
import '../css/change.css';
import dues1 from '../../img/5.png'
import dues2 from '../../img/4.png'


const { Text } = Typography;

const Change = () => {
  return (
    <div className="container">
      <Row justify="space-around" align="middle" gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div className="card-wrapper">
            <img 
              src={dues1}
              alt="第一党支部" 
              className="party-image"
            />
            <div className="caption">
              <Text strong>第一党支部</Text>
            </div>
          </div>
        </Col>
        
        <Col xs={24} md={12}>
          <div className="card-wrapper">
            <img 
              src={dues2}
              alt="第二党支部" 
              className="party-image"
            />
            <div className="caption">
              <Text strong>第二党支部</Text>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Change;