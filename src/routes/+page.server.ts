import jsonData from './data.json' assert { type: 'json' };

// Fetch the data from JSON file
export async function load() {
	return { jsonData };
}
