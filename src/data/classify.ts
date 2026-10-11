/** AI 분류 API 연동 전까지 쓰는 키워드 기반 임시 분류기 */
const RULES: [RegExp, string][] = [
  [/redis|db|database|index|sql|jpa|트랜잭션/i, 'Database'],
  [/spring|bean|di\b|ioc|jpa|api|서버|backend/i, 'Backend'],
  [/redis|cache|캐시/i, 'Backend'],
  [/http|tcp|udp|quic|dns|네트워크|network/i, 'Network'],
  [/docker|kubernetes|k8s|aws|vm|infra|배포/i, 'Infra'],
  [/java|jvm|gc|garbage/i, 'Java'],
  [/ai|llm|모델|학습|embedding|rag/i, 'AI'],
]

export function classifyQuestion(title: string): string[] {
  const topics = new Set<string>()
  for (const [pattern, topic] of RULES) {
    if (pattern.test(title)) topics.add(topic)
  }
  return topics.size > 0 ? [...topics].slice(0, 3) : ['기타']
}
