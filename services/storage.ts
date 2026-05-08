import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV({
  id: "aqua-flow-storage",
});

export const mmkvStorage = {
  setItem: (name: string, value: string) => {
    return storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    return storage.remove(name);
  },
};
