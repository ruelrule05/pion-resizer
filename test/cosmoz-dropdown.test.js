import '../src/cosmoz-dropdown';
import { expect, html, fixture, nextFrame } from '@open-wc/testing';

before(() => {
	const e = window.onerror;
	window.onerror = function (err) {
		if (err.startsWith('ResizeObserver loop')) {
			// eslint-disable-next-line no-console
			console.warn(`[ignored] ${ err }`);
			return false;
		}
		return e(...arguments);
	};
});

describe('cosmoz-autocomplete-ui', () => {
	it('render', async () => {
		const el = await fixture(html`<cosmoz-dropdown><a href="#">Test<a/></cosmoz-dropdown>`);
		el.shadowRoot.querySelector('button').focus();
		await nextFrame();
		expect(el.shadowRoot.querySelector('cosmoz-dropdown-content')).to.be.ok;
	});
});
