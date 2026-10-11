export type Note = {
  id: string
  questionId: string
  title: string
  /** 목록에 보이는 짧은 제목 */
  shortTitle: string
  topics: string[]
  date: string
  doneAt: string
  revisions: number
  finalAnswer: string
  aiSupplements: string[]
  keywords: string[]
  related: string[]
  furtherReading: string
}

export const notes: Note[] = [
  {
    id: 'spring-di',
    questionId: 'spring-di',
    title: 'Spring에서 DI가 필요한 이유는 무엇인가?',
    shortTitle: 'Spring에서 DI가 필요한 이유는?',
    topics: ['Backend', 'Spring'],
    date: '10.04',
    doneAt: '2026.10.04',
    revisions: 3,
    finalAnswer:
      '객체가 필요한 의존성을 직접 생성하지 않고 외부(스프링 컨테이너)에서 주입받게 하면 객체 간 결합도가 낮아지고 구현체를 쉽게 바꿀 수 있다. 덕분에 테스트할 때 Mock 객체로 교체하기 쉽고, 객체 생성과 생명주기를 컨테이너가 관리해 코드가 단순해진다.',
    aiSupplements: [
      '"결합도가 낮아진다"를 인터페이스 의존(DIP)과 연결하면 더 정확한 설명이 돼요.',
      '생성자 주입이 권장되는 이유(불변성, 순환 참조 조기 발견)를 보완했어요.',
    ],
    keywords: ['IoC', 'DIP', '생성자 주입', 'Bean', 'ApplicationContext'],
    related: ['IoC 컨테이너는 어떻게 동작할까?', 'Spring Bean의 생명주기는 어떻게 동작할까?'],
    furtherReading: 'Bean Scope(싱글톤·프로토타입)에 따라 주입 시점과 방식이 어떻게 달라지는지',
  },
  {
    id: 'docker-vs-vm',
    questionId: 'docker-vs-vm',
    title: 'Docker Container는 왜 VM보다 가벼울까?',
    shortTitle: 'Docker Container는 왜 VM보다 가벼울까?',
    topics: ['Infra'],
    date: '09.28',
    doneAt: '2026.09.28',
    revisions: 2,
    finalAnswer:
      'VM은 하이퍼바이저 위에 게스트 OS 전체를 올리지만, 컨테이너는 호스트 OS의 커널을 공유하고 namespace와 cgroup으로 프로세스를 격리한다. OS를 새로 부팅하지 않으니 시작이 빠르고, 이미지 크기와 메모리 사용량도 훨씬 작다.',
    aiSupplements: [
      '커널을 공유하기 때문에 격리 수준은 VM보다 약하다는 트레이드오프를 함께 적으면 좋아요.',
      '이미지 레이어 구조(Union File System)가 가벼움에 기여한다는 점을 보완했어요.',
    ],
    keywords: ['namespace', 'cgroup', '하이퍼바이저', '이미지 레이어'],
    related: ['컨테이너 격리는 어떻게 보장될까?', 'Kubernetes는 왜 필요할까?'],
    furtherReading: '컨테이너 보안 이슈와 rootless 컨테이너',
  },
  {
    id: 'tcp-vs-udp',
    questionId: 'tcp-handshake',
    title: 'TCP와 UDP는 무엇이 다른가?',
    shortTitle: 'TCP와 UDP는 무엇이 다른가?',
    topics: ['Network'],
    date: '09.21',
    doneAt: '2026.09.21',
    revisions: 2,
    finalAnswer:
      'TCP는 연결을 맺고 순서 보장·재전송·흐름 제어로 신뢰성을 제공하는 대신 오버헤드가 크다. UDP는 연결 없이 데이터그램을 보내 빠르고 가볍지만 손실과 순서를 애플리케이션이 직접 처리해야 한다.',
    aiSupplements: ['혼잡 제어도 TCP의 핵심 기능으로 함께 언급하면 좋아요.'],
    keywords: ['3-way handshake', '흐름 제어', '혼잡 제어', '데이터그램'],
    related: ['HTTP/3는 왜 UDP를 사용할까?', 'TCP는 왜 3-way handshake를 할까?'],
    furtherReading: 'QUIC이 UDP 위에서 신뢰성을 구현하는 방법',
  },
  {
    id: 'jpa-persistence-context',
    questionId: 'jpa-persistence-context',
    title: 'JPA 영속성 컨텍스트란 무엇인가?',
    shortTitle: 'JPA 영속성 컨텍스트란 무엇인가?',
    topics: ['Backend'],
    date: '09.15',
    doneAt: '2026.09.15',
    revisions: 2,
    finalAnswer:
      '엔티티를 영구 저장하는 환경으로, 트랜잭션 동안 엔티티를 1차 캐시에 보관하고 변경을 감지해 커밋 시점에 DB에 반영한다. 같은 트랜잭션 안에서는 같은 엔티티의 동일성이 보장된다.',
    aiSupplements: ['쓰기 지연(SQL 저장소)과 flush 시점을 함께 설명하면 더 정확해요.'],
    keywords: ['1차 캐시', '변경 감지', '쓰기 지연', 'flush'],
    related: ['N+1 문제는 왜 생길까?', '트랜잭션 격리 수준이란?'],
    furtherReading: '준영속 상태와 merge의 동작 방식',
  },
]

/** 노트를 Markdown 문서로 만든다 (내보내기용) */
export function noteToMarkdown(note: Note) {
  return [
    `# ${note.title}`,
    '',
    `> ${note.topics.join(', ')} · 답변 ${note.revisions}회 수정 · ${note.doneAt} 이해 완료`,
    '',
    '## 내가 작성한 최종 답',
    '',
    note.finalAnswer,
    '',
    '## AI가 보완한 부분',
    '',
    ...note.aiSupplements.map((item) => `- ${item}`),
    '',
    '## 핵심 키워드',
    '',
    note.keywords.map((keyword) => `\`${keyword}\``).join(' '),
    '',
    '## 관련 질문',
    '',
    ...note.related.map((item) => `- ${item}`),
    '',
    '## 추가로 알아두면 좋은 내용',
    '',
    note.furtherReading,
    '',
  ].join('\n')
}
