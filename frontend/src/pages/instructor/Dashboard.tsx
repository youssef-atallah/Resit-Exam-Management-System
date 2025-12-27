import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  RotateCcw,
  ClipboardList,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { Card, CardHeader, Badge } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { instructorService } from '../../services/instructorService';
import { Course, ResitExam } from '../../types';

interface StatCard {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

export function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [resitExams, setResitExams] = useState<ResitExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      try {
        const [coursesData, examsData] = await Promise.all([
          instructorService.getCourses(user.id),
          instructorService.getResitExams(user.id),
        ]);
        setCourses(coursesData);
        setResitExams(examsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  const activeResitExams = resitExams.filter((e) => e.status === 'scheduled');

  const stats: StatCard[] = [
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: courses.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: 156,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: RotateCcw,
      label: 'Resit Exams',
      value: activeResitExams.length,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: ClipboardList,
      label: 'Pending Grades',
      value: 24,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your courses and exams</p>
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
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Courses */}
        <Card>
          <CardHeader
            title="My Courses"
            subtitle="Courses you're teaching this semester"
            action={
              <Link to="/instructor/courses" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            }
          />
          <div className="space-y-3">
            {courses.slice(0, 4).map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>
                </div>
                <Badge variant="info">{course.credits} Credits</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Resit Exams */}
        <Card>
          <CardHeader
            title="Active Resit Exams"
            subtitle="Upcoming resit exams you're managing"
            action={
              <Link to="/instructor/resit" className="text-sm text-blue-600 hover:text-blue-700">
                Manage
              </Link>
            }
          />
          {activeResitExams.length > 0 ? (
            <div className="space-y-3">
              {activeResitExams.slice(0, 3).map((exam) => (
                <div
                  key={exam.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{exam.courseName}</p>
                      <p className="text-sm text-gray-500">{exam.courseCode}</p>
                    </div>
                    <Badge variant="warning">Scheduled</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                    <span>{exam.examTime}</span>
                    <span>{exam.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No active resit exams scheduled.</p>
              <Link
                to="/instructor/resit"
                className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-700"
              >
                Create a resit exam
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader title="Quick Actions" subtitle="Common tasks and actions" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: RotateCcw, label: 'Create Resit Exam', path: '/instructor/resit' },
            { icon: ClipboardList, label: 'Enter Grades', path: '/instructor/grades' },
            { icon: Users, label: 'View Students', path: '/instructor/courses' },
            { icon: TrendingUp, label: 'View Reports', path: '/instructor/reports' },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.path}
                className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
