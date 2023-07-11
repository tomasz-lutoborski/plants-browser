export type PostMessageDataResponse = { name: string; family: string }[];
export type PostMessageDataRequest = string[];

export type PostMessageRequest = 'init' | 'search';
export type PostMessageResponse = 'result';

export interface PostMessage<T extends PostMessageDataRequest | PostMessageDataResponse> {
	msg: PostMessageRequest | PostMessageResponse;
	data: T;
	query?: string;
}
