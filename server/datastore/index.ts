import { CourseDao } from './dao/CourseDao';
import { InstructorDao } from './dao/InstructorDao';
import { ResitExamDao } from './dao/ResitExamDao';
import { StudentDao } from './dao/StudentDao';
import { SecretaryDao } from './dao/SecretaryDao';
// Removing the SecretaryDao import since the module cannot be found
import { SqlDatastore } from './sql';
import { ResitExam } from '../types';
// import { inMemoryDatastore } from './memorydb';

export interface Datastore extends CourseDao, InstructorDao, ResitExamDao, StudentDao, SecretaryDao {
  getResitExamByCourseId(courseId: string): Promise<ResitExam | undefined>;
}

export let db: Datastore;

export async function initializeDb() {
  // db = new inMemoryDatastore();  const sqlDatastore = new SqlDatastore();
  // db = await sqlDatastore.openDb();
  const sqlDatastore = new SqlDatastore();
  db = await sqlDatastore.openDb();
}

// This is the in-memory implementation of the datastore
// singleton instance of the in-memory datastore
// db.access all the methods of the datastore
// export const db = new inMemoryDatastore();