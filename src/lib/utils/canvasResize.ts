/**
 * Canvas resize utility that prevents unnecessary visualization restarts.
 *
 * On mobile devices, browser chrome (URL bars, toolbars) appearing/disappearing
 * triggers resize events. This utility:
 * 1. Only resizes canvas when dimensions change significantly (prevents canvas clearing)
 * 2. Debounces resize to prevent rapid-fire restarts
 * 3. Uses higher threshold for height changes (mobile browser chrome)
 */

export interface CanvasResizeOptions {
	/** Minimum width change (px) to trigger resize. Default: 10 */
	widthThreshold?: number;
	/** Minimum height change (px) to trigger resize. Default: 100 (accounts for mobile browser chrome) */
	heightThreshold?: number;
	/** Debounce delay (ms) for resize. Default: 150 */
	debounceMs?: number;
}

export interface CanvasResizeHandler {
	/** Call on window resize events */
	handleResize: () => void;
	/** Call once on mount to set initial dimensions and initialize */
	init: () => void;
	/** Call on unmount to cleanup timers */
	destroy: () => void;
}

/**
 * Creates a resize handler that intelligently filters resize events.
 *
 * Key insight: Setting canvas.width or canvas.height CLEARS the canvas.
 * So we must only resize when truly necessary, not on every resize event.
 *
 * @param getCanvas - Function returning the canvas element
 * @param getCtx - Function returning the 2D context
 * @param onDimensionsChange - Called when canvas is actually resized (for updating bounds)
 * @param onReinit - Called after resize to reinitialize visualization state
 * @param options - Configuration options
 */
export function createCanvasResizeHandler(
	getCanvas: () => HTMLCanvasElement | null,
	getCtx: () => CanvasRenderingContext2D | null,
	onDimensionsChange: (width: number, height: number) => void,
	onReinit: () => void,
	options: CanvasResizeOptions = {}
): CanvasResizeHandler {
	const { widthThreshold = 10, heightThreshold = 100, debounceMs = 150 } = options;

	let lastWidth = 0;
	let lastHeight = 0;
	let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

	/**
	 * Updates canvas dimensions for proper DPR-aware rendering.
	 * IMPORTANT: This clears the canvas, so only call when necessary.
	 */
	function updateCanvasDimensions(width: number, height: number): void {
		const canvas = getCanvas();
		const ctx = getCtx();
		if (!canvas || !ctx) return;

		const dpr = window.devicePixelRatio || 1;

		// Set physical pixel dimensions (this clears the canvas!)
		canvas.width = width * dpr;
		canvas.height = height * dpr;

		// Reset transform and scale for DPR
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.scale(dpr, dpr);
	}

	function handleResize() {
		const canvas = getCanvas();
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const newWidth = rect.width;
		const newHeight = rect.height;

		// Check if change exceeds thresholds
		const widthChanged = Math.abs(newWidth - lastWidth) >= widthThreshold;
		const heightChanged = Math.abs(newHeight - lastHeight) >= heightThreshold;

		// Only resize if change is significant
		if (!widthChanged && !heightChanged) {
			return; // Ignore small changes (like mobile browser chrome)
		}

		// Debounce the actual resize to prevent rapid-fire during drag resize
		if (debounceTimeout) clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => {
			// Re-check dimensions in case they changed during debounce
			const currentRect = canvas.getBoundingClientRect();
			const currentWidth = currentRect.width;
			const currentHeight = currentRect.height;

			// Update stored dimensions
			lastWidth = currentWidth;
			lastHeight = currentHeight;

			// Now actually resize canvas (this clears it)
			updateCanvasDimensions(currentWidth, currentHeight);

			// Notify about new dimensions
			onDimensionsChange(currentWidth, currentHeight);

			// Reinitialize visualization
			onReinit();

			debounceTimeout = null;
		}, debounceMs);
	}

	function init() {
		const canvas = getCanvas();
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		lastWidth = rect.width;
		lastHeight = rect.height;

		// Initial resize and init (no debounce on mount)
		updateCanvasDimensions(rect.width, rect.height);
		onDimensionsChange(rect.width, rect.height);
		onReinit();
	}

	function destroy() {
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
			debounceTimeout = null;
		}
	}

	return { handleResize, init, destroy };
}
