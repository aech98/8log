import { create } from 'zustand';

interface PostEditType {
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const usePostEdit = create<PostEditType>((set) => ({
  isEditing: false,
  setIsEditing: (value: boolean) =>
    set((state) => {
      return { ...state, isEditing: value };
    }),
}));
