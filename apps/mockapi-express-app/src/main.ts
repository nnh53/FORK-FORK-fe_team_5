/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from 'cors';
import express from 'express';
import * as path from 'path';
import { blogsMockData } from './blogs.mockapi';
import { healthMetricListMockData } from './health-metric.mockapi';
import { User } from './myInfo.mockapi';
import { myMembership } from './myMembership';
import { myMovieHistory } from './myMovieHistory';
import { mockVoucherHistory, mockVouchers } from './voucher.mockapi';
import { myPoint } from './mypoint';
import { loginMock, usersMockData } from './users.mockapi';
import { myMembership } from './myMembership';
import { myMovieHistory } from './myMovieHistory';
import { mockVoucherHistory, mockVouchers } from './voucher.mockapi';
import { myPoint } from './mypoint';

const app = express();
const corsOptions = {
  origin: ['http://localhost:4222', 'http://localhost:5173'],
};
app.use(cors(corsOptions));

//middleware
app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to mockapi-express!' });
});

// http://localhost:3000/metrics
app.get('/metrics', (req, res) => {
  res.send(healthMetricListMockData);
});

// http://localhost:3000/blogs
app.get('/blogs', (req, res) => {
  res.send(blogsMockData);
});

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
app.get('/myInfo', (req, res) => {
  res.send(user);
});

app.put('/myInfo', (req, res) => {
  const updatedData = req.body;

  // Update user object with new data
  user = {
    ...user,
    ...updatedData,
  };

  res.send(user);
});
app.get('/myMembership', (req, res) => {
  res.send(myMembership);
});

app.get('/myMovieHistory', (req, res) => {
  res.send(myMovieHistory);
});
app.get('/myPoint', (req, res) => {
  res.send(myPoint);
});

app.get('/myVoucher', (req, res) => {
  res.send(mockVouchers);
});
app.get('/myVoucherHistory', (req, res) => {
  res.send(mockVoucherHistory);
});
// Add login endpoint
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  const userData = loginMock(email, password);

  if (userData) {
    res.status(200).json(userData);
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

// Add register endpoint
app.post('/users/register', (req, res) => {
  const { email, password, full_name, date_of_birth } = req.body;

  // Check if user already exists
  if (usersMockData[email]) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // In a real app, we would save the user to a database
  // For this mock, we'll just return a success response
  res.status(200).json({
    message: 'Registration successful',
    user: {
      email,
      full_name,
      date_of_birth,
    },
  });
});

// Add logout endpoint
app.post('/users/logout', (req, res) => {
  // In a real app, we would invalidate the token here
  res.status(200).json({ message: 'Logged out successfully' });
});

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on('error', console.error);
