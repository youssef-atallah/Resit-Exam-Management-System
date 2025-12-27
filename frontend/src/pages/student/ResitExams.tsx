import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, Badge, Button, Modal } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { studentService } from '../../services/studentService';
import { Grade, ResitExam } from '../../types';
import { useToast } from '../../components/ui/Toast';

export function StudentResitExams() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [eligibleCourses, setEligibleCourses] = useState<Grade[]>([]);
  const [resitExams, setResitExams] = useState<ResitExam[]>([]);
  const [appliedExams, setAppliedExams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<ResitExam | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      try {
        const [gradesData, examsData] = await Promise.all([
          studentService.getCourseDetails(user.id),
          studentService.getResitExams(user.id),
        ]);

        setEligibleCourses(gradesData.filter((g) => g.isEligibleForResit));
        setResitExams(examsData);
      } catch (error) {
        console.error('Error fetching resit data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  const handleApply = async () => {
    if (!selectedExam || !user?.id) return;

    setIsApplying(true);
    try {
      await studentService.applyForResit(user.id, selectedExam.id);
      setAppliedExams((prev) => [...prev, selectedExam.id]);
      showToast('Successfully applied for resit exam!', 'success');
      setSelectedExam(null);
    } catch (error) {
      showToast('Failed to apply. Please try again.', 'error');
    } finally {
      setIsApplying(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resit Exams</h1>
        <p className="text-gray-500 mt-1">Apply for resit exams and track your applications</p>
      </div>

      {/* Eligible Courses */}
      <Card>
        <CardHeader
          title="Eligible Courses"
          subtitle={`You have ${eligibleCourses.length} course(s) eligible for resit exams`}
        />
        {eligibleCourses.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
              <CheckCircle size={24} className="text-green-600" />
            </div>
            <p className="text-gray-500">Great job! No courses eligible for resit.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eligibleCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 bg-orange-50 border border-orange-100 rounded-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{course.courseName}</h4>
                    <p className="text-sm text-gray-500">{course.courseCode}</p>
                  </div>
                  <Badge variant="danger">{course.letterGrade || 'F'}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Midterm: {course.midterm ?? '-'}</span>
                  <span>Final: {course.final ?? '-'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Available Resit Exams */}
      <Card>
        <CardHeader
          title="Available Resit Exams"
          subtitle="Select an exam to apply"
        />
        {resitExams.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No resit exams scheduled at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resitExams.map((exam) => {
              const isApplied = appliedExams.includes(exam.id);
              const isPastDeadline = new Date(exam.applicationDeadline) < new Date();

              return (
                <div
                  key={exam.id}
                  className={`
                    p-4 border rounded-xl transition-all
                    ${isApplied ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-blue-300'}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{exam.courseName}</h4>
                        {isApplied && <Badge variant="success">Applied</Badge>}
                        {exam.status === 'cancelled' && <Badge variant="danger">Cancelled</Badge>}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{exam.courseCode}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{formatDate(exam.examDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={16} className="text-gray-400" />
                          <span>{exam.examTime} ({exam.duration} min)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} className="text-gray-400" />
                          <span>{exam.location}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <AlertCircle size={14} className="text-orange-500" />
                        <span className="text-orange-600">
                          Application deadline: {formatDate(exam.applicationDeadline)}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4">
                      {!isApplied && !isPastDeadline && exam.status !== 'cancelled' && (
                        <Button
                          onClick={() => setSelectedExam(exam)}
                          variant="primary"
                          size="sm"
                        >
                          Apply
                        </Button>
                      )}
                      {isPastDeadline && !isApplied && (
                        <Badge variant="default">Deadline Passed</Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        title="Apply for Resit Exam"
      >
        {selectedExam && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-1">{selectedExam.courseName}</h4>
              <p className="text-sm text-gray-600">{selectedExam.courseCode}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar size={18} className="text-gray-400" />
                <span>{formatDate(selectedExam.examDate)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Clock size={18} className="text-gray-400" />
                <span>{selectedExam.examTime} ({selectedExam.duration} minutes)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={18} className="text-gray-400" />
                <span>{selectedExam.location}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-4">
                By applying, you confirm that you understand the exam schedule and will be present at the specified time and location.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedExam(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleApply}
                  isLoading={isApplying}
                  className="flex-1"
                >
                  Confirm Application
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
