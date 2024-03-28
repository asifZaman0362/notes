import {StatusBar} from 'react-native';
import {useTheme} from 'react-native-paper';

export default function MyStatusBar() {
  const theme = useTheme();
  return <StatusBar backgroundColor={theme.colors.elevation.level2} />;
}
