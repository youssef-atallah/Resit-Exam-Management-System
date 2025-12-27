import { useEffect, useState } from 'react';
import { Search, BookOpen, User, Clock } from 'lucide-react';
import { Card, CardHeader, Badge, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/studentService';
import { Course } from '../../types';

export function StudentCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      if (!user?.id) return;

      try {
        const data = await studentService.getCourses(user.id);
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, [user?.id]);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">View and manage your enrolled courses</p>
        </div>
        <Badge variant="info">{courses.length} Courses</Badge>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search size={18} />}
        />
      </div>

      {filteredCourses.length === 0 ? (
        <Card className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <BookOpen size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">
            {searchQuery
              ? 'Try adjusting your search query'
              : "You haven't enrolled in any courses yet"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`
                    p-3 rounded-xl transition-colors
                    bg-gradient-to-br from-blue-500 to-blue-600
                    group-hover:from-blue-600 group-hover:to-blue-700
                  `}
                >
                  <BookOpen size={24} className="text-white" />
                </div>
                <Badge variant="default">{course.credits} Credits</Badge>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {course.name}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{course.code}</p>

              <div className="space-y-2 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User size={16} className="text-gray-400" />
                  <span>{course.instructorName || 'TBA'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock size={16} className="text-gray-400" />
                  <span>
                    {course.semester} {course.year}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
