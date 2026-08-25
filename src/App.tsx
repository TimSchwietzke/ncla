import { Route, Routes } from "react-router";
import { AppShell } from "./components/AppShell";
import Home from "./routes/Home";
import Categories from "./routes/Categories";
import Category from "./routes/Category";
import Patterns from "./routes/Patterns";
import PatternDetail from "./routes/PatternDetail";
import Problem from "./routes/Problem";
import NotFound from "./routes/NotFound";
import { CheatSheet, Method, Progress, Review } from "./routes/Placeholders";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Home />} />
        <Route path="method" element={<Method />} />
        <Route path="patterns" element={<Patterns />} />
        <Route path="patterns/:patternSlug" element={<PatternDetail />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/:categorySlug" element={<Category />} />
        <Route path="problems/:categorySlug/:problemSlug" element={<Problem />} />
        <Route path="review" element={<Review />} />
        <Route path="progress" element={<Progress />} />
        <Route path="cheat-sheet" element={<CheatSheet />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
