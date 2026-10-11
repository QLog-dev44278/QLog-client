import type { Question, User } from './types'

/** 백엔드 연동 전까지 쓰는 목 데이터 */
export const currentUser: User = {
  name: '정지윤',
  email: 'jiyoon@example.com',
}

export const TOPICS = ['Backend', 'Network', 'Database', 'Infra', 'AI', '기타']

export const questions: Question[] = [
  {
    id: 'redis-fast',
    title: 'Redis는 왜 빠른가?',
    status: 'weak',
    topics: ['Backend', 'Database'],
    date: '2일 전',
    daysAgo: 2,
    meta: '답변 2회 · 마지막 평가: 부분적으로 이해',
  },
  {
    id: 'http2-vs-http3',
    title: 'HTTP/2와 HTTP/3은 무엇이 다른가?',
    status: 'studying',
    topics: ['Network'],
    date: '4일 전',
    daysAgo: 4,
    meta: '답변 작성 중 · 임시 저장됨',
  },
  {
    id: 'http3-udp',
    title: 'HTTP/3는 왜 UDP를 사용할까?',
    status: 'weak',
    topics: ['Network'],
    date: '5일 전',
    daysAgo: 5,
    meta: '답변 1회 · 보완 필요: QUIC 개념 누락',
  },
  {
    id: 'spring-di',
    title: 'Spring에서 DI가 필요한 이유는 무엇인가?',
    status: 'done',
    topics: ['Backend', 'Spring'],
    date: '1주 전',
    daysAgo: 7,
    meta: '답변 3회 · 충분히 설명 가능 · 노트 생성됨',
  },
  {
    id: 'db-index',
    title: 'DB Index는 왜 조회 성능을 높여줄까?',
    status: 'curious',
    topics: ['Database'],
    date: '1주 전',
    daysAgo: 8,
    meta: '아직 답을 작성하지 않았어요',
  },
  {
    id: 'cold-hands',
    title: '사람은 왜 긴장하면 손이 차가워질까?',
    status: 'curious',
    topics: ['기타'],
    date: '2주 전',
    daysAgo: 14,
    meta: '아직 답을 작성하지 않았어요',
  },
  {
    id: 'docker-vs-vm',
    title: 'Docker Container는 왜 VM보다 가벼울까?',
    status: 'done',
    topics: ['Infra'],
    date: '3주 전',
    daysAgo: 21,
    meta: '답변 2회 · 이해 완료 · 노트 생성됨',
  },
  {
    id: 'llm-hallucination',
    title: 'LLM은 왜 hallucination을 할까?',
    status: 'studying',
    topics: ['AI'],
    date: '3주 전',
    daysAgo: 24,
    meta: '답변 1회 · 공부 중',
  },
  {
    id: 'gc-timing',
    title: 'Garbage Collector는 정확히 언제 실행될까?',
    status: 'curious',
    topics: ['Backend', 'Java'],
    date: '37일 전',
    daysAgo: 37,
    meta: '37일 전에 등록 · 아직 답을 작성하지 않았어요',
  },
  {
    id: 'tcp-handshake',
    title: 'TCP는 왜 3-way handshake를 할까?',
    status: 'curious',
    topics: ['Network'],
    date: '6주 전',
    daysAgo: 42,
    meta: '42일 전에 등록 · 아직 답을 작성하지 않았어요',
  },
  {
    id: 'spring-bean-lifecycle',
    title: 'Spring Bean의 생명주기는 어떻게 동작할까?',
    status: 'done',
    topics: ['Backend', 'Spring'],
    date: '복습',
    daysAgo: 95,
    meta: '3개월 전 이해 완료 · 다시 설명해볼 때예요',
  },
]

/** 홈의 "다시 꺼내볼 질문" */
export const recallQuestions: Question[] = ['gc-timing', 'http3-udp', 'spring-bean-lifecycle'].map(
  (id) => questions.find((q) => q.id === id)!,
)
