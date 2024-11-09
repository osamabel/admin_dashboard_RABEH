import {
  House,
  Users,
  Gamepad2,
  ShoppingBag,
  FileText,
  Star,
  Newspaper,
  CircleDollarSign,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/الرئيسية", name: "الرئيسية", icon: House }, // Home
  { to: "/المستخدمين", name: "المستخدمين", icon: Users }, // Users
  { to: "/التصنيف", name: "التصنيف", icon: Gamepad2 }, // Ranking
  { to: "/المتجر", name: "المتجر", icon: ShoppingBag }, // Store
  { to: "/التقارير", name: "التقارير", icon: FileText }, // Reports
  { to: "/الرعاة", name: "الرعاة", icon: CircleDollarSign }, // Sponsors
  { to: "/التعليقات", name: "التعليقات", icon: Star }, // Feedback
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
                to={'اختبار-جديد'}
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
                <p className="text-[14px]">اختبار جديد</p>
              </NavLink>
            </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
