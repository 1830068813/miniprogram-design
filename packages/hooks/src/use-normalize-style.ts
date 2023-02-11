import { ComputedRef, computed } from 'vue';
import type { CSSProperties } from 'vue';
type Style = Partial<Record<keyof CSSProperties, string | number>>
type ReturnStyle<T extends Style> = { transition: string } & T;
export function useNormalizeStyle<T extends Style> (
  style: T,
): ComputedRef<ReturnStyle<T>> {
  return computed(() => {
    const _style = Object.entries(style).reduce<Partial<CSSProperties>>(
      (obj, _style) => {
        const [key, value] = _style;
        if (typeof value === 'number') {
          // @ts-expect-error: value is not a number
          obj[key] = `${value}px`;
        } else {
          // @ts-expect-error: value is not a number
          obj[key] = value;
        }
        return obj;
      }, {} as Partial<CSSProperties>);

    return {
      transition: 'inherit',
      ..._style,
    } as ReturnStyle<T>;
  });
}
