import { component, useCallback } from '@pionjs/pion';
import { html, nothing, TemplateResult } from 'lit-html';
import { when } from 'lit-html/directives/when.js';
import { ref } from 'lit-html/directives/ref.js';
import { usePosition, Placement } from './use-position';
import { useHostFocus, UseFocusOpts } from './use-focus';

const preventDefault = <T extends Event>(e: T) => e.preventDefault();

interface ContentProps {
	anchor: HTMLElement;
	placement?: Placement;
	render?: () => TemplateResult;
}

const Content = (host: HTMLElement & ContentProps) => {
	const { anchor, placement, render } = host;
	usePosition({ anchor, placement, host });

	return html` <style>
			:host {
				position: fixed;
				left: -9999999999px;
				min-width: 72px;
				box-sizing: border-box;
				padding: var(--cosmoz-dropdown-spacing, 0px);
				z-index: var(--cosmoz-dropdown-z-index, 2);
			}
			.wrap {
				background: var(--cosmoz-dropdown-bg-color, #fff);
				box-shadow: var(
					--cosmoz-dropdown-box-shadow,
					0px 3px 4px 2px rgba(0, 0, 0, 0.1)
				);
			}
			::slotted(*) {
				display: block;
			}
		</style>
		<div class="wrap" part="wrap"><slot></slot>${render?.() || nothing}</div>`;
};

interface DropdownProps
	extends UseFocusOpts,
		Pick<ContentProps, 'placement' | 'render'> {}

const Dropdown = (host: HTMLElement & DropdownProps) => {
	const dialogChanged = (dialog?: HTMLDialogElement) => {
		requestAnimationFrame(() => {
			dialog?.showModal();
		});
	};

	const { placement, render } = host,
		anchor = useCallback(() => host.shadowRoot!.querySelector('.anchor'), []),
		{ active, onToggle } = useHostFocus(host);
	return html` <style>
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

			#content {
				position: absolute;
			}
		</style>
		<div class="anchor" part="anchor">
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
				html`<dialog ${ref(dialogChanged)} id="content">
					<cosmoz-dropdown-content
						part="content"
						exportparts="wrap, content"
						.anchor=${anchor}
						.placement=${placement}
						.render=${render}
					>
						<slot></slot>
					</cosmoz-dropdown-content>
				</dialog>`,
		)}`;
};

const List = () => html`
	<style>
		:host {
			display: contents;
			max-height: var(--cosmoz-dropdown-menu-max-height, calc(96vh - 64px));
			overflow-y: auto;
		}
		::slotted(:not(slot)) {
			display: block;
			--paper-button_-_display: block;
			box-sizing: border-box;
			padding: 10px 24px;
			background: transparent;
			color: var(--cosmoz-dropdown-menu-color, #101010);
			transition:
				background 0.25s,
				color 0.25s;
			border: none;
			cursor: pointer;
			font-size: 14px;
			line-height: 20px;
			text-align: left;
			margin: 0;
			width: 100%;
		}

		::slotted(:not(slot):hover) {
			background: var(
				--cosmoz-dropdown-menu-hover-color,
				var(--cosmoz-selection-color, rgba(58, 145, 226, 0.1))
			);
		}

		::slotted(:not(slot)[disabled]) {
			opacity: 0.5;
			pointer-events: none;
		}
	</style>
	<slot></slot>
`;

type MenuProps = Pick<DropdownProps, 'placement'>;

const Menu = ({ placement }: MenuProps) =>
	html` <cosmoz-dropdown
		.placement=${placement}
		part="dropdown"
		exportparts="anchor, button, content, wrap, dropdown"
	>
		<slot name="button" slot="button"></slot>
		<cosmoz-dropdown-list><slot></slot></cosmoz-dropdown-list>
	</cosmoz-dropdown>`;

customElements.define(
	'cosmoz-dropdown-content',
	component<ContentProps>(Content),
);
customElements.define('cosmoz-dropdown', component<DropdownProps>(Dropdown));
customElements.define('cosmoz-dropdown-list', component(List));
customElements.define('cosmoz-dropdown-menu', component<MenuProps>(Menu));

export { Dropdown, Content };
