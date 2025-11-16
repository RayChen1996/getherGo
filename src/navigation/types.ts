import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Intro: undefined;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  EventDetail: { eventId: string };
};

export type MainTabsParamList = {
  Home: undefined;
  Search: { type?: 'fan' | 'concert' | 'exhibition' | 'other' };
  Upload: undefined;
  Calendar: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

