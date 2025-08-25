import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Modal, Form, Input, Select, InputNumber, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Option } = Select;
const { TextArea } = Input;

const AdminContainer = styled.div`
  padding: 24px;
`;

const AdminOffers: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOffer, setEditingOffer] = useState<any>(null);
  const [form] = Form.useForm();

  // Mock data
  const offers = [
    {
      id: 1,
      title: 'Under 299 Sale',
      type: 'under-299',
      discount: 20,
      validFrom: '2024-01-01',
      validUntil: '2024-01-31',
      status: 'active'
    },
    {
      id: 2,
      title: 'Special Deals',
      type: 'special-deals',
      discount: 15,
      validFrom: '2024-01-15',
      validUntil: '2024-02-15',
      status: 'active'
    }
  ];

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color="blue">{type.replace('-', ' ').toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: number) => `${discount}%`,
    },
    {
      title: 'Valid From',
      dataIndex: 'validFrom',
      key: 'validFrom',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button 
            danger 
            size="small" 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingOffer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (offer: any) => {
    setEditingOffer(offer);
    form.setFieldsValue(offer);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this offer?',
      content: 'This action cannot be undone.',
      onOk() {
        message.success('Offer deleted successfully');
      },
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingOffer) {
        message.success('Offer updated successfully');
      } else {
        message.success('Offer created successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save offer');
    }
  };

  return (
    <AdminContainer>
      <Card
        title="Offer Management"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Offer
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={offers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={editingOffer ? 'Edit Offer' : 'Add Offer'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Offer Title"
            rules={[{ required: true, message: 'Please enter offer title' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Offer Type"
            rules={[{ required: true, message: 'Please select offer type' }]}
          >
            <Select>
              <Option value="under-299">Under 299</Option>
              <Option value="special-deals">Special Deals</Option>
              <Option value="deal-of-month">Deal of the Month</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount"
            label="Discount Percentage"
            rules={[{ required: true, message: 'Please enter discount percentage' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="validFrom"
            label="Valid From"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="validUntil"
            label="Valid Until"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingOffer ? 'Update' : 'Add'} Offer
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminContainer>
  );
};

export default AdminOffers;
