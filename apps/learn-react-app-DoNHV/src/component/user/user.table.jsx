import { Space, Table, Tag } from 'antd';


const UserTable = (props) => {
  const { dataUser } = props;

  const columns = [
    {
      title: 'ID',
      dataIndex: '_id',
    },
    {
      title: 'Full name',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
  ];



  return <Table columns={columns} dataSource={dataUser} rowKey={'_id'} />;
};

export default UserTable;
