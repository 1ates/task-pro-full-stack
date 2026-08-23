import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "../../pages/AuthPage/AuthPage.jsx";
import HomePage from "../../pages/HomePage/HomePage.jsx";
import NotFoundPage from "../../pages/NotFound/NotFound.jsx";
import PrivateRoute from "../../routers/PrivateRoute.jsx";
import RestrictedRoute from "../../routers/RestrictedRoute.jsx";
import { refreshUser } from "../../redux/auth/operations.js";
import { selectIsRefreshing } from "../../redux/auth/selectors.js";
import { Loader } from "../Loader/Loader.jsx";
import "./App.module.css";

// NOT: WelcomePage.jsx ve ScreensPage.jsx henuz bos (0 satir),
// bu yuzden bu route'lar simdilik yorum satirinda birakildi.
// O sayfalari yazan arkadas tamamlayinca yorumlari kaldirip
// import satirlarini eklemesi yeterli.
// import WelcomePage from "../../pages/WelcomePage/WelcomePage.jsx";
// import ScreensPage from "../../pages/ScreensPage/ScreensPage.jsx";

function App() {
  const dispatch = useDispatch();
  const isRefreshing = useSelector(selectIsRefreshing);

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  if (isRefreshing) return <Loader />;

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/welcome' replace />} />

      {/* TODO: WelcomePage hazir olunca asagidaki satiri degistir */}
      <Route path='/welcome' element={<Navigate to='/auth/login' replace />} />

      <Route path='/auth/:id' element={<RestrictedRoute component={<AuthPage />} />} />

      <Route path='/home' element={<PrivateRoute component={<HomePage />} />}>
        {/* TODO: ScreensPage hazir olunca nested route olarak eklenecek */}
        {/* <Route path=':boardId' element={<ScreensPage />} /> */}
      </Route>

      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
