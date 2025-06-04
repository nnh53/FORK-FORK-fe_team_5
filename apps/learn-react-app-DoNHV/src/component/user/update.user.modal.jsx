import { useEffect, useState } from "react";
import { createUserAPI } from "../../service/api.service";
import { Input, notification, Modal } from "antd";
import { NavLink } from "react-router-dom";



const UpdateUserModal = (props) => {
  const [id, setId] = useState("")
  const [fullName, setFullName] = useState("");
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const { isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } = props

  useEffect(() => {
    if (dataUpdate) {
      setId(dataUpdate._id)
      setFullName(dataUpdate.fullName)
      setPhone(dataUpdate.phone)
      setDataUpdate(null); // Reset dataUpdate to null after using it
    }
  }, [dataUpdate])

  const handleSubmit = async () => {
    const res = await createUserAPI(fullName, email, password, phone);
    if (res.data) {
      notification.success({
        message: "Create User",
        description: "User created successfully"
      })
      resetModal();
      // await loadUser(); // Reload user data after creating a new user
    }
    else {
      notification.error({
        message: "Create User",
        description: JSON.stringify(res.message)
      })
    }

    // console.log("check res ", res.data);
  }

  const resetModal = () => {
    setIsUpdateModalOpen(false);
    setFullName("");
    // setEmail("");
    // setPassword("");
    setPhone("");
  }

  return (
    <div>
      <Modal title="Update User"
        open={isUpdateModalOpen}
        onOk={() => handleSubmit()}
        onCancel={() => resetModal()}
        okText="Save"
        maskClosable={false}>
        <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
          <div>
            <span>ID</span>
            <Input
              value={id}
              disabled={true}
            />
          </div>
          <div>
            <span >Full name</span>
            <Input
              value={fullName}
              onChange={(event) => { setFullName(event.target.value) }}
            />
          </div>
          {/* <div>
                        <span>Email</span>
                        <Input
                            value={email}
                            onChange={(event) => { setEmail(event.target.value) }}
                        />
                    </div> */}
          {/* <div>
                        <span>Password</span>
                        <Input.Password
                            value={password}
                            onChange={(event) => { setPassword(event.target.value) }}
                        />
                    </div> */}
          <div>
            <span>Phone number</span>
            <Input
              value={phone}
              onChange={(event) => { setPhone(event.target.value) }}
            />
          </div>
        </div>
      </Modal>
    </div>


  )
}

export default UpdateUserModal;
