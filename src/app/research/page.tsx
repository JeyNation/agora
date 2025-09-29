'use client';

import { useSearchParams } from 'next/navigation';

export default function ResearchPage() {
	const searchParams = useSearchParams();
	const ticker = searchParams.get('ticker')?.toUpperCase();

	if (!ticker) {
		return (
			<>
				No ticker symbol provided
			</>
		);
	}

	return (
		<>
			Research: {ticker}
		</>
	);
}