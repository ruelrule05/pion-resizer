export default {
	title: 'Cosmoz Dropdown',
};

import '../src';

const Dropdown = () => `<cosmoz-dropdown>
		<div>Item 1</div>
		<div>Item 2</div>
		<div>Item 3</div>
		<div>Item 4</div>
		<div>Item 5</div>
		<button>Item 6</div>
	</cosmoz-dropdown>`,
	DropdownMenu = () => `<cosmoz-dropdown-menu>
		<div>Item 1</div>
		<div>Item 2</div>
		<div>Item 3</div>
		<div>Item 4</div>
		<div>Item 5</div>
		<a href="#">Achor 1</a>
	</cosmoz-dropdown-menu>`;

export { Dropdown, DropdownMenu };
