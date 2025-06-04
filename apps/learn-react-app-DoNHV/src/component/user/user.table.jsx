import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Space, Table, Tag } from 'antd';
import { useState } from 'react';
import UpdateUserModal from './update.user.modal';


const UserTable = (props) => {
  const { dataUser } = props;

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState(null)

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
      render: (_, record) => (
        <Space size="middle">
          <a href='#'>{record._id}</a>
        </Space>
      ),
    },
    {
      title: 'Full name',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="large">
          <a href="#" style={{ color: 'black' }}>
            <EditOutlined
              onClick={() => {
                setIsUpdateModalOpen(true)
                setDataUpdate(record);

              }} />
          </a>
          <a href="#" style={{ color: "red" }}><DeleteOutlined /></a>
        </Space>
      ),
    },
  ];



  return (
    <>
      <Table columns={columns} dataSource={dataUser} rowKey={"_id"} />
      <UpdateUserModal
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  )
};

export default UserTable;
