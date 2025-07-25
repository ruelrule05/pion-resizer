import {html, css, useCallback, useEffect, useRef, useState, component} from '@pionjs/pion';
import {ref} from "lit-html/directives/ref.js";

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

	const [container, setContainer] = useState<HTMLElement>();
	const [leftPanel, setLeftPanel] = useState<HTMLElement>();
	const [rightPanel, setRightPanel] = useState<HTMLElement>();
	const [divider, setDivider] = useState<HTMLElement>();

	const containerOffsetLeft = useRef(0);

	const handleMouseUp = useCallback(() => {
		setIsResizing(false);
	}, []);

	const handleMouseMove = useCallback((e: MouseEvent) => {
		if (!isResizing || !leftPanel || !rightPanel || !container || !divider) return;

		let newLeftWidth = e.clientX - containerOffsetLeft.current;

		const leftMinWidth = parseInt(getComputedStyle(leftPanel).minWidth, 10);
		const rightMinWidth = parseInt(getComputedStyle(rightPanel).minWidth, 10);
		const containerWidth = container.getBoundingClientRect().width;
		const dividerWidth = divider.offsetWidth;

		if (newLeftWidth < leftMinWidth) {
			newLeftWidth = leftMinWidth;
		}

		if (containerWidth - newLeftWidth - dividerWidth < rightMinWidth) {
			newLeftWidth = containerWidth - rightMinWidth - dividerWidth;
		}

		leftPanel.style.setProperty('--left-panel-width', `${newLeftWidth}px`);
	}, [isResizing, leftPanel, rightPanel, container, divider]);

	const handleMouseDown = useCallback((e: MouseEvent) => {
		e.preventDefault();
		if (!container) return;

		containerOffsetLeft.current = container.getBoundingClientRect().left;
		setIsResizing(true);
	}, [container]);

	useEffect(() => {
		if (divider) {
			divider.addEventListener('mousedown', handleMouseDown);
			return () => divider.removeEventListener('mousedown', handleMouseDown);
		}
		return undefined;
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
		return undefined;
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

		<div id="container" ${ref(setContainer)})>
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
