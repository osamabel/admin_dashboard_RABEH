import {
  House,
  Users,
  Gamepad2,
  ShoppingBag,
  FileText,
  Star,
  Newspaper,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/home", name: "Home", icon: House },
  { to: "/users", name: "Users", icon: Users },
  { to: "/Ranking", name: "Ranking", icon: Gamepad2 },
  { to: "/store", name: "Store", icon: ShoppingBag },
  { to: "/reports", name: "Reports", icon: FileText },
  { to: "/sponsors", name: "Sponsors", icon: Star },
];

function SideBar() {
  return (
    <div className="min-w-[300px] h-full bg-black rounded-[10px] py-[40px]">
      <div className="w-full h-full flex flex-col items-center justify-between text-white">
        <div>
          <img src="/Logo.svg" alt="" />
        </div>
        <div className="flex flex-col gap-y-[10px] px-[20px] w-full">
          {navItems.map((item, index) => (
            <div key={index} className="w-full bg-white/10 rounded-[6px]">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-end justify-center gap-x-[5px] py-[10px] w-full group active-class"
                    : "flex items-end justify-center gap-x-[5px] py-[10px] w-full group"
                }
              >
                <div className="overflow-hidden relative min-w-[25px] min-h-[25px]">
                  <div className="absolute group-hover:translate-y-[-25px] translate-y-[0px] duration-500 transition-transform">
                    <item.icon width={16} />
                  </div>
                  <div className="absolute group-hover:translate-y-[0px] translate-y-[25px] duration-500 transition-transform">
                    <item.icon width={16} />
                  </div>
                </div>
                <p className="text-[14px]">{item.name}</p>
              </NavLink>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-y-[10px] px-[20px] w-full">
          <div className="w-full bg-white/10 rounded-[6px]">
              <NavLink
                to={'newQuiz'}
                className={({ isActive }) =>
                  isActive
                    ? "flex items-end justify-center gap-x-[5px] py-[10px] w-full group active-class"
                    : "flex items-end justify-center gap-x-[5px] py-[10px] w-full group"
                }
              >
                <div className="overflow-hidden relative min-w-[25px] min-h-[25px]">
                  <div className="absolute group-hover:translate-y-[-25px] translate-y-[0px] duration-500 transition-transform">
                    <Newspaper width={16} />
                  </div>
                  <div className="absolute group-hover:translate-y-[0px] translate-y-[25px] duration-500 transition-transform">
                    <Newspaper width={16} />
                  </div>
                </div>
                <p className="text-[14px]">New Quiz</p>
              </NavLink>
            </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
