import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { MainTabsParamList } from '../../navigation/types';
import { EventType } from '../../types/event';

type Props = NativeStackScreenProps<MainTabsParamList, 'Upload'>;

export const UploadScreen: React.FC<Props> = ({ navigation }) => {
  const { isLoggedIn } = useAuth();
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('fan');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [host, setHost] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      Alert.alert('需要登入', '此功能需登入，请先登入或注册', [
        {
          text: '取消',
          style: 'cancel',
          onPress: () => navigation.navigate('Home'),
        },
        {
          text: '登入',
          onPress: () => {
            navigation.getParent()?.navigate('Auth', { screen: 'Login' });
          },
        },
      ]);
    }
  }, [isLoggedIn, navigation]);

  const handleSubmit = () => {
    // 前端验证
    if (!title.trim()) {
      Alert.alert('错误', '请输入活动名称');
      return;
    }
    if (!location.trim()) {
      Alert.alert('错误', '请输入活动地点');
      return;
    }
    if (!startDate.trim()) {
      Alert.alert('错误', '请输入活动开始日期');
      return;
    }

    const formData = {
      title,
      type,
      location,
      startDate,
      endDate: endDate || undefined,
      host: host || '未填写',
      description: description || undefined,
      status: 'pending' as const,
    };

    console.log('提交活动数据:', formData);
    Alert.alert('成功', '活动已提交，我们将在 1-3 个工作天内完成审核', [
      {
        text: '确定',
        onPress: () => {
          // 清空表单
          setTitle('');
          setLocation('');
          setStartDate('');
          setEndDate('');
          setHost('');
          setDescription('');
          navigation.navigate('Home');
        },
      },
    ]);
  };

  const eventTypes: { value: EventType; label: string }[] = [
    { value: 'fan', label: '应援活动' },
    { value: 'concert', label: '演唱会' },
    { value: 'exhibition', label: '展览' },
    { value: 'other', label: '其他活动' },
  ];

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>此功能需登入，请先登入或注册</Text>
        <Button
          title="前往登入"
          onPress={() => navigation.getParent()?.navigate('Auth', { screen: 'Login' })}
          variant="primary"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>上传活动</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>
          活动名称 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="请输入活动名称"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>
          活动类型 <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.typeContainer}>
          {eventTypes.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.typeButton, type === item.value && styles.typeButtonActive]}
              onPress={() => setType(item.value)}
            >
              <Text
                style={[styles.typeButtonText, type === item.value && styles.typeButtonTextActive]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>
          活动地点 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="请输入活动地点"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>
          开始日期 <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
        />

        <Text style={styles.label}>结束日期</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD (可选)"
          value={endDate}
          onChangeText={setEndDate}
        />

        <Text style={styles.label}>主办单位 / 发起人</Text>
        <TextInput
          style={styles.input}
          placeholder="请输入主办单位或发起人"
          value={host}
          onChangeText={setHost}
        />

        <Text style={styles.label}>备注 / 描述</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="请输入活动描述"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Button
          title="提交上传"
          onPress={handleSubmit}
          variant="primary"
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    marginTop: 32,
    marginBottom: 32,
  },
  message: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
});

