import { PointTransaction } from "./interfaces/member.interface.ts";
import { UserBase } from "./interfaces/users.interface.ts";

export const membersMockData: UserBase[] = [
  {
    id: "M001",
    full_name: "Nguyễn Văn A",
    date_of_birth: "2000-01-01",
    email: "a.nguyen@email.com",
    password: "123456",
    is_active: 1,
    is_subscription: 1,
    role_name: "MEMBER",
    status_name: "ACTIVE",
    avatar_url: "https://via.placeholder.com/150",
    loyalty_point: 1000,
    totalSpent: 2500000,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2025-06-18T00:00:00Z",
    membershipLevel: "Platinum",
  },
  {
    id: "M002",
    full_name: "Trần Thị B",
    date_of_birth: "2000-01-01",
    email: "b.tran@email.com",
    password: "123456",
    is_active: 1,
    is_subscription: 1,
    role_name: "MEMBER",
    status_name: "ACTIVE",
    avatar_url: "https://via.placeholder.com/150",
    loyalty_point: 1000,
    totalSpent: 1200000,
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2025-06-18T00:00:00Z",
    membershipLevel: "Silver",
  },
  {
    id: "M003",
    full_name: "Lê Văn C",
    date_of_birth: "2000-01-01",
    email: "c.le@email.com",
    password: "123456",
    is_active: 1,
    is_subscription: 1,
    role_name: "MEMBER",
    status_name: "ACTIVE",
    avatar_url: "https://via.placeholder.com/150",
    loyalty_point: 1000,
    totalSpent: 5000000,
    createdAt: "2023-11-10T00:00:00Z",
    updatedAt: "2025-06-18T00:00:00Z",
    membershipLevel: "Gold",
  },
  {
    id: "M004",
    full_name: "Tran Tan Phat",
    date_of_birth: "2000-01-01",
    email: "xxxxx@email.com",
    password: "123456",
    is_active: 1,
    is_subscription: 1,
    role_name: "MEMBER",
    status_name: "ACTIVE",
    avatar_url: "https://via.placeholder.com/150",
    loyalty_point: 1000,
    totalSpent: 5000000,
    createdAt: "2023-11-10T00:00:00Z",
    updatedAt: "2025-06-18T00:00:00Z",
    membershipLevel: "Diamond",
  },
];

export const pointTransactionsMockData: PointTransaction[] = [
  {
    id: "PT001",
    memberId: "M001",
    type: "earn",
    points: 50,
    description: "Check-in cho booking BK001",
    createdAt: "2025-06-18T10:00:00Z",
  },
  {
    id: "PT002",
    memberId: "M001",
    type: "redeem",
    points: 100,
    description: "Sử dụng điểm cho booking BK005",
    createdAt: "2025-06-18T14:30:00Z",
  },
  {
    id: "PT003",
    memberId: "M002",
    type: "earn",
    points: 75,
    description: "Check-in cho booking BK002",
    createdAt: "2025-06-18T16:00:00Z",
  },
];

// Members API
export const membersAPI = {
  getAll: (): UserBase[] => {
    return membersMockData;
  },

  getById: (id: string): UserBase | null => {
    return membersMockData.find((member) => member.id === id) || null;
  },

  getByEmail: (email: string): UserBase | null => {
    return membersMockData.find((member) => member.email === email) || null;
  },

  create: (memberData: Omit<UserBase, "id" | "createdAt" | "updatedAt">): UserBase => {
    const newMember: UserBase = {
      ...memberData,
      id: `M${String(membersMockData.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    membersMockData.push(newMember);
    return newMember;
  },

  update: (id: string, updateData: Partial<UserBase>): UserBase | null => {
    const index = membersMockData.findIndex((member) => member.id === id);
    if (index === -1) return null;

    membersMockData[index] = {
      ...membersMockData[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return membersMockData[index];
  },

  updatePoints: (id: string, points: number, type: "earn" | "redeem", description: string): UserBase | null => {
    const member = membersAPI.getById(id);
    if (!member) return null;

    const pointChange = type === "earn" ? points : -points;
    const newPoints = Math.max(0, member.loyalty_point + pointChange);

    // Create transaction record
    const transaction: PointTransaction = {
      id: `PT${String(pointTransactionsMockData.length + 1).padStart(3, "0")}`,
      memberId: id,
      type,
      points,
      description,
      createdAt: new Date().toISOString(),
    };
    pointTransactionsMockData.push(transaction);

    // Update member points
    return membersAPI.update(id, { loyalty_point: newPoints });
  },

  getTransactions: (memberId: string): PointTransaction[] => {
    return pointTransactionsMockData.filter((transaction) => transaction.memberId === memberId);
  },

  delete: (id: string): UserBase | null => {
    const index = membersMockData.findIndex((member) => member.id === id);
    if (index === -1) return null;

    const deletedMember = membersMockData[index];
    membersMockData.splice(index, 1);
    return deletedMember;
  },
};
