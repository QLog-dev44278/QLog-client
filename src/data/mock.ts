import type { Question, User } from './types'

/** 백엔드 연동 전까지 쓰는 목 데이터 */
export const currentUser: User = {
  name: '정지윤',
  email: 'jiyoon@example.com',
}

/** 홈의 "다시 꺼내볼 질문" */
export const recallQuestions: Question[] = [
  {
    id: 'gc-timing',
    title: 'Garbage Collector는 정확히 언제 실행될까?',
    status: 'curious',
    topics: ['Java'],
    date: '37일 전',
    meta: '37일 전에 등록 · 아직 답을 작성하지 않았어요',
  },
  {
    id: 'http3-udp',
    title: 'HTTP/3는 왜 UDP를 사용할까?',
    status: 'weak',
    topics: ['Network'],
    date: '5일 전',
    meta: '답변 1회 · 보완 필요: QUIC 개념 누락',
  },
  {
    id: 'spring-bean-lifecycle',
    title: 'Spring Bean의 생명주기는 어떻게 동작할까?',
    status: 'done',
    topics: ['Backend', 'Spring'],
    date: '복습',
    meta: '3개월 전 이해 완료 · 다시 설명해볼 때예요',
  },
]
