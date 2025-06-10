export interface User {
  id: string;
  name: string;
  phone: string;
  dob: Date | null;
  email: string;
  city: string | null;
  district: string | null;
  address: string | null;
  img: string | null;
}

export let user: User = {
  id: 'asdasfasd',
  name: 'Lucian Nguyen',
  phone: '0292920322',
  dob: new Date('2000-02-21'),
  email: 'lucianNguyen@gmail.com',
  city: null,
  district: null,
  address: null,
  img: 'https://smilemedia.vn/wp-content/uploads/2022/09/cach-chup-hinh-the-dep.jpeg',
};
