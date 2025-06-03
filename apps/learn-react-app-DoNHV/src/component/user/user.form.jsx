import { Button, Input, notification, Modal } from 'antd';
import { useState } from 'react';
import { createUserAPI } from '../../service/api.service';

const UserForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async () => {
    const res = await createUserAPI(fullName, email, password, phone);
    if (res.data) {
      notification.success({
        message: 'Create User',
        description: 'User created successfully',
      })
      setIsModalOpen(false)
    } else {
      notification.error({
        message: 'Create User',
        description: JSON.stringify(res.message),
      });
    }

    // console.log("check res ", res.data);
  };

  return (
    <div className="user-form" style={{ margin: '10px 0' }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create User
        </Button>
      </div>
      <Modal title="Create User"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Create"
        maskClosable={false}>
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <div>
            <span>Full name</span>
            <Input
              onChange={(event) => {
                setFullName(event.target.value);
              }}
            />
          </div>
          <div>
            <span>Email</span>
            <Input
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div>
            <span>Password</span>
            <Input.Password
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <div>
            <span>Phone number</span>
            <Input
              onChange={(event) => {
                setPhone(event.target.value);
              }}
            />
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default UserForm;
