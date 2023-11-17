"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState("");

  //   const handleThemeChange = () => {
  //     if (mode === "dark") {
  //       setMode("light");
  //       document.documentElement.classList.add("light");
  //     } else {
  //       setMode("dark");
  //       document.documentElement.classList.add("dark");
  //     }
  //   };

  //   useEffect(
  //     function () {
  //       handleThemeChange();
  //     },
  //     [mode],
  //   );

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const theme = useContext(ThemeContext);

  if (theme === undefined) {
    throw new Error("useTheme should be used within the ThemeProvider");
  }

  return theme;
}
