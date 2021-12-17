import { useEffect, useState, useCallback } from 'haunted';
import { useMeta } from '@neovici/cosmoz-utils/lib/hooks/use-meta';

const isFocused = t => t.matches(':focus-within');

export const useFocus = ({ disabled, onFocus }) => {
	const [{ focused, closed } = {}, setState] = useState(),
		active = focused && !disabled,
		meta = useMeta({ closed, onFocus }),
		setClosed = useCallback(
			closed => setState(p => ({ ...p, closed })),
			[]
		),
		onToggle = useCallback(e => {
			const target = e.currentTarget;
			return isFocused(target)
				? setState(p => ({ focused: true, closed: !p?.closed }))
				: target.focus();
		}, []);

	useEffect(() => {
		if (!active) {
			return;
		}
		const handler = e => {
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
	}, [active]);

	return {
		active: active && !closed,
		setClosed,
		onToggle,
		onFocus: useCallback(
			e => {
				const focused = isFocused(e.currentTarget);
				setState({ focused });
				meta.onFocus?.(focused);
			},
			[meta]
		)
	};
};

const fevs = ['focusin', 'focusout'];
export const useHostFocus = host => {
	const thru = useFocus(host),
		{ onFocus } = thru;

	useEffect(() => {
		host.setAttribute('tabindex', '-1');
		fevs.forEach(ev => host.addEventListener(ev, onFocus));
		return () => {
			fevs.forEach(ev => host.removeEventListener(ev, onFocus));
		};
	}, []);

	return thru;
};
