import '../src-old/cosmoz-dropdown';
import { expect, html, fixture, nextFrame } from '@open-wc/testing';

describe('cosmoz-dropdown', () => {
	it('render', async () => {
		const el = await fixture(
			html`<cosmoz-dropdown><a href="#">Test<a/></cosmoz-dropdown>`,
		);
		el.shadowRoot!.querySelector<HTMLButtonElement>('button')!.focus();
		await nextFrame();
		expect(el.shadowRoot!.querySelector('cosmoz-dropdown-content')).to.be.ok;
	});
});
