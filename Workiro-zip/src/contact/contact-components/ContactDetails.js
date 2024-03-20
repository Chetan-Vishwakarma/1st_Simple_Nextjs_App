import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ToggleButton from '@mui/material/ToggleButton';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EmailIcon from '@mui/icons-material/Email';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import user from "../../images/user.jpg";
import country from "../../images/uk.png";
import KeyIcon from '@mui/icons-material/Key';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import VerifiedIcon from '@mui/icons-material/Verified';
import CircleIcon from '@mui/icons-material/Circle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tooltip from '@mui/material/Tooltip';
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAdd from '@mui/icons-material/PersonAdd';
import { useEffect } from 'react';
import CommanCLS from "../../services/CommanService"
import { useLocation } from 'react-router-dom';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CheckIcon from '@mui/icons-material/Check';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Autocomplete from '@mui/material/Autocomplete';
import TestPDF from '../TestPDF';



// const [nextDate, setNextDate] = useState("");

function ContactDetails() {

    const location = useLocation();

    const { agrno, Email, password, folderId, originatorNo, contactNo } = location.state;

    const [selected, setSelected] = React.useState(false);

    const [value, setValue] = React.useState('1');

    const [contactDetails, setContactDetails] = useState([]);

    // dropdown
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // AML check modal
    const [isAMLChkOpen, setisAMLChkOpen] = React.useState(false);

    const [amlDetails, setAmlDetails] = useState({
        bankAccNo: "",
        bankSrNo: "",
        drivingLicNo: "",
        NiNumber: "",
        passportNo: ""
    });

    const [currentDate, setCurrentDate] = useState(""); // Initialize with the current date in "dd/mm/yyyy" format

    const [verificationModal, setVerificationModalOpen] = React.useState(false);

    const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);

    const baseUrl = "https://docusms.uk/dsdesktopwebservice.asmx/";

    const clientWebUrl = "https://docusms.uk/dswebclientmanager.asmx/";

    let Cls = new CommanCLS(baseUrl, agrno, Email, password);

    let webClientCLS = new CommanCLS(clientWebUrl, agrno, Email, password);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        let obj = {
            agrno: agrno,
            Email: Email,
            password: password,
            ClientID: originatorNo,
            ProjectID: folderId
        };
        try {
            Cls.Json_GetAllContactsByClientID(obj, (sts, data) => {
                if (sts) {
                    if (data) {
                        let json = JSON.parse(data);
                        console.log("Json_GetAllContactsByClientID", json);
                        let details = json.Table;
                        setContactDetails(details.filter((item) => item.ContactNo === contactNo));
                    }
                }
            });
        } catch (err) {
            console.log("Error while calling Json_GetAllContactsByClientID", err);
        }
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClickOpen = () => {
        setAmlDetails({
            bankAccNo: "",
            bankSrNo: "",
            drivingLicNo: "",
            NiNumber: "",
            passportNo: ""
        });
        setisAMLChkOpen(true);
    };

    const Json_UpdateContactVerify = () => {
        let obj = {
            agrno: agrno,
            Email: Email,
            password: password,
            Contactemail: contactDetails[0]["E-Mail"],
            BnkAccNumber: "",
            BnkSrCode: "",
            DrvLicNumber: amlDetails.drivingLicNo,
            NatInsNumber: "",
            PassportNumber: ""
        }
        try {
            Cls.Json_UpdateContactVerify(obj, (sts, data) => {
                if (sts) {
                    if (data) {
                        console.log("Json_UpdateContactVerify", data);
                        if (data === "Success") {
                            setVerificationModalOpen(true);
                        }
                    }
                }
            });
        } catch (err) {
            console.log("Error while calling Json_UpdateContactVerify", err);
        }
    }

    const handleUpdateContactVerify = (target) => {
        if (target === "drivingLicNo") {
            if (isValidate("drivingLicNo")) {
                Json_UpdateContactVerify();
            }
        }
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAmlDetails(prevState => ({
            ...prevState, [name]: value
        }));
    }

    const isValidate = (str) => {
        if (amlDetails[str].length > 0) {
            return true;
        } else {
            return false
        }
    }

    const Json_VerifyDrivingLicence=()=>{
        setIsViewerModalOpen(!isViewerModalOpen);
        let obj = {
            agrno: agrno,
            strEmail: Email,
            password: password,
            strTitle: "",
            strFirstName: "",
            strMiddleName: "",
            strLastName: "",
            dtDateOfBirth: "",
            strGender: "",
            strAddress1:"",
            strAddress2: "",
            strAddress3: "",
            strAddress4: "",
            strPostTown: "",
            strCounty: "",
            strPostCode:"",
            strCountry: "",
            strLicenseNo: amlDetails.drivingLicNo
        }
        try {
            Cls.Json_VerifyDrivingLicence(obj, (sts, data) => {
                if (sts) {
                    console.log("Json_VerifyDrivingLicence",data);
                }
            });
        } catch (err) {
            console.log("Error while calling Json_VerifyDrivingLicence", err);
        }
    }

    return (
        <Box className="container-fluid p-0">
            <Box className="d-flex align-items-center justify-content-between flex-wrap">
                <Box className='d-flex flex-wrap align-items-center'>
                    <Typography variant="h2" className='title me-3 mb-2' gutterBottom>
                        {contactDetails.length > 0 ? contactDetails[0]["Company Name"] : "Loading..."}
                    </Typography>

                    {/* <ToggleButton
                        value="check"
                        selected={selected}
                        onChange={() => {
                            setSelected(!selected);
                        }}
                        className='mb-2 btn-favorite'
                    >
                        <FavoriteIcon />
                        Add to Favorites
                    </ToggleButton> */}
                </Box>

                <Box className='d-flex flex-wrap'>
                    <Button className='btn-blue-2 me-2 mb-1' size="small" startIcon={<BorderColorIcon />}>Edit Contacts</Button>
                    <Button className='btn-blue-2 me-2 mb-1' size="small" startIcon={<GroupAddIcon />}>Client Card</Button>
                    <Button className='btn-blue-2 me-2 mb-1' onClick={handleClickOpen} size="small" startIcon={<FactCheckIcon />}>AML Check</Button>

                    {/* <Button className='btn-blue-2 me-2 mb-1' onClick={setVerificationModalOpen} size="small" startIcon={<FactCheckIcon />}>varificaton</Button> */}

                    <div>
                        <Button
                            id="fade-button"
                            aria-controls={open ? 'fade-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                            className='min-width-auto mb-1'
                        >
                            <MoreVertIcon />

                        </Button>
                        <Menu
                            id="fade-menu"
                            MenuListProps={{
                                'aria-labelledby': 'fade-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            TransitionComponent={Fade}
                        >
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                </ListItemIcon>
                                My Account
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                </ListItemIcon>
                                My Account
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                                <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                </ListItemIcon>
                                My Account
                            </MenuItem>
                        </Menu>
                    </div>

                </Box>
            </Box>

            <Box sx={{ width: '100%', typography: 'body1' }} className="mt-3">
                <TabContext value={value}>
                    <Box className='d-none'>
                        <TabList onChange={handleChange} aria-label="lab API tabs example" className='custom-tabs'>
                            <Tab label="General" value="1" />
                            <Tab label="Address" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1" className='p-0'>
                        <Box className="general-tab">
                            <Box className="row">
                                <Box className="col-xl-4 col-lg-4 col-md-12 d-flex">
                                    {
                                        contactDetails.length > 0 ?
                                            contactDetails.map((item) => {
                                                return <Box className='white-box w-100'>

                                                    <Box className='d-flex align-items-center'>
                                                        <Box className='relative m-0 me-4'>
                                                            <Box className='client-img'>
                                                                <img src={user} />
                                                            </Box>

                                                            <Tooltip title="UK" arrow>
                                                                <Box className='country-flage'>
                                                                    <img src={country} className='' />
                                                                </Box>
                                                            </Tooltip>

                                                            <VerifiedIcon className='user-register' />

                                                        </Box>
                                                        <Box className="clearfix">
                                                            <Typography variant="h5" className='mb-1 bold d-flex align-items-center' gutterBottom>
                                                                <CircleIcon className='text-success me-1 font-16' /> {item["First Name"] + " " + item["Last Name"]}
                                                            </Typography>


                                                            <Typography variant="body1" className='mb-0 ' gutterBottom>
                                                                <span className='bold'>
                                                                    Role:</span> {item.Role}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <Box className='d-flex flex-wrap contact-availability mb-2'>
                                                        <Box className={item["Main Contact"] ? 'contact-availability-box' : 'contact-availability-box inactive'}>
                                                            <CheckCircleIcon />
                                                            <Typography variant="h5" className='mb-0 ' gutterBottom>
                                                                Main Contact
                                                            </Typography>
                                                        </Box>

                                                        {/* <Box className='contact-availability-box inactive'>
                                                <CancelIcon />
                                                <Typography variant="h5" className='mb-0 ' gutterBottom>
                                                    In Active
                                                </Typography>
                                            </Box> */}

                                                        <Box className='contact-availability-box inactive'>
                                                            <CancelIcon />
                                                            <Typography variant="h5" className='mb-0 ' gutterBottom>
                                                                Portal User
                                                            </Typography>
                                                        </Box>

                                                        {/* <Box className='contact-availability-box'>
                                                <CheckCircleIcon />
                                                <Typography variant="h5" className='mb-0 ' gutterBottom>
                                                    AML Check
                                                </Typography>
                                            </Box> */}

                                                    </Box>

                                                    <Box className='card-box d-flex mt-2'>
                                                        <FmdGoodIcon className='me-2 text-primary' />

                                                        <Box className=''>
                                                            <p className='font-16 bold mb-1 text-primary'>Address</p>
                                                            <p className='mb-0 font-14 text-gray'>{item["Address 1"]}</p>
                                                        </Box>
                                                    </Box>

                                                    <Box className='card-box d-flex mt-2'>
                                                        <FmdGoodIcon className='me-2 text-primary' />

                                                        <Box className=''>
                                                            <p className='font-16 bold mb-1 text-primary'>Phone</p>
                                                            <p className='mb-0 font-14 text-gray'>{item.Tel}, {item.Mobile}</p>
                                                        </Box>
                                                    </Box>

                                                </Box>
                                            }) : <Box className='white-box w-100'>

                                                <Box className='d-flex align-items-center'>
                                                    <Box className='relative m-0 me-4'>
                                                        <Box className='client-img'>
                                                            <img src={user} />
                                                        </Box>

                                                        <Tooltip title="UK" arrow>
                                                            <Box className='country-flage'>
                                                                <img src={country} className='' />
                                                            </Box>
                                                        </Tooltip>

                                                        <VerifiedIcon className='user-register' />

                                                    </Box>
                                                    <Box className="clearfix">
                                                        <Typography variant="h5" className='mb-1 bold d-flex align-items-center' gutterBottom>
                                                            <CircleIcon className='text-success me-1 font-16' /> Patrick Jones
                                                        </Typography>


                                                        <Typography variant="body1" className='mb-0 ' gutterBottom>
                                                            <span className='bold'>
                                                                Role:</span> Tester
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box className='d-flex flex-wrap contact-availability mb-2'>
                                                    <Box className={'contact-availability-box inactive'}>
                                                        <CheckCircleIcon />
                                                        <Typography variant="h5" className='mb-0 ' gutterBottom>
                                                            Main Contact
                                                        </Typography>
                                                    </Box>

                                                    {/* <Box className='contact-availability-box inactive'>
                                                <CancelIcon />
                                                <Typography variant="h5" className='mb-0 ' gutterBottom>
                                                    In Active
                                                </Typography>
                                            </Box> */}

                                                    <Box className='contact-availability-box inactive'>
                                                        <CancelIcon />
                                                        <Typography variant="h5" className='mb-0 ' gutterBottom>
                                                            Portal User
                                                        </Typography>
                                                    </Box>

                                                    {/* <Box className='contact-availability-box'>
                                                <CheckCircleIcon />
                                                <Typography variant="h5" className='mb-0 ' gutterBottom>
                                                    AML Check
                                                </Typography>
                                            </Box> */}

                                                </Box>

                                                <Box className='card-box d-flex mt-2'>
                                                    <FmdGoodIcon className='me-2 text-primary' />

                                                    <Box className=''>
                                                        <p className='font-16 bold mb-1 text-primary'>Address</p>
                                                        <p className='mb-0 font-14 text-gray'>testing/address</p>
                                                    </Box>
                                                </Box>

                                                <Box className='card-box d-flex mt-2'>
                                                    <LocalPhoneIcon className='me-2 text-primary' />

                                                    <Box className=''>
                                                        <p className='font-16 bold mb-1 text-primary'>Phone</p>
                                                        <p className='mb-0 font-14 text-gray'>0000000000, 000000000</p>
                                                    </Box>
                                                </Box>

                                            </Box>
                                    }

                                </Box>
                                {/* cold end */}

                                <Box className="col-xl-8 col-lg-8 col-md-12 d-flex">
                                    <Box className='white-box w-100'>
                                        <Box className='contact-detail-row mb-4'>
                                            <Box className='contact-detail-box'>
                                                <KeyIcon />
                                                <Typography variant="h4" className='mb-0 ' gutterBottom>
                                                    Key
                                                </Typography>

                                                <Typography variant="Body1" className='mb-0 ' gutterBottom>
                                                    23156
                                                </Typography>
                                            </Box>

                                            <Box className='contact-detail-box'>
                                                <RequestQuoteIcon />
                                                <Typography variant="h4" className='mb-0 ' gutterBottom>
                                                    Amount
                                                </Typography>

                                                <Typography variant="Body1" className='mb-0 ' gutterBottom>
                                                    $1012
                                                </Typography>
                                            </Box>

                                            <Box className='contact-detail-box'>
                                                <FactCheckIcon />
                                                <Typography variant="h4" className='mb-0 ' gutterBottom>
                                                    Claim Status
                                                </Typography>

                                                <Typography variant="Body1" className='mb-0 ' gutterBottom>
                                                    Pending
                                                </Typography>
                                            </Box>

                                            <Box className='contact-detail-box'>
                                                <FolderSharedIcon />
                                                <Typography variant="h4" className='mb-0 ' gutterBottom>
                                                    User ID
                                                </Typography>

                                                <Typography variant="Body1" className='mb-0 ' gutterBottom>
                                                    23156
                                                </Typography>
                                            </Box>

                                            <Box className='contact-detail-box'>
                                                <CalendarMonthIcon />
                                                <Typography variant="h4" className='mb-0 ' gutterBottom>
                                                    Date Added
                                                </Typography>

                                                <Typography variant="Body1" className='mb-0 ' gutterBottom>
                                                    23/05/23
                                                </Typography>
                                            </Box>
                                        </Box>


                                        {/* test */}
                                        <Box className='card-box d-flex'>
                                            <EditNoteIcon className='me-2 text-primary' />
                                            <Box className=''>
                                                <p className='font-16 bold mb-1 text-primary'>Notes</p>
                                                <p className='mb-0 font-14 text-gray'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the when an unknown printer took a galley of type and scrambled it to make simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the when an unknown printer took a galley of type  the industry standard dummy text ever since the when an unknown p and scrambled it to make a type specimen book.</p>
                                            </Box>
                                        </Box>





                                        {/* <textarea></textarea> */}

                                        {/*  */}




                                    </Box>
                                    {/* white box end */}
                                </Box>


                                {/* cold end */}
                            </Box>
                            {/* row end */}
                        </Box>
                        {/* white box end */}

                        <Box className='main-accordian'>
                            <Accordion className='accordian-box' defaultExpanded>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1-content"
                                    id="panel1-header"
                                >
                                    Key Facts - Team
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box className='table-responsive'>
                                        <table className='table'>
                                            <tbody>
                                                <tr>
                                                    <th>Key Facts - Team</th>
                                                    <td>Key Facts - Team</td>
                                                </tr>
                                                <tr>
                                                    <th>Key Facts - Team</th>
                                                    <td>Patrick</td>
                                                </tr>
                                                <tr>
                                                    <th>Investigations manager Name</th>
                                                    <td>Jones</td>
                                                </tr>
                                                <tr>
                                                    <th>Assistant Manager Date</th>
                                                    <td>Jones@gmail.com</td>
                                                </tr>
                                                <tr>
                                                    <th>Investigations manager Date</th>
                                                    <td>Admin</td>
                                                </tr>
                                                <tr>
                                                    <th>Closures Manager Date</th>
                                                    <td>Key</td>
                                                </tr>
                                                <tr>
                                                    <th>Administrator 1 Date</th>
                                                    <td>01/10/2001</td>
                                                </tr>
                                                <tr>
                                                    <th>Administrator 1 Date</th>
                                                    <td>01/10/2001</td>
                                                </tr>
                                                <tr>
                                                    <th>Assistant Manager Name</th>
                                                    <td>98756465464</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2-content"
                                    id="panel2-header"
                                >
                                    Fee Data
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box className='table-responsive'>
                                        <table className='table'>
                                            <tbody>
                                                <tr>
                                                    <th>Key Facts - Team</th>
                                                    <td>Key Facts - Team</td>
                                                </tr>
                                                <tr>
                                                    <th>Key Facts - Team</th>
                                                    <td>Patrick</td>
                                                </tr>
                                                <tr>
                                                    <th>Investigations manager Name</th>
                                                    <td>Jones</td>
                                                </tr>
                                                <tr>
                                                    <th>Assistant Manager Date</th>
                                                    <td>Jones@gmail.com</td>
                                                </tr>
                                                <tr>
                                                    <th>Investigations manager Date</th>
                                                    <td>Admin</td>
                                                </tr>
                                                <tr>
                                                    <th>Closures Manager Date</th>
                                                    <td>Key</td>
                                                </tr>
                                                <tr>
                                                    <th>Administrator 1 Date</th>
                                                    <td>01/10/2001</td>
                                                </tr>
                                                <tr>
                                                    <th>Administrator 1 Date</th>
                                                    <td>01/10/2001</td>
                                                </tr>
                                                <tr>
                                                    <th>Assistant Manager Name</th>
                                                    <td>98756465464</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel3-content"
                                    id="panel3-header"
                                >
                                    Key Facts - Team
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel4-content"
                                    id="panel4-header"
                                >
                                    Key Facts - Team
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel5-content"
                                    id="panel5-header"
                                >
                                    WIP - Fee Approval
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel6-content"
                                    id="panel6-header"
                                >
                                    PreFee
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel7-content"
                                    id="panel7-header"
                                >
                                    Bonding
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel9-content"
                                    id="panel7-header"
                                >
                                    Next Actions
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel8-content"
                                    id="panel8-header"
                                >
                                    WIP - Current
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>

                            <Accordion className='accordian-box'>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel9-content"
                                    id="panel9-header"
                                >
                                    Bonding
                                </AccordionSummary>
                                <AccordionDetails>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </AccordionDetails>
                            </Accordion>

                        </Box>
                    </TabPanel>
                    {/* tab end */}

                    <TabPanel value="2">Item Two</TabPanel>

                    {/* <TabPanel value="3">Item Three</TabPanel>
                    <TabPanel value="4">Item Three</TabPanel>
                    <TabPanel value="5">Item Three</TabPanel>
                    <TabPanel value="6">Item Three</TabPanel>
                    <TabPanel value="7">Item Three</TabPanel> */}
                </TabContext>
            </Box>

            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open alert dialog
            </Button> */}


            {/* AML check modal Start */}
            <Dialog
                open={isAMLChkOpen}
                onClose={() => setisAMLChkOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="custom-modal aml-details-modal"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box className="d-flex align-items-center justify-content-between">
                            <Box className="dropdown-box">
                                <Typography variant="h4" className='font-18 text-black'>AML Details</Typography>
                            </Box>

                            <Button onClick={() => setisAMLChkOpen(false)} autoFocus sx={{ minWidth: 30 }} className='p-0'>
                                <span className="material-symbols-outlined text-black">
                                    cancel
                                </span>
                            </Button>
                        </Box>

                        <hr />

                        <Box className='row'>
                            <Box className='col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField name='bankAccNo' value={amlDetails.bankAccNo} onChange={handleInputChange} label="Bank Account No" className='form-control' variant="outlined" />
                                    <Button className={isValidate("bankAccNo") ? 'btn-blue-2 btn-sign active' : 'btn-blue-2 btn-sign'} onClick={() => handleUpdateContactVerify("bankAccNo")}><CheckIcon /></Button>
                                </Box>

                            </Box>

                            <Box className='col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField name='bankSrNo' value={amlDetails.bankSrNo} onChange={handleInputChange} label="Bank SR Code" variant="outlined" className='form-control' />
                                    <Button className={isValidate("bankSrNo") ? 'btn-blue-2 btn-sign active' : 'btn-blue-2 btn-sign'} onClick={() => handleUpdateContactVerify("bankSrNo")}><CheckIcon /></Button>
                                </Box>
                            </Box>
                        </Box>

                        <Box className='row'>
                            <Box className='col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField name='drivingLicNo' value={amlDetails.drivingLicNo} onChange={handleInputChange} label="Driving Lic No" variant="outlined" className='form-control' />
                                    <Button className={isValidate("drivingLicNo") ? 'btn-blue-2 btn-sign active' : 'btn-blue-2 btn-sign'} onClick={() => handleUpdateContactVerify("drivingLicNo")}><CheckIcon /></Button>
                                </Box>
                            </Box>

                            <Box className='col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField name='NiNumber' value={amlDetails.NiNumber} onChange={handleInputChange} label="NI Number" variant="outlined" className='form-control' />
                                    <Button className={isValidate("NiNumber") ? 'btn-blue-2 btn-sign active' : 'btn-blue-2 btn-sign'} onClick={() => handleUpdateContactVerify("NiNumber")}><CheckIcon /></Button>
                                </Box>
                            </Box>

                            <Box className='col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField name='passportNo' value={amlDetails.passportNo} onChange={handleInputChange} label="Passport Number" variant="outlined" className='form-control' />
                                    <Button className={isValidate("passportNo") ? 'btn-blue-2 btn-sign active' : 'btn-blue-2 btn-sign'} onClick={() => handleUpdateContactVerify("passportNo")}><CheckIcon /></Button>
                                </Box>
                            </Box>

                            <Box className='col-md-6'>
                                <Button variant="text" className="btn-blue btn-block">
                                    Next
                                    <NavigateNextIcon className='ms-2' />
                                </Button>
                            </Box>
                        </Box>

                    </DialogContentText>
                </DialogContent>
                {/* <DialogActions>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleClose} autoFocus>
                            Agree
                        </Button>
                    </DialogActions> */}
            </Dialog>

            {/* AML check modal End */}


            {/* Checkmodal modal Start */}
            <Dialog
                open={verificationModal}
                onClose={() => setVerificationModalOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="custom-modal"

            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box className="d-flex align-items-center justify-content-between">
                            <Box className="dropdown-box">
                                <Typography variant="h4" className='font-18 text-black'>Driving License Verification</Typography>
                            </Box>

                            <Button onClick={() => setVerificationModalOpen(false)} autoFocus sx={{ minWidth: 30 }} className='p-0'>
                                <span className="material-symbols-outlined text-black">
                                    cancel
                                </span>
                            </Button>
                        </Box>

                        <hr />

                        <Box className='row'>


                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        className='w-100'
                                        options={selectMR}
                                        renderInput={(params) => <TextField {...params} label="Title" />}
                                    />
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField label="First Name" defaultValue={contactDetails.length>0 && contactDetails[0]["First Name"] }  className='form-control' variant="outlined" />
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField label="Middle Name" variant="outlined" className='form-control' />
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField label="Last Name" defaultValue={contactDetails.length>0 && contactDetails[0]["Last Name"]} variant="outlined" className='form-control' />
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <LocalizationProvider
                                        className="pe-0 sadik"
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <DatePicker className=" w-100"
                                            defaultValue={currentDate}// Set the default value using the value prop
                                            onChange={(e) => setCurrentDate(e)} // Update the default date when the user changes it                      
                                            inputFormat="DD/MM/YYYY" // Set the input format to "dd/mm/yyyy"
                                        />
                                    </LocalizationProvider>

                                    {/* <LocalizationProvider
                                        className="pe-0"
                                        dateAdapter={AdapterDayjs}
                                    >
                                        <DatePicker className="datepicker w-100"
                                            defaultValue={nextDate}
                                            onChange={(e) => setNextDate(e)}                      
                                            inputFormat="DD/MM/YYYY"
                                        />
                                    </LocalizationProvider> */}
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                {/* <Box class="input-group mb-3">
                                    <TextField label="Gender" variant="outlined" className='form-control' />
                                </Box> */}

                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label" className='sembold'>Gender</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                    >
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="other" control={<Radio />} label="Other" />
                                    </RadioGroup>
                                </FormControl>

                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <textarea className='textarea form-control' placeholder='Address1'></textarea>
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <textarea className='textarea form-control' placeholder='Address2'></textarea>
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <textarea className='textarea form-control' placeholder='Address3'></textarea>
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <textarea className='textarea form-control' placeholder='Address4'></textarea>
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField label="Post Town" variant="outlined" className='form-control' />
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>

                                <Autocomplete
                                    id="country-select-demo"
                                    options={countries}
                                    autoHighlight
                                    getOptionLabel={(option) => option.label}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            <img
                                                loading="lazy"
                                                width="20"
                                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                alt=""
                                            />
                                            {option.label} ({option.code}) +{option.phone}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            className='form-control'
                                            {...params}
                                            label="Choose a country"
                                            defaultValue={contactDetails[0].Country}
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField label="PostCode" defaultValue={contactDetails.length>0 && contactDetails[0]["PostCode"]} variant="outlined" className='form-control' />
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField label="County" defaultValue={contactDetails.length>0 && contactDetails[0]["County"]} variant="outlined" className='form-control' />
                                </Box>
                            </Box>

                            <Box className='col-xl-6 col-md-6'>
                                <Box class="input-group mb-3">
                                    <TextField label="Driving License Number" defaultValue={amlDetails.drivingLicNo} variant="outlined" className='form-control' />
                                </Box>
                            </Box>

                            <Box className='col-md-6'>
                                <Button variant="text" className="btn-blue btn-block" onClick={Json_VerifyDrivingLicence}>
                                    Verify
                                    <NavigateNextIcon className='ms-2' />
                                </Button>
                            </Box>
                        </Box>

                    </DialogContentText>
                </DialogContent>
                {/* <DialogActions>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button onClick={handleClose} autoFocus>
                            Agree
                        </Button>
                    </DialogActions> */}
            </Dialog>

            {/* Checkmodal check modal End */}

            {/* viewer modal start */}
            <Dialog
                open={isViewerModalOpen}
                onClose={() => setIsViewerModalOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className="custom-modal"

            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box className="d-flex align-items-center justify-content-between">
                            <Box className="dropdown-box">
                                <Typography variant="h4" className='font-18 text-black'>Driving License Verification</Typography>
                            </Box>

                            <Button onClick={() => setIsViewerModalOpen(false)} autoFocus sx={{ minWidth: 30 }} className='p-0'>
                                <span className="material-symbols-outlined text-black">
                                    cancel
                                </span>
                            </Button>
                        </Box>

                        <hr />

                        <TestPDF/>

                    </DialogContentText>
                </DialogContent>
            </Dialog>

            {/* viewer modal end */}


        </Box>

    )
}


export default ContactDetails


// country
// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
const countries = [
    { code: 'AD', label: 'Andorra', phone: '376' },
    {
        code: 'AE',
        label: 'United Arab Emirates',
        phone: '971',
    },
    { code: 'AF', label: 'Afghanistan', phone: '93' },
    {
        code: 'AG',
        label: 'Antigua and Barbuda',
        phone: '1-268',
    },
    { code: 'AI', label: 'Anguilla', phone: '1-264' },
    { code: 'AL', label: 'Albania', phone: '355' },
    { code: 'AM', label: 'Armenia', phone: '374' },
    { code: 'AO', label: 'Angola', phone: '244' },
    { code: 'AQ', label: 'Antarctica', phone: '672' },
    { code: 'AR', label: 'Argentina', phone: '54' },
    { code: 'AS', label: 'American Samoa', phone: '1-684' },
    { code: 'AT', label: 'Austria', phone: '43' },
    {
        code: 'AU',
        label: 'Australia',
        phone: '61',
        suggested: true,
    },
    { code: 'AW', label: 'Aruba', phone: '297' },
    { code: 'AX', label: 'Alland Islands', phone: '358' },
    { code: 'AZ', label: 'Azerbaijan', phone: '994' },
    {
        code: 'BA',
        label: 'Bosnia and Herzegovina',
        phone: '387',
    },
    { code: 'BB', label: 'Barbados', phone: '1-246' },
    { code: 'BD', label: 'Bangladesh', phone: '880' },
    { code: 'BE', label: 'Belgium', phone: '32' },
    { code: 'BF', label: 'Burkina Faso', phone: '226' },
    { code: 'BG', label: 'Bulgaria', phone: '359' },
    { code: 'BH', label: 'Bahrain', phone: '973' },
    { code: 'BI', label: 'Burundi', phone: '257' },
    { code: 'BJ', label: 'Benin', phone: '229' },
    { code: 'BL', label: 'Saint Barthelemy', phone: '590' },
    { code: 'BM', label: 'Bermuda', phone: '1-441' },
    { code: 'BN', label: 'Brunei Darussalam', phone: '673' },
    { code: 'BO', label: 'Bolivia', phone: '591' },
    { code: 'BR', label: 'Brazil', phone: '55' },
    { code: 'BS', label: 'Bahamas', phone: '1-242' },
    { code: 'BT', label: 'Bhutan', phone: '975' },
    { code: 'BV', label: 'Bouvet Island', phone: '47' },
    { code: 'BW', label: 'Botswana', phone: '267' },
    { code: 'BY', label: 'Belarus', phone: '375' },
    { code: 'BZ', label: 'Belize', phone: '501' },
    {
        code: 'CA',
        label: 'Canada',
        phone: '1',
        suggested: true,
    },
    {
        code: 'CC',
        label: 'Cocos (Keeling) Islands',
        phone: '61',
    },
    {
        code: 'CD',
        label: 'Congo, Democratic Republic of the',
        phone: '243',
    },
    {
        code: 'CF',
        label: 'Central African Republic',
        phone: '236',
    },
    {
        code: 'CG',
        label: 'Congo, Republic of the',
        phone: '242',
    },
    { code: 'CH', label: 'Switzerland', phone: '41' },
    { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
    { code: 'CK', label: 'Cook Islands', phone: '682' },
    { code: 'CL', label: 'Chile', phone: '56' },
    { code: 'CM', label: 'Cameroon', phone: '237' },
    { code: 'CN', label: 'China', phone: '86' },
    { code: 'CO', label: 'Colombia', phone: '57' },
    { code: 'CR', label: 'Costa Rica', phone: '506' },
    { code: 'CU', label: 'Cuba', phone: '53' },
    { code: 'CV', label: 'Cape Verde', phone: '238' },
    { code: 'CW', label: 'Curacao', phone: '599' },
    { code: 'CX', label: 'Christmas Island', phone: '61' },
    { code: 'CY', label: 'Cyprus', phone: '357' },
    { code: 'CZ', label: 'Czech Republic', phone: '420' },
    {
        code: 'DE',
        label: 'Germany',
        phone: '49',
        suggested: true,
    },
    { code: 'DJ', label: 'Djibouti', phone: '253' },
    { code: 'DK', label: 'Denmark', phone: '45' },
    { code: 'DM', label: 'Dominica', phone: '1-767' },
    {
        code: 'DO',
        label: 'Dominican Republic',
        phone: '1-809',
    },
    { code: 'DZ', label: 'Algeria', phone: '213' },
    { code: 'EC', label: 'Ecuador', phone: '593' },
    { code: 'EE', label: 'Estonia', phone: '372' },
    { code: 'EG', label: 'Egypt', phone: '20' },
    { code: 'EH', label: 'Western Sahara', phone: '212' },
    { code: 'ER', label: 'Eritrea', phone: '291' },
    { code: 'ES', label: 'Spain', phone: '34' },
    { code: 'ET', label: 'Ethiopia', phone: '251' },
    { code: 'FI', label: 'Finland', phone: '358' },
    { code: 'FJ', label: 'Fiji', phone: '679' },
    {
        code: 'FK',
        label: 'Falkland Islands (Malvinas)',
        phone: '500',
    },
    {
        code: 'FM',
        label: 'Micronesia, Federated States of',
        phone: '691',
    },
    { code: 'FO', label: 'Faroe Islands', phone: '298' },
    {
        code: 'FR',
        label: 'France',
        phone: '33',
        suggested: true,
    },
    { code: 'GA', label: 'Gabon', phone: '241' },
    { code: 'GB', label: 'United Kingdom', phone: '44' },
    { code: 'GD', label: 'Grenada', phone: '1-473' },
    { code: 'GE', label: 'Georgia', phone: '995' },
    { code: 'GF', label: 'French Guiana', phone: '594' },
    { code: 'GG', label: 'Guernsey', phone: '44' },
    { code: 'GH', label: 'Ghana', phone: '233' },
    { code: 'GI', label: 'Gibraltar', phone: '350' },
    { code: 'GL', label: 'Greenland', phone: '299' },
    { code: 'GM', label: 'Gambia', phone: '220' },
    { code: 'GN', label: 'Guinea', phone: '224' },
    { code: 'GP', label: 'Guadeloupe', phone: '590' },
    { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
    { code: 'GR', label: 'Greece', phone: '30' },
    {
        code: 'GS',
        label: 'South Georgia and the South Sandwich Islands',
        phone: '500',
    },
    { code: 'GT', label: 'Guatemala', phone: '502' },
    { code: 'GU', label: 'Guam', phone: '1-671' },
    { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
    { code: 'GY', label: 'Guyana', phone: '592' },
    { code: 'HK', label: 'Hong Kong', phone: '852' },
    {
        code: 'HM',
        label: 'Heard Island and McDonald Islands',
        phone: '672',
    },
    { code: 'HN', label: 'Honduras', phone: '504' },
    { code: 'HR', label: 'Croatia', phone: '385' },
    { code: 'HT', label: 'Haiti', phone: '509' },
    { code: 'HU', label: 'Hungary', phone: '36' },
    { code: 'ID', label: 'Indonesia', phone: '62' },
    { code: 'IE', label: 'Ireland', phone: '353' },
    { code: 'IL', label: 'Israel', phone: '972' },
    { code: 'IM', label: 'Isle of Man', phone: '44' },
    { code: 'IN', label: 'India', phone: '91' },
    {
        code: 'IO',
        label: 'British Indian Ocean Territory',
        phone: '246',
    },
    { code: 'IQ', label: 'Iraq', phone: '964' },
    {
        code: 'IR',
        label: 'Iran, Islamic Republic of',
        phone: '98',
    },
    { code: 'IS', label: 'Iceland', phone: '354' },
    { code: 'IT', label: 'Italy', phone: '39' },
    { code: 'JE', label: 'Jersey', phone: '44' },
    { code: 'JM', label: 'Jamaica', phone: '1-876' },
    { code: 'JO', label: 'Jordan', phone: '962' },
    {
        code: 'JP',
        label: 'Japan',
        phone: '81',
        suggested: true,
    },
    { code: 'KE', label: 'Kenya', phone: '254' },
    { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
    { code: 'KH', label: 'Cambodia', phone: '855' },
    { code: 'KI', label: 'Kiribati', phone: '686' },
    { code: 'KM', label: 'Comoros', phone: '269' },
    {
        code: 'KN',
        label: 'Saint Kitts and Nevis',
        phone: '1-869',
    },
    {
        code: 'KP',
        label: "Korea, Democratic People's Republic of",
        phone: '850',
    },
    { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    { code: 'KW', label: 'Kuwait', phone: '965' },
    { code: 'KY', label: 'Cayman Islands', phone: '1-345' },
    { code: 'KZ', label: 'Kazakhstan', phone: '7' },
    {
        code: 'LA',
        label: "Lao People's Democratic Republic",
        phone: '856',
    },
    { code: 'LB', label: 'Lebanon', phone: '961' },
    { code: 'LC', label: 'Saint Lucia', phone: '1-758' },
    { code: 'LI', label: 'Liechtenstein', phone: '423' },
    { code: 'LK', label: 'Sri Lanka', phone: '94' },
    { code: 'LR', label: 'Liberia', phone: '231' },
    { code: 'LS', label: 'Lesotho', phone: '266' },
    { code: 'LT', label: 'Lithuania', phone: '370' },
    { code: 'LU', label: 'Luxembourg', phone: '352' },
    { code: 'LV', label: 'Latvia', phone: '371' },
    { code: 'LY', label: 'Libya', phone: '218' },
    { code: 'MA', label: 'Morocco', phone: '212' },
    { code: 'MC', label: 'Monaco', phone: '377' },
    {
        code: 'MD',
        label: 'Moldova, Republic of',
        phone: '373',
    },
    { code: 'ME', label: 'Montenegro', phone: '382' },
    {
        code: 'MF',
        label: 'Saint Martin (French part)',
        phone: '590',
    },
    { code: 'MG', label: 'Madagascar', phone: '261' },
    { code: 'MH', label: 'Marshall Islands', phone: '692' },
    {
        code: 'MK',
        label: 'Macedonia, the Former Yugoslav Republic of',
        phone: '389',
    },
    { code: 'ML', label: 'Mali', phone: '223' },
    { code: 'MM', label: 'Myanmar', phone: '95' },
    { code: 'MN', label: 'Mongolia', phone: '976' },
    { code: 'MO', label: 'Macao', phone: '853' },
    {
        code: 'MP',
        label: 'Northern Mariana Islands',
        phone: '1-670',
    },
    { code: 'MQ', label: 'Martinique', phone: '596' },
    { code: 'MR', label: 'Mauritania', phone: '222' },
    { code: 'MS', label: 'Montserrat', phone: '1-664' },
    { code: 'MT', label: 'Malta', phone: '356' },
    { code: 'MU', label: 'Mauritius', phone: '230' },
    { code: 'MV', label: 'Maldives', phone: '960' },
    { code: 'MW', label: 'Malawi', phone: '265' },
    { code: 'MX', label: 'Mexico', phone: '52' },
    { code: 'MY', label: 'Malaysia', phone: '60' },
    { code: 'MZ', label: 'Mozambique', phone: '258' },
    { code: 'NA', label: 'Namibia', phone: '264' },
    { code: 'NC', label: 'New Caledonia', phone: '687' },
    { code: 'NE', label: 'Niger', phone: '227' },
    { code: 'NF', label: 'Norfolk Island', phone: '672' },
    { code: 'NG', label: 'Nigeria', phone: '234' },
    { code: 'NI', label: 'Nicaragua', phone: '505' },
    { code: 'NL', label: 'Netherlands', phone: '31' },
    { code: 'NO', label: 'Norway', phone: '47' },
    { code: 'NP', label: 'Nepal', phone: '977' },
    { code: 'NR', label: 'Nauru', phone: '674' },
    { code: 'NU', label: 'Niue', phone: '683' },
    { code: 'NZ', label: 'New Zealand', phone: '64' },
    { code: 'OM', label: 'Oman', phone: '968' },
    { code: 'PA', label: 'Panama', phone: '507' },
    { code: 'PE', label: 'Peru', phone: '51' },
    { code: 'PF', label: 'French Polynesia', phone: '689' },
    { code: 'PG', label: 'Papua New Guinea', phone: '675' },
    { code: 'PH', label: 'Philippines', phone: '63' },
    { code: 'PK', label: 'Pakistan', phone: '92' },
    { code: 'PL', label: 'Poland', phone: '48' },
    {
        code: 'PM',
        label: 'Saint Pierre and Miquelon',
        phone: '508',
    },
    { code: 'PN', label: 'Pitcairn', phone: '870' },
    { code: 'PR', label: 'Puerto Rico', phone: '1' },
    {
        code: 'PS',
        label: 'Palestine, State of',
        phone: '970',
    },
    { code: 'PT', label: 'Portugal', phone: '351' },
    { code: 'PW', label: 'Palau', phone: '680' },
    { code: 'PY', label: 'Paraguay', phone: '595' },
    { code: 'QA', label: 'Qatar', phone: '974' },
    { code: 'RE', label: 'Reunion', phone: '262' },
    { code: 'RO', label: 'Romania', phone: '40' },
    { code: 'RS', label: 'Serbia', phone: '381' },
    { code: 'RU', label: 'Russian Federation', phone: '7' },
    { code: 'RW', label: 'Rwanda', phone: '250' },
    { code: 'SA', label: 'Saudi Arabia', phone: '966' },
    { code: 'SB', label: 'Solomon Islands', phone: '677' },
    { code: 'SC', label: 'Seychelles', phone: '248' },
    { code: 'SD', label: 'Sudan', phone: '249' },
    { code: 'SE', label: 'Sweden', phone: '46' },
    { code: 'SG', label: 'Singapore', phone: '65' },
    { code: 'SH', label: 'Saint Helena', phone: '290' },
    { code: 'SI', label: 'Slovenia', phone: '386' },
    {
        code: 'SJ',
        label: 'Svalbard and Jan Mayen',
        phone: '47',
    },
    { code: 'SK', label: 'Slovakia', phone: '421' },
    { code: 'SL', label: 'Sierra Leone', phone: '232' },
    { code: 'SM', label: 'San Marino', phone: '378' },
    { code: 'SN', label: 'Senegal', phone: '221' },
    { code: 'SO', label: 'Somalia', phone: '252' },
    { code: 'SR', label: 'Suriname', phone: '597' },
    { code: 'SS', label: 'South Sudan', phone: '211' },
    {
        code: 'ST',
        label: 'Sao Tome and Principe',
        phone: '239',
    },
    { code: 'SV', label: 'El Salvador', phone: '503' },
    {
        code: 'SX',
        label: 'Sint Maarten (Dutch part)',
        phone: '1-721',
    },
    {
        code: 'SY',
        label: 'Syrian Arab Republic',
        phone: '963',
    },
    { code: 'SZ', label: 'Swaziland', phone: '268' },
    {
        code: 'TC',
        label: 'Turks and Caicos Islands',
        phone: '1-649',
    },
    { code: 'TD', label: 'Chad', phone: '235' },
    {
        code: 'TF',
        label: 'French Southern Territories',
        phone: '262',
    },
    { code: 'TG', label: 'Togo', phone: '228' },
    { code: 'TH', label: 'Thailand', phone: '66' },
    { code: 'TJ', label: 'Tajikistan', phone: '992' },
    { code: 'TK', label: 'Tokelau', phone: '690' },
    { code: 'TL', label: 'Timor-Leste', phone: '670' },
    { code: 'TM', label: 'Turkmenistan', phone: '993' },
    { code: 'TN', label: 'Tunisia', phone: '216' },
    { code: 'TO', label: 'Tonga', phone: '676' },
    { code: 'TR', label: 'Turkey', phone: '90' },
    {
        code: 'TT',
        label: 'Trinidad and Tobago',
        phone: '1-868',
    },
    { code: 'TV', label: 'Tuvalu', phone: '688' },
    {
        code: 'TW',
        label: 'Taiwan',
        phone: '886',
    },
    {
        code: 'TZ',
        label: 'United Republic of Tanzania',
        phone: '255',
    },
    { code: 'UA', label: 'Ukraine', phone: '380' },
    { code: 'UG', label: 'Uganda', phone: '256' },
    {
        code: 'US',
        label: 'United States',
        phone: '1',
        suggested: true,
    },
    { code: 'UY', label: 'Uruguay', phone: '598' },
    { code: 'UZ', label: 'Uzbekistan', phone: '998' },
    {
        code: 'VA',
        label: 'Holy See (Vatican City State)',
        phone: '379',
    },
    {
        code: 'VC',
        label: 'Saint Vincent and the Grenadines',
        phone: '1-784',
    },
    { code: 'VE', label: 'Venezuela', phone: '58' },
    {
        code: 'VG',
        label: 'British Virgin Islands',
        phone: '1-284',
    },
    {
        code: 'VI',
        label: 'US Virgin Islands',
        phone: '1-340',
    },
    { code: 'VN', label: 'Vietnam', phone: '84' },
    { code: 'VU', label: 'Vanuatu', phone: '678' },
    { code: 'WF', label: 'Wallis and Futuna', phone: '681' },
    { code: 'WS', label: 'Samoa', phone: '685' },
    { code: 'XK', label: 'Kosovo', phone: '383' },
    { code: 'YE', label: 'Yemen', phone: '967' },
    { code: 'YT', label: 'Mayotte', phone: '262' },
    { code: 'ZA', label: 'South Africa', phone: '27' },
    { code: 'ZM', label: 'Zambia', phone: '260' },
    { code: 'ZW', label: 'Zimbabwe', phone: '263' },
];



// select title
const selectMR = [
    { label: 'Mr' },
    { label: 'Mrs' },
    { label: 'Miss' },
    { label: 'Ms' },
    { label: 'Dr' }
];

// rfce