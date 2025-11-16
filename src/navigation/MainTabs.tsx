import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home/HomeScreen';
import { SearchScreen } from '../screens/search/SearchScreen';
import { UploadScreen } from '../screens/upload/UploadScreen';
import { CalendarScreen } from '../screens/calendar/CalendarScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MainTabsParamList } from './types';

const Tab = createBottomTabNavigator<MainTabsParamList>();

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '首页',
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: '搜寻',
          tabBarIcon: ({ color }) => <TabIcon icon="🔍" color={color} />,
        }}
        initialParams={{}}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{
          tabBarLabel: '上传',
          tabBarIcon: ({ color }) => <TabIcon icon="➕" color={color} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarLabel: '行事历',
          tabBarIcon: ({ color }) => <TabIcon icon="📅" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我的',
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

// 简单的图标组件（使用 emoji，实际项目中可以替换为图标库）
const TabIcon: React.FC<{ icon: string; color: string }> = ({ icon }) => {
  return <Text style={{ fontSize: 24 }}>{icon}</Text>;
};

