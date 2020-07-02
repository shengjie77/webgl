
export function resolvePanoUrl(url: string) {
	return 'r|l|u|d|f|b'
		.split('|')
		.map(face => `${url}_${face}`)
}
