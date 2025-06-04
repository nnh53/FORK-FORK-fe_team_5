import { Button, Input, notification, Modal } from 'antd';
import { useState } from 'react';
import { createUserAPI } from '../../service/api.service';

const UserForm = (props) => {
  const { loadUser } = props;

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
      resetModal();
      await loadUser()
    } else {
      notification.error({
        message: 'Create User',
        description: JSON.stringify(res.message),
      });
    }

    // console.log("check res ", res.data);
  };

  const resetModal = () => {
    setIsModalOpen(false)
    setFullName("");
    setEmail("");
    setPassword("");
    setPhone("");
  }

  return (
    <div className="user-form" style={{ margin: '10px 0' }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Table User</h3>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Create User
        </Button>
      </div>
      <Modal title="Create User"
        open={isModalOpen}
        onOk={() => handleSubmit()}
        onCancel={() => resetModal()}
        okText="Create"
        maskClosable={false}>
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <div>
            <span>Full name</span>
            <Input
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
              }}
            />
          </div>
          <div>
            <span>Email</span>
            <Input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </div>
          <div>
            <span>Password</span>
            <Input.Password
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <div>
            <span>Phone number</span>
            <Input
              value={phone}
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
