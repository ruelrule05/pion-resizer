import { useEffect, useState, useCallback } from '@pionjs/pion';
import { useMeta } from '@neovici/cosmoz-utils/hooks/use-meta';

const isFocused = (t: Element) => t.matches(':focus-within');

interface FocusState {
	focused?: boolean;
	closed?: boolean;
}
export interface UseFocusOpts {
	disabled?: boolean;
	onFocus?: (focused: boolean) => void;
}
export const useFocus = ({ disabled, onFocus }: UseFocusOpts) => {
	const [focusState, setState] = useState<FocusState>(),
		{ focused: _focused, closed } = focusState || {},
		focused = _focused && !disabled,
		meta = useMeta({ closed, onFocus }),
		setClosed = useCallback(
			(closed: boolean) => setState((p) => ({ ...p, closed })),
			[],
		),
		onToggle = useCallback((e: Event) => {
			const target = e.currentTarget as HTMLElement;
			return isFocused(target)
				? setState((p) => ({ focused: true, closed: !p?.closed }))
				: target.focus();
		}, []);

	useEffect(() => {
		if (!focused) {
			return;
		}
		const handler = (e: KeyboardEvent) => {
			if (e.defaultPrevented) {
				return;
			}
			const { closed } = meta;
			if (e.key === 'Escape' && !closed) {
				e.preventDefault();
				setClosed(true);
			} else if (['ArrowUp', 'Up'].includes(e.key) && closed) {
				e.preventDefault();
				setClosed(false);
			}
		};
		document.addEventListener('keydown', handler, true);
		return () => document.removeEventListener('keydown', handler, true);
	}, [focused]);

	return {
		focused,
		active: focused && !closed,
		setClosed,
		onToggle,
		onFocus: useCallback(
			(e: FocusEvent) => {
				const focused = isFocused(e.currentTarget as HTMLElement);
				setState({ focused });
				meta.onFocus?.(focused);
			},
			[meta],
		),
	};
};

const fevs = ['focusin', 'focusout'] as const;
export const useHostFocus = (host: HTMLElement & UseFocusOpts) => {
	const thru = useFocus(host),
		{ onFocus } = thru;

	useEffect(() => {
		host.setAttribute('tabindex', '0');
		fevs.forEach((ev) => host.addEventListener(ev, onFocus));
		return () => {
			fevs.forEach((ev) => host.removeEventListener(ev, onFocus));
		};
	}, []);

	return thru;
};
