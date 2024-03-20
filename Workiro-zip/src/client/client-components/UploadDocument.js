import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import FolderIcon from '@mui/icons-material/Folder';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Checkbox, FormControlLabel } from '@mui/material';
import CommanCLS from '../../services/CommanService';
import dayjs from 'dayjs';
import CreateNewModalTask from '../../components/CreateNewModal';
import { red } from '@mui/material/colors';


function UploadDocument({ openUploadDocument, setOpenUploadDocument }) {

    const handleCloseDocumentUpload = () => {
        setOpenUploadDocument(false);
    };

    const [agrno, setAgrNo] = useState(localStorage.getItem("agrno"));
    const [password, setPassword] = useState(localStorage.getItem("Password"));
    const [Email, setEmail] = useState(localStorage.getItem("Email"));
    const [txtFolderId, setTxtFolderId] = useState(localStorage.getItem("ProjectId"));

    const [txtFolderData, setTextFolderData] = useState(null);


    const [clientList, setClientList] = useState([]);
    const [sectionList, setSectionList] = useState([]);
    const [folderList, setFolderList] = useState([]);
    const [udfTable, setUDFTable] = useState([]);
    const [getAllFolderData, setGetAllFolderData] = useState([]);

    const baseUrl = "https://practicetest.docusoftweb.com/PracticeServices.asmx/"; // base url for api
    //   let dt = new LoginDetails();
    let cls = new CommanCLS(baseUrl, agrno, Email, password);

    const [selectedFiles, setSelectedFiles] = useState([]);////////////Set file selected and upload

    const [txtClientId, setTxtClientId] = useState(null);/////////////////for clientid set

    const [txtClientData, setTxtClientData] = useState(null);/////////////////for clientid set

    const [txtSectionId, setTxtSectionId] = useState(null);//////for sectionid set

    const [txtSectionData, setTxtSectionData] = useState(null);//////for sectionid set

    const [documentDate, setDocumentDate] = useState(null); // Initialize the selected date state

    const [receivedDate, setReceivedDate] = useState(null); // Initialize the selected date state

    const [standarDescription, setStandarDescription] = useState([]); // Initialize the selected date state

    const [txtStandarDescription, settxtStandarDescription] = useState(""); // Initialize the selected date state

    const [subSectionData, setSubSectionData] = useState([]); // Initialize the selected date state

    const [txtSubSectionData, setTxtSubSectionData] = useState(null); // Initialize the selected date state

    const [subSectionBool, setSubSectionBool] = useState(false); // Initialize the selected date state

    const [categoryid, setCategoryId] = useState(0);

    const [categoryList, setCategoryList] = useState([])

    const [showModalCreateTask, setshowModalCreateTask] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [inputValue, setInputValue] = useState(''); // State to manage the input value

    const [fileLangth, setFileLength] = useState(0);

    const [countval, setCountval] = useState(2);

    const [validation, setValidation] = useState("");

    const [TaskType, setTaskType] = useState("");

    let count = 2;

    const [selectedValueUDF, setSelectedValueUDF] = useState([]);
    const [selectedValueUDFText, setselectedValueUDFText] = useState("");
    const [udfIdWithValue, setUDFidWithValue] = useState([]);

    // const [passButtonHide, setPassButtonHide] = useState(false);

    // Event handler to handle file selection
    const handleFileSelect = async (event) => {
        const files = event.target.files;
        const selectedFilesArray = Array.from(files);
        let couter = 0;
        for (let i = 0; i < selectedFilesArray.length; i++) {
            couter++;
            const file = selectedFilesArray[i];
            const isFileAlreadySelected = selectedFiles.some((selectedFile) => selectedFile.FileName === file.name);

            if (!isFileAlreadySelected) {
                await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        let fileByte = reader.result.split(";")[1].replace("base64,", "");
                        const fileData = {
                            FileName: file.name,
                            Base64: fileByte ? fileByte : "", // Base64 data of the file
                            FileSize: file.size,
                            Preview: reader.result, // Data URL for preview
                            DocId: "",
                            GUID: generateGUID()
                        };
                        setSelectedFiles((prevUploadedFiles) => [...prevUploadedFiles, fileData]);
                        resolve();
                    };
                    reader.readAsDataURL(file); // Read file as data URL (base64)
                });
            }
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setFileLength(selectedFiles.length);
        }, 2000);
    }, [selectedFiles]);

    const RemoveFiles = (id) => {
        // Filter out the object with the specified ID
        const resutl = selectedFiles.filter(guid => guid.GUID !== id);
        setSelectedFiles(resutl);
    };

    function generateGUID() {
        const cryptoObj = window.crypto || window.msCrypto; // for IE 11 compatibility

        if (cryptoObj && cryptoObj.getRandomValues) {
            // Use crypto.getRandomValues to generate a GUID if available
            const buf = new Uint16Array(8);
            cryptoObj.getRandomValues(buf);

            // Convert to string format
            return (
                pad4(buf[0]) + pad4(buf[1]) + '-' + pad4(buf[2]) + '-' + pad4(buf[3]) + '-' +
                pad4(buf[4]) + '-' + pad4(buf[5]) + pad4(buf[6]) + pad4(buf[7])
            );
        } else {
            // Fallback if crypto.getRandomValues is not supported
            console.error("crypto.getRandomValues not supported. GUID generation failed.");
            return null;
        }
    }

    function pad4(num) {
        let ret = num.toString(16);
        while (ret.length < 4) {
            ret = '0' + ret;
        }
        return ret;
    }

    useEffect(() => {
        console.log("selectedFiles", selectedFiles);
    }, [selectedFiles]);


    //////////////////////////Get Foder Data
    function Json_GetFolders() {
        let obj = {
            agrno: agrno,
            Email: Email,
            password: password
        }

        try {
            cls.Json_GetFolders(obj, function (sts, data) {
                if (sts) {
                    if (data) {
                        let js = JSON.parse(data);
                        let tbl = js.Table;
                        let result = tbl.filter((el) => el.FolderID === parseInt(txtFolderId));
                        console.log("get folder list", tbl);
                        setFolderList(tbl);
                        if (result.length > 0) {
                            console.log("get folder list", result);
                            setTextFolderData(result[0])
                        }
                    }
                }
            });
        } catch (error) {
            console.log({
                status: false,
                message: "Folder is Blank Try again",
                error: error,
            });
        }
    }

    function Json_GetFolderData() {
        console.log("Json_GetFolderData11", txtFolderId);
        try {
            let o = {};
            o.ProjectId = txtFolderId;
            o.SectionId = "-1";
            o.ClientId = "";
            cls.Json_GetFolderData(o, function (sts, data) {
                if (sts) {
                    let js = JSON.parse(data);
                    console.log("Json_GetFolderData", js);
                    setGetAllFolderData(js);
                    let clientList = js.Table1;
                    if (clientList.length > 0) {
                        setClientList(clientList);
                    }
                    let sectionList = js.Table;
                    if (sectionList.length > 0) {
                        setSectionList(sectionList);
                    }
                    let udfTable2 = js.Table2;
                    if (udfTable2.length > 0) {
                        setUDFTable(udfTable2);
                    }
                }
            });
        } catch (error) {
            console.log({ Status: false, mgs: "Data not found", Error: error });
        }
    }





    useEffect(() => {
        Json_GetFolders();
        Json_GetFolderData();
        setDocumentDate(dayjs(cls.GetCurrentDayDate)); // Update the selected date state with the new date value
        setReceivedDate(dayjs(cls.GetNextDayDate)); // Update the selected date state with the new date value
        console.log("GetCurrentDayDate", cls.GetCurrentDayDate());
        console.log("GetNextDayDate", cls.GetNextDayDate());
        setOpenModal(false);
        setshowModalCreateTask(false)
    }, [])

    const handleOnFolderClick = (data) => {
        setInputValue('');
        console.log("Get Folder On click", data);
        if(data){
            setTxtFolderId(data.FolderID)
            setTextFolderData(data)
        }
        Json_GetFolderData()

    }

    const handleClientChange = (data) => {
        console.log("Get Clietn On click", data);
        setTxtClientId(data.ClientID)
        setTxtClientData(data)
    }





    const handleSectionChange = (data) => {
        console.log("Get Clietn On click", data);
        setTxtSectionId(data.SecID)
        setTxtSectionData(data)
        Json_GetCategory(data.SecID)
        Json_GetSubSections(data.SecID)
    }




    const handleCategoryChange = (data) => {
        console.log("Get Clietn On click", data);
        setCategoryId(data.CatId)
    }
    const handleStandarDescriptionChange = (data) => {
        console.log("Get Clietn On click", data);
        settxtStandarDescription(data.Description)
    }

    const handleDescriptionChange = (e) => {
        console.log("Get Clietn On click", e.target.value);
        settxtStandarDescription(e.target.value)
    }


    function Json_GetSubSections(SectionId) {
        try {
            let o = {};
            o.SectionId = SectionId;
            o.ProjectId = txtFolderId;
            cls.Json_GetSubSections(o, function (sts, data) {
                if (sts) {
                    console.log("Json_GetSubSections", data);
                    let json = JSON.parse(data);
                    let tbl1 = json.Table1;
                    if (tbl1.length > 0) {
                        setSubSectionBool(true);
                        setSubSectionData(tbl1);
                    }
                    else {
                        setSubSectionBool(false);
                    }

                }
            });
        } catch (error) {
            console.log({ Status: false, mgs: "Data not found", Error: error });
        }
    }

    const handleSubSectionChange = (data) => {
        console.log("Get Clietn On click", data);
        setTxtSubSectionData(data);
    }

    function Json_GetCategory(SectionId) {

        try {
            let o = {};
            o.SectionId = SectionId;
            cls.Json_GetCategory(o, function (sts, data) {
                if (sts) {
                    console.log("Json_GetCategory", data);
                    let json = JSON.parse(data);
                    let tbl1 = json.Table1;
                    let tbl = json.Table;
                    if (tbl.length > 0) {
                        setCategoryList(tbl)
                    }
                    if (tbl1.length > 0) {
                        setStandarDescription(tbl1);
                    }



                }
            });
        } catch (error) {
            console.log({ Status: false, mgs: "Data not found", Error: error });
        }
    }
    //////////////////////////End Get Foder Data
    /////////////////////////////DAte Set



    const handleDateChangeDocument = (date) => {
        console.log("Get Clietn On click", dayjs(date).format('YYYY/MM/DD'));
        setDocumentDate(dayjs(date).format('YYYY/MM/DD')); // Update the selected date state
    };

    const handleDateChangeRecieved = (date) => {
        console.log("Get Clietn On click", dayjs(date).format('YYYY/MM/DD'));
        setReceivedDate(dayjs(date).format('YYYY/MM/DD')); // Update the selected date state
    };

    const [createTaskChk, setCreateTaskChk] = useState(false);

    const [createPublishChk, setCreatePublishChk] = useState(false);

    const [buttonNameText, setButtonNameText] = useState("Submit");


    const handleCheckboxChangeCreateTask = (event) => {
        setCreateTaskChk(event.target.checked); // Update the createTask state when the checkbox value changes
        setTaskType("CRM");
        if (event.target.checked || createPublishChk) {
            setButtonNameText("Submit & Create Task");

        }
        else {
            setButtonNameText("Submit")
        }

    };



    const handleCheckboxChangeCreatePublish = (event) => {
        setCreatePublishChk(event.target.checked); // Update the createTask state when the checkbox value changes
        setTaskType("Portal");
        if (event.target.checked || createTaskChk) {
            setButtonNameText("Submit & Create Task")
        }
        else {
            setButtonNameText("Submit")
        }

    };



    const [step, setStep] = useState(1);

    const handleNext = () => {
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };



    const UploadDocumentCreattTask = async () => {
        if (selectedFiles.length > 0) {
            for (let i of selectedFiles) {
                await Json_RegisterItem(i)
            }
            // setOpenUploadDocument(false);
        }
        else {
            Json_RegisterItem()
        }
    }

    const [createNewFileObj, setCreateNewFileObj] = useState([]);

    function Json_RegisterItem(fileData) {
        let  values;
        let concatenatedString;
if(udfIdWithValue){
     values = Object.values(udfIdWithValue);
     concatenatedString = values.join(', ');
}
       

        let validationMessage = '';

        if (!txtFolderData || !txtFolderData.FolderID) {
            validationMessage += "Please Select Folder. ";
        }

        if (!txtClientData || !txtClientData.ClientID) {
            validationMessage += "Please Select Reference. ";
        }

        if (!txtSectionData || !txtSectionData.SecID) {
            validationMessage += "Please Select Section. ";
        }
        if (validationMessage === '') {

            let obj = {
                "sectionId": txtSectionData.SecID,
                "deptId": 0,
                "folderId": txtFolderData.FolderID,
                "categoryId": categoryid ? categoryid : 0,
                "subSectionId": txtSubSectionData ? txtSubSectionData.SubSectionID : 0,
                "retForMonth": "-1",
                "deptName": "",
                "folderName": txtFolderData.Folder,
                "originatorId": txtClientData.ClientID,
                "senderId": txtClientData.ClientID,
                "sectionName": txtSectionData.Sec,
                "extDescription": "",
                "docDirection": "Incoming",
                "description": txtStandarDescription,
                "priority": "",
                "stickyNote": "",
                "fileName": fileData ? fileData.FileName : "",
                "forActionList": "",
                "forInformationList": "",
                "forGroupList": "",
                "uDFList": concatenatedString,
                "sUDFList": "",
                "clientname": txtClientData.Client,
                "receiveDate": dayjs(receivedDate).format("YYYY/MM/DD"),
                "actionByDate": "1990/01/01",
                "actionDate": dayjs(documentDate).format("YYYY/MM/DD"),
                "docViewedDate": dayjs(documentDate).format("YYYY/MM/DD"),
                "strb64": fileData ? fileData.Base64 : "",
                "strtxt64": "",
                "EmailMessageId": ""
            }
            console.log("Json_RegisterItem", obj);
            if(fileData){
                fileData.DocId = "111111";
            }
           

            setCreateNewFileObj((Previous) => [...Previous, fileData]);
            //setOpenUploadDocument(false);
            setshowModalCreateTask(true);
            setOpenModal(true);

            //    setTimeout(() => {
            //     setPassButtonHide(false);
            // }, 3000);

            // cls.Json_RegisterItem1(obj, function (sts, data) {
            //     if (sts && data) {
            //         let js = JSON.parse(data)
            //         console.log("Json_RegisterItem", js)



            //     }
            // })

        } else {
            // Data is invalid, set the validation message
            setValidation(validationMessage);
            // Hide validation message after 2 seconds
            setTimeout(() => {
                setValidation('');
            }, 3000);
        }



    }

   

    const handleAutocompleteChangeUdf = (id, newValue,udf) => { 
        let setUdf=newValue.UDFID+":"+newValue[udf];   

        setSelectedValueUDF(prevState => ({
            ...prevState,
            [id]: newValue // Update selected value for a specific ComboBox
        }));
     //console.log("newValue",id,newValue,udf)

        setUDFidWithValue(prevState => ({
            ...prevState,
            [id]: setUdf // Update selected value for a specific ComboBox
        }));

       
      //  const stringRepresentation = JSON.stringify(udfIdWithValue);
       // console.log("newValue11",stringRepresentation);
    };

    const handleAutocompleteChangeUdfText = (id, newValue) => {  
        let setUdf=id+":"+newValue;      
        setselectedValueUDFText(prevState => ({
            ...prevState,
            [id]: newValue // Update selected value for a specific ComboBox
        }));

        setUDFidWithValue(prevState => ({
            ...prevState,
            [id]: setUdf // Update selected value for a specific ComboBox
        }));

       // console.log("newValue",udfIdWithValue);

    };

    return (
        <React.Fragment>
            {/* <Button variant="outlined" onClick={handleClickOpenUploadDocument}>
                OpenUploadDocument alert dialog
            </Button> */}


            <Dialog
                open={openUploadDocument}
                onClose={handleCloseDocumentUpload}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className='custom-modal'
            >

                <DialogContent className='pb-0'>
                    <DialogContentText id="alert-dialog-description">

                        <Box className="d-flex align-items-center justify-content-between">
                            <Box className="dropdown-box">
                                <Typography variant="h4" className='font-18 bold text-black'>
                                    ({fileLangth}) Upload Document
                                </Typography>
                            </Box>

                            {/*  */}
                            <Button onClick={handleCloseDocumentUpload} autoFocus sx={{ minWidth: 30 }}>
                                <span className="material-symbols-outlined text-black">
                                    cancel
                                </span>
                            </Button>
                        </Box>

                        <hr />

                        {/* file upload */}
                        {step === 1 && (<>
                            <Box className="">
                                <Box className='row'>
                                    <Box className='col-lg-8 m-auto'>
                                        <Box className="file-upload-2 mt-4">
                                            <input
                                                type="file"
                                                id="file-upload"
                                                multiple
                                                onChange={handleFileSelect}
                                            />
                                            <label className="file-upload-2-label" for="file-upload">
                                                <Box className="text-center">
                                                    <span className="material-symbols-outlined icon">
                                                        cloud_upload
                                                    </span>
                                                    <Box className="upload-content-2">
                                                        <Typography variant="h4" className='font-18 bold mb-1'>
                                                            Select or drag file here
                                                        </Typography>
                                                        <Typography variant="body1" className='font-14'>
                                                            JPG, PNG or PDF, file size no more than 10MB
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </label>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box className='uploaded-list mt-4'>
                                    {selectedFiles.map((item, index) => {
                                        return <>
                                            <Box className='uploaded-box' key={index}>
                                                <CloseIcon className='close-icon' onClick={() => RemoveFiles(item.GUID)} />
                                                <DescriptionIcon />
                                                <Typography variant="body1" className='font-14 uploaded-name'>
                                                    {item.FileName}
                                                </Typography>
                                                <Typography variant="body1" className='font-12'>
                                                    {item.File}
                                                </Typography>
                                            </Box>
                                        </>
                                    })}
                                </Box>
                            </Box>
                        </>)}
                        {/*  */}
                        {step === 2 && (<>
                            <Box className='row'>
                                <Box className='col-lg-6 mb-3 col-md-6 col-sm-12'>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={folderList}
                                        value={txtFolderData}
                                        getOptionLabel={(option) => option.Folder} // Provide a function to extract the label from each option
                                        onChange={(event, newValue) => handleOnFolderClick(newValue)} // Handle the onChange event
                                        renderInput={(params) => <TextField {...params} label="Folder" />}
                                    />
                                </Box>

                                <Box className='col-lg-6 mb-3 col-md-6 col-sm-12'>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={clientList}

                                        getOptionLabel={(option) => option.Client}
                                        getOptionSelected={(option, value) => option.ClientID === value.ClientID} // Add this line

                                        onChange={(event, newValue) => handleClientChange(newValue)} // Handle the onChange event

                                        renderInput={(params) => (
                                            <TextField {...params} label="Reference" />
                                        )}
                                    />
                                </Box>

                                <Box className='col-lg-6 mb-3 col-md-6 col-sm-12 d-flex align-items-end'>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={sectionList}

                                        getOptionLabel={(option) => option.Sec}
                                        onChange={(event, newValue) => handleSectionChange(newValue)} // Handle the onChange event
                                        renderInput={(params) => <TextField {...params} label="Section" />}
                                        className='w-100'
                                    />
                                </Box>

                                {subSectionBool && <Box className='col-lg-6 mb-3 col-md-6 col-sm-12 d-flex align-items-end'>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={subSectionData}
                                        getOptionLabel={(option) => option.SubSection}
                                        onChange={(event, newValue) => handleSubSectionChange(newValue)} // Handle the onChange event
                                        renderInput={(params) => <TextField {...params} label="Subsection" />}
                                        className='w-100'
                                    />
                                </Box>}

                                <Box className='col-lg-6 mb-3 col-md-6 col-sm-12'>
                                    <label className='font-14 text-black'>Document Date</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DatePicker className=" w-100"
                                            format="DD/MM/YYYY"
                                            defaultValue={documentDate}
                                            onChange={handleDateChangeDocument} // Handle date changes
                                        />




                                    </LocalizationProvider>
                                </Box>

                                <Box className='col-lg-6 mb-3 col-md-6 col-sm-12'>
                                    <label className='font-14 text-black'>Received Date</label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DatePicker className=" w-100"
                                            format="DD/MM/YYYY"
                                            defaultValue={receivedDate}
                                            onChange={handleDateChangeRecieved} // Handle date changes
                                        />
                                    </LocalizationProvider>
                                </Box>

                                <Box className='col-lg-6 mb-3 col-md-6 col-sm-12 d-flex align-items-end'>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={standarDescription}
                                        getOptionLabel={(option) => option.Description}
                                        onChange={(event, newValue) => handleStandarDescriptionChange(newValue)} // Handle the onChange event
                                        renderInput={(params) => <TextField {...params} label="Standar Description" />}
                                        className='w-100'

                                    />
                                </Box>
                                <Box className='col-lg-6 mb-3 col-md-6 col-sm-12 d-flex align-items-end'>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={categoryList}
                                        getOptionLabel={(option) => option.CatName}
                                        onChange={(event, newValue) => handleCategoryChange(newValue)} // Handle the onChange event
                                        renderInput={(params) => <TextField {...params} label="Category" />}
                                        className='w-100'
                                    />
                                </Box>

                                <Box className='col-lg-6 mb-3 col-md-6 col-sm-12 pt-2'>
                                    <FormControlLabel control={<Checkbox checked={createTaskChk} onChange={handleCheckboxChangeCreateTask} />} label="Create Task" />
                                    <FormControlLabel control={<Checkbox checked={createPublishChk} onChange={handleCheckboxChangeCreatePublish} />} label="Publish" />
                                </Box>

                                <Box className='col-lg-12'>
                                    <textarea className='textarea w-100' onChange={handleDescriptionChange} value={txtStandarDescription} placeholder='Description'></textarea>
                                </Box>
                                <Box component="section" sx={{ color: '#f44336' }}>
                                    {validation}
                                </Box>

                            </Box>


                            <hr />
                            <Typography variant="body1" className="font-18 bold mb-2 text-black">
                                UDF Form
                            </Typography>
                            <Box className='row'>
                                {udfTable ? udfTable.map((item, index) => {
                                    switch (item.ControlType) {
                                        case "ComboBox":
                                            count++;
                                            console.log("vlaueeee", count)
                                            let data = getAllFolderData["Table" + count];
                                            if (data && data.length > 0 && item.UDFId === data[0]["UDFID"]) {
                                                return (
                                                    <Box key={index} className='col-lg-6 mb-3 col-md-6 col-sm-12'>
                                                        <Autocomplete
                                                            disablePortal
                                                            id="combo-box-demo"
                                                            options={data}  
                                                            value={selectedValueUDF['combo-box-1']}                                                         
                                                            onChange={(event,vlaue)=>handleAutocompleteChangeUdf(index, vlaue,item.UDF)} // Handle onChange event
                                                            getOptionLabel={(option) => option[item.UDF]} // Adjust this based on your option structure
                                                            renderInput={(params) => <TextField {...params} label={item.UDF} />}
                                                        />
                                                    </Box>
                                                );
                                            }
                                            break;
                                        case "TextBox":
                                            return (
                                                <Box key={index} className='col-lg-6 mb-3 col-md-6 col-sm-12'>
                                                    <TextField value={selectedValueUDFText[item.UDFId] || ""}   onChange={(event,vlaue)=>handleAutocompleteChangeUdfText(item.UDFId, event.target.value)}  id="outlined-basic" label={item.UDF} variant="outlined" className='w-100' />
                                                </Box>
                                            );
                                        default:
                                            return null; // Handle other ControlTypes if necessary
                                    }
                                    return null; // Default return in case no condition is met
                                }) : null}



                            </Box>

                            {showModalCreateTask && <CreateNewModalTask
                                documentDate={documentDate}
                                receivedDate={receivedDate}
                                createNewFileObj={createNewFileObj}
                                txtFolderData={txtFolderData}
                                txtClientData={txtClientData}
                                txtSectionData={txtSectionData}
                                TaskType={TaskType}
                                // setPassButtonHide={setPassButtonHide}
                                // passButtonHide={passButtonHide}
                                openModal={openModal}
                            ></CreateNewModalTask>}


                        </>)}



                        {/* row end */}

                        {/* UDF Start */}




                        {/* {step===4 && (<>
                    <CreateNewModalTask openModal={true}></CreateNewModalTask>
                    </>)} */}
                        {/* UDF End */}

                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Box className="d-flex mb-3 pe-3">
                        {step === 2 && (<>
                            <Button variant="text" className="btn-blue-2 me-2" onClick={handlePrevious} disabled={step === 1}>
                                Previous
                            </Button>

                            <Button variant="text" style={{ float: 'right' }} className="btn-blue-2" onClick={UploadDocumentCreattTask}>

                                {buttonNameText}

                            </Button>


                        </>)}

                        {step === 1 && (<>
                            <Button variant="text" className="btn-blue-2 me-2" onClick={handleNext}>
                                Index
                            </Button>
                        </>)}

                        {/* <Button variant="text" className="btn-blue-2" onClick={UploadDocumentCreattTask}>
                            Submit
                        </Button> */}
                    </Box>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default UploadDocument

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const Folder = [
    { label: 'Client' },
    { label: 'Cases' },
    { label: 'Customer' },
    { label: 'Share Allotments' },
    { label: 'M Customer' },
    { label: 'Process Folder' }
];