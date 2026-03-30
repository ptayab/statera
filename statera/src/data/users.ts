export type User = {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'worker' | 'miner' | 'supervisor';
};

export const users: User[] = [
  {
    id: 1,
    email: 'w',
    password: 'd1',
    name: 'Worker One',
    role: 'worker',
  },
  {
    id: 2,
    email: 'workerOne@statera.com',
    password: 'demo1234',
    name: 'Worker One',
    role: 'miner',
  },
  {
    id: 3,
    email: 'manager@statera.com',
    password: 'manager1234',
    name: 'Manager',
    role: 'admin',
  },
];