import { component, useCallback, css } from '@pionjs/pion';
import { html } from 'lit-html';
import { when } from 'lit-html/directives/when.js';
import { useHostFocus, UseFocusOpts } from './use-focus';
import { Content, Props as ContentProps } from './cosmoz-dropdown-content';

const preventDefault = <T extends Event>(e: T) => e.preventDefault();

export interface Props
	extends UseFocusOpts,
		Pick<ContentProps, 'placement' | 'render'> {}

const style = css`
	.anchor {
		pointer-events: none;
		padding: var(--cosmoz-dropdown-anchor-spacing);
	}
	button {
		border: none;
		cursor: pointer;
		position: relative;
		pointer-events: auto;
		outline: none;
		background: var(
			--cosmoz-dropdown-button-bg-color,
			var(--cosmoz-button-bg-color, #101010)
		);
		color: var(
			--cosmoz-dropdown-button-color,
			var(--cosmoz-button-color, #fff)
		);
		border-radius: var(--cosmoz-dropdown-button-radius, 50%);
		width: var(
			--cosmoz-dropdown-button-width,
			var(--cosmoz-dropdown-button-size, 40px)
		);
		height: var(
			--cosmoz-dropdown-button-height,
			var(--cosmoz-dropdown-button-size, 40px)
		);
		padding: var(--cosmoz-dropdown-button-padding);
	}
	button:hover {
		background: var(
			--cosmoz-dropdown-button-hover-bg-color,
			var(--cosmoz-button-hover-bg-color, #3a3f44)
		);
	}
	::slotted(svg) {
		pointer-events: none;
	}
	@-moz-document url-prefix() {
		#content {
			left: auto;
		}
	}
`;

const Dropdown = (host: HTMLElement & Props) => {
	const { placement, render } = host;
	const anchor = useCallback(
		() => host.shadowRoot!.querySelector('.anchor'),
		[],
	);
	const { active, onToggle } = useHostFocus(host);
	return html` <div class="anchor" part="anchor">
			<button
				@click=${onToggle}
				@mousedown=${preventDefault}
				part="button"
				id="dropdownButton"
			>
				<slot name="button">...</slot>
			</button>
		</div>
		${when(
			active,
			() =>
				html`<cosmoz-dropdown-content
					popover
					id="content"
					part="content"
					exportparts="wrap, content"
					.anchor=${anchor}
					.placement=${placement}
					.render=${render}
					@connected=${(e: Event) => (e.target as HTMLElement).showPopover?.()}
					><slot></slot
				></cosmoz-dropdown-content> `,
		)}`;
};
customElements.define(
	'cosmoz-dropdown',
	component<Props>(Dropdown, { styleSheets: [style] }),
);
export { Dropdown, Content };
