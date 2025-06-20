// Members mock API
export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  membershipLevel: "Silver" | "Gold" | "Platinum";
  currentPoints: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface PointTransaction {
  id: string;
  memberId: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  createdAt: string;
}

// Mock data
export const membersMockData: Member[] = [
  {
    id: "M001",
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "a.nguyen@email.com",
    membershipLevel: "Gold",
    currentPoints: 1250,
    totalSpent: 2500000,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2025-06-18T00:00:00Z",
  },
  {
    id: "M002",
    name: "Trần Thị B",
    phone: "0987654321",
    email: "b.tran@email.com",
    membershipLevel: "Silver",
    currentPoints: 850,
    totalSpent: 1200000,
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2025-06-18T00:00:00Z",
  },
  {
    id: "M003",
    name: "Lê Văn C",
    phone: "0555123456",
    email: "c.le@email.com",
    membershipLevel: "Platinum",
    currentPoints: 2100,
    totalSpent: 5000000,
    createdAt: "2023-11-10T00:00:00Z",
    updatedAt: "2025-06-18T00:00:00Z",
  },
  {
    id: "M004",
    name: "Tran Tan Phat",
    phone: "0555123456",
    email: "xxxxx@email.com",
    membershipLevel: "Platinum",
    currentPoints: 2100,
    totalSpent: 5000000,
    createdAt: "2023-11-10T00:00:00Z",
    updatedAt: "2025-06-18T00:00:00Z",
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
  getAll: (): Member[] => {
    return membersMockData;
  },

  getById: (id: string): Member | null => {
    return membersMockData.find((member) => member.id === id) || null;
  },

  getByPhone: (phone: string): Member | null => {
    return membersMockData.find((member) => member.phone === phone) || null;
  },

  create: (memberData: Omit<Member, "id" | "createdAt" | "updatedAt">): Member => {
    const newMember: Member = {
      ...memberData,
      id: `M${String(membersMockData.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    membersMockData.push(newMember);
    return newMember;
  },

  update: (id: string, updateData: Partial<Member>): Member | null => {
    const index = membersMockData.findIndex((member) => member.id === id);
    if (index === -1) return null;

    membersMockData[index] = {
      ...membersMockData[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return membersMockData[index];
  },

  updatePoints: (id: string, points: number, type: "earn" | "redeem", description: string): Member | null => {
    const member = membersAPI.getById(id);
    if (!member) return null;

    const pointChange = type === "earn" ? points : -points;
    const newPoints = Math.max(0, member.currentPoints + pointChange);

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
    return membersAPI.update(id, { currentPoints: newPoints });
  },

  getTransactions: (memberId: string): PointTransaction[] => {
    return pointTransactionsMockData.filter((transaction) => transaction.memberId === memberId);
  },

  delete: (id: string): Member | null => {
    const index = membersMockData.findIndex((member) => member.id === id);
    if (index === -1) return null;

    const deletedMember = membersMockData[index];
    membersMockData.splice(index, 1);
    return deletedMember;
  },
};
