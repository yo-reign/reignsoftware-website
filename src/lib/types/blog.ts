export interface BlogPostMeta {
	title: string;
	description: string;
	date: string;
	published: boolean;
	tags?: string[];
	author?: string;
}

export interface BlogPost {
	slug: string;
	meta: BlogPostMeta;
}
