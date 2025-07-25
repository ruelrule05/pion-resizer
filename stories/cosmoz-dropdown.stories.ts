import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from '@pionjs/pion';
import '../src';

const meta: Meta = {
	title: 'Cosmoz Dropdown',
	component: 'cosmoz-dropdown',
};

export default meta;

export type Story = StoryObj;

export const Resizer: Story = {
	render: () => {
		return html`
			<pion-resizer></pion-resizer>
		`;
	}
}
