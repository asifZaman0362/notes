import {DefaultTheme, RouteProp} from '@react-navigation/native';
import {getHeaderTitle} from '@react-navigation/elements';
import {
  NativeStackHeaderProps,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Appbar} from 'react-native-paper';

export function MyAppBar({
  route,
  options,
  navigation,
  back,
}: NativeStackHeaderProps) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

export type RootStackParamList = {
  Home: undefined;
  Edit: {id?: string};
};

export type NavigationProps = NativeStackScreenProps<RootStackParamList>;

type HomeRouteProps = RouteProp<RootStackParamList, 'Home'>;
type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export type HomeProps = {
  route: HomeRouteProps;
  navigation: HomeNavigationProp;
};

type EditRouteProps = RouteProp<RootStackParamList, 'Edit'>;
type EditNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Edit'>;

export type EditProps = {
  route: EditRouteProps;
  navigation: EditNavigationProp;
};
