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
				}
			</style>
			<slot></slot>`;
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
