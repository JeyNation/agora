"use client";

import React from 'react';
import { Box, InputBase, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchBar } from '../../styles/components';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  fullWidth?: boolean;
  minWidth?: number | string;
  maxWidth?: number | string;
  autoFocus?: boolean;
  'data-testid'?: string;
}

export default function SearchInput({
  placeholder = 'Search...',
  value = '',
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  fullWidth = false,
  minWidth,
  maxWidth,
  autoFocus = false,
  'data-testid': testId,
}: SearchInputProps) {
  return (
    <Box sx={searchBar.input.container({ fullWidth, minWidth, maxWidth })}>
      <InputBase
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        autoFocus={autoFocus}
        data-testid={testId}
        sx={searchBar.input.base}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon sx={searchBar.input.icon} />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search input',
        }}
      />
    </Box>
  );
}