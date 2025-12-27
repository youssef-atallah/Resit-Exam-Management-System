import { useEffect, useState } from 'react';
import { Search, BookOpen, Users, Clock, ChevronRight } from 'lucide-react';
import { Card, Badge, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { instructorService } from '../../services/instructorService';
import { Course } from '../../types';

export function InstructorCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      if (!user?.id) return;

      try {
        const data = await instructorService.getCourses(user.id);
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
          <p className="text-gray-500 mt-1">Courses you're teaching this semester</p>
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
              : 'No courses assigned to you this semester'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <BookOpen size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course.name}
                    </h3>
                    <p className="text-sm text-gray-500">{course.code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <span>45 Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      <span>{course.semester} {course.year}</span>
                    </div>
                    <Badge variant="default">{course.credits} Credits</Badge>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
