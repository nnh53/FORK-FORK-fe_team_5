type Account = {
  id: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
};

const testAccounts: Account[] = [
  {
    id: '1',
    email: 'bao@gmail.com',
    phoneNumber: '090000000',
    password: '123456',
    role: 'manager'
  },
  {
    id: '2',
    email: 'phat@gmail.com',
    phoneNumber: '090000000',
    password: '123456',
    role: `member`
  },
  {
    id: '3',
    email: 'hoang@gmail.com',
    phoneNumber: '065432197',
    password: '123456',
    role: `guest`,
  },
  {
    id: '4',
    email: 'staff@gmail.com',
    phoneNumber: '025432197',
    password: '123456',
    role: `staff`,
  },
];

export default testAccounts;

