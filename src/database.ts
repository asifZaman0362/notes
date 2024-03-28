import {
  SQLiteDatabase,
  deleteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';
import {Alert} from 'react-native';

export interface Note {
  id: string;
  date: string;
  content: string;
}

enablePromise(true);

export async function reset() {
  return deleteDatabase({name: 'notes.db', location: 'default'});
}

export async function getConnection() {
  return openDatabase({name: 'notes.db', location: 'default'});
}

export async function createTable(db: SQLiteDatabase) {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS NOTES ( 
      id VARCHAR(32) NOT NULL PRIMARY KEY, date TEXT NOT NULL, content TEXT NOT NULL 
    );`;
    return await db.executeSql(query);
  } catch (err) {
    console.error(err);
    Alert.alert('Database error!');
  }
}

export async function getNotes(db: SQLiteDatabase) {
  try {
    const query = `SELECT id, date, content FROM NOTES;`;
    const data: Note[] = [];
    const results = await db.executeSql(query);
    results.forEach(result => {
      for (let i = 0; i < result.rows.length; i++) {
        const item: Note = result.rows.item(i);
        data.push(item);
      }
    });
    return data;
  } catch (err) {
    console.error(err);
    Alert.alert('Database error!');
  }
}

export async function saveNotes(db: SQLiteDatabase, newNotes: Note[]) {
  const toRow = (n: Note) => `("${n.id}", "${n.date}", "${n.content}")`;
  const serializeRows = (notes: Note[]) =>
    notes.map(note => toRow(note)).join(',');
  const query = `INSERT OR REPLACE INTO NOTES (ID, DATE, CONTENT) VALUES ${serializeRows(
    newNotes,
  )};`;
  try {
    return db.executeSql(query);
  } catch (err) {
    console.error(err);
    Alert.alert('Database error!');
  }
}

export async function deleteNotes(db: SQLiteDatabase, ids: String[]) {
  try {
    let range = `(${ids.map(id => `"${id}"`).join(',')})`;
    const query = `DELETE FROM NOTES WHERE ID IN ${range};`;
    return db.executeSql(query);
  } catch (err) {
    console.error(err);
    Alert.alert('Database error!');
  }
}

export async function dropTable(db: SQLiteDatabase) {
  const query = 'DROP TABLE NOTES;';
  return db.executeSql(query);
}
