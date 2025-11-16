import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { MainTabsParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<MainTabsParamList, 'Profile'>;

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('确认登出', '确定要登出吗？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '登出',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.getParent()?.navigate('Intro');
        },
      },
    ]);
  };

  const handleLogin = () => {
    navigation.getParent()?.navigate('Auth', { screen: 'Login' });
  };

  const handleRegister = () => {
    navigation.getParent()?.navigate('Auth', { screen: 'Register' });
  };

  if (!isLoggedIn) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>我的</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.notLoggedInContainer}>
            <Text style={styles.notLoggedInTitle}>尚未登入</Text>
            <Text style={styles.notLoggedInText}>登入后可以使用更多功能</Text>
            <Button
              title="登入"
              onPress={handleLogin}
              variant="primary"
              style={styles.button}
            />
            <Button
              title="建立账号"
              onPress={handleRegister}
              variant="outline"
              style={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
        </View>
        <Text style={styles.userName}>{user?.name || '用户'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>

      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⭐</Text>
          <Text style={styles.menuText}>我的收藏</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👁️</Text>
          <Text style={styles.menuText}>最近浏览</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📤</Text>
          <Text style={styles.menuText}>活动上传管理</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🤝</Text>
          <Text style={styles.menuText}>小帮手申请</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>💬</Text>
          <Text style={styles.menuText}>意见反馈</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.logoutSection}>
        <Button title="登出" onPress={handleLogout} variant="outline" style={styles.logoutButton} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  menuArrow: {
    fontSize: 24,
    color: '#9ca3af',
  },
  logoutSection: {
    padding: 16,
  },
  logoutButton: {
    marginBottom: 32,
  },
  notLoggedInContainer: {
    alignItems: 'center',
    padding: 32,
    marginTop: 64,
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  notLoggedInText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 12,
  },
});

