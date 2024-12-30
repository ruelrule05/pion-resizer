import { useCallback, useEffect, useMemo, useState } from '@pionjs/pion';
import {
	autoUpdate,
	computePosition,
	flip,
	shift,
	ComputePositionReturn,
	ComputePositionConfig,
	Placement,
	Strategy,
} from '@floating-ui/dom';

export const defaultMiddleware = [
	flip({
		fallbackAxisSideDirection: 'start',
		crossAxis: false,
	}),
	shift(),
];

interface UseFloating
	extends Pick<
		ComputePositionConfig,
		'placement' | 'strategy' | 'middleware'
	> {}

export const useFloating = ({
	placement = 'bottom-start',
	strategy,
	middleware = defaultMiddleware,
}: UseFloating) => {
	const [[reference, floating], setRefs] = useState<[Element?, Element?]>([]);
	const [position, setPosition] = useState<ComputePositionReturn>();

	useEffect(() => {
		if (!reference || !(floating instanceof HTMLElement)) {
			setPosition(undefined);
			return;
		}
		return autoUpdate(reference, floating, () =>
			computePosition(reference, floating, {
				placement,
				strategy,
				middleware,
			}).then(setPosition),
		);
	}, [reference, floating, placement, strategy, middleware]);

	return {
		setReference: useCallback(
			(el?: Element) => setRefs(([, _]) => [el, _]),
			[],
		),
		setFloating: useCallback((el?: Element) => setRefs(([_]) => [_, el]), []),
		styles: useMemo(
			() =>
				position ? { left: `${position.x}px`, top: `${position.y}px` } : {},
			[position?.x, position?.y],
		),
	};
};

export type { Placement, Strategy };
