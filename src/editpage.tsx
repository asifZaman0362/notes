import {MarkdownTextInput} from '@expensify/react-native-live-markdown';
import {View, StyleSheet, ToastAndroid} from 'react-native';
import {Button, Snackbar, useTheme} from 'react-native-paper';
import React from 'react';
import {NotesContext} from './context';
import {Note, saveNotes} from './database';
import {EditProps} from './navigation';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import MyStatusBar from './statusbar';

function generateId() {
  let id = '';
  for (let i = 0; i < 32; i++) {
    let char = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    id += char;
  }
  return id;
}

export function Edit({route, navigation}: EditProps) {
  const defaultText = '# Title\n\nStart writing here...';
  const theme = useTheme();
  const {notes, database, setNotes} = React.useContext(NotesContext);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [content, setContent] = React.useState(defaultText);
  const [newNote, setNewNote] = React.useState<Note>({
    id: generateId(),
    date: new Date().toISOString(),
    content: defaultText,
  });
  const save = React.useCallback(() => {
    setNewNote(old => ({...old, content}));
    setNotes([
      ...notes.filter(item => item.id != route.params.id),
      {...newNote, content}!,
    ]);
    saveNotes(database!, [{...newNote, content}]).then(() => {
      setSnackbarVisible(true);
      setTimeout(() => navigation.navigate('Home'), 500);
    });
  }, [database, newNote, content]);
  React.useEffect(() => {
    if (route.params.id) {
      const target = notes!.find(item => item.id == route.params.id);
      if (target) {
        setContent(target.content);
        setNewNote({content: target.content, id: target.id, date: target.date});
      }
    }
  }, []);
  return (
    <SafeAreaView style={styles.page}>
      <MyStatusBar />
      <View style={editPageStyles.inputStyle}>
        <MarkdownTextInput
          value={content}
          onChangeText={setContent}
          multiline
        />
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <Button mode="contained" onPress={save} icon="content-save">
          Save
        </Button>
      </View>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}>
          Note Saved!
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const editPageStyles = StyleSheet.create({
  inputStyle: {
    width: '100%',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
});
