import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import { FormControl } from "@mui/material";
import { Switch } from "@mui/material";
import CommanCLS from "../../services/CommanService";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from 'react-toastify';
const ContactMainform = React.memo(
  ({ setContact,contact, clientNames, userContactDetails, setContactDetails, contactlistdata,Importcontactdata,setImportcontactdata }) => {
    console.log(contactlistdata, "contactlistdata",Importcontactdata);
    const [agrno, setAgrNo] = useState(localStorage.getItem("agrno"));
    const [password, setPassword] = useState(localStorage.getItem("Password"));
    const [Email, setEmail] = useState(localStorage.getItem("Email"));
    const [folderId, setFolderId] = useState(localStorage.getItem("FolderId"));
    const [Dataset, setDataset] = useState("");
    const [errors, setErrors] = useState({});
    const [checkboxfeb, setCheckboxfeb] = useState(false);
    const [advancedSettingChecked, setAdvancedSettingChecked] = useState(false);
    const [advancedInactive, setAdvancedInactive] = useState(false);
    const [createPortal, setCreatePortal] = useState(false);
    const [contactFilled, setContactFilled] = useState(false);
    const [mainCountry, setMainCountry] = useState(
      countries.find((country) => country.label === "United Kingdom")?.label
    );
    const [mangers, setMangers] = useState([]); // State to hold folders data
    const [Roles, setRoles] = useState([]);
    // const defaultUser1 = mangers.find((manager) => manager.UserId == intUserid);
    const [defaultUser, setDefaultUser] = useState(null);
    const baseUrl = "https://docusms.uk/dsdesktopwebservice.asmx/";
    const clientWebUrl = "https://docusms.uk/dswebclientmanager.asmx/";
    let Cls = new CommanCLS(baseUrl, agrno, Email, password);
    let webClientCLS = new CommanCLS(clientWebUrl, agrno, Email, password);
    const Json_GetConfiguration = () => {
      // let passdata = localStorage.getItem("pass");
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
              //   setBussiness(json.Table1);
              //   setSources(json.Table2);
              setMangers(json.Table3);
              setRoles(json.Table4);
              //   setStatus(json.Table);

              let defaultUser1 = json.Table3.find(
                (manager) => manager.UserId == localStorage.getItem("UserId")
              );
              setDefaultUser(defaultUser1);
            }
          }
        });
      } catch (err) {
        console.log("Error while calling Json_GetClientCardDetails", err);
      }
      // CallApi(requestBody, "Json_GetConfiguration", function (res) {
      //   if (res) {
      //     console.log(res, "Json_GetConfiguration");
      //     let str = JSON.parse(JSON.stringify(res));
      //     let json = JSON.parse(str.d);
      //     console.log(json, "Json_GetConfiguration1");
      //     setBussiness(json.Table1);
      //     setSources(json.Table2);
      //     setMangers(json.Table3);
      //     setStatus(json.Table);
      //   } else {

      //   }
      // });
    };
    const userlistdata = {
      options: mangers,
      getOptionLabel: (option) => option.UserName || "",
    };

    const onChange = (e) => {
      e.preventDefault();
      let data = { ...userContactDetails };
      let name = e.target.name;
      let val = e.target.value;
      data = { ...data, [name]: val };
      console.log(data, "dataOnchange", e);
      setContactDetails(data);

      if (name === 'EmailName' && val.trim() !== '') {
        // Check if the email already exists in contactlistdata.EmailID
        const emailExists = contactlistdata.some((contact) => contact.EMailId == val.trim());
        console.log(emailExists, val, "emailExist", contactlistdata);
        if (emailExists) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Email already exists',
          }));
        } else if (!validateEmail(val)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Invalid email address',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '', // Clear error message if validation succeeds or if val is empty
          }));
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: '', // Clear error message if val is empty
        }));
      }
    };
    const validateEmail = (email) => {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const onChangecheckbox = (e) => {
      e.preventDefault();
      let data = { ...userContactDetails };
      let name = e.target.name;
      let val = e.target.checked;
      data = { ...data, [name]: val };
      console.log(data, "dataOnchange", e);

      setContactDetails(data);
      setCheckboxfeb(e.target.checked);
    };
    const onChangeUser = (event, value) => {
      event.preventDefault();
      if (value) {
        // Update the selectedFolderID state with the FolderID of the selected option
        // managerData = value.UserId;
        // setSelectedUserId(value.UserId);
        // console.log(value.UserId, "UserId", selectedUserId);
        let data = { ...userContactDetails };
        data = { ...data, ["MainUserId"]: value.UserId, ["MainUserName"]: value.UserName };
        console.log(defaultUser, "dataOnchange111", value);
        setDefaultUser(value);
        setContactDetails(data);
      } else {
        // If no option is selected, clear the selectedFolderID state
        // setSelectedUserId(null);
      }
    };

    const onChangetitle = (event, value) => {
      event.preventDefault();
      if (value) {
        let data = { ...userContactDetails };
        data = { ...data, ["Title"]: value.label };
        console.log(data, "onChangetitle");
        setContactDetails(data);
      } else {
      }
    };
    const onChangeRoles = (event, value) => {
      event.preventDefault();
      if (value) {
        let data = { ...userContactDetails };
        data = { ...data, ["RolesData"]: value.RoleName };
        console.log(data, "onChangeRoles");
        setContactDetails(data);
      } else {
      }
    };
    const handleInputOnDateChage = (event, value) => {
      // event.preventDefault();

      let date = dayjs(event).format("YYYY/MM/DD");
      let data = { ...userContactDetails };
      data = { ...data, ["BirthDate"]: date };
      console.log(data, "onChangetitle");
      setDataset(date);
      setContactDetails(data);

    };
    const onChangecountry = (event, value) => {
      event.preventDefault();
      if (value) {
        // Update the selectedFolderID state with the FolderID of the selected option
        // managerData = value.UserId;
        // setSelectedUserId(value.UserId);
        // console.log(value.UserId, "UserId", selectedUserId);
        let data = { ...userContactDetails };
        data = { ...data, ["Maincontactcountry"]: value.label };
        console.log(data, "onChangetitle");
        setMainCountry(value.label);
        setContactDetails(data);
      } else {
        // If no option is selected, clear the selectedFolderID state
        // setSelectedUserId(null);
      }
    };
    const handleAdvancedSettingChange = (event) => {
      setAdvancedSettingChecked(event.target.checked);
      let data = { ...userContactDetails };
      let name = event.target.name;
      let val = event.target.checked;
      data = { ...data, [name]: val };
      console.log(data, "dataOnchange", event);
      setContactDetails(data);
    };
    const handleAdvancedInactive = (event) => {
      setAdvancedInactive(event.target.checked);
      let data = { ...userContactDetails };
      let name = event.target.name;
      let val = event.target.checked;
      data = { ...data, [name]: val };
      console.log(data, "dataOnchange", event);
      setContactDetails(data);
    };
    const handleAdvancedCreatePortal = (event) => {
      setCreatePortal(event.target.checked);
      let data = { ...userContactDetails };
      let name = event.target.name;
      let val = event.target.checked;
      data = { ...data, [name]: val };
      console.log(data, "dataOnchange", event);
      setContactDetails(data);
    };
    useEffect(() => {
      setAgrNo(localStorage.getItem("agrno"));
      setPassword(localStorage.getItem("Password"));
      setEmail(localStorage.getItem("Email"));
      setFolderId(localStorage.getItem("FolderId"));
      Json_GetConfiguration();
      console.log(contact, "contactlistsona");
  
      if (contact) {
        // setContactDetails(null);
        setImportcontactdata(null)
          let data2 = { ...userContactDetails };
          data2 = {
              ...data2,
              ["Title"]: contact.Salutation,
              ["FirstName"]: contact.FirstName,
              ["LastName"]: contact.LastName,
              ["ReferenceName"]: "",
              ["MainContact"]: contact.MainContact,
              ["Inactive"]: contact.CActive,
              ["GreetingName"]: contact.Greeting,
              ["EmailName"]: contact.EMailId,
              ["MainUserId"]: -1,
              ["MainLine1Name"]: contact.Add1,
              ["MainLine2Name"]: contact.Add2,
              ["MainLine3Name"]: contact.Add3,
              ["MainTownName"]: contact.Town,
              ["MainPostcodeName"]: contact.PostCode,
              ["Maincontactcountry"]: "",
              ["MainTelephoneName"]: contact.Tel,
              ["MainMobileName"]: contact.Mobile,
              ["mainCountry"]: "",
              ["billingsCountry"]: "",
              ["ragistersCountry"]: "",
              ["ReferenceID"]: clientNames,
              ["BirthDate"]: Dataset
          };
          setContactDetails(data2);
          // setContactFilled(true);
      } 
       if (Importcontactdata) {
        setContact(null);
          let data = { ...userContactDetails };
          data = {
              ...data,
              ["Title"]: Importcontactdata.Salutation,
              ["FirstName"]: Importcontactdata.FirstName,
              ["LastName"]: Importcontactdata.LastName,
              ["ReferenceName"]: "",
              ["MainContact"]: Importcontactdata.MainContact,
              ["Inactive"]: Importcontactdata.CActive,
              ["GreetingName"]: Importcontactdata.Greeting,
              ["EmailName"]: Importcontactdata.EMailId,
              ["MainUserId"]: -1,
              ["MainLine1Name"]: Importcontactdata.address_line_1,
              ["MainLine2Name"]: Importcontactdata.address_line_2,
              ["MainLine3Name"]: Importcontactdata.Add3,
              ["MainTownName"]: Importcontactdata.locality,
              ["MainPostcodeName"]: Importcontactdata.postal_code,
              ["Maincontactcountry"]: "",
              ["MainTelephoneName"]: Importcontactdata.Tel,
              ["MainMobileName"]: Importcontactdata.Mobile,
              ["mainCountry"]: "",
              ["billingsCountry"]: "",
              ["ragistersCountry"]: "",
              ["ReferenceID"]: clientNames,
              ["BirthDate"]: Dataset
          };
          setContactDetails(data);
      }
  }, [contact, Importcontactdata]);
  
    return (
      <div>
        {" "}
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                options={titleData}
                key={`uniques-manager`}
                // value={defaultUser || null}
                onChange={onChangetitle}
                clearOnEscape
                renderInput={(params) => (
                  <TextField
                    {...params}
                    key={`titlemain`}
                    name="Title"
                    // onChange={onChange}
                    label="Title"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`firstnamekey`}
              id="firstnameid"
              variant="outlined"
              label="First Name"
              name="FirstName"
              value={userContactDetails.FirstName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`lastnamekey`}
              id="lastnameid"
              label="Last Name"
              variant="outlined"
              name="LastName"
              value={userContactDetails.LastName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                // options={titleData}
                key={`uniques-roles`}
                options={Roles}
                getOptionLabel={(option) => option.RoleName}
                // value={defaultUser || null}
                onChange={onChangeRoles}
                clearOnEscape
                renderInput={(params) => (
                  <TextField
                    {...params}
                    key={`titlemain`}
                    name="Role"
                    // onChange={onChange}
                    label="Role"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                components={[
                  "DatePicker",
                  "TimePicker",
                  "DateTimePicker",
                  "DateRangePicker",
                ]}
              >

                <DatePicker
                  // dateFormat="DD/MM/YYYY"
                  // value={currentDate}

                  onChange={(e) => handleInputOnDateChage(e)}
                  label="Birth date"
                />

              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          {/* <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Referencekey`}
              id="Referenceid"
              label="Reference Name"
              variant="outlined"
              name="ReferenceName"
              disabled={true}
              value={userContactDetails.ReferenceID}
              onChange={onChange}
            />
          </Grid> */}

          <Grid item xs={6} md={6} className="d-flex flex-wrap align-items-center">
            <FormControlLabel
              key={`inactive`}
              control={
                <Switch
                  name="Inactive"
                  checked={advancedInactive}
                  onChange={handleAdvancedInactive}
                />
              }
              label="In Active"
            />

            <FormControlLabel
              key={`createportal`}
              control={
                <Switch
                  name="CreatePortal"
                  checked={createPortal}
                  onChange={handleAdvancedCreatePortal}
                />
              }
              label="Create Portal"
            />

            <FormControlLabel
              key={`maincheckbox`}
              control={
                <Switch
                  name="MainContact"
                  checked={advancedSettingChecked}
                  onChange={handleAdvancedSettingChange}
                />
              }
              label="Main Contact"
            />

          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Greetingkey`}
              id="Greetingid"
              label="Greeting"
              variant="outlined"
              name="GreetingName"
              value={userContactDetails.GreetingName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Emailkey`}
              id="Emailid"
              label="Email"
              variant="outlined"
              name="EmailName"
              value={userContactDetails.EmailName}
              onChange={onChange}
              error={!!errors['EmailName']} // Set error state based on whether there is an error message
              helperText={errors['EmailName']} // Display error message if there is one    
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <FormControl fullWidth variant="outlined">
              {/* <Autocomplete
                
                id="combo-box-demo"
                
                options={mangers}
                getOptionLabel={(option) => option.UserName}
                renderInput={(params) => <TextField {...params} label="Manager" />}
                className="w-100"
                value={defaultUser}
                onChange={onChangeUser}
              /> */}
              <Autocomplete
                key={`maincontact-manager`}
                options={mangers}
                getOptionLabel={(option) => option.UserName}
                value={defaultUser || null}
                onChange={onChangeUser}
                clearOnEscape
                renderInput={(params) => (
                  <TextField
                    {...params}
                    key={`Managermain`}
                    name="Manager"
                    // onChange={onChangeUser}
                    label="Manager"
                    variant="outlined"
                  />
                )}
              />


            </FormControl>
          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Line1key`}
              id="Line1id"
              label="Line1"
              variant="outlined"
              name="MainLine1Name"
              value={userContactDetails.MainLine1Name}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Line2key`}
              id="Line2id"
              label="Line2"
              variant="outlined"
              name="MainLine2Name"
              value={userContactDetails.MainLine2Name}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Line3key`}
              id="Line3id"
              label="Line3"
              variant="outlined"
              name="MainLine3Name"
              value={userContactDetails.MainLine3Name}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Townkey`}
              id="Townid"
              label="Town"
              variant="outlined"
              name="MainTownName"
              value={userContactDetails.MainTownName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Postcodekey`}
              // type="number"
              id="Postcodeid"
              label="Postcode"
              variant="outlined"
              name="MainPostcodeName"
              value={userContactDetails.MainPostcodeName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                options={countries}
                key={`maincontact-Country`}
                getOptionLabel={(option) => option.label}
                value={countries.find(
                  (country) => country.label === mainCountry
                )}
                onChange={onChangecountry}
                // value={defaultUser || null}
                // onChange={onChangeuser}
                clearOnEscape
                renderInput={(params) => (
                  <TextField
                    {...params}
                    key={`Countrymain`}
                    name="Country"
                    // onChange={onChangecountry}
                    label="Country"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Telephonekey`}
              type="number"
              id="Telephoneid"
              label="Telephone"
              variant="outlined"
              name="MainTelephoneName"
              value={userContactDetails.MainTelephoneName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <TextField
              fullWidth
              key={`Mobilekey`}
              type="number"
              id="Mobileid"
              label="Mobile No"
              variant="outlined"
              name="MainMobileName"
              value={userContactDetails.MainMobileName}
              onChange={onChange}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
);
export default ContactMainform;
var countries = [
  { code: "AD", label: "Andorra", phone: "376" },
  {
    code: "AE",
    label: "United Arab Emirates",
    phone: "971",
  },
  { code: "AF", label: "Afghanistan", phone: "93" },
  {
    code: "AG",
    label: "Antigua and Barbuda",
    phone: "1-268",
  },
  { code: "AI", label: "Anguilla", phone: "1-264" },
  { code: "AL", label: "Albania", phone: "355" },
  { code: "AM", label: "Armenia", phone: "374" },
  { code: "AO", label: "Angola", phone: "244" },
  { code: "AQ", label: "Antarctica", phone: "672" },
  { code: "AR", label: "Argentina", phone: "54" },
  { code: "AS", label: "American Samoa", phone: "1-684" },
  { code: "AT", label: "Austria", phone: "43" },
  {
    code: "AU",
    label: "Australia",
    phone: "61",
    suggested: true,
  },
  { code: "AW", label: "Aruba", phone: "297" },
  { code: "AX", label: "Alland Islands", phone: "358" },
  { code: "AZ", label: "Azerbaijan", phone: "994" },
  {
    code: "BA",
    label: "Bosnia and Herzegovina",
    phone: "387",
  },
  { code: "BB", label: "Barbados", phone: "1-246" },
  { code: "BD", label: "Bangladesh", phone: "880" },
  { code: "BE", label: "Belgium", phone: "32" },
  { code: "BF", label: "Burkina Faso", phone: "226" },
  { code: "BG", label: "Bulgaria", phone: "359" },
  { code: "BH", label: "Bahrain", phone: "973" },
  { code: "BI", label: "Burundi", phone: "257" },
  { code: "BJ", label: "Benin", phone: "229" },
  { code: "BL", label: "Saint Barthelemy", phone: "590" },
  { code: "BM", label: "Bermuda", phone: "1-441" },
  { code: "BN", label: "Brunei Darussalam", phone: "673" },
  { code: "BO", label: "Bolivia", phone: "591" },
  { code: "BR", label: "Brazil", phone: "55" },
  { code: "BS", label: "Bahamas", phone: "1-242" },
  { code: "BT", label: "Bhutan", phone: "975" },
  { code: "BV", label: "Bouvet Island", phone: "47" },
  { code: "BW", label: "Botswana", phone: "267" },
  { code: "BY", label: "Belarus", phone: "375" },
  { code: "BZ", label: "Belize", phone: "501" },
  {
    code: "CA",
    label: "Canada",
    phone: "1",
    suggested: true,
  },
  {
    code: "CC",
    label: "Cocos (Keeling) Islands",
    phone: "61",
  },
  {
    code: "CD",
    label: "Congo, Democratic Republic of the",
    phone: "243",
  },
  {
    code: "CF",
    label: "Central African Republic",
    phone: "236",
  },
  {
    code: "CG",
    label: "Congo, Republic of the",
    phone: "242",
  },
  { code: "CH", label: "Switzerland", phone: "41" },
  { code: "CI", label: "Cote d'Ivoire", phone: "225" },
  { code: "CK", label: "Cook Islands", phone: "682" },
  { code: "CL", label: "Chile", phone: "56" },
  { code: "CM", label: "Cameroon", phone: "237" },
  { code: "CN", label: "China", phone: "86" },
  { code: "CO", label: "Colombia", phone: "57" },
  { code: "CR", label: "Costa Rica", phone: "506" },
  { code: "CU", label: "Cuba", phone: "53" },
  { code: "CV", label: "Cape Verde", phone: "238" },
  { code: "CW", label: "Curacao", phone: "599" },
  { code: "CX", label: "Christmas Island", phone: "61" },
  { code: "CY", label: "Cyprus", phone: "357" },
  { code: "CZ", label: "Czech Republic", phone: "420" },
  {
    code: "DE",
    label: "Germany",
    phone: "49",
    suggested: true,
  },
  { code: "DJ", label: "Djibouti", phone: "253" },
  { code: "DK", label: "Denmark", phone: "45" },
  { code: "DM", label: "Dominica", phone: "1-767" },
  {
    code: "DO",
    label: "Dominican Republic",
    phone: "1-809",
  },
  { code: "DZ", label: "Algeria", phone: "213" },
  { code: "EC", label: "Ecuador", phone: "593" },
  { code: "EE", label: "Estonia", phone: "372" },
  { code: "EG", label: "Egypt", phone: "20" },
  { code: "EH", label: "Western Sahara", phone: "212" },
  { code: "ER", label: "Eritrea", phone: "291" },
  { code: "ES", label: "Spain", phone: "34" },
  { code: "ET", label: "Ethiopia", phone: "251" },
  { code: "FI", label: "Finland", phone: "358" },
  { code: "FJ", label: "Fiji", phone: "679" },
  {
    code: "FK",
    label: "Falkland Islands (Malvinas)",
    phone: "500",
  },
  {
    code: "FM",
    label: "Micronesia, Federated States of",
    phone: "691",
  },
  { code: "FO", label: "Faroe Islands", phone: "298" },
  {
    code: "FR",
    label: "France",
    phone: "33",
    suggested: true,
  },
  { code: "GA", label: "Gabon", phone: "241" },
  { code: "GB", label: "United Kingdom", phone: "44" },
  { code: "GD", label: "Grenada", phone: "1-473" },
  { code: "GE", label: "Georgia", phone: "995" },
  { code: "GF", label: "French Guiana", phone: "594" },
  { code: "GG", label: "Guernsey", phone: "44" },
  { code: "GH", label: "Ghana", phone: "233" },
  { code: "GI", label: "Gibraltar", phone: "350" },
  { code: "GL", label: "Greenland", phone: "299" },
  { code: "GM", label: "Gambia", phone: "220" },
  { code: "GN", label: "Guinea", phone: "224" },
  { code: "GP", label: "Guadeloupe", phone: "590" },
  { code: "GQ", label: "Equatorial Guinea", phone: "240" },
  { code: "GR", label: "Greece", phone: "30" },
  {
    code: "GS",
    label: "South Georgia and the South Sandwich Islands",
    phone: "500",
  },
  { code: "GT", label: "Guatemala", phone: "502" },
  { code: "GU", label: "Guam", phone: "1-671" },
  { code: "GW", label: "Guinea-Bissau", phone: "245" },
  { code: "GY", label: "Guyana", phone: "592" },
  { code: "HK", label: "Hong Kong", phone: "852" },
  {
    code: "HM",
    label: "Heard Island and McDonald Islands",
    phone: "672",
  },
  { code: "HN", label: "Honduras", phone: "504" },
  { code: "HR", label: "Croatia", phone: "385" },
  { code: "HT", label: "Haiti", phone: "509" },
  { code: "HU", label: "Hungary", phone: "36" },
  { code: "ID", label: "Indonesia", phone: "62" },
  { code: "IE", label: "Ireland", phone: "353" },
  { code: "IL", label: "Israel", phone: "972" },
  { code: "IM", label: "Isle of Man", phone: "44" },
  { code: "IN", label: "India", phone: "91" },
  {
    code: "IO",
    label: "British Indian Ocean Territory",
    phone: "246",
  },
  { code: "IQ", label: "Iraq", phone: "964" },
  {
    code: "IR",
    label: "Iran, Islamic Republic of",
    phone: "98",
  },
  { code: "IS", label: "Iceland", phone: "354" },
  { code: "IT", label: "Italy", phone: "39" },
  { code: "JE", label: "Jersey", phone: "44" },
  { code: "JM", label: "Jamaica", phone: "1-876" },
  { code: "JO", label: "Jordan", phone: "962" },
  {
    code: "JP",
    label: "Japan",
    phone: "81",
    suggested: true,
  },
  { code: "KE", label: "Kenya", phone: "254" },
  { code: "KG", label: "Kyrgyzstan", phone: "996" },
  { code: "KH", label: "Cambodia", phone: "855" },
  { code: "KI", label: "Kiribati", phone: "686" },
  { code: "KM", label: "Comoros", phone: "269" },
  {
    code: "KN",
    label: "Saint Kitts and Nevis",
    phone: "1-869",
  },
  {
    code: "KP",
    label: "Korea, Democratic People's Republic of",
    phone: "850",
  },
  { code: "KR", label: "Korea, Republic of", phone: "82" },
  { code: "KW", label: "Kuwait", phone: "965" },
  { code: "KY", label: "Cayman Islands", phone: "1-345" },
  { code: "KZ", label: "Kazakhstan", phone: "7" },
  {
    code: "LA",
    label: "Lao People's Democratic Republic",
    phone: "856",
  },
  { code: "LB", label: "Lebanon", phone: "961" },
  { code: "LC", label: "Saint Lucia", phone: "1-758" },
  { code: "LI", label: "Liechtenstein", phone: "423" },
  { code: "LK", label: "Sri Lanka", phone: "94" },
  { code: "LR", label: "Liberia", phone: "231" },
  { code: "LS", label: "Lesotho", phone: "266" },
  { code: "LT", label: "Lithuania", phone: "370" },
  { code: "LU", label: "Luxembourg", phone: "352" },
  { code: "LV", label: "Latvia", phone: "371" },
  { code: "LY", label: "Libya", phone: "218" },
  { code: "MA", label: "Morocco", phone: "212" },
  { code: "MC", label: "Monaco", phone: "377" },
  {
    code: "MD",
    label: "Moldova, Republic of",
    phone: "373",
  },
  { code: "ME", label: "Montenegro", phone: "382" },
  {
    code: "MF",
    label: "Saint Martin (French part)",
    phone: "590",
  },
  { code: "MG", label: "Madagascar", phone: "261" },
  { code: "MH", label: "Marshall Islands", phone: "692" },
  {
    code: "MK",
    label: "Macedonia, the Former Yugoslav Republic of",
    phone: "389",
  },
  { code: "ML", label: "Mali", phone: "223" },
  { code: "MM", label: "Myanmar", phone: "95" },
  { code: "MN", label: "Mongolia", phone: "976" },
  { code: "MO", label: "Macao", phone: "853" },
  {
    code: "MP",
    label: "Northern Mariana Islands",
    phone: "1-670",
  },
  { code: "MQ", label: "Martinique", phone: "596" },
  { code: "MR", label: "Mauritania", phone: "222" },
  { code: "MS", label: "Montserrat", phone: "1-664" },
  { code: "MT", label: "Malta", phone: "356" },
  { code: "MU", label: "Mauritius", phone: "230" },
  { code: "MV", label: "Maldives", phone: "960" },
  { code: "MW", label: "Malawi", phone: "265" },
  { code: "MX", label: "Mexico", phone: "52" },
  { code: "MY", label: "Malaysia", phone: "60" },
  { code: "MZ", label: "Mozambique", phone: "258" },
  { code: "NA", label: "Namibia", phone: "264" },
  { code: "NC", label: "New Caledonia", phone: "687" },
  { code: "NE", label: "Niger", phone: "227" },
  { code: "NF", label: "Norfolk Island", phone: "672" },
  { code: "NG", label: "Nigeria", phone: "234" },
  { code: "NI", label: "Nicaragua", phone: "505" },
  { code: "NL", label: "Netherlands", phone: "31" },
  { code: "NO", label: "Norway", phone: "47" },
  { code: "NP", label: "Nepal", phone: "977" },
  { code: "NR", label: "Nauru", phone: "674" },
  { code: "NU", label: "Niue", phone: "683" },
  { code: "NZ", label: "New Zealand", phone: "64" },
  { code: "OM", label: "Oman", phone: "968" },
  { code: "PA", label: "Panama", phone: "507" },
  { code: "PE", label: "Peru", phone: "51" },
  { code: "PF", label: "French Polynesia", phone: "689" },
  { code: "PG", label: "Papua New Guinea", phone: "675" },
  { code: "PH", label: "Philippines", phone: "63" },
  { code: "PK", label: "Pakistan", phone: "92" },
  { code: "PL", label: "Poland", phone: "48" },
  {
    code: "PM",
    label: "Saint Pierre and Miquelon",
    phone: "508",
  },
  { code: "PN", label: "Pitcairn", phone: "870" },
  { code: "PR", label: "Puerto Rico", phone: "1" },
  {
    code: "PS",
    label: "Palestine, State of",
    phone: "970",
  },
  { code: "PT", label: "Portugal", phone: "351" },
  { code: "PW", label: "Palau", phone: "680" },
  { code: "PY", label: "Paraguay", phone: "595" },
  { code: "QA", label: "Qatar", phone: "974" },
  { code: "RE", label: "Reunion", phone: "262" },
  { code: "RO", label: "Romania", phone: "40" },
  { code: "RS", label: "Serbia", phone: "381" },
  { code: "RU", label: "Russian Federation", phone: "7" },
  { code: "RW", label: "Rwanda", phone: "250" },
  { code: "SA", label: "Saudi Arabia", phone: "966" },
  { code: "SB", label: "Solomon Islands", phone: "677" },
  { code: "SC", label: "Seychelles", phone: "248" },
  { code: "SD", label: "Sudan", phone: "249" },
  { code: "SE", label: "Sweden", phone: "46" },
  { code: "SG", label: "Singapore", phone: "65" },
  { code: "SH", label: "Saint Helena", phone: "290" },
  { code: "SI", label: "Slovenia", phone: "386" },
  {
    code: "SJ",
    label: "Svalbard and Jan Mayen",
    phone: "47",
  },
  { code: "SK", label: "Slovakia", phone: "421" },
  { code: "SL", label: "Sierra Leone", phone: "232" },
  { code: "SM", label: "San Marino", phone: "378" },
  { code: "SN", label: "Senegal", phone: "221" },
  { code: "SO", label: "Somalia", phone: "252" },
  { code: "SR", label: "Suriname", phone: "597" },
  { code: "SS", label: "South Sudan", phone: "211" },
  {
    code: "ST",
    label: "Sao Tome and Principe",
    phone: "239",
  },
  { code: "SV", label: "El Salvador", phone: "503" },
  {
    code: "SX",
    label: "Sint Maarten (Dutch part)",
    phone: "1-721",
  },
  {
    code: "SY",
    label: "Syrian Arab Republic",
    phone: "963",
  },
  { code: "SZ", label: "Swaziland", phone: "268" },
  {
    code: "TC",
    label: "Turks and Caicos Islands",
    phone: "1-649",
  },
  { code: "TD", label: "Chad", phone: "235" },
  {
    code: "TF",
    label: "French Southern Territories",
    phone: "262",
  },
  { code: "TG", label: "Togo", phone: "228" },
  { code: "TH", label: "Thailand", phone: "66" },
  { code: "TJ", label: "Tajikistan", phone: "992" },
  { code: "TK", label: "Tokelau", phone: "690" },
  { code: "TL", label: "Timor-Leste", phone: "670" },
  { code: "TM", label: "Turkmenistan", phone: "993" },
  { code: "TN", label: "Tunisia", phone: "216" },
  { code: "TO", label: "Tonga", phone: "676" },
  { code: "TR", label: "Turkey", phone: "90" },
  {
    code: "TT",
    label: "Trinidad and Tobago",
    phone: "1-868",
  },
  { code: "TV", label: "Tuvalu", phone: "688" },
  {
    code: "TW",
    label: "Taiwan",
    phone: "886",
  },
  {
    code: "TZ",
    label: "United Republic of Tanzania",
    phone: "255",
  },
  { code: "UA", label: "Ukraine", phone: "380" },
  { code: "UG", label: "Uganda", phone: "256" },
  {
    code: "US",
    label: "United States",
    phone: "1",
    suggested: true,
  },
  { code: "UY", label: "Uruguay", phone: "598" },
  { code: "UZ", label: "Uzbekistan", phone: "998" },
  {
    code: "VA",
    label: "Holy See (Vatican City State)",
    phone: "379",
  },
  {
    code: "VC",
    label: "Saint Vincent and the Grenadines",
    phone: "1-784",
  },
  { code: "VE", label: "Venezuela", phone: "58" },
  {
    code: "VG",
    label: "British Virgin Islands",
    phone: "1-284",
  },
  {
    code: "VI",
    label: "US Virgin Islands",
    phone: "1-340",
  },
  { code: "VN", label: "Vietnam", phone: "84" },
  { code: "VU", label: "Vanuatu", phone: "678" },
  { code: "WF", label: "Wallis and Futuna", phone: "681" },
  { code: "WS", label: "Samoa", phone: "685" },
  { code: "XK", label: "Kosovo", phone: "383" },
  { code: "YE", label: "Yemen", phone: "967" },
  { code: "YT", label: "Mayotte", phone: "262" },
  { code: "ZA", label: "South Africa", phone: "27" },
  { code: "ZM", label: "Zambia", phone: "260" },
  { code: "ZW", label: "Zimbabwe", phone: "263" },
];
const titleData = [
  { label: "Mr", year: 1994 },
  { label: "Mrs", year: 1972 },
  { label: "Miss", year: 1974 },
  { label: "Ms", year: 2008 },
  { label: "Dr", year: 1957 },
  { label: "Hr", year: 1957 },
  { label: "N/A", year: 1957 },
];
