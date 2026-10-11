import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { Chip } from '../../components/Chip/Chip'
import { Input } from '../../components/Input/Input'
import { StatusBadge } from '../../components/StatusBadge/StatusBadge'
import { Surface } from '../../components/Surface/Surface'
import { questions } from '../../data/mock'
import { noteToMarkdown, notes, type Note } from '../../data/notes'
import styles from './NotesPage.module.css'

export function NotesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const keyword = query.trim().toLowerCase()
  const filtered = notes.filter(
    (note) =>
      !keyword ||
      note.title.toLowerCase().includes(keyword) ||
      note.keywords.some((k) => k.toLowerCase().includes(keyword)),
  )
  const selected = notes.find((note) => note.id === searchParams.get('id')) ?? notes[0]

  const relatedLink = (title: string) => {
    const question = questions.find((q) => q.title.replace(/\?$/, '') === title.replace(/\?$/, ''))
    return question ? `/questions/${question.id}` : `/?q=${encodeURIComponent(title)}`
  }

  return (
    <main className={styles.body}>
      <Surface as="aside" className={styles.list} aria-label="노트 목록">
        <h1 className="heading-20">정리 노트</h1>
        <Input
          type="search"
          placeholder="노트 검색"
          aria-label="노트 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <ul className={styles.items}>
          {filtered.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                className={[styles.item, note.id === selected.id && styles.itemActive].filter(Boolean).join(' ')}
                aria-current={note.id === selected.id}
                onClick={() => setSearchParams({ id: note.id })}
              >
                <span className={styles.itemTitle}>{note.shortTitle}</span>
                <span className={styles.itemMeta}>
                  {note.topics[0]} · {note.date}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && <li className={styles.noResult}>검색 결과가 없어요</li>}
        </ul>
      </Surface>

      <Surface as="article" className={styles.note}>
        <div className={styles.meta}>
          <StatusBadge status="done" />
          {selected.topics.map((topic) => (
            <Chip key={topic}>{topic}</Chip>
          ))}
          <span className={styles.metaText}>
            답변 {selected.revisions}회 수정 · {selected.doneAt} 이해 완료
          </span>
        </div>
        <h2 className="heading-24">{selected.title}</h2>

        <section className={styles.section}>
          <h3 className="title-16">내가 작성한 최종 답</h3>
          <p className={styles.answer}>{selected.finalAnswer}</p>
        </section>

        <section className={styles.section}>
          <h3 className="title-16">AI가 보완한 부분</h3>
          <div className={styles.aiBox}>
            <span className={styles.accentBar} aria-hidden />
            <ul>
              {selected.aiSupplements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <div className={styles.twoColumns}>
          <section className={styles.section}>
            <h3 className="title-16">핵심 키워드</h3>
            <div className={styles.chips}>
              {selected.keywords.map((keyword) => (
                <Chip key={keyword}>{keyword}</Chip>
              ))}
            </div>
          </section>
          <section className={styles.section}>
            <h3 className="title-16">관련 질문</h3>
            <ul className={styles.related}>
              {selected.related.map((title) => (
                <li key={title}>
                  <Link to={relatedLink(title)} className={styles.relatedLink}>
                    <span>{title}</span>
                    <span className={styles.arrow}>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className={styles.section}>
          <h3 className="title-16">추가로 알아두면 좋은 내용</h3>
          <p className={`body-14 ${styles.secondary}`}>{selected.furtherReading}</p>
        </section>

        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => navigate(`/questions/${selected.questionId}`)}>
            학습 히스토리 보기
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/questions/${selected.questionId}`)}>
            다시 설명해보기
          </Button>
          <Button variant="ghost" className={styles.export} onClick={() => downloadMarkdown(selected)}>
            Markdown 내보내기
          </Button>
        </div>
      </Surface>
    </main>
  )
}

function downloadMarkdown(note: Note) {
  const blob = new Blob([noteToMarkdown(note)], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${note.title.replace(/[\\/:*?"<>|]/g, '')}.md`
  link.click()
  URL.revokeObjectURL(url)
}
