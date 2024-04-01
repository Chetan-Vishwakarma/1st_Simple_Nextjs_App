import React, { createContext, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import { FormControl, List, ListItem, ListItemText } from "@mui/material";
import Box from "@mui/material/Box";
import CommanCLS from "../../services/CommanService";
import { memo } from 'react';
import Button from '@mui/material/Button';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
const UserDetailContext = createContext();
// const UserDetailContext = createContext();

const AddClientdetails = React.memo(({ userDetail, setUserDetail,setDataCompanyHouse }) => {
  const [agrno, setAgrNo] = useState(localStorage.getItem("agrno"));
  const [password, setPassword] = useState(localStorage.getItem("Password"));
  const [Email, setEmail] = useState(localStorage.getItem("Email"));
  const [folderId, setFolderId] = useState(localStorage.getItem("FolderId"));
  const baseUrl = "https://docusms.uk/dsdesktopwebservice.asmx/";
  const [folders, setFolders] = useState([]);
  const [bussiness, setBussiness] = useState([]);
  const [sources, setSources] = useState([]);
  const [mangers, setMangers] = useState([]);
  const [defaultUser, setDefaultUser] = useState(null);
  const [defaultStatus, setDefaultStatus] = useState(null);
  const [status, setStatus] = useState([]);
  const [ImportContact, setImportContact] = useState([]);
  const [ImportCompanyDetails, setImportCompanyDetails] = useState([]);
  const [Importdata, setImportdata] = useState("");
  const [intUserid, setIntUserid] = useState(localStorage.getItem("UserId"));
  const clientWebUrl = "https://docusms.uk/dswebclientmanager.asmx/";
  let Cls = new CommanCLS(baseUrl, agrno, Email, password);
  let webClientCLS = new CommanCLS(clientWebUrl, agrno, Email, password);
  // const defaultUser = mangers.find((manager) => manager.UserId == intUserid);
  const clientlist = {
    options: folders,
    getOptionLabel: (option) => option.Folder || "",
  };
  const bussinesslist = {
    options: bussiness,
    getOptionLabel: (option) => option.BussName || "",
  };
  const sourcelist = {
    options: sources,
    getOptionLabel: (option) => option.SourceName || "",
  };
  const userlistdata = {
    options: mangers,
    getOptionLabel: (option) => option.UserName || "",
  };
  const statuslistdata = {
    options: status,
    getOptionLabel: (option) => option.StatusName || "",
  };
  const onChangeclientlist = (event, value) => {
    event.preventDefault();
    if (value) {
      let data = { ...userDetail };
      data = { ...data, ["FolderId"]: value.FolderID };
      setUserDetail(data);
    }
  };
  const onChangebussines = (event, value) => {
    event.preventDefault();
    if (value) {
      let data = { ...userDetail };
      data = { ...data, ["BussId"]: value.BussId };
      setUserDetail(data);
    } else {
    }
  };
  const onChangestatuss = (event, value) => {
    event.preventDefault();
    if (value) {
      let data = { ...userDetail };
      data = { ...data, ["StatusId"]: value.StatusId };
      setDefaultStatus(value);
      setUserDetail(data);
    } else {
    }
  };
  const onChangesource = (event, value) => {
    event.preventDefault();
    if (value) {
      let data = { ...userDetail };
      data = { ...data, ["SourceId"]: value.SourceId };
      setUserDetail(data);
    } else {
    }
  };
  const onChangeuser = (event, value) => {
    event.preventDefault();
    if (value) {
      let data = { ...userDetail };
      data = { ...data, ["UserId"]: value.UserId };
      console.log(defaultUser, "dataOnchange111",value);
        setDefaultUser(value);
      setUserDetail(data);
    } else {
    }
  };

  const onChange = (e) => {
    e.preventDefault();
    let data = { ...userDetail };
    let name = e.target.name;
    let val = e.target.value;
    data = { ...data, [name]: val };
    console.log(data, "dataOnchange", e);
    setUserDetail(data);
  };
  const Json_GetConfiguration = () => {
    let requestBody = {
      agrno: agrno,
      Email: Email,
      password: password,
    };
    try {
      webClientCLS.Json_GetConfiguration(requestBody, (sts, data) => {
        if (sts) {
          if (data) {
            let json = JSON.parse(data);
            console.log("Json_GetConfiguration", json);
            setBussiness(json.Table1);
            setSources(json.Table2);
            setMangers(json.Table3);
            let defaultUser1 = json.Table3.find(
              (manager) => manager.UserId == localStorage.getItem("UserId")
            );
            console.log(defaultUser1,"defaulttManager");
            setDefaultUser(defaultUser1);
            setStatus(json.Table);
          }
        }
      });
    } catch (err) {
      console.log("Error while calling Json_GetClientCardDetails", err);
    }
  };
  const Json_GetFolders = () => {
    let passdata = localStorage.getItem("Password");
    let requestBody = {
      agrno: localStorage.getItem("agrno"),
      Email: localStorage.getItem("Email"),
      password: passdata,
    };
    try {
      Cls.Json_GetFolders(requestBody, (sts, data) => {
        if (sts) {
          if (data) {
            let json = JSON.parse(data);
            setFolders(json.Table);
          }
        }
      });
    } catch (err) {
      console.log("Error while calling Json_GetToFavourites", err);
    }
  };

  const 
  Json_CompanyHouseDetails = (inputValue) => {
    let requestBody = {
      CompanyName_Number:inputValue
    };
    try {
       Cls.Json_CompanyHouseDetails(requestBody, (sts, data) => {
        if (sts) {
          if (data) {
            let json = JSON.parse(data);
            console.log(json,"Json_CompanyHouseDetails");
            let jdata = json.CompanyBasicDetails;
            console.log("Json_CompanyHouseDetails1", jdata);
            let singledata = json.CompanyDetails;
            console.log(singledata,"singledatasingledata");
            // setImportCompanyDetails(singledata[0]);
            // setContactlistdata(json.Table);
            if(jdata.length > 0){
              setImportContact(jdata);
            }
          }
        }
      });
    } catch (err) {
      console.log("Error while calling Json_GetToFavourites", err);
    }
  };
  const 
  Json_CompanyDetails = (inputValue) => {
    let requestBody = {
      CompanyName_Number:inputValue
    };
    try {
       Cls.Json_CompanyHouseDetails(requestBody, (sts, data) => {
        if (sts) {
          if (data) {
            let json = JSON.parse(data);
            console.log(json,"Json_CompanyDetails");
            
            let singledata = json.CompanyDetails[0];
            console.log(singledata,"singledatasingledata");
                const defaultCompanyStatus = singledata.company_status;

// Find the status object corresponding to the default company status
const defaultStatusObject = status.find(status => status.StatusName.toLowerCase() === defaultCompanyStatus.toLowerCase());

// If a matching status object is found, set it as the default status
const defaultStatus = defaultStatusObject || null;
console.log(defaultStatus,"defaultStatus22222",singledata);
    let data1 = { ...userDetail };
    data1 = { 
      ...data1,
      CHNumber: singledata.company_number,
      Clientname:singledata.company_name,
      StatusId:setDefaultStatus(defaultStatus)
      
    };
    setUserDetail(data1);
            // setImportCompanyDetails(singledata[0]);
            setDataCompanyHouse(singledata);
            
          }
        }
      });
    } catch (err) {
      console.log("Error while calling Json_GetToFavourites", err);
    }
  };
  const onChangeImportData = (e) => {
           
    e.preventDefault();
    const inputValue = e.target.value;
    console.log(inputValue,"import_data");
    setImportdata(inputValue);
    Json_CompanyHouseDetails(inputValue);
};

const [txtValue,setTxtValue]=useState(null);
const [open, setOpen] = useState(false);

const handleOptionClick = (id) => {
  console.log(id, "onSelectData");
      setTxtValue(id);
    setOpen(false); 
  // Perform actions with the id
  let data = id.company_number;
  Json_CompanyDetails(id.company_number);
  console.log(data, "onSelectDatacnnumbr");

};

  console.log(Importdata,"Importdata",ImportCompanyDetails)
  useEffect(() => {
    setAgrNo(localStorage.getItem("agrno"));
    setPassword(localStorage.getItem("Password"));
    setEmail(localStorage.getItem("Email"));
    setFolderId(localStorage.getItem("FolderId"));
    setIntUserid(localStorage.getItem("UserId"));
    //   Json_GetClientCardDetails();
    Json_GetFolders();
    Json_GetConfiguration();
   
    // setUserDetail(data);
  }, []);
  return (
    <div>

      <Box className='well'>
        <h2 className="font-14 bold mb-2 text-black">Import from Companies House</h2>
        <Grid container spacing={3} className="mb-">
          <Grid item lg={6} xs={6} md={6}>
          {/* <TextField
                          fullWidth
                          variant="outlined"
                          name="importclient"
                          onChange={onChangeImportData}
                          label="Enter Company Name or Number"
                        /> */}
                        <Autocomplete
      fullWidth
      // options={ImportContact.map((option) => option.title)}
      options={ImportContact} // Pass the entire ImportContact array
      getOptionLabel={(option) => option.title}
      onChange={(e, value) => setImportdata(value)}
      // inputValue={ImportContact}
      noOptionsText="No matches found"
      filterOptions={(x) => x}
      autoComplete
      includeInputInList
    value={txtValue}
    open={open} // Controlled by state
    onOpen={() => setOpen(true)} // Open the Autocomplete dropdown
    onClose={() => setOpen(false)} // Close the Autocomplete dropdown
      renderOption={(props, option) => {
        // Custom rendering for each option
        console.log(option,"rendwered dynamic from apifff",props);
        return (
          <li {...props} 
          onClick={() => {
            
            handleOptionClick(option); // Pass the id directly
          }}
  >
            {/* Your custom rendering */}
            <Grid container alignItems="center">
            
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {option.title}          
              </Grid>
              <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                {option.date_of_creation}
              </Grid>
            </Grid>
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          name="importclient"
          onChange={onChangeImportData}
          label="Enter Company Name or Number"
        />
      )}
    />
          </Grid>
          <Grid item lg={6} xs={6} md={6} className="d-flex align-items-center">
            <Button className="min-width-auto text-danger">
              <HighlightOffIcon className="font-32"/>
            </Button>
          </Grid>
          {/* {ImportContact && ImportContact.length > 0 && (
            <List >
              {ImportContact.map((item, index) => (
                // !item.resigned_on && ( // Add this condition
                <ListItem key={index} button
                onClick={() => handleListItemClick(item)}
                >
                 
                  <ListItemText primary={item.title}/>
                  <ListItemText secondary={item.date_of_creation} />
                 
                </ListItem>
              // )
              ))}
            </List>
          )} */}
          {/* <Grid item lg={6} xs={6} md={6} className="d-flex align-items-center">
            <FormControlLabel control={<Checkbox />} label="Active" />
          </Grid> */}
        </Grid>
      </Box>

      <Grid container spacing={3} className="mt-2">
      <Grid item lg={4} xs={6} md={6}>
          <TextField
            fullWidth
            id="CHNumber"
            label="CH Number"
            variant="outlined"
            name="CHNumber"
            value={userDetail.CHNumber}
            disabled={true}
            // onChange={onChange}
          />
        </Grid>
        <Grid item lg={4} xs={6} md={6}>
          <TextField
            fullWidth
            id="standard-basic-client"
            label="Client Name"
            variant="outlined"
            name="Clientname"
            value={userDetail.Clientname}
            onChange={onChange}
          />
        </Grid>

        <Grid item lg={4} xs={6} md={6}>
          <TextField
            fullWidth
            id="standard-basic-id"
            label="Client ID"
            variant="outlined"
            name="Clientid"
            value={userDetail.Clientid}
            onChange={onChange}
          />
        </Grid>

        <Grid item lg={4} xs={6} md={6}>
          <Autocomplete
            {...clientlist}
            id="clientlist"
            clearOnEscape
            onChange={onChangeclientlist}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                name="Selectclient"
                value={userDetail.Selectclient}
                onChange={onChange}
                label="Client List"
              />
            )}
          />
        </Grid>
        <Grid item lg={4} xs={6} md={6}>
          <FormControl fullWidth variant="outlined">
            <Autocomplete
              {...bussinesslist}
              id="clear-on-escape-bussiness"
              clearOnEscape
              onChange={onChangebussines}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="Bussiness"
                  value={userDetail.Bussiness}
                  onChange={onChange}
                  label="Bussiness"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item lg={4} xs={6} md={6}>
          <FormControl fullWidth variant="outlined">
            <Autocomplete
              // {...statuslistdata}
              options={status}
              getOptionLabel={(option) => option.StatusName}
              value={defaultStatus || null}
              id="clear-on-escape-status"
              clearOnEscape
              onChange={onChangestatuss}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="Status"
                  value={userDetail.Status}
                  onChange={onChange}
                  label="Status"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item lg={4} xs={6} md={6}>
          <FormControl fullWidth variant="outlined">
            <Autocomplete
              {...sourcelist}
              id="clear-on-escape-source"
              clearOnEscape
              onChange={onChangesource}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="Source"
                  value={userDetail.Source}
                  onChange={onChange}
                  label="Source"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item lg={4} xs={6} md={6}>
          <FormControl fullWidth variant="outlined">
            <Autocomplete
              key={`uniques-manager`}
              options={mangers}
              getOptionLabel={(option) => option.UserName}
              value={defaultUser || null}
              onChange={onChangeuser}
              clearOnEscape
              renderInput={(params) => (
                <TextField
                  {...params}
                  key={`textfield`}
                  name="Manager"
                  // onChange={onChange}
                  label="Manager"
                  variant="outlined"
                />
              )}
            />
          </FormControl>
        </Grid>
        <Grid item lg={4} xs={6} md={6}>
          <TextField
            fullWidth
            id="standard-basic"
            type="number"
            label="Mobile"
            variant="outlined"
            name="Mobile"
            value={userDetail.Mobile}
            onChange={onChange}
          />
        </Grid>
        <Grid item lg={4} xs={6} md={6}>
          <TextField
            fullWidth
            id="standard-basic"
            type="number"
            label="Telephone"
            variant="outlined"
            name="Telephone"
            value={userDetail.Telephone}
            onChange={onChange}
          />
        </Grid>
        <Grid item lg={4} xs={6} md={6}>
          <TextField
            fullWidth
            id="standard-basic"
            label="Email"
            variant="outlined"
            name="Email"
            value={userDetail.Email}
            onChange={onChange}
          />
        </Grid>
      </Grid>
    </div>
  );
});
export default memo(AddClientdetails);

