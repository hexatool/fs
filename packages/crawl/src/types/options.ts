export const directions = ['down'] as const;
export type CrawlDirection = (typeof directions)[number];

export const resultTypes = ['string', 'Dirent'] as const;
export type ReturnType = (typeof resultTypes)[number];

export interface CommonCrawlerOptions {
	direction: CrawlDirection;
	returnType: ReturnType;
}

export interface CrawlerDownOptions extends CommonCrawlerOptions {
	direction: 'down';
}

// export interface CrawlerUpOptions extends CommonCrawlerOptions {
// 	direction: 'up';
// }

export type CrawlerOptions = CrawlerDownOptions;

export interface DirentCrawlerOptions extends CrawlerOptions {
	returnType: 'Dirent';
}

export interface StringCrawlerOptions extends CrawlerOptions {
	returnType: 'string';
}
