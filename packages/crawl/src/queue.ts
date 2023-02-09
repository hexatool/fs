import type { CrawlerState } from './crawler';

export type OnQueueEmptyCallback = (error: Error | undefined, output: CrawlerState) => void;

/**
 * This is a custom stateless queue to track concurrent async fs calls.
 * It increments a counter whenever a call is queued and decrements it
 * as soon as it completes. When the counter hits 0, it calls onQueueEmpty.
 */
export class CrawlerQueue {
	private count = 0;

	constructor(private readonly onQueueEmpty: OnQueueEmptyCallback) {}

	dequeue(error: Error | undefined, output: CrawlerState): void {
		if (--this.count === 0 || error) {
			this.onQueueEmpty(error, output);
		}
	}

	enqueue(): void {
		this.count++;
	}
}
