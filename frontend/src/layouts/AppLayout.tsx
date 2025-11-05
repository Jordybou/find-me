import { Outlet } from "react-router-dom";
const bgUrl = new URL("../assets/BackgroundPicture.png", import.meta.url).href;

export default function AppLayout() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgUrl})` }}
    >
      <div className="min-h-screen bg-white backdrop-blur-[0.8px] flex items-center justify-center px-6 sm:px-10 py-12 sm:py-16">
        <Outlet />
      </div>
    </div>
  );
}