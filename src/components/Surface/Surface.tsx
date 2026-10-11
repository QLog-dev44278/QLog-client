import type { ComponentPropsWithoutRef, ElementType } from 'react'
import styles from './Surface.module.css'

type SurfaceProps<T extends ElementType> = {
  as?: T
} & ComponentPropsWithoutRef<T>

/** Elevation/Float 스타일의 반투명 카드 면. 카드·패널·모달의 바탕으로 쓴다. */
export function Surface<T extends ElementType = 'div'>({ as, className, ...rest }: SurfaceProps<T>) {
  const Tag = as ?? 'div'
  return <Tag className={[styles.surface, className].filter(Boolean).join(' ')} {...rest} />
}
