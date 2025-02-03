import { create } from "zustand";
import { persist } from "zustand/middleware";

const enum ThemeMode {
  dark,
  light,
}

interface State {
  themeMode: ThemeMode;
}
const initialState: State = {
  themeMode: ThemeMode.light,
};

interface Actions {
  setThemeMode: (themeMode: ThemeMode) => void;
}

const useGlobalStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      ...initialState,
      setThemeMode: (themeMode: ThemeMode) => set(() => ({ themeMode })),
    }),
    {
      name: "globalStore",
    },
  ),
);

export default useGlobalStore;
