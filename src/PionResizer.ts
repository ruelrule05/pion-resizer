import {html, css, useCallback, useEffect, useRef, useState, component} from '@pionjs/pion';
import {ref} from 'lit-html/directives/ref.js';

const styles = css`
	:host {
		display: block;
		width: 100%;
		height: 100%;
		overflow: hidden;
		color: #111827;
	}

	:host([is-resizing]) {
		cursor: col-resize;
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
	}

	#container {
		display: flex;
		width: 100%;
		height: 100%;
		background-color: #f9fafb;
	}

	.panel {
		padding: 24px;
		box-sizing: border-box;
		overflow: auto;
		position: relative;
	}

	#left-panel {
		--left-panel-width: 50%;
		width: var(--left-panel-width, 50%);
		min-width: 200px;
		background-color: #ffffff;
		border-right: 1px solid #e5e7eb;
		flex-shrink: 0;
	}

	#right-panel {
		flex-grow: 1;
		min-width: 200px;
		background-color: #f9fafb;
	}

	#divider {
		width: 8px;
		background-color: #e5e7eb;
		cursor: col-resize;
		transition:
			background-color 0.2s ease-in-out,
			width 0.2s ease-in-out;
		flex-shrink: 0;
	}

	#divider:hover {
		width: 12px;
		background-color: #3b82f6;
	}
`;

interface PionResizerProps {
	host: HTMLElement;
}

const PionResizer = ({ host } : PionResizerProps) => {
	const [isResizing, setIsResizing] = useState<boolean>(false);

	const [container, setContainer] = useState<Element>();
	const [leftPanel, setLeftPanel] = useState<Element>();
	const [rightPanel, setRightPanel] = useState<Element>();
	const [divider, setDivider] = useState<Element>();

	const resizeState = useRef({
		containerOffsetLeft: 0,
		leftMinWidth: 0,
		rightMinWidth: 0,
		containerWidth: 0,
		dividerWidth: 0,
	});

	const handleMouseUp = useCallback(() => {
		setIsResizing(false);
	}, []);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!isResizing || !leftPanel) return;

		const {
			containerOffsetLeft,
			leftMinWidth,
			rightMinWidth,
			containerWidth,
			dividerWidth,
		} = resizeState.current;

		let newLeftWidth = e.clientX - containerOffsetLeft;

		if (newLeftWidth < leftMinWidth) {
			newLeftWidth = leftMinWidth;
		}

		if (containerWidth - newLeftWidth - dividerWidth < rightMinWidth) {
			newLeftWidth = containerWidth - rightMinWidth - dividerWidth;
		}

		(leftPanel as HTMLElement).style.setProperty('--left-panel-width', `${newLeftWidth}px`);
	}, [isResizing, leftPanel, rightPanel, container, divider]);

	const handleMouseDown = useCallback((e: MouseEvent) => {
		e.preventDefault();
		if (!container) return;

		resizeState.current = {
			containerOffsetLeft: container.getBoundingClientRect().left,
			leftMinWidth: parseInt(getComputedStyle(leftPanel as HTMLElement).minWidth, 10),
			rightMinWidth: parseInt(getComputedStyle(rightPanel as HTMLElement).minWidth, 10),
			containerWidth: (container as HTMLElement).offsetWidth,
			dividerWidth: (divider as HTMLElement).offsetWidth,
		};

		setIsResizing(true);
	}, [container, leftPanel, rightPanel, divider]);

	useEffect(() => {
		if (divider) {
			(divider as HTMLElement).addEventListener('mousedown', handleMouseDown);
			return () => (divider as HTMLElement).removeEventListener('mousedown', handleMouseDown);
		}
	}, [divider, handleMouseDown]);

	useEffect(() => {
		if (isResizing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
			return () => {
				document.removeEventListener('mousemove', handleMouseMove);
				document.removeEventListener('mouseup', handleMouseUp);
			};
		}
	}, [isResizing, handleMouseMove, handleMouseUp]);

	useEffect(() => {
		if (host) {
			host.toggleAttribute('is-resizing', isResizing);
		}
	}, [isResizing, host])

	return html`
		<style>
			${styles}
		</style>

		<div id="container" ${ref(setContainer)}>
			<div id="left-panel" class="panel" ${ref(setLeftPanel)}>
				<h2>Left Component</h2>
				<p>This is the left panel. You can resize it by dragging the divider on the right.</p>
			</div>

			<div id="divider" ${ref(setDivider)})></div>

			<div id="right-panel" class="panel" ${ref(setRightPanel)}>
				<h2>Right Component</h2>
				<p>This is the right panel. You can resize it by dragging the divider on the left.</p>
			</div>
		</div>
	`;
}

customElements.define(
	'pion-resizer',
	component<PionResizerProps>(PionResizer, { styleSheets: [styles] })
)
export { PionResizer }
