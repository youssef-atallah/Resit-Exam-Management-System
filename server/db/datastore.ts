export class Datastore {
    async updateResitExamAnnouncement(resitExamId: string, announcement: string): Promise<void> {
        const query = 'UPDATE resit_exams SET announcement = $1 WHERE resit_exam_id = $2';
        await this.pool.query(query, [announcement, resitExamId]);
    }
} 