import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, DocumentData, CollectionReference, collectionData, doc, updateDoc, deleteDoc, query, orderBy, where } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

export interface Task {
  id?: string;
  name: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
  isWork?: boolean;
  isPersonal?: boolean;
  timeout?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {

  private tasksCollectionRef: CollectionReference<DocumentData>;
  constructor(private fireStore: Firestore) {
    this.tasksCollectionRef = collection(this.fireStore, 'tasks');
  }

  addTask(task: Task): Observable<any> {
    return from(addDoc(this.tasksCollectionRef, task));
  }

  getTasksRealtime(): Observable<Task[]> {
    return collectionData(this.tasksCollectionRef, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => ({
        ...doc,
        dueDate: (doc['dueDate'] instanceof Timestamp) ? (doc['dueDate'] as Timestamp).toDate() : doc['dueDate']
      }) as Task))
    );
  }


  fetchTasksWithCategoryAndDate(category: string, order: any) {
    let conditions = [];

    if (category) {
      conditions.push(where(category, '==', true));
    }

    if (order) {
      conditions.push(orderBy('dueDate', order));
    }

    const q = query(this.tasksCollectionRef, ...conditions);
    return collectionData(q, { idField: 'id' }).pipe(
      map(docs => docs.map(doc => ({
        ...doc,
        dueDate: (doc['dueDate'] instanceof Timestamp)
          ? (doc['dueDate'] as Timestamp).toDate()
          : (doc['dueDate'] || null)
      }) as Task))
    );
  }


  taskUpdation(taskId: string, updateValue: any): Promise<void> {
    return this.updateTask(taskId, updateValue);
  }

  updateTask(taskId: string, dataToUpdate: Partial<Task>): Promise<any> {
    if (!taskId) {
      return Promise.reject("taskId UnAvailable");
    }
    const taskDocRef = doc(this.fireStore, `tasks/${taskId}`);
    return updateDoc(taskDocRef, dataToUpdate)
      .then((res) => {
        console.log("updated successfully");
        return true;
      })
      .catch((error) => {
        console.error("Error updating task");
        throw error;
      });
  }


  deleteTask(taskId: string): Promise<any> {
    if (!taskId) {
      return Promise.reject("taskId UnAvailable");
    }
    const taskDocRef = doc(this.fireStore, `tasks/${taskId}`);
    return deleteDoc(taskDocRef)
      .then(() => {
        console.log("deleted successfully");
        return true;
      })
      .catch((error) => {
        console.error("Error deleting");
        throw error;
      });
  }

}
