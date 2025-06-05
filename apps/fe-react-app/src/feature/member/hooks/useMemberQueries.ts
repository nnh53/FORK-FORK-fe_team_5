// src/feature/member/hooks/useMemberQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMembers, createMember, updateMember, deleteMember } from '../services/memberApi';
import { Member } from '../types'; // Adjust path if necessary

export const MEMBER_QUERY_KEY = 'members'; // Key để quản lý cache của react-query

// Hook để lấy danh sách members
export function useGetMembers() {
  return useQuery<Member[], Error>({
    queryKey: [MEMBER_QUERY_KEY], // Key cho query này
    queryFn: getMembers, // Hàm thực thi để lấy dữ liệu
  });
}

// Hook để tạo member mới
export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation<Member, Error, Omit<Member, 'member_id'>>({
    mutationFn: createMember,
    onSuccess: () => {
      // Sau khi tạo thành công, làm mới lại query 'members' để cập nhật danh sách
      queryClient.invalidateQueries({ queryKey: [MEMBER_QUERY_KEY] });
    },
  });
}

// Hook để cập nhật member
export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation<Member, Error, Member>({
    mutationFn: updateMember,
    onSuccess: (updatedMember) => {
      queryClient.invalidateQueries({ queryKey: [MEMBER_QUERY_KEY] });
      // Optional: cập nhật cache cho member cụ thể nếu có trang chi tiết
      // queryClient.setQueryData([MEMBER_QUERY_KEY, updatedMember.member_id], updatedMember);
    },
  });
}

// Hook để xóa member
export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    // string ở đây là member_id
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEMBER_QUERY_KEY] });
    },
  });
}
