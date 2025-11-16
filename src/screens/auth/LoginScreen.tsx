import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { AuthStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('错误', '请输入邮箱和密码');
      return;
    }
    // 假登录逻辑
    login({
      id: '1',
      name: '测试用户',
      email: email,
    });
    navigation.getParent()?.navigate('MainTabs');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>登入</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="邮箱"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="密码"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="登入" onPress={handleLogin} variant="primary" style={styles.button} />
        <Button
          title="还没有账号？建立账号"
          onPress={() => navigation.navigate('Register')}
          variant="outline"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  form: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
  },
});

