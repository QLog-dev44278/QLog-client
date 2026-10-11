export type DiffPart = { text: string; added: boolean }

/**
 * 이전 답변(before)과 비교해 새 답변(after)에서 추가된 부분을 표시한다.
 * 공백 단위 토큰의 LCS로 계산하고, 연속된 추가 토큰은 하나로 묶는다.
 */
export function diffAdded(before: string, after: string): DiffPart[] {
  const a = before.split(/(\s+)/)
  const b = after.split(/(\s+)/)

  const lcs: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const parts: DiffPart[] = []
  const push = (text: string, added: boolean) => {
    const last = parts.at(-1)
    // 공백은 앞 덩어리에 붙여 하이라이트가 끊기지 않게 한다
    if (last && (last.added === added || /^\s+$/.test(text))) last.text += text
    else parts.push({ text, added })
  }

  let i = 0
  let j = 0
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) {
      push(b[j], false)
      i++
      j++
    } else if (i < a.length && lcs[i + 1][j] >= lcs[i][j + 1]) {
      i++
    } else {
      push(b[j], true)
      j++
    }
  }
  return parts
}
