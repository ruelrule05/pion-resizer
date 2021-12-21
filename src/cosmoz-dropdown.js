import { component, useCallback } from 'haunted';
import { html, nothing } from 'lit-html';
import { usePosition } from './use-position';
import { useHostFocus } from './use-focus';

const preventDefault = e => e.preventDefault(),
	Content = host => {
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
				.content {
					background: var(--cosmoz-dropdown-bg-color, #fff);
					box-shadow: var(--cosmoz-dropdown-box-shadow, 0px 3px 4px 2px rgba(0, 0, 0, 0.1));
				}
				::slotted(*) {
					display: block;
				}
			</style>
			<div class="content" part="content"><slot></slot>${ render?.() || nothing }</div>`;
	},
	Dropdown = host => {
		const { placement, render } = host,
			anchor = useCallback(() => host.shadowRoot.querySelector('.anchor'), []),
			{ active, onToggle } = useHostFocus(host);
		return html`
			<style>
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
					background: var(--cosmoz-dropdown-button-bg-color, var(--cosmoz-button-bg-color, #101010));
					color: var(--cosmoz-dropdown-button-color, var(--cosmoz-button-color, #fff));
					border-radius: var(--cosmoz-dropdown-button-radius, 50%);
					width: var(--cosmoz-dropdown-button-width, var(--cosmoz-dropdown-button-size, 40px));
					height: var(--cosmoz-dropdown-button-height, var(--cosmoz-dropdown-button-size, 40px));
					padding: var(--cosmoz-dropdown-button-padding);
				}
				button:hover {
					background: var(--cosmoz-dropdown-button-hover-bg-color, var(--cosmoz-button-hover-bg-color, #3A3F44));
				}
			</style>
			<div class="anchor" part="anchor">
				<button @click=${ onToggle } @mousedown=${ preventDefault } part="button">
					<slot name="button">...</slot>
				</button>
			</div>
			${ active || 1 && html`
			<cosmoz-dropdown-content id="dropdown" part="dropdown" .anchor=${ anchor } .placement=${ placement } .render=${ render }>
				<slot></slot>
			</cosmoz-dropdown-content>` || [] }
		`;
	},
	List = () => html`
		<style>
			:host { display: contents; }
			::slotted(:not(slot)) {
				display: block;
				--paper-button_-_display: block;
				padding: 10px 24px;
				background: transparent;
				color: var(--cosmoz-dropdown-menu-color, #101010);
				transition: background 0.25s, color 0.25s;
				border: none;
				cursor: pointer;
				font-size: 14px;
				line-height: 20px;
				text-align: left;
				margin: 0;
				width: 100%;
			}
			::slotted(:not(slot):hover) {
				background: var(--cosmoz-dropdown-menu-hover-color, var(--cosmoz-selection-color, rgba(58, 145, 226, 0.1)));
			}

			::slotted(:not(slot)[disabled]) {
				opacity: 0.5;
				pointer-events: none;
			}
		</style>
		<slot></slot>
	`,
	Menu = host => html`
		<cosmoz-dropdown .placement=${ host.placement }>
			<slot name="button" slot="button"></slot>
			<cosmoz-dropdown-list><slot></slot></cosmoz-dropdown-list>
		</cosmoz-dropdown>`;

customElements.define('cosmoz-dropdown-content', component(Content));
customElements.define('cosmoz-dropdown', component(Dropdown));
customElements.define('cosmoz-dropdown-list', component(List));
customElements.define('cosmoz-dropdown-menu', component(Menu));

export { Dropdown, Content };
