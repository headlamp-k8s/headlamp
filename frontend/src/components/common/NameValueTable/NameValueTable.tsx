import { Grid, GridProps } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import React from 'react';
import { ValueLabel } from '../Label';

const useStyles = makeStyles(theme => ({
  metadataNameCell: {
    fontSize: '1rem',
    textAlign: 'left',
    maxWidth: '100%',
    minWidth: '10rem',
    verticalAlign: 'top',
    paddingLeft: '0',
    paddingRight: '0',
    color: theme.palette.text.secondary,
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
      color: theme.palette.text.primary,
      fontSize: '1.5rem',
      minWidth: '100%',
      width: '100%',
      maxWidth: '100%',
      display: 'block',
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `none`,
    },
  },
  metadataCell: {
    width: '100%',
    verticalAlign: 'top',
    fontSize: '1rem',
    overflowWrap: 'anywhere',
    paddingBottom: '3.5rem',
    borderBottom: `1px solid ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
      color: theme.palette.text.secondary,
      minWidth: '100%',
      width: '100%',
      maxWidth: '100%',
      display: 'block',
      marginBottom: '2rem',
      borderBottom: `none`,
    },
  },
  metadataRow: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  metadataLast: {
    borderBottom: 'none',
  },
  table: {
    '& .MuiTableBody-root': {
      '& .MuiTableRow-root:last-child': {
        '& .MuiTableCell-root': {
          borderBottom: 'none',
        },
      },
    },
  },
}));

export interface NameValueTableRow {
  /** The name (key) for this row */
  name: string | JSX.Element;
  /** The value for this row */
  value?: string | JSX.Element | JSX.Element[];
  /** Whether this row should be hidden (can be a boolean or a function that will take the
   * @param value and return a boolean) */
  hide?: boolean | ((value: NameValueTableRow['value']) => boolean);
}

export interface NameValueTableProps {
  rows: NameValueTableRow[];
  valueCellProps?: GridProps;
}

function Value({
  value,
}: {
  value: string | JSX.Element | JSX.Element[] | undefined;
}): JSX.Element | null {
  if (typeof value === 'undefined') {
    return null;
  } else if (typeof value === 'string') {
    return <ValueLabel>{value}</ValueLabel>;
  } else if (Array.isArray(value)) {
    return (
      <>
        {value.map((val, i) => (
          <Value value={val} key={i} />
        ))}
      </>
    );
  } else {
    return value;
  }
}

export default function NameValueTable(props: NameValueTableProps) {
  const classes = useStyles();
  const { rows, valueCellProps } = props;

  const visibleRows = React.useMemo(
    () =>
      rows.filter(({ value, hide = false }) => {
        let shouldHide = false;
        if (typeof hide === 'function') {
          shouldHide = hide(value);
        } else {
          shouldHide = hide;
        }

        return !shouldHide;
      }),
    [rows]
  );

  return (
    <Grid
      container
      component="dl" // mount a Definition List
      spacing={3}
    >
      {visibleRows.map(({ name, value, hide = false }, i) => {
        let shouldHide = false;
        if (typeof hide === 'function') {
          shouldHide = hide(value);
        } else {
          shouldHide = hide;
        }

        if (shouldHide) {
          return null;
        }

        const last = visibleRows.length === i + 1;
        const { className, ...otherValueCellProps } = valueCellProps || {};

        return (
          <>
            <Grid
              item
              key={i}
              xs={12}
              sm={4}
              spacing={2}
              component="dt"
              className={clsx(last ? classes.metadataLast : '', classes.metadataNameCell)}
            >
              {name}
            </Grid>
            <Grid
              item
              key={i + 10000}
              xs={12}
              sm={8}
              spacing={2}
              component="dd"
              className={clsx(
                last ? classes.metadataLast : '',
                classes.metadataCell,
                className ? className : ''
              )}
              {...otherValueCellProps}
            >
              <Value value={value} />
            </Grid>
          </>
        );
      })}
    </Grid>
  );
}
