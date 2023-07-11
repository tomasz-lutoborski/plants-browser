import type { PostMessage, PostMessageDataRequest } from './message-type';
import Fuse from 'fuse.js';

let fuse: Fuse<string> = new Fuse([]);

onmessage = ({ data: { data, msg, query } }: MessageEvent<PostMessage<PostMessageDataRequest>>) => {
	let options;
	let result;

	switch (msg) {
		case 'init':
			options = { includeScore: true };
			fuse = new Fuse(data, options);
			break;
		case 'search':
			if (!query) return;
			result = fuse ? fuse.search(query, { limit: 100 }) : [];

			result = result.map((item) => ({
				name: item.item.split(':')[0],
				family: item.item.split(':')[1]
			}));

			postMessage({ msg: 'result', data: result });
			break;
	}
};
