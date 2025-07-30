import {expect, html, fixture, nextFrame} from '@open-wc/testing';

import '../src/PionResizer.ts';

describe('pion-resizer', () => {
	async function sizedFixture(): Promise<HTMLElement> {
		const container = await fixture<HTMLDivElement>(html`
			<div style="width: 800px; height: 600px; padding: 0; margin: 0;">
				<pion-resizer></pion-resizer>
			</div>
		`);
		return container.querySelector('pion-resizer')!;
	}

	it('renders the initial layout with panels and a divider', async () => {
		const el = await fixture<HTMLElement>(html`<pion-resizer></pion-resizer>`);
		const shadowRoot = el.shadowRoot!;

		const leftPanel = shadowRoot.querySelector('#left-panel');
		const rightPanel = shadowRoot.querySelector('#right-panel');
		const divider = shadowRoot.querySelector('#divider');

		expect(leftPanel).to.exist;
		expect(rightPanel).to.exist;
		expect(divider).to.exist;
		expect(el.hasAttribute('is-resizing')).to.be.false;
	});

	it('resizes the left panel on mousemove', async () => {
		const el = await sizedFixture();
		const leftPanel = el.shadowRoot!.querySelector('#left-panel') as HTMLElement;
		const divider = el.shadowRoot!.querySelector('#divider') as HTMLElement;

		divider.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
		await nextFrame();

		const newX = 350;
		document.dispatchEvent(new MouseEvent('mousemove', {clientX: newX}));
		await nextFrame();

		expect(leftPanel.style.getPropertyValue('--left-panel-width')).to.equal(
			`${newX - 8}px` //We need to consider the size of the divider
		);
	});

	it('respects the min-width of the panels when resizing', async () => {
		const el = await sizedFixture();
		const leftPanel = el.shadowRoot!.querySelector('#left-panel') as HTMLElement;
		const rightPanel = el.shadowRoot!.querySelector('#right-panel') as HTMLElement;
		const divider = el.shadowRoot!.querySelector('#divider') as HTMLElement;

		const leftMinWidth = 200;
		const rightMinWidth = 200;

		divider.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
		await nextFrame();

		document.dispatchEvent(new MouseEvent('mousemove', {clientX: 100}));
		await nextFrame();
		expect(leftPanel.style.getPropertyValue('--left-panel-width')).to.equal(
			`${leftMinWidth}px`
		);

		const containerWidth = el.offsetWidth;
		const dividerWidth = divider.offsetWidth;
		const maxLeftWidth = containerWidth - rightMinWidth - dividerWidth;

		document.dispatchEvent(new MouseEvent('mousemove', {clientX: 700}));
		await nextFrame();
		expect(leftPanel.style.getPropertyValue('--left-panel-width')).to.equal(
			`${maxLeftWidth}px`
		);
	});

	it('passes a basic automated accessibility check', async () => {
		const el = await fixture<HTMLElement>(html`<pion-resizer></pion-resizer>`);
		await expect(el).to.be.accessible();
	});
});
