import React from 'react';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme as Dark,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  PaperProvider,
  MD3LightTheme,
  adaptNavigationTheme,
  MD3DarkTheme,
  Text,
} from 'react-native-paper';

import {Note, createTable, getConnection, getNotes} from './src/database';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Home} from './src/homepage';
import {Edit} from './src/editpage';
import {MyAppBar, RootStackParamList} from './src/navigation';
import {View, useColorScheme} from 'react-native';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {NotesContext} from './src/context';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const colorScheme = useColorScheme();
  const {theme} = useMaterial3Theme();
  const darkTheme = {...MD3DarkTheme, colors: theme.dark};
  const lightTheme = {...MD3LightTheme, colors: theme.light};
  const paperTheme = React.useMemo(
    () =>
      colorScheme === 'dark'
        ? {...MD3DarkTheme, colors: theme.dark}
        : {...MD3LightTheme, colors: theme.light},
    [colorScheme, theme],
  );
  const {LightTheme, DarkTheme} = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: Dark,
    materialDark: darkTheme,
    materialLight: lightTheme,
  });
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  const [notes, setNotes] = React.useState<Note[]>([]);
  const [database, setDatabase] = React.useState<SQLiteDatabase>();

  React.useEffect(() => {
    getConnection().then(db => {
      createTable(db).then(() => {
        setDatabase(db);
      });
    });
  }, []);

  React.useEffect(() => {
    if (database) getNotes(database).then(notes => setNotes(notes || []));
  }, [database]);

  if (!database)
    return (
      <PaperProvider theme={paperTheme}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text variant="displayMedium">Loading...</Text>
        </View>
      </PaperProvider>
    );

  return (
    <NotesContext.Provider value={{notes, database, setNotes}}>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navigationTheme}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              header: props => <MyAppBar {...props} />,
            }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Edit" component={Edit} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </NotesContext.Provider>
  );
};

export default App;
