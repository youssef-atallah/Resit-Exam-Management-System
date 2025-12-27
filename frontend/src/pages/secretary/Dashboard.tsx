import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  RotateCcw,
  FileText,
  Calendar,
  TrendingUp,
  UserPlus,
  ClipboardList,
} from 'lucide-react';
import { Card, CardHeader, Badge } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';

interface StatCard {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  change?: string;
}

export function SecretaryDashboard() {
  const { user } = useAuth();

  const stats: StatCard[] = [
    {
      icon: Users,
      label: 'Total Students',
      value: 1250,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12',
    },
    {
      icon: Users,
      label: 'Total Instructors',
      value: 85,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+3',
    },
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: 156,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      icon: RotateCcw,
      label: 'Pending Resit Apps',
      value: 48,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivities = [
    { action: 'New student registered', user: 'John Doe', time: '5 minutes ago' },
    { action: 'Resit exam created', user: 'Dr. Smith', time: '1 hour ago' },
    { action: 'Course schedule updated', user: 'Admin', time: '2 hours ago' },
    { action: 'Grades submitted', user: 'Prof. Johnson', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of the system</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar size={16} />
          <span>Spring 2024-2025</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && (
                    <span className="text-xs text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                      {stat.change}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader title="Quick Actions" subtitle="Common administrative tasks" />
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: UserPlus, label: 'Add Student', path: '/secretary/students' },
              { icon: UserPlus, label: 'Add Instructor', path: '/secretary/instructors' },
              { icon: BookOpen, label: 'Manage Courses', path: '/secretary/courses' },
              { icon: RotateCcw, label: 'Resit Exams', path: '/secretary/resit' },
              { icon: ClipboardList, label: 'Generate Reports', path: '/secretary/reports' },
              { icon: FileText, label: 'View Logs', path: '/secretary/logs' },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Icon size={20} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader
            title="Recent Activity"
            subtitle="Latest system activities"
            action={
              <Link to="/secretary/logs" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            }
          />
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    by {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader
          title="Pending Resit Applications"
          subtitle="Applications awaiting approval"
          action={
            <Link to="/secretary/resit" className="text-sm text-blue-600 hover:text-blue-700">
              View all
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Student
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Course
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Applied
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { student: 'John Doe', course: 'MATH101 - Mathematics I', applied: '2 hours ago', status: 'pending' },
                { student: 'Jane Smith', course: 'PHYS101 - Physics I', applied: '5 hours ago', status: 'pending' },
                { student: 'Bob Johnson', course: 'CS101 - Programming I', applied: '1 day ago', status: 'pending' },
              ].map((app, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">{app.student}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{app.course}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{app.applied}</td>
                  <td className="py-3 px-4">
                    <Badge variant="warning">Pending</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
