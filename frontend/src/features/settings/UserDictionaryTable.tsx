import React, { useEffect, useState } from 'react';
import { useSetting } from './settingsUtils';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export interface UserDictionaryTable {}

export const UserDictionaryTable: React.FC<UserDictionaryTable> = () => {
  const { setting } = useSetting<{ [key: string]: string }>('Dictionary');

  return (
    <Paper style={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>変換前</TableCell>
              <TableCell>変換後</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(setting || {}).map((before) => (
              <TableRow>
                <TableCell>{before}</TableCell>
                <TableCell>{setting?.[before] || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default UserDictionaryTable;
