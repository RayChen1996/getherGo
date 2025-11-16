import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IntroScreen } from '../screens/auth/IntroScreen';
import { MainTabs } from './MainTabs';
import { AuthStack } from './AuthStack';
import { EventDetailScreen } from '../screens/home/EventDetailScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Intro"
    >
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          presentation: 'modal',
          headerShown: true,
          title: '活动详情',
        }}
      />
    </Stack.Navigator>
  );
};

