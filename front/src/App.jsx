import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routes";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {routes.map((route, i) =>
          route.children ? (
            <Route key={i} path={route.path} element={route.element}>
              {route.children.map((child, idx) => (
                <Route key={idx} path={child.path} element={child.element} />
              ))}
            </Route>
          ) : (
            <Route key={i} path={route.path} element={route.element} />
          )
        )}
      </Routes>
    </BrowserRouter>
  );
}
