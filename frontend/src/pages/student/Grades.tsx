import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardHeader, Badge } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/studentService';
import { Grade } from '../../types';

export function StudentGrades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGrades() {
      if (!user?.id) return;

      try {
        const data = await studentService.getCourseDetails(user.id);
        setGrades(data);
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGrades();
  }, [user?.id]);

  const getGradeVariant = (grade?: string): 'success' | 'info' | 'warning' | 'danger' | 'default' => {
    if (!grade) return 'default';
    if (grade.startsWith('A')) return 'success';
    if (grade.startsWith('B')) return 'info';
    if (grade.startsWith('C')) return 'warning';
    if (grade === 'F') return 'danger';
    return 'default';
  };

  const calculateGPA = (): string => {
    const gradePoints: Record<string, number> = {
      'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0,
      'F': 0.0,
    };

    const validGrades = grades.filter((g) => g.letterGrade && gradePoints[g.letterGrade] !== undefined);
    if (validGrades.length === 0) return '-';

    const totalPoints = validGrades.reduce((sum, g) => sum + (gradePoints[g.letterGrade!] || 0), 0);
    return (totalPoints / validGrades.length).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const passedCourses = grades.filter((g) => g.letterGrade && g.letterGrade !== 'F').length;
  const failedCourses = grades.filter((g) => g.letterGrade === 'F').length;
  const resitEligible = grades.filter((g) => g.isEligibleForResit).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        <p className="text-gray-500 mt-1">View your academic performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-gray-900">{calculateGPA()}</p>
          <p className="text-sm text-gray-500 mt-1">Current GPA</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="text-green-500" size={20} />
            <p className="text-3xl font-bold text-green-600">{passedCourses}</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">Passed</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2">
            <TrendingDown className="text-red-500" size={20} />
            <p className="text-3xl font-bold text-red-600">{failedCourses}</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">Failed</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Minus className="text-orange-500" size={20} />
            <p className="text-3xl font-bold text-orange-600">{resitEligible}</p>
          </div>
          <p className="text-sm text-gray-500 mt-1">Resit Eligible</p>
        </Card>
      </div>

      {/* Grades Table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Course Grades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Course
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Midterm
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Final
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Resit
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Grade
                </th>
                <th className="text-center py-3 px-6 text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{grade.courseName}</p>
                    <p className="text-sm text-gray-500">{grade.courseCode}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-medium ${
                      (grade.midterm ?? 0) >= 50 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {grade.midterm ?? '-'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-medium ${
                      (grade.final ?? 0) >= 50 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {grade.final ?? '-'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="font-medium">{grade.resit ?? '-'}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Badge variant={getGradeVariant(grade.letterGrade)}>
                      {grade.letterGrade || '-'}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {grade.isEligibleForResit ? (
                      <Badge variant="warning">Resit Eligible</Badge>
                    ) : grade.letterGrade === 'F' ? (
                      <Badge variant="danger">Failed</Badge>
                    ) : grade.letterGrade ? (
                      <Badge variant="success">Passed</Badge>
                    ) : (
                      <Badge variant="default">Pending</Badge>
                    )}
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
