import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Note} from './database';
import React from 'react';

type _NotesContext = {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  database?: SQLiteDatabase;
};

export const NotesContext = React.createContext<_NotesContext>({
  notes: [],
  setNotes: _ => {},
});
