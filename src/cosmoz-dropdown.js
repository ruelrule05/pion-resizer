import { html, component, useCallback, useEffect } from 'haunted';
import { usePosition } from './use-position';
import { useFocus } from './use-focus';

const preventDefault = e => e.preventDefault(),
	fevs = ['focusin', 'focusout'],
	Content = host => {
		usePosition({ anchor: host.anchor, host });
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
		const { active, onFocus, onToggle } = useFocus(host),
			anchor = useCallback(() => host.shadowRoot.querySelector('.anchor'), []);
		useEffect(() => {
			host.setAttribute('tabindex', '-1');
			fevs.forEach(ev => host.addEventListener(ev, onFocus));
			return () => {
				fevs.forEach(ev => host.removeEventListener(ev, onFocus));
			};
		}, []);
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
		? html` <cosmoz-dropdown-content .anchor=${ anchor } part="dropdown">
						<slot></slot>
				  </cosmoz-dropdown-content>`
		: [] }
		`;
	};

customElements.define('cosmoz-dropdown', component(Dropdown));
customElements.define('cosmoz-dropdown-content', component(Content));

export { Dropdown, Content };
