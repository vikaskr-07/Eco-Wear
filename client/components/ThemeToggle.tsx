import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-10 w-10">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="h-10 w-10 bg-white/80 hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90 border-2 border-eco-200 dark:border-eco-700 transition-all duration-300 hover:scale-105 shadow-lg"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-eco-600 dark:text-eco-400 transition-all duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 text-eco-600 dark:text-eco-400 transition-all duration-300 rotate-0 scale-100" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
