declare global {
	interface HTMLElement {
		connectedCallback(): void;
		disconnectedCallback(): void;
	}
}

export const connectable = (base = HTMLElement) =>
	class extends base {
		connectedCallback() {
			super.connectedCallback?.();
			this.dispatchEvent(new CustomEvent('connected'));
		}
		disconnectedCallback() {
			super.disconnectedCallback?.();
			this.dispatchEvent(new CustomEvent('disconnected'));
		}
	};
