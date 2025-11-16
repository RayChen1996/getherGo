import { useState, useMemo } from 'react';
import { Event, EventType } from '../types/event';

// 假数据
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Winter Birthday Support Cafe',
    type: 'fan',
    location: '猫一咖啡厅(台北市中山区中山北路二段39号)',
    startDate: '2025-12-28',
    endDate: '2026-01-10',
    host: 'aespa - Winter',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Winter+Cafe',
    description: 'Winter 生日应援咖啡厅',
    status: 'approved',
    groupMember: 'aespa - Winter',
  },
  {
    id: '2',
    title: 'PLAVE 3',
    type: 'fan',
    location: '福一咖啡厅/台北市中山区中山北路二段39号',
    startDate: '2025-09-13',
    endDate: '2025-09-20',
    host: 'PLAVE',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=PLAVE',
    description: 'PLAVE 应援活动',
    status: 'approved',
    groupMember: 'PLAVE',
  },
  {
    id: '3',
    title: 'Jimin 10月生日庆',
    type: 'fan',
    location: '第一咖啡厅/台北市中山区中山北路二段39号',
    startDate: '2025-10-13',
    endDate: '2025-10-20',
    host: '阿米小队长',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Jimin',
    description: 'Jimin 生日应援, 秋季限定主题',
    status: 'approved',
    groupMember: 'BTS - Jimin',
  },
  {
    id: '4',
    title: '演唱会活动名称',
    type: 'concert',
    location: '台北小巨蛋',
    startDate: '2025-11-01',
    endDate: '2025-11-01',
    host: '主办单位',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Concert',
    description: '演唱会活动',
    status: 'approved',
    groupMember: '团体成员',
  },
  {
    id: '5',
    title: '展览活动名称',
    type: 'exhibition',
    location: '台北市立美术馆',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    host: '展览主办',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Exhibition',
    description: '展览活动',
    status: 'approved',
    groupMember: '艺术家',
  },
  {
    id: '6',
    title: '其他活动名称',
    type: 'other',
    location: '活动地点',
    startDate: '2025-09-15',
    endDate: '2025-09-18',
    host: '主办方',
    thumbnailUrl: 'https://via.placeholder.com/300x200?text=Other',
    description: '其他类型活动',
    status: 'approved',
    groupMember: '团体成员',
  },
];

export const useEvents = () => {
  const [events] = useState<Event[]>(mockEvents);

  const allEvents = useMemo(() => events, [events]);

  const getEventsByType = (type: EventType): Event[] => {
    return events.filter((event) => event.type === type);
  };

  const searchEventsByKeyword = (keyword: string): Event[] => {
    if (!keyword.trim()) {
      return events;
    }
    const lowerKeyword = keyword.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(lowerKeyword) ||
        event.location.toLowerCase().includes(lowerKeyword) ||
        event.host.toLowerCase().includes(lowerKeyword) ||
        event.groupMember?.toLowerCase().includes(lowerKeyword)
    );
  };

  const getEventById = (id: string): Event | undefined => {
    return events.find((event) => event.id === id);
  };

  return {
    allEvents,
    getEventsByType,
    searchEventsByKeyword,
    getEventById,
  };
};

