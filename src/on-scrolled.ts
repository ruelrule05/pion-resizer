/**
 * Returns all ancestor ShadowRoot elements
 * @param {HTMLElement} el The element
 * @param {HTMLElement} limit The limit to stop searching
 * @returns {ShadowRoot[]} Array of ancestor roots
 */
const ancestorRoots = (el: Element, limit: Element = document.body) => {
	const roots: (Element | ShadowRoot)[] = [];
	let ancestor: Node | Element | null = el;
	while (ancestor && ancestor !== limit) {
		if (ancestor instanceof Element && ancestor.assignedSlot) {
			ancestor = ancestor.assignedSlot;
			continue;
		}
		if (ancestor instanceof ShadowRoot) {
			roots.push(ancestor);
			ancestor = ancestor.host;
			continue;
		}
		ancestor = ancestor.parentNode;
	}
	return roots;
};

/**
 * Listen to a scroll event in a ancestor root
 * @param {HTMLElement} el The element
 * @param {function} handler The event handler
 * @returns {function} Function to cleanup the event listeners
 */
export const onScrolled = <T extends Element>(
	el: T,
	handler: (e: Event) => void
) => {
	const roots = ancestorRoots(el);
	roots.forEach((r) => r.addEventListener('scroll', handler, true));
	return () => {
		roots.forEach((r) => r.removeEventListener('scroll', handler, true));
	};
};
