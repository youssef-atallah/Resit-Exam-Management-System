import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  RotateCcw,
  Users,
  ClipboardList,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const studentNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/student' },
  { icon: BookOpen, label: 'Courses', path: '/student/courses' },
  { icon: Calendar, label: 'Schedule', path: '/student/schedule' },
  { icon: GraduationCap, label: 'Grades', path: '/student/grades' },
  { icon: RotateCcw, label: 'Resit Exams', path: '/student/resit' },
];

const instructorNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/instructor' },
  { icon: BookOpen, label: 'Courses', path: '/instructor/courses' },
  { icon: Calendar, label: 'Schedule', path: '/instructor/schedule' },
  { icon: RotateCcw, label: 'Resit Exams', path: '/instructor/resit' },
  { icon: ClipboardList, label: 'Grades', path: '/instructor/grades' },
];

const secretaryNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/secretary' },
  { icon: Users, label: 'Students', path: '/secretary/students' },
  { icon: Users, label: 'Instructors', path: '/secretary/instructors' },
  { icon: BookOpen, label: 'Courses', path: '/secretary/courses' },
  { icon: RotateCcw, label: 'Resit Exams', path: '/secretary/resit' },
  { icon: FileText, label: 'Reports', path: '/secretary/reports' },
];

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems =
    user?.role === 'instructor'
      ? instructorNav
      : user?.role === 'secretary'
      ? secretaryNav
      : studentNav;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto z-30">
      <nav className="p-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <NavLink
            to="/settings"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
              transition-all duration-200
              ${
                location.pathname === '/settings'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <Settings size={20} className="text-gray-400" />
            Settings
          </NavLink>
        </div>
      </nav>
    </aside>
  );
}
