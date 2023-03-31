// eslint-disable-next-line
/// <reference path="../types/position.d.ts" />
import { useEffect } from 'haunted';
import getPosition from 'position.js';
// eslint-disable-next-line no-duplicate-imports
import type { Placement } from 'position.js';
import { onScrolled } from './on-scrolled';

export const defaultPlacement = [
	'bottom-left',
	'bottom-right',
	'bottom',
	'top-left',
	'top-right',
	'top',
] as const;

export { Placement };

export interface PositionOpts {
	host: HTMLElement;
	anchor: HTMLElement;
	placement?: Placement;
	confinement?: HTMLElement;
	limit?: boolean;
}
export const position = ({
	host,
	anchor,
	placement = defaultPlacement,
	confinement,
	limit,
}: PositionOpts) => {
	const anchorBounds = anchor.getBoundingClientRect(),
		hostBounds = host.getBoundingClientRect(),
		{ popupOffset: offset } = getPosition(hostBounds, anchorBounds, placement, {
			fixed: true,
			adjustXY: 'both',
			offsetParent: confinement,
		}),
		{ style } = host;
	style.left = offset.left + 'px';
	style.top = offset.top + 'px';
	if (limit) {
		style.minWidth = Math.max(anchorBounds.width, hostBounds.width) + 'px';
	}
};

interface UsePositionOpts extends Omit<PositionOpts, 'anchor'> {
	anchor?: (() => HTMLElement) | HTMLElement | null;
}
export const usePosition = ({
	anchor: anchorage,
	host,
	...thru
}: UsePositionOpts) => {
	useEffect(() => {
		const anchor = typeof anchorage === 'function' ? anchorage() : anchorage;
		if (anchor == null) {
			return;
		}
		let rid: number;
		const reposition = () => position({ host, anchor, ...thru }),
			ro = new ResizeObserver(reposition);

		ro.observe(host);
		ro.observe(anchor);

		const onReposition = () => {
				cancelAnimationFrame(rid);
				rid = requestAnimationFrame(reposition);
			},
			offScroll = onScrolled(anchor, onReposition);
		window.addEventListener('resize', onReposition, true);

		return () => {
			ro.unobserve(host);
			ro.unobserve(anchor);
			offScroll();
			window.removeEventListener('resize', onReposition, true);
			cancelAnimationFrame(rid);
		};
	}, [anchorage, ...Object.values(thru)]);
};
