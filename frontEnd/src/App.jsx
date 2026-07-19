import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import authService from "./services/auth";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from './components/index';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  
  useEffect(() => {
    fetch('https://s-mv-blog.vercel.app/ping')
      .then(res => res.text())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }, []); // Empty dependency array ensures it runs exactly once on mount
  
  
  useEffect(() => {
    // Keeping logic isolated inside the effect avoids dependency array bloat
    const checkUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        if (userData?.success && userData?.user) {
          dispatch(login(userData.user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("App boot initialization auth check failed:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [dispatch]);

  if (loading) {
    return (<>
      <Header />
      <div className="min-h-screen flex items-center justify-center p-4">
        <Loading title="Initializing Application" description="Setting up your secure workspace..." />
      </div>
      <Footer /></>
    );
  }

  return (
    <div className='min-h-screen flex flex-wrap content-between'>
      <div className='w-full block'>
        <Header />
        <main className="min-h-[60vh]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;


function Loading() {
  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-10 text-white">
      <div className="max-w-7xl mx-auto mt-6 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl p-12 text-center flex flex-col items-center shadow-xl">

        <div className="relative w-12 h-12 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-white/5 shadow-inner"></div>

          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-spin"></div>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Loading Articles</h2>
        <p className="text-sm text-white/50 max-w-sm animate-pulse">
          Fetching the latest content for you...
        </p>
      </div>
    </div>
  )
}
