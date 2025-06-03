import { Button, Input, notification } from 'antd';
import { useState } from 'react';
import { createUserAPI } from '../../service/api.service';

const UserForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleClick = async () => {
    const res = await createUserAPI(fullName, email, password, phone);
    if (res.data) {
      notification.success({
        message: 'Create User',
        description: 'User created successfully',
      });
    } else {
      notification.error({
        message: 'Create User',
        description: JSON.stringify(res.message),
      });
    }
    // console.log("check res ", res.data);
  };

  return (
    <div className="user-form" style={{ margin: '20px 0' }}>
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
        <div>
          <Button type="primary" onClick={handleClick}>
            Create User
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
