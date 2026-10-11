import type { GraphNodeStatus } from '../components/GraphNode/GraphNode'

export type RelationType = 'RELATED' | 'PREREQUISITE' | 'FOLLOW_UP' | 'EXPANSION'

export type ConceptNode = {
  id: string
  label: string
  status: GraphNodeStatus
  topics: string[]
  /** 1440×900 캔버스 기준 별 중심 좌표 (Figma 03 지식 그래프) */
  x: number
  y: number
  /** 질문 노드면 질문 상세로 이동할 id */
  questionId?: string
  question?: string
  description: string
  /** 추천 개념: 왜 추천했는지 */
  reason?: string
  related: { title: string; type: RelationType }[]
  helpful?: string
}

export type ConceptEdge = {
  from: string
  to: string
  /** 추천 개념으로 이어지는 점선 */
  recommended?: boolean
}

export const GRAPH_TOPICS = ['Backend', 'Database', 'Network', 'Infra']

export const conceptNodes: ConceptNode[] = [
  {
    id: 'redis',
    label: 'Redis',
    status: 'done',
    topics: ['Backend', 'Database'],
    x: 700.5,
    y: 470,
    questionId: 'redis-fast',
    question: 'Redis는 왜 빠른가?',
    description: '메모리 기반 키-값 저장소. 이벤트 루프와 I/O Multiplexing으로 많은 연결을 처리한다.',
    related: [
      { title: 'Cache는 왜 사용하는가?', type: 'RELATED' },
      { title: 'Redis의 I/O Multiplexing은 어떻게 동작할까?', type: 'FOLLOW_UP' },
    ],
  },
  {
    id: 'cache',
    label: 'Cache',
    status: 'done',
    topics: ['Backend'],
    x: 560.5,
    y: 380,
    question: 'Cache는 왜 사용하는가?',
    description: '자주 쓰는 데이터를 빠른 저장소에 두어 응답 속도와 원본 부하를 줄이는 기법.',
    related: [{ title: 'Redis는 왜 빠른가?', type: 'RELATED' }],
  },
  {
    id: 'db-index',
    label: 'DB Index',
    status: 'todo',
    topics: ['Database'],
    x: 560,
    y: 590,
    questionId: 'db-index',
    question: 'DB Index는 왜 조회 성능을 높여줄까?',
    description: '아직 답을 작성하지 않은 질문이에요.',
    related: [{ title: 'Redis는 왜 빠른가?', type: 'RELATED' }],
  },
  {
    id: 'redis-cluster',
    label: 'Redis Cluster',
    status: 'studying',
    topics: ['Backend', 'Infra'],
    x: 850.5,
    y: 380.5,
    question: 'Redis Cluster는 왜 필요할까?',
    description: '여러 노드에 데이터를 나눠 저장해 확장성과 가용성을 높이는 구성.',
    related: [{ title: 'Distributed Cache는 어떻게 동작하는가?', type: 'EXPANSION' }],
  },
  {
    id: 'io-multiplexing',
    label: 'I/O Multiplexing',
    status: 'weak',
    topics: ['Network', 'Backend'],
    x: 860.5,
    y: 590.5,
    question: 'Redis의 I/O Multiplexing은 어떻게 동작할까?',
    description: '하나의 스레드가 여러 소켓의 I/O 이벤트를 감시하고 처리하는 방식.',
    related: [{ title: 'Redis는 왜 빠른가?', type: 'PREREQUISITE' }],
  },
  {
    id: 'cache-consistency',
    label: 'Cache Consistency',
    status: 'studying',
    topics: ['Backend', 'Database'],
    x: 430.5,
    y: 280.5,
    question: '캐시와 DB의 데이터는 어떻게 일관성을 맞출까?',
    description: '캐시와 원본 데이터가 어긋나지 않도록 갱신 시점을 관리하는 문제.',
    related: [{ title: 'Cache는 왜 사용하는가?', type: 'FOLLOW_UP' }],
  },
  {
    id: 'distributed-cache',
    label: 'Distributed Cache',
    status: 'weak',
    topics: ['Backend', 'Infra'],
    x: 690,
    y: 250.5,
    question: 'Distributed Cache는 어떻게 동작하는가?',
    description: '여러 서버가 공유하는 캐시 계층. 샤딩과 복제가 핵심이다.',
    related: [{ title: 'Cache는 왜 사용하는가?', type: 'EXPANSION' }],
  },
  {
    id: 'spring',
    label: 'Spring',
    status: 'done',
    topics: ['Backend'],
    x: 460.5,
    y: 720,
    question: 'Spring은 무엇을 해주는 프레임워크일까?',
    description: 'IoC 컨테이너를 중심으로 객체 생성과 의존성을 관리하는 자바 프레임워크.',
    related: [{ title: 'Spring에서 DI가 필요한 이유는 무엇인가?', type: 'FOLLOW_UP' }],
  },
  {
    id: 'di',
    label: 'DI',
    status: 'done',
    topics: ['Backend'],
    x: 610,
    y: 790,
    questionId: 'spring-di',
    question: 'Spring에서 DI가 필요한 이유는 무엇인가?',
    description: '객체가 필요한 의존성을 외부에서 주입받아 결합도를 낮추는 설계.',
    related: [{ title: 'Spring Bean의 생명주기는 어떻게 동작할까?', type: 'RELATED' }],
  },
  {
    id: 'bean',
    label: 'Bean',
    status: 'studying',
    topics: ['Backend'],
    x: 400.5,
    y: 830.5,
    questionId: 'spring-bean-lifecycle',
    question: 'Spring Bean의 생명주기는 어떻게 동작할까?',
    description: '스프링 컨테이너가 생성하고 관리하는 객체.',
    related: [{ title: 'Spring에서 DI가 필요한 이유는 무엇인가?', type: 'RELATED' }],
  },
  {
    id: 'cache-stampede',
    label: 'Cache Stampede',
    status: 'recommended',
    topics: ['Backend'],
    x: 410.5,
    y: 470.5,
    description: '캐시가 만료되는 순간 같은 데이터 요청이 DB로 한꺼번에 몰리는 현상',
    reason: 'Cache와 Distributed Cache를 공부하고 있어요. 지금 흐름이라면 캐시 만료 시점의 트래픽 문제도 함께 알아두면 좋아요.',
    related: [
      { title: 'Cache는 왜 사용하는가?', type: 'RELATED' },
      { title: 'Distributed Cache는 어떻게 동작하는가?', type: 'EXPANSION' },
    ],
    helpful: '대규모 트래픽 환경의 캐시 설계, TTL·락 전략',
  },
  {
    id: 'redis-sentinel',
    label: 'Redis Sentinel',
    status: 'recommended',
    topics: ['Infra'],
    x: 975,
    y: 265.5,
    description: 'Redis 마스터 장애를 감지하고 자동으로 복제본을 승격시키는 고가용성 도구',
    reason: 'Redis Cluster를 공부하고 있어요. 장애가 났을 때 Redis가 어떻게 버티는지도 이어서 보면 좋아요.',
    related: [{ title: 'Redis Cluster는 왜 필요할까?', type: 'EXPANSION' }],
    helpful: '고가용성 구성, 장애 조치(failover) 흐름',
  },
  {
    id: 'cache-eviction',
    label: 'Cache Eviction Policy',
    status: 'recommended',
    topics: ['Backend'],
    x: 840.5,
    y: 165.5,
    description: '캐시가 가득 찼을 때 어떤 데이터를 먼저 지울지 정하는 규칙 (LRU, LFU 등)',
    reason: 'Distributed Cache를 공부하고 있어요. 메모리가 한정된 캐시가 데이터를 어떻게 비우는지 알아두면 좋아요.',
    related: [{ title: 'Distributed Cache는 어떻게 동작하는가?', type: 'EXPANSION' }],
    helpful: '메모리 설계, 캐시 적중률 개선',
  },
  {
    id: 'event-loop',
    label: 'Event Loop',
    status: 'recommended',
    topics: ['Network'],
    x: 990.5,
    y: 690.5,
    description: '이벤트가 생길 때마다 등록된 작업을 하나씩 처리하는 실행 모델',
    reason: 'I/O Multiplexing을 보완하고 있어요. 이벤트 루프를 알면 Redis와 Node.js의 동작이 함께 이해돼요.',
    related: [{ title: 'Redis의 I/O Multiplexing은 어떻게 동작할까?', type: 'PREREQUISITE' }],
    helpful: '비동기 서버 구조, 논블로킹 I/O',
  },
]

export const conceptEdges: ConceptEdge[] = [
  { from: 'redis', to: 'cache' },
  { from: 'redis', to: 'redis-cluster' },
  { from: 'redis', to: 'io-multiplexing' },
  { from: 'redis', to: 'db-index' },
  { from: 'cache', to: 'cache-consistency' },
  { from: 'cache', to: 'distributed-cache' },
  { from: 'distributed-cache', to: 'redis-cluster' },
  { from: 'spring', to: 'di' },
  { from: 'spring', to: 'bean' },
  { from: 'cache', to: 'cache-stampede', recommended: true },
  { from: 'redis-cluster', to: 'redis-sentinel', recommended: true },
  { from: 'distributed-cache', to: 'cache-eviction', recommended: true },
  { from: 'io-multiplexing', to: 'event-loop', recommended: true },
]
