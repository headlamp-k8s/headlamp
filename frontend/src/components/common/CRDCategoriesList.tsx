import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useDispatch } from 'react-redux';
import CRD from '../../lib/k8s/crd';
import { removeCategoryFilter,setCategoryFilter } from '../../redux/filterSlice'; // Import the action to set the category filter
import { useTypedSelector } from '../../redux/reducers/reducers'; // Import the hook to access the Redux store's state

// Define CRDCategoriesList component
export function CRDCategoriesList() {
  // Fetch list of CRDs and handle potential errors
  const [crds, error] = CRD.useList();
  const dispatch = useDispatch();
  const filter = useTypedSelector(state => state.filter); // Access the filter state

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!crds) {
    return <div>Loading...</div>;
  }

  // Extract categories from the fetched CRDs and put em in lowercase for facilitating filtering
  const categories = Array.from(
    new Set(
      crds
        .flatMap((crd: { jsonData: any }) => crd.jsonData!.status.acceptedNames.categories || [])
        .map(category => category.toLowerCase())
    )
  );

  const filteredCategories = categories.filter((category: string) =>
    filter.categories.includes(category)
  );
  console.log('value : ', filteredCategories);

  const handleChange = (event: any, newValue: string) => {
    if (filteredCategories.includes(newValue)) {
      // If the category is already selected, remove it from the filter
      dispatch(removeCategoryFilter(newValue));
    } else {
      // If the category is not selected, add it to the filter
      dispatch(setCategoryFilter(newValue)); // Dispatch an action to update the filter state
    }
  };

  // Render Autocomplete component to select categories
  return (
    <Box width="15rem">
      <Autocomplete
        autoComplete
        value={filteredCategories} // Use the categories from the filter state
        onChange={handleChange} // Handle change in selected categories
        options={categories}
        isOptionEqualToValue={(option, value) => value.includes(option)}
        getOptionLabel={option => option.toString()}
        /*
                isOptionEqualToValue={filter.categories.some(shit => filteredCategories.includes(shit))}
*/
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox checked={selected} />
            {option}
          </li>
        )}
        renderInput={params => (
          <TextField
            {...params}
            variant="standard"
            label={'Categories'}
            fullWidth
            InputLabelProps={{ shrink: true }}
            style={{ marginTop: 0 }}
            placeholder="Filter"
          />
        )}
      />
    </Box>
  );
}
