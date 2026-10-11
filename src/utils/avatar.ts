/** 세 글자 한국 이름은 성을 뺀 첫 글자(정지윤 → 지), 그 외에는 첫 글자 */
export function avatarInitial(name: string) {
  return name.length === 3 ? name[1] : name[0]
}
