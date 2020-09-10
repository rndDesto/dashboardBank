import React from 'react'
import PropTypes from 'prop-types';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'

const DataTable = ({ column, data }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {column.map((data, index) => {
              return (
                <TableCell key={`${index}`} align="center">{data.heading}</TableCell>
              )
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => {
            return (
              <TableRow key={`${index}`}>
                {column.map((cItem, cIdx) => {
                  const { value } = cItem;
                  const newValue = typeof value === 'function' ? value(item) : item[value];

                  return (
                    <TableCell align="center" key={cIdx}>
                      {newValue || '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

DataTable.defaultProps = {
  column: [],
  data: [],
};

DataTable.propTypes = {
  column: PropTypes.array,
  item: PropTypes.array,
};

export default DataTable
