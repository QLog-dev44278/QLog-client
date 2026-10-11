/** 질문의 이해 상태 */
export type QuestionStatus = 'curious' | 'studying' | 'weak' | 'done'

export const STATUS_LABEL: Record<QuestionStatus, string> = {
  curious: '궁금함',
  studying: '공부 중',
  weak: '보완 필요',
  done: '이해 완료',
}

export type User = {
  name: string
  email: string
}

export type Question = {
  id: string
  title: string
  status: QuestionStatus
  topics: string[]
  /** 카드 우상단에 보이는 상대 시간 (예: "3일 전") */
  date: string
  /** 등록 후 지난 일수. 정렬과 "오래 방치된 질문" 판단에 쓴다. */
  daysAgo: number
  /** 카드 하단 한 줄 요약 */
  meta: string
}
