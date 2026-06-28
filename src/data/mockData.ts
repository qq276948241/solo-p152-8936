import type { Show, Message } from '@/types';

const now = new Date();

function addDays(date: Date, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  d.setHours(19, 30, 0, 0);
  return d.toISOString();
}

function addHours(date: Date, hours: number): string {
  const d = new Date(date);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

export const MOCK_SHOWS: Show[] = [
  {
    id: 'show-001',
    venue: 'MAO Livehouse 北京',
    date: addDays(now, 45),
    price: 180,
    status: 'upcoming',
    address: '北京市海淀区复兴路69号华熙LIVE hi-up G23',
    notes: '暖场乐队：夜航乐队。到场凭身份证换票，预计演出时长120分钟。',
    createdAt: addDays(now, -30),
    updatedAt: addDays(now, -5),
  },
  {
    id: 'show-002',
    venue: '育音堂音乐公园',
    date: addDays(now, 25),
    price: 150,
    status: 'upcoming',
    address: '上海市长宁区愚园路1398号米域礼和2F',
    notes: '预售票已售罄，现场票少量发售。VIP包含提前入场+签名海报。',
    createdAt: addDays(now, -40),
    updatedAt: addDays(now, -3),
  },
  {
    id: 'show-003',
    venue: 'TU凸空间',
    date: addDays(now, -2),
    price: 120,
    status: 'ongoing',
    address: '广州市越秀区广州大道中361-365号东方花苑1楼',
    notes: '今晚开演！7点开始检票，请提前到场。',
    createdAt: addDays(now, -60),
    updatedAt: addDays(now, -1),
  },
  {
    id: 'show-004',
    venue: '小酒馆音乐空间',
    date: addDays(now, -15),
    price: 100,
    status: 'completed',
    address: '成都市武侯区玉林西路55号',
    notes: '圆满结束！感谢所有到场的乐迷朋友，现场录音后期放出。',
    createdAt: addDays(now, -80),
    updatedAt: addDays(now, -14),
  },
  {
    id: 'show-005',
    venue: 'VOX LIVEHOUSE',
    date: addDays(now, -35),
    price: 130,
    status: 'completed',
    address: '武汉市洪山区鲁磨路118号国光大厦B座101',
    notes: '武汉站完美收官，特别感谢嘉宾乐队的助阵。',
    createdAt: addDays(now, -100),
    updatedAt: addDays(now, -33),
  },
  {
    id: 'show-006',
    venue: '红糖罐（福田店）',
    date: addDays(now, 60),
    price: 160,
    status: 'upcoming',
    address: '深圳市福田区泰然九路皇冠科技园2栋1楼红糖罐',
    notes: '深圳站筹备中，下周开放预售。关注公众号获取第一手消息。',
    createdAt: addDays(now, -20),
    updatedAt: addDays(now, -10),
  },
  {
    id: 'show-007',
    venue: '欧拉艺术空间',
    date: addDays(now, 10),
    price: 0,
    status: 'cancelled',
    address: '南京市玄武区阳光路3号太阳宫演艺广场B1楼',
    notes: '因不可抗力原因取消，已购票观众将原路退款。抱歉给大家带来不便。',
    createdAt: addDays(now, -50),
    updatedAt: addDays(now, -8),
  },
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    showId: 'show-001',
    nickname: '午夜飞行',
    content: '终于等到北京站！去年那场看了三遍视频，这次必须现场前排！',
    createdAt: addHours(now, -48),
    starred: true,
  },
  {
    id: 'msg-002',
    showId: 'show-001',
    nickname: 'radiohead_fan',
    content: '请问现场有周边售卖吗？想收藏新专辑的黑胶。',
    createdAt: addHours(now, -36),
    starred: false,
  },
  {
    id: 'msg-003',
    showId: 'show-001',
    nickname: '宇宙漫游指南',
    content: '从天津特意过去，期待新歌首唱！',
    createdAt: addHours(now, -24),
    starred: false,
  },
  {
    id: 'msg-004',
    showId: 'show-002',
    nickname: '上海小阿姨',
    content: '育音堂场地超棒的，音响效果一绝！上次在这听的现场至今难忘。',
    createdAt: addHours(now, -72),
    starred: false,
  },
  {
    id: 'msg-005',
    showId: 'show-002',
    nickname: '独立音乐爱好者',
    content: 'VIP还能再加票吗？没抢到呜呜呜...',
    createdAt: addHours(now, -12),
    starred: true,
  },
  {
    id: 'msg-006',
    showId: 'show-003',
    nickname: '广州土著',
    content: '今晚见！已经在地铁上了，激动！',
    createdAt: addHours(now, -3),
    starred: false,
  },
  {
    id: 'msg-007',
    showId: 'show-003',
    nickname: '荔枝湾少年',
    content: 'TU凸空间的老顾客了，每次演出体验都很好。',
    createdAt: addHours(now, -6),
    starred: false,
  },
  {
    id: 'msg-008',
    showId: 'show-004',
    nickname: '玉林路尽头',
    content: '成都站太顶了！安可了三首，值回票价百倍！',
    createdAt: addHours(now, -340),
    starred: true,
  },
  {
    id: 'msg-009',
    showId: 'show-004',
    nickname: '小酒馆常客',
    content: '和主唱击掌了，人生圆满。下次巡演再来成都！',
    createdAt: addHours(now, -336),
    starred: false,
  },
  {
    id: 'msg-010',
    showId: 'show-005',
    nickname: '东湖边的风',
    content: '武汉场嘉宾乐队是什么来头？现场超级炸！求名字。',
    createdAt: addHours(now, -820),
    starred: false,
  },
  {
    id: 'msg-011',
    showId: 'show-005',
    nickname: '光谷夜归人',
    content: '返场《晚安》的时候全场大合唱，直接泪目了。',
    createdAt: addHours(now, -810),
    starred: true,
  },
  {
    id: 'msg-012',
    showId: 'show-006',
    nickname: '深圳打工仔',
    content: '终于来深圳了！蹲一个开票时间，定好闹钟准备抢票。',
    createdAt: addHours(now, -96),
    starred: false,
  },
  {
    id: 'msg-013',
    showId: 'show-006',
    nickname: '南山音乐迷',
    content: '红糖罐福田店交通挺方便的，车公庙地铁出来走几步就到。',
    createdAt: addHours(now, -70),
    starred: false,
  },
  {
    id: 'msg-014',
    showId: 'show-007',
    nickname: '南京粉丝团',
    content: '啊...取消了太可惜了，上次看还是两年前，期待下次。',
    createdAt: addHours(now, -190),
    starred: false,
  },
];
