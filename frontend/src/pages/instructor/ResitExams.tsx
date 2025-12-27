import { useEffect, useState } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Edit,
  Trash2,
} from 'lucide-react';
import { Card, CardHeader, Badge, Button, Modal, Input } from '../../components/ui';
import { useAuth } from '../../contexts/AuthContext';
import { instructorService } from '../../services/instructorService';
import { ResitExam, Course } from '../../types';
import { useToast } from '../../components/ui/Toast';

export function InstructorResitExams() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [resitExams, setResitExams] = useState<ResitExam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ResitExam | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    examDate: '',
    examTime: '',
    location: '',
    duration: 90,
    applicationDeadline: '',
  });

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;

      try {
        const [examsData, coursesData] = await Promise.all([
          instructorService.getResitExams(user.id),
          instructorService.getCourses(user.id),
        ]);
        setResitExams(examsData);
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user?.id]);

  const handleCreateExam = async () => {
    try {
      const newExam = await instructorService.createResitExam({
        ...formData,
        instructorId: user?.id,
        status: 'scheduled',
      });
      setResitExams((prev) => [...prev, newExam]);
      showToast('Resit exam created successfully!', 'success');
      setShowCreateModal(false);
      resetForm();
    } catch {
      showToast('Failed to create resit exam', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      courseId: '',
      examDate: '',
      examTime: '',
      location: '',
      duration: 90,
      applicationDeadline: '',
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
    switch (status) {
      case 'scheduled':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resit Exams</h1>
          <p className="text-gray-500 mt-1">Create and manage resit exams for your courses</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus size={18} />
          Create Resit Exam
        </Button>
      </div>

      {/* Resit Exams List */}
      {resitExams.length === 0 ? (
        <Card className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resit exams yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first resit exam to get started
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus size={18} />
            Create Resit Exam
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {resitExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exam.courseName}
                    </h3>
                    <Badge variant={getStatusVariant(exam.status)}>
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{exam.courseCode}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{formatDate(exam.examDate)}</p>
                        <p className="text-xs text-gray-500">Exam Date</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{exam.examTime}</p>
                        <p className="text-xs text-gray-500">{exam.duration} min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{exam.location}</p>
                        <p className="text-xs text-gray-500">Location</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={18} className="text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">12 Students</p>
                        <p className="text-xs text-gray-500">Applied</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Application Deadline: <span className="font-medium text-gray-900">{formatDate(exam.applicationDeadline)}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedExam(exam)}
                  >
                    <Users size={16} />
                    View Students
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Exam Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Create Resit Exam"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Exam Date"
              type="date"
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
            />
            <Input
              label="Exam Time"
              type="time"
              value={formData.examTime}
              onChange={(e) => setFormData({ ...formData, examTime: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              placeholder="e.g., Room 101"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration.toString()}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
            />
          </div>

          <Input
            label="Application Deadline"
            type="date"
            value={formData.applicationDeadline}
            onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateExam}
              className="flex-1"
              disabled={!formData.courseId || !formData.examDate || !formData.examTime}
            >
              Create Exam
            </Button>
          </div>
        </div>
      </Modal>

      {/* View Students Modal */}
      <Modal
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
        title={`Students - ${selectedExam?.courseName}`}
        size="lg"
      >
        {selectedExam && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <p className="text-sm text-gray-500">
                {12} students applied for this resit exam
              </p>
              <Button variant="secondary" size="sm">
                <Download size={16} />
                Export List
              </Button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">Student {i + 1}</p>
                    <p className="text-sm text-gray-500">2024{String(i + 1).padStart(4, '0')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      placeholder="Grade"
                      className="w-20"
                    />
                    <Button size="sm">Save</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
