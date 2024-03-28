import {View, FlatList, StatusBar, StyleSheet} from 'react-native';
import {Text, Button, useTheme, IconButton} from 'react-native-paper';
import {Note, deleteNotes, reset} from './database';
import {NotesContext} from './context';
import React from 'react';
import {HomeProps} from './navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import MyStatusBar from './statusbar';
import Markdown from 'react-native-markdown-display';

function Loading() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function formatFromISODate(date: string) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString();
}

function NoteComponent({
  data,
  editCallback,
  deleteCallback,
}: {
  data: Note;
  editCallback: (id: string) => void;
  deleteCallback: (id: string) => void;
}) {
  const {database} = React.useContext(NotesContext);
  const theme = useTheme();
  const noteStyles = {
    ...homePageStyles.note,
    backgroundColor: theme.colors.elevation.level1,
  };
  return (
    <View style={noteStyles}>
      <View style={homePageStyles.noteHeader}>
        <Text
          variant="titleSmall"
          style={{color: theme.colors.primary, flexGrow: 1}}>
          {formatFromISODate(data.date)}
        </Text>
        <IconButton
          icon="file-edit"
          onPress={() => editCallback(data.id)}
          size={18}
          iconColor={theme.colors.primary}
          style={{margin: 0}}
        />
        <IconButton
          icon="delete"
          onPress={() => deleteCallback(data.id)}
          size={18}
          iconColor={theme.colors.primary}
          style={{margin: 0}}
        />
      </View>
      <Markdown>{data.content}</Markdown>
    </View>
  );
}

function Notes({
  notes,
  edit,
  deleteItem,
}: {
  notes: Note[];
  edit: (id: string) => void;
  deleteItem: (id: string) => void;
}) {
  if (notes.length == 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingHorizontal: 10,
          paddingVertical: 20,
          marginBottom: 20,
        }}>
        <Text variant="displayLarge">No notes found</Text>
      </View>
    );
  }
  return (
    <View style={{marginBottom: 20, flex: 1}}>
      <FlatList
        data={notes}
        renderItem={item => (
          <NoteComponent
            data={item.item}
            key={item.index}
            editCallback={edit}
            deleteCallback={deleteItem}
          />
        )}
      />
    </View>
  );
}

export function Home({navigation}: HomeProps) {
  const {notes, database, setNotes} = React.useContext(NotesContext);
  const edit = (id: string) => {
    navigation.navigate('Edit', {id});
  };
  const deleteItem = (id: string) => {
    deleteNotes(database!, [id]);
    setNotes(notes.filter(note => note.id != id));
  };
  if (notes) {
    return (
      <SafeAreaView style={styles.page}>
        <MyStatusBar />
        <Notes notes={notes} edit={edit} deleteItem={deleteItem} />
        <Button
          onPress={() => navigation.navigate('Edit', {id: undefined})}
          icon="plus"
          mode="contained">
          Add
        </Button>
        <Button onPress={() => reset()} icon={'delete'}>
          Reset
        </Button>
      </SafeAreaView>
    );
  } else {
    return <Loading />;
  }
}

const homePageStyles = StyleSheet.create({
  note: {
    display: 'flex',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    flexDirection: 'column',
  },
  noteHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
});
