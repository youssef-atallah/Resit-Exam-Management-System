import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  GraduationCap,
  RotateCcw,
  TrendingUp,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/studentService';
import { Course, Grade } from '../../types';

interface StatCard {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      try {
        const [coursesData, gradesData] = await Promise.all([
          studentService.getCourses(user.id),
          studentService.getCourseDetails(user.id),
        ]);
        setCourses(coursesData);
        setGrades(gradesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  const eligibleForResit = grades.filter((g) => g.isEligibleForResit);

  const stats: StatCard[] = [
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: courses.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: GraduationCap,
      label: 'Completed',
      value: grades.filter((g) => g.letterGrade && g.letterGrade !== 'F').length,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: RotateCcw,
      label: 'Resit Eligible',
      value: eligibleForResit.length,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      icon: TrendingUp,
      label: 'GPA',
      value: '3.5',
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
          <p className="text-gray-500 mt-1">Here's what's happening with your courses</p>
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
        {/* Upcoming Exams */}
        <Card>
          <CardHeader
            title="Upcoming Events"
            subtitle="Your schedule for this week"
            action={
              <Link to="/student/schedule" className="text-sm text-blue-600 hover:text-blue-700">
                View all
              </Link>
            }
          />
          <div className="space-y-3">
            {[
              { date: 'Mar 15', title: 'Mathematics Final', time: '10:00 AM', room: 'Room 101' },
              { date: 'Mar 18', title: 'Physics Midterm', time: '2:00 PM', room: 'Room 203' },
              { date: 'Mar 20', title: 'Programming Project Due', time: '11:59 PM', room: 'Online' },
            ].map((event, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="text-center min-w-[48px]">
                  <p className="text-xs text-gray-500">{event.date.split(' ')[0]}</p>
                  <p className="text-lg font-bold text-gray-900">{event.date.split(' ')[1]}</p>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{event.time}</span>
                    <span>•</span>
                    <span>{event.room}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Resit Eligible Courses */}
        <Card>
          <CardHeader
            title="Resit Eligible Courses"
            subtitle="Courses you can apply for resit exams"
            action={
              <Link to="/student/resit" className="text-sm text-blue-600 hover:text-blue-700">
                Apply now
              </Link>
            }
          />
          {eligibleForResit.length > 0 ? (
            <div className="space-y-3">
              {eligibleForResit.slice(0, 3).map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <AlertCircle size={18} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{grade.courseName}</p>
                      <p className="text-sm text-gray-500">{grade.courseCode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{grade.letterGrade || 'F'}</p>
                    <p className="text-xs text-gray-500">Grade</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                <GraduationCap size={24} className="text-green-600" />
              </div>
              <p className="text-gray-500">Great job! No courses eligible for resit.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <CardHeader
          title="Recent Grades"
          subtitle="Your latest academic performance"
          action={
            <Link to="/student/grades" className="text-sm text-blue-600 hover:text-blue-700">
              View all grades
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Course
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Midterm
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Final
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {grades.slice(0, 5).map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{grade.courseName}</p>
                    <p className="text-sm text-gray-500">{grade.courseCode}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium">{grade.midterm ?? '-'}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium">{grade.final ?? '-'}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                        grade.letterGrade === 'A' || grade.letterGrade === 'A-'
                          ? 'bg-green-100 text-green-700'
                          : grade.letterGrade === 'B+' ||
                            grade.letterGrade === 'B' ||
                            grade.letterGrade === 'B-'
                          ? 'bg-blue-100 text-blue-700'
                          : grade.letterGrade === 'C+' ||
                            grade.letterGrade === 'C' ||
                            grade.letterGrade === 'C-'
                          ? 'bg-yellow-100 text-yellow-700'
                          : grade.letterGrade === 'F'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {grade.letterGrade || '-'}
                    </span>
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
