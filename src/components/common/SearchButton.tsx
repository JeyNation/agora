"use client";

import { IconButton } from "@mui/material";
import { useCallback } from "react";
import SearchIcon from '@mui/icons-material/Search';

interface SearchButtonProps {
	onSelect: (open: boolean) => void;
}

export default function SearchButton({
	onSelect
}: SearchButtonProps) {
	const handleClick = useCallback(() => {
		onSelect(true);
	}, [onSelect]);

	return (
		<IconButton
			aria-label="open search"
			onClick={() => handleClick()}
			color="inherit"
		>
			<SearchIcon />
		</IconButton>
	);
} 
