declare module 'position.js' {
	export type PlacementDirection =
		| 'bottom'
		| 'top'
		| 'right'
		| 'left'
		| 'center'
		| 'left-center'
		| 'top-center'
		| 'bottom-center'
		| 'bottom-left'
		| 'bottom-right'
		| 'bottom'
		| 'top-left'
		| 'top-right'
		| 'top';

	export interface PlacementPrecise {
		popup: PlacementDirection;
		anchor: PlacementDirection;
	}

	export type Placement =
		| PlacementPrecise
		| PlacementDirection
		| readonly PlacementDirection[]
		| readonly PlacementPrecise[];

	export interface Bounds {
		top: number;
		left: number;
	}

	export default function position(
		hostBounds: Bounds,
		anchorBounds: Bounds,
		placement: Placement,
		options?: {
			fixed?: boolean;
			adjustXY?: 'both';
			offsetParent?: HTMLElement;
		}
	): {
		popupOffset: {
			top: number;
			left: number;
		};
	};
}
