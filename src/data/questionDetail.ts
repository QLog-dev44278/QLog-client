import { questions } from './mock'
import type { Question } from './types'

export type Verdict = 'insufficient' | 'partial' | 'done'

export const VERDICT_LABEL: Record<Verdict, string> = {
  insufficient: '설명 부족',
  partial: '부분적으로 이해',
  done: '충분히 설명 가능',
}

export type Evaluation = {
  verdict: Verdict
  coverage: { covered: number; total: number }
  good: string[]
  missing: string[]
  misconceptions: string[]
  next: { title: string; keywords: string[]; hint: string }
  /** 직전 버전과 비교해 달라진 점 (답변 비교 화면) */
  changes: { kind: 'plus' | 'warn'; text: string }[]
}

export type AnswerVersion = {
  number: number
  date: string
  text: string
  evaluation?: Evaluation
}

export type QuestionDetail = Question & {
  /** 지식 그래프에 표시되는 개념 이름 */
  concept?: string
  registeredAt: string
  context?: string
  references: string[]
  versions: AnswerVersion[]
  followUps: string[]
  prerequisites: string[]
}

const EVALUATIONS: Record<number, Evaluation> = {
  1: {
    verdict: 'insufficient',
    coverage: { covered: 1, total: 5 },
    good: ['메모리 기반이라는 핵심은 정확해요'],
    missing: ['왜 메모리만으로 설명이 부족한지 더 찾아보세요'],
    misconceptions: [],
    next: { title: '이 방향으로 더 찾아보세요', keywords: ['인메모리 DB', '자료구조'], hint: 'Redis 공식 문서의 소개 페이지부터 읽어보세요' },
    changes: [],
  },
  2: {
    verdict: 'partial',
    coverage: { covered: 3, total: 5 },
    good: ['메모리 기반 저장소라 디스크 I/O보다 접근이 빠르다는 점', '싱글 스레드 구조라는 사실 자체는 정확해요'],
    missing: ['싱글 스레드가 왜 성능에 유리한지(락·경합 비용) 설명이 부족해요', '많은 연결을 한 스레드로 처리하는 방식이 빠져 있어요'],
    misconceptions: ['"싱글 스레드라서 빠르다"는 원인과 결과가 뒤바뀐 설명에 가까워요'],
    next: {
      title: '이 방향으로 더 찾아보세요',
      keywords: ['I/O Multiplexing', 'epoll', '이벤트 루프', 'Redis 내부 자료구조'],
      hint: '공식 문서 FAQ에서 싱글 스레드 관련 항목을 확인해보세요',
    },
    changes: [
      { kind: 'plus', text: '디스크 기반 DB와 비교하는 관점이 생겼어요' },
      { kind: 'plus', text: '싱글 스레드 구조를 언급했어요' },
      { kind: 'warn', text: '아직 I/O Multiplexing과 이벤트 루프가 빠져 있어요' },
    ],
  },
  3: {
    verdict: 'done',
    coverage: { covered: 5, total: 5 },
    good: [
      '메모리 접근과 단순한 자료구조가 속도의 핵심이라는 점',
      'I/O Multiplexing으로 한 스레드가 많은 연결을 처리한다는 점',
      '싱글 스레드를 원인이 아니라 설계 선택으로 정확히 구분한 점',
    ],
    missing: [],
    misconceptions: [],
    next: {
      title: '다음에 이어서 보면 좋은 것',
      keywords: ['Redis Persistence', 'Replication', 'Redis Cluster', 'Cache Stampede'],
      hint: '꼬리질문으로 추가하면 지식 그래프에 새 별로 이어져요',
    },
    changes: [
      { kind: 'plus', text: 'I/O Multiplexing과 이벤트 루프로 많은 연결을 처리하는 방식을 설명했어요' },
      { kind: 'plus', text: '싱글 스레드를 원인이 아닌 설계 선택으로 바로잡았어요' },
    ],
  },
}

/** AI 평가 API 연동 전 목: 버전 번호에 따라 정해진 평가를 돌려준다 */
export function mockEvaluate(versionNumber: number): Promise<Evaluation> {
  const evaluation = EVALUATIONS[Math.min(versionNumber, 3)]
  return new Promise((resolve) => setTimeout(() => resolve(evaluation), 4800))
}

const REDIS_DETAIL: QuestionDetail = {
  ...questions.find((q) => q.id === 'redis-fast')!,
  concept: 'Redis',
  registeredAt: '2026.10.02',
  context: '백엔드 캐시 강의를 듣다가, 같은 인메모리 저장소인데 왜 유독 Redis가 빠르다고 하는지 궁금해짐 · 참고 링크 1개',
  references: ['Redis 공식 문서'],
  versions: [
    { number: 1, date: '10.03', text: 'Redis는 데이터를 메모리에 저장하기 때문에 빠르다.', evaluation: EVALUATIONS[1] },
    {
      number: 2,
      date: '10.05',
      text: 'Redis는 데이터를 메모리에 저장하기 때문에 디스크 기반 DB보다 빠르고, 싱글 스레드 방식이라 context switching 비용이 적어서 빠르다.',
      evaluation: EVALUATIONS[2],
    },
  ],
  followUps: [
    'Redis는 왜 싱글 스레드 구조를 선택했을까?',
    'Redis의 I/O Multiplexing은 어떻게 동작할까?',
    'Redis와 Memcached는 어떤 차이가 있을까?',
  ],
  prerequisites: ['블로킹 I/O와 논블로킹 I/O는 무엇이 다른가?', 'Context Switching은 왜 비용이 드는가?'],
}

export function getQuestionDetail(id: string): QuestionDetail | undefined {
  if (id === REDIS_DETAIL.id) return REDIS_DETAIL
  const question = questions.find((q) => q.id === id)
  if (!question) return undefined
  return { ...question, registeredAt: '', references: [], versions: [], followUps: [], prerequisites: [] }
}
