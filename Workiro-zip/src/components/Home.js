import React from 'react'
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "../redux/reducers/counterSlice";
import { Box, Typography } from '@mui/material';
import user from "../images/user.jpg";
import pin from "../images/icons/star.svg";
import Button from "@mui/material/Button";

import Stack from '@mui/material/Stack';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
// search
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';


import { useAutocomplete } from '@mui/base/useAutocomplete';
import { styled } from '@mui/system';

const options = ['Firefox', 'Google Chrome', 'Microsoft Edge', 'Safari', 'Opera'];


function Home() {
  const data = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();


  const [value, setValue] = React.useState(options[0]);
  const [inputValue, setInputValue] = React.useState('');

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    focused,
  } = useAutocomplete({
    id: 'controlled-state-demo',
    options,
    value,
    onChange: (event, newValue) => setValue(newValue),
    inputValue,
    onInputChange: (event, newInputValue) => setInputValue(newInputValue),
  });

  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box className='container'>
      <Box className='row'>
        <Box className='col-lg-11 m-auto'>

          <Box className='d-flex main-search-box'>

            <Box className="search-box">
              <Layout>
                <AutocompleteWrapper>
                  <AutocompleteRoot
                    {...getRootProps()}
                    className={focused ? 'Mui-focused' : ''}>
                    <span class="material-symbols-outlined search-icon">search</span>

                    <Input {...getInputProps()} placeholder='Search' className='ps-0' />
                  </AutocompleteRoot>
                  {groupedOptions.length > 0 && (
                    <Listbox {...getListboxProps()}>
                      {groupedOptions.map((option, index) => (
                        <Option {...getOptionProps({ option, index })}>{option}</Option>
                      ))}
                    </Listbox>
                  )}
                </AutocompleteWrapper>
              </Layout>
            </Box>

            <Box className="dropdown-box ms-4">
              <Button className='btn-select'>Select Folder</Button>
              {/* <Box className="btn-Select">
                <Button className='btn-white'>Folder 1</Button>
                <Button className='btn-white'>Folder 2</Button>
                <Button className='btn-white'>Folder 3</Button>
                <Button className='btn-white'>Folder 4</Button>
                <Button className='btn-white'>Folder 5</Button>
              </Box> */}
            </Box>

            <Box className="dropdown-box ms-4">
              <Button className='btn-select'>All</Button>
              {/* <Box className="btn-list-box btn-Select">
                <Button className='btn-list'>All</Button>
                <Button className='btn-list'>Client Only</Button>
                <Button className='btn-list'>Contact Only</Button>
              </Box> */}
            </Box>

            <Box className="dropdown-box ms-4">
              <Box>
                <Fab size="small" className='btn-plus' aria-label="add">
                  <AddIcon />
                </Fab>
              </Box>

              <Box className="btn-Select color-pic-box">
                <Box className='clearfix'>

                  <Box className='clearfix'>
                    <Typography variant='Body1' className='ps-1'>Filter:</Typography>
                    <Box className="mb-2">
                      <Button className='btn-white'>key: value <span class="material-symbols-outlined font-16 text-danger">
                        close
                      </span></Button>

                      <Fab size="small" className='btn-plus  ms-2' aria-label="add">
                        <AddIcon />
                      </Fab>

                      {/* <Fab size="small" className='btn-small-plus ms-2' aria-label="add">
                        <AddIcon />
                      </Fab> */}
                    </Box>


                    <div className='row'>
                      <div className='col-md-4'>
                        <div className='mb-2'>
                          <label>Select Property</label>
                          <select class="form-select" aria-label="Default select example">
                            <option selected>Select Property</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-md-4 px-0'>
                        <div className='mb-2'>
                          <label>Value</label>
                          <input type="text" class="form-control" placeholder="Type Value" />
                        </div>
                      </div>
                      <div className='col-md-4'>
                        <Box className='clearfix'>
                          <Typography variant='Body1' className='mb-1'>Labels</Typography>

                          <Box className="color-box">
                            <button type='button' className='btn-color selected' style={{ backgroundColor: '#32ceff' }}></button>
                            <button type='button' className='btn-color' style={{ backgroundColor: '#ff3da6' }}></button>
                            {/* <button type='button' className='btn-color' style={{ backgroundColor: '#4780FF' }}><span class="material-symbols-outlined">
                              add
                            </span></button> */}
                          </Box>
                        </Box>
                      </div>

                    </div>


                    <div className='mt-2'>
                      <Button variant="contained" size='small' color="success">
                        <span class="material-symbols-outlined">
                          add
                        </span> Add
                      </Button>
                    </div>







                  </Box>

                  {/* <Box className='clearfix'>
                    <Typography variant='Body1' className='ps-1'>Labels</Typography>
                    <Box>
                      <Button className='btn-white'>Filter 1</Button>
                      <Button className='btn-white'>Filter 2</Button>

                      <Fab size="small" className='btn-small-plus ms-2' aria-label="add">
                        <AddIcon />
                      </Fab>
                    </Box>
                  </Box> */}

                  {/* <Box className='clearfix ps-4'>
                    <Typography variant='Body1' className='mb-1'>Labels</Typography>

                    <Box className="color-box">
                      <button type='button' className='btn-color' style={{ backgroundColor: '#32ceff' }}></button>
                      <button type='button' className='btn-color' style={{ backgroundColor: '#ff3da6' }}></button>
                      <button type='button' className='btn-color' style={{ backgroundColor: '#4780FF' }}><span class="material-symbols-outlined">
                        add
                      </span></button>
                    </Box>
                  </Box> */}



                </Box>
              </Box>

            </Box>
          </Box>


          <Box className='row'>
            <Box className='col-lg-3'>
              <Box className='client-box'>
                <img src={pin} className='pin-img' />
                <Box className='client-img'>
                  <img src={user} />
                </Box>
                <Typography variant="h2">Patrick Jo.</Typography>
                <Typography variant='h4'>Admin</Typography>
                <Typography variant='body1' className='mb-0'>patrick_joe@yahoo.com</Typography>
                <Box className='color-filter-box mt-3'>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#d80505", borderColor: "#d80505" }}>Red</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#3b7605", borderColor: "#3b7605" }}>Green</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#01018d", borderColor: "#01018d" }}>Blue</Typography>
                </Box>
              </Box>
            </Box>
            {/* col box end */}

            <Box className='col-lg-3'>
              <Box className='client-box'>
                <Box className='client-img'>
                  <img src={user} />
                </Box>
                <Typography variant="h2">Patrick Jo.</Typography>
                <Typography variant='h4'>Admin</Typography>
                <Typography variant='body1' className='mb-0'>patrick_joe@yahoo.com</Typography>
                <Box className='color-filter-box mt-3'>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#d80505", borderColor: "#d80505" }}>Red</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#3b7605", borderColor: "#3b7605" }}>Green</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#01018d", borderColor: "#01018d" }}>Blue</Typography>
                </Box>
              </Box>
            </Box>
            {/* col box end */}

            <Box className='col-lg-3'>
              <Box className='client-box'>
                <Box className='client-img'>
                  <img src={user} />
                </Box>
                <Typography variant="h2">Patrick Jo.</Typography>
                <Typography variant='h4'>Admin</Typography>
                <Typography variant='body1' className='mb-0'>patrick_joe@yahoo.com</Typography>
                <Box className='color-filter-box mt-3'>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#d80505", borderColor: "#d80505" }}>Red</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#3b7605", borderColor: "#3b7605" }}>Green</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#01018d", borderColor: "#01018d" }}>Blue</Typography>
                </Box>
              </Box>
            </Box>
            {/* col box end */}

            <Box className='col-lg-3'>
              <Box className='client-box'>
                <Box className='client-img'>
                  <img src={user} />
                </Box>
                <Typography variant="h2">Patrick Jo.</Typography>
                <Typography variant='h4'>Admin</Typography>
                <Typography variant='body1' className='mb-0'>patrick_joe@yahoo.com</Typography>
                <Box className='color-filter-box mt-3'>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#d80505", borderColor: "#d80505" }}>Red</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#3b7605", borderColor: "#3b7605" }}>Green</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#01018d", borderColor: "#01018d" }}>Blue</Typography>
                </Box>
              </Box>
            </Box>
            {/* col box end */}


            <Box className='col-lg-3'>
              <Box className='client-box'>
                <Box className='client-img'>
                  <img src={user} />
                </Box>
                <Typography variant="h2">Patrick Jo.</Typography>
                <Typography variant='h4'>Admin</Typography>
                <Typography variant='body1' className='mb-0'>patrick_joe@yahoo.com</Typography>
                <Box className='color-filter-box mt-3'>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#d80505", borderColor: "#d80505" }}>Red</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#3b7605", borderColor: "#3b7605" }}>Green</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#01018d", borderColor: "#01018d" }}>Blue</Typography>
                </Box>
              </Box>
            </Box>
            {/* col box end */}

            <Box className='col-lg-3'>
              <Box className='client-box'>
                <Box className='client-img'>
                  <img src={user} />
                </Box>
                <Typography variant="h2">Patrick Jo.</Typography>
                <Typography variant='h4'>Admin</Typography>
                <Typography variant='body1' className='mb-0'>patrick_joe@yahoo.com</Typography>
                <Box className='color-filter-box mt-3'>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#d80505", borderColor: "#d80505" }}>Red</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#3b7605", borderColor: "#3b7605" }}>Green</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#01018d", borderColor: "#01018d" }}>Blue</Typography>
                </Box>
              </Box>
            </Box>
            {/* col box end */}


            <Box className='col-lg-3'>
              <Box className='client-box'>
                <Box className='client-img'>
                  <img src={user} />
                </Box>
                <Typography variant="h2">Patrick Jo.</Typography>
                <Typography variant='h4'>Admin</Typography>
                <Typography variant='body1' className='mb-0'>patrick_joe@yahoo.com</Typography>
                <Box className='color-filter-box mt-3'>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#d80505", borderColor: "#d80505" }}>Red</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#3b7605", borderColor: "#3b7605" }}>Green</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#01018d", borderColor: "#01018d" }}>Blue</Typography>
                </Box>
              </Box>
            </Box>
            {/* col box end */}

            <Box className='col-lg-3'>
              <Box className='client-box'>
                <Box className='client-img'>
                  <img src={user} />
                </Box>
                <Typography variant="h2">Patrick Jo.</Typography>
                <Typography variant='h4'>Admin</Typography>
                <Typography variant='body1' className='mb-0'>patrick_joe@yahoo.com</Typography>
                <Box className='color-filter-box mt-3'>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#d80505", borderColor: "#d80505" }}>Red</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#3b7605", borderColor: "#3b7605" }}>Green</Typography>
                  <Typography variant='span' className='color-filter-row' style={{ color: "#01018d", borderColor: "#01018d" }}>Blue</Typography>
                </Box>
              </Box>
            </Box>
            {/* col box end */}


          </Box>
        </Box>
      </Box>
    </Box>
  )
}


const blue = {
  100: '#DAECFF',
  200: '#99CCF3',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const AutocompleteWrapper = styled('div')`
  position: relative;
`;

const AutocompleteRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
    };
  display: flex;
  gap: 5px;
  padding-right: 5px;
  overflow: hidden;
  width: 320px;

  &.Mui-focused {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
  }

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus-visible {
    outline: 0;
  }
`,
);

const Input = styled('input')(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
  flex: 1 0 auto;
`,
);

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  max-width: 320px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  max-height: 300px;
  z-index: 1;
  position: absolute;
  left: 0;
  right: 0;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 6px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
    };
  `,
);

const Option = styled('li')(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
  }

  &[aria-selected=true] {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }

  &.base--focused,
  &.base--focusVisible {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }

  &.base--focusVisible {
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
  }

  &[aria-selected=true].base--focused,
  &[aria-selected=true].base--focusVisible {
    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};
  }
  `,
);

const Layout = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  gap: 4px;
`;

const Pre = styled('pre')(({ theme }) => ({
  margin: '0.5rem 0',
  fontSize: '0.75rem',
  '& code': {
    backgroundColor: theme.palette.mode === 'light' ? grey[100] : grey[900],
    border: '1px solid',
    borderColor: theme.palette.mode === 'light' ? grey[300] : grey[700],
    color: theme.palette.mode === 'light' ? '#000' : '#fff',
    padding: '0.125rem 0.25rem',
    borderRadius: 3,
  },
}));



export default Home
