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

const app = express();
const corsOptions = {
  origin: ['http://localhost:4222', 'http://localhost:5173'],
};
app.use(cors(corsOptions));

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
const port = 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/`);
});
server.on('error', console.error);
