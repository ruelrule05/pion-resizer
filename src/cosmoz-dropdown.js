import { html, component, useCallback } from 'haunted';
import { usePosition } from './use-position';
import { useHostFocus } from './use-focus';

const preventDefault = e => e.preventDefault(),
	Content = host => {
		usePosition({ anchor: host.anchor, host, placement: host.placement });
		return html` <style>
				:host {
					position: fixed;
					left: -9999999999px;
					min-width: 72px;
					box-sizing: border-box;
					padding: var(--cosmoz-dropdown-spacing, 0px)
				}
				.content {
					background: var(--cosmoz-dropdown-bg-color, #fff);
					box-shadow: var(--cosmoz-dropdown-box-shadow, 0px 3px 4px 2px rgba(0, 0, 0, 0.1));
				}
				::slotted(*) {
					display: block;
				}
			</style>
			<div class="content"><slot></slot></div>`;
	},
	Dropdown = host => {
		const { placement } = host,
			anchor = useCallback(() => host.shadowRoot.querySelector('.anchor'), []),
			{ active, onToggle } = useHostFocus(host);
		return html`
			<style>
				.anchor {
					pointer-events: none;
				}
				button {
					border: none;
					cursor: pointer;
					pointer-events: auto;
					outline: none;
					background: var(--cosmoz-dropdown-button-bg-color, #101010);
					color: var(--cosmoz-dropdown-button-color, #fff);
					border-radius: var(--cosmoz-dropdown-button-radius, 50%);
					width: var(--cosmoz-dropdown-button-width, var(--cosmoz-dropdown-button-size, 40px));
					height: var(--cosmoz-dropdown-button-height, var(--cosmoz-dropdown-button-size, 40px));
				}
			</style>
			<div class="anchor" part="anchor">
				<button @click=${ onToggle } @mousedown=${ preventDefault } part="button">
					<slot name="button">...</slot>
				</button>
			</div>
			${ active
		? html` <cosmoz-dropdown-content part="dropdown" .anchor=${ anchor } .placement=${ placement }>
						<slot></slot>
				  </cosmoz-dropdown-content>`
		: [] }
		`;
	};

customElements.define('cosmoz-dropdown', component(Dropdown));
customElements.define('cosmoz-dropdown-content', component(Content));

export { Dropdown, Content };
