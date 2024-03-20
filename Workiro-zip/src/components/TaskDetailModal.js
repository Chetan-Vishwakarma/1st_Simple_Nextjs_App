import React, { useEffect, useRef, useState } from "react";
import CommanCLS from "../services/CommanService";
import dayjs from "dayjs";
// import LoginDetails from "../services/Utils";
import Swal from "sweetalert2";
// import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, Typography, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, Link, Chip, Stack, ListItemIcon, Radio, useMediaQuery, useTheme, Accordion, AccordionSummary, AccordionDetails, } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import {AdapterDayjs,LocalizationProvider,DatePicker} from '@mui/x-date-pickers';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BallotIcon from '@mui/icons-material/Ballot';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import DescriptionIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import user from "../images/user.jpg";
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DocumentDetails from "./DocumentDetails";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

import DatePicker from 'react-datetime';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import Fade from '@mui/material/Fade';
import GetClientList from "./GetClientList";
import {

    TextField,
} from "@mui/material";


const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));


function TaskDetailModal({ isApi, setIsApi, selectedTask, openModal, setOpen }) {
    console.log("TaskDetailModal2222", selectedTask);
    const baseUrl = "https://practicetest.docusoftweb.com/PracticeServices.asmx/";
    const [agrno, setAgrNo] = useState(localStorage.getItem("agrno"));
    const [password, setPassword] = useState(localStorage.getItem("Password"));
    const [Email, setEmail] = useState(localStorage.getItem("Email"));

    const [folderId, setFolderId] = useState(localStorage.getItem("FolderId"));
    let Cls = new CommanCLS(baseUrl, agrno, Email, password);

    /////////////////////////////////////////Task Activity

    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);

    const [txtSection, settxtSection] = React.useState(selectedTask.Section);
    const [txtClient, setTxtClient] = React.useState(selectedTask.Client);
    const [txtClientId, setTxtClientId] = React.useState(null);

    const [txtSectionId, settxtSectionId] = React.useState(null);

    const [anchorClsEl, setAnchorClsEl] = useState(null);


    const [crmTaskAcivity, setCRMTaskAcivity] = React.useState(null);
    //const [selectedTaskp, setselectedTask] = React.useState(selectedTask);
    /////////////////////////////////////////End Task Activity

    const [messageId, setMessageId] = React.useState("");

    const [addUser, setAddUser] = useState([]);
    const [ownerID, setOwnerID] = React.useState("");
    const [userList, setUserList] = React.useState([]);
    const [filterText, setFilterText] = React.useState("");

    const [currentDate, setCurrentDate] = useState(""); // Initialize with the current date in "dd/mm/yyyy" format
    const [nextDate, setNextDate] = useState("");
    const [remiderDate, setRemiderDate] = useState("");

    const [status, setStatus] = useState("");
    const [tSubject, setTSubject] = useState("");

    const messageContainerRef = useRef(null);

    ////////////////////////////////Attachment files
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [attachmentPath, setAttachmentPath] = useState([]);

    const [attOpen, setAttOpen] = React.useState(false);
    const [txtdescription, setTxtDescriptin] = React.useState("");

    const [clientList, setClientList] = useState([]);



    ////////////////////////////////End Attachment files

    const [isVisible, setIsVisible] = useState(false); // Initially visible

    // 
    const [scroll, setScroll] = React.useState('paper');
    const [getUser, setGetUser] = React.useState({});
    const [sectionList, setSectionList] = React.useState([]);

    const [clientObject, setClientObject] = useState(null);

    const [searchSectionQuery, setSearchSectionQuery] = useState("");
    const [searchClient1Query, setSearchClient1Query] = useState("");

    const toggleVisibilityCancle = () => {
        setIsVisible(false); // Toggle visibility
    };
    const handalClickEditeSubject = () => {
        setIsVisible(true); // Toggle visibility
    };
    const handalChangeSetSubject = (e) => {
        setTSubject(e.target.value); // Toggle visibility
    };

    const disablePastDt = (date) => {
        const today = new Date();
        return date.isSameOrAfter(today, 'day'); // Disable past dates

    };





    const [anchorElSec, setAnchorSectionEl] = React.useState(null);

    const openSection = Boolean(anchorElSec);
    const handleClickSection = (event) => {
        setAnchorSectionEl(event.currentTarget);
    };
    const handleCloseSection = (e) => {
        settxtSection(e.Sec)
        settxtSectionId(e.SecID)
        setAnchorSectionEl(null);
    };






    const openClient = Boolean(anchorClsEl);

    const handleClickClick = (event) => {
        setAnchorClsEl(event.currentTarget);
    };
    const handleCloseClient = (e) => {
        setClientObject(e)
        setAnchorClsEl(null);
        setTxtClient(e.Client);
        setTxtClientId(e.ClientID);


    };






    const Json_Get_CRM_Task_ActivityByTaskId = (taskid) => {
        // console.log("selectedTask333333333", taskid);
        let obj = {};
        obj.TaskID = taskid;
        try {
            Cls.Json_Get_CRM_Task_ActivityByTaskId(obj, (sts, data) => {
                if (sts) {
                    if (data) {
                        let json = JSON.parse(data);
                        const formattedActivity = json.Table.map((activity) => {
                            let ActivityDate;
                            if (activity.ActivityDate) {
                                ActivityDate = parseInt(activity.ActivityDate.slice(6, -2));
                            }
                            const date = new Date(ActivityDate);
                            return { ...activity, ActivityDate: date };
                        });
                        // console.log(
                        //     "Json_Get_CRM_Task_ActivityByTaskId",
                        //     formattedActivity
                        // );
                        setCRMTaskAcivity(
                            formattedActivity.sort((a, b) => a.ActivityDate - b.ActivityDate)
                        );

                        let obj = {
                            ActivityId: 4,
                            ActivityDate: "2023-10-04T16:36:41.000Z",
                            Notes: "Task creation email send to Nabeel User",
                            TaskId: 19101,
                            username: "User",
                        };
                        // setCRMTaskAcivity((el) => [...el, obj]);
                        // setAllTask(json.Table);
                    }
                }
            });
        } catch (err) {
            console.log("Error while calling Json_CRM_GetOutlookTask", err);
        }
    };






    async function Json_GetForwardUserList() {
        try {
            let o = {};
            o.ProjectId = folderId;
            o.SectionId = "-1";
            await Cls.Json_GetForwardUserList(o, function (sts, data) {
                if (sts) {
                    let js = JSON.parse(data);
                    let dt = js.Table;
                    if (dt.length > 0) {
                        let result = dt.filter((el) => {
                            return el.CGroup !== "Yes";
                        });

                        if (result.length > 0) {
                            result.map((el) => {
                                if (el.ID === parseFloat(localStorage.getItem("UserId"))) {
                                    setOwnerID(el.ID);
                                    setGetUser(el);
                                    setAddUser([el]);
                                    console.log("Json_GetForwardUserList11333222", el);

                                }
                            });
                        }
                        console.log("Json_GetForwardUserList11333", result);
                        setUserList(result);
                    }
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    }


    // Filter the userList based on filterText
    const filteredUserList = userList.filter((item) => {
        // Check if item and its properties are defined before accessing them
        //console.log("filterText", filterText);
        if (item && item.ForwardTo) {
            // You can customize the filtering logic here based on your requirements
            return item.ForwardTo.toLowerCase().includes(filterText.toLowerCase());
        } else {
            return false; // Return false if any required property is undefined
        }
    });

    // Event handler to handle file selection
    const handleFileSelect = (event) => {
        const files = event.target.files;
        const selectedFilesArray = Array.from(files);
        const filesData = [];

        selectedFilesArray.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                let fileByte = reader.result.split(";")[1].replace("base64,", "");
                const fileData = {
                    FileName: file.name,
                    Base64: fileByte, // Base64 data of the file
                    FileSize: file.size,
                    Preview: reader.result, // Data URL for preview
                    lastModifiedDate: dateAndTime(file.lastModifiedDate),
                };
                filesData.push(fileData);
                UploadAttachment(fileData)
                // console.log("Attachment list", filesData);
                // Check if this is the last file
                if (index === selectedFilesArray.length - 1) {
                    // Add new files to the uploadedFiles array
                    setSelectedFiles((prevUploadedFiles) => [
                        ...prevUploadedFiles,
                        ...filesData,
                    ]);
                }
            };
            reader.readAsDataURL(file); // Read file as data URL (base64)
        });
    };

    async function UploadAttachment(filedata) {
        // setLoading(true);
        // Your form submission logic, for example, making an API call
        try {

            let o = {};
            o.base64File = filedata.Base64;
            o.FileName = filedata.FileName;
            Cls.SaveTaskAttachments(o, function (sts, data) {
                if (sts && data) {
                    let res = JSON.parse(data);
                    if (res.Status === "Success") {
                        let path = window.atob(res.Message);
                        let index = path.lastIndexOf("\\");
                        let fileName = path.slice(index + 1);
                        let o = { Path: path, FileName: fileName }

                        setAttachmentPath((prevAttachments) => [...prevAttachments, o]);

                    } else {
                        console.log("Failed to save attachment.");
                    }
                } else {
                    console.log("Failed to save attachment.");
                }
            });

        } catch (error) {
            console.log({
                status: false,
                message: "Attachment is Not Uploaded Try again",
                error: error,
            });
        } finally {
            // Reset loading state after submission is complete
        }
    }

    const [attachmentFile, setAttachmentFile] = useState([]);
    const [assignUser, setAssignUser] = useState([]);

    async function Json_Get_CRM_SavedTask_ByTaskId(taskid) {
        let obj = {};
        obj.TaskId = taskid;
        await Cls.Json_Get_CRM_SavedTask_ByTaskId(obj, function (status, data) {
            if (status && data) {
                let json = JSON.parse(data);
                console.log("Json_Get_CRM_SavedTask_ByTaskId", json);
                let table2 = json.T2;
                if (table2.length > 0) {
                    let spt = table2[0].AssignedToID.split(",");
                    let pushUser = [];
                    for (let i of spt) {
                        if (i) {
                            for (let j of userList) {
                                if (parseInt(i) === j.ID) {
                                    pushUser.push(j);
                                }
                            }
                        }
                    }
                    //console.log("Json_Get_CRM_SavedTask_ByTaskId22", pushUser);
                    setAddUser(pushUser);
                }

                let table6 = json.T6;
                if (table6.length > 0) {
                    // let arrFile = [];
                    // for (let item of table6) {
                    //     arrFile.push(getFilePath(item));
                    // }
                    setAttachmentFile(table6);
                    // setTimeout(() => {
                    //     console.log("attachmentFile", attachmentFile);
                    // }, 3000);
                }
            }
        });
    }

    function getFilePath(dt) {
        const filePath = dt.DestinationPath;
        // Convert Windows file path to URL path
        const urlPath = filePath
            .replace(/\\/g, "/")
            .replace(
                "D:/Plesk/Vhosts/docusoftpractice.com/httpdocs/",
                "https://docusoftpractice.com/"
            );
        console.log("file path", urlPath);
        const fileNameWithExtension = dt.DestinationPath.match(/[^\\]+$/)[0];
        let o = {
            AttachId: dt.AttachId,
            DestinationPath: urlPath,
            fileName: fileNameWithExtension,
            data: selectedTask
        };

        return o;
    }

    function DateFormet(timestamp) {
        const date = new Date(timestamp);
        console.log("date formet1", date);
        return date;
    }

    function startFormattingDate(dt) {
        if (dt) {
            let fullDate = new Date(parseInt(dt.substr(6)));
            console.log("date formet111", fullDate);
            return fullDate;
        }

    }


    const Json_GetTaskAttachmentList = () => {
        let o = {
            TaskId: selectedTask.ID,
            StageId: 0,
            SubStageId: 0
        }
        Cls.Json_GetTaskAttachmentList(o, function (sts, data) {
            if (sts && data) {
                console.log("Json_GetTaskAttachmentList", data)
            }
        })
    }



    function Json_GetSections(fid) {
        try {
            let o = {};
            o.ProjectId = fid;
            Cls.Json_GetSections(o, function (sts, data) {
                if (sts) {
                    let js = JSON.parse(data);

                    let sectionList = js.Table;
                    if (sectionList.length > 0) {
                        setSectionList(sectionList);
                    }

                    console.log("Json_GetSections", js);
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    }


    function Json_GetFolderData() {

        try {
            let o = {};
            o.ProjectId = selectedTask.FolderID;
            o.SectionId = "-1";//selectedTask.SectionId;
            o.ClientId = "";
            Cls.Json_GetFolderData(o, function (sts, data) {
                if (sts) {
                    let js = JSON.parse(data);
                    console.log("Json_GetFolderData", js);
                    let clientList = js.Table1;
                    if (clientList.length > 0) {
                        setClientList(clientList);
                    }
                    // let sectionList = js.Table;
                    // if (sectionList.length > 0) {
                    //     setSectionList(sectionList);
                    // }
                }
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {

        settxtSection(selectedTask.Section);
        setTxtClient(selectedTask.Client);
        setTxtClient(selectedTask.Client)
        settxtSectionId(selectedTask.SectionId);
        setTxtClientId(selectedTask.ClientNo);
        setNotesMessage("");
        Json_Get_CRM_SavedTask_ByTaskId(selectedTask.ID);
        setCurrentDate(startFormattingDate(selectedTask.CreationDate));

        setNextDate(DateFormet(selectedTask.EndDateTime));
        setRemiderDate(dayjs(Cls.getCurrentDate()));

        Json_GetFolderData();
        Json_GetForwardUserList();
        setStatus(selectedTask.mstatus);
        // Json_GetTaskAttachmentList();
        setTSubject(selectedTask.Subject)

        Json_GetSections(selectedTask.FolderID)
        // const Json_CRM_GetOutlookTask=async()=>{
        //     let res = await axios.post(`${baseUrl}Json_CRM_GetOutlookTask`,{
        //         Email: "nabs@docusoft.net",
        //         agrno: "0261",
        //         password: "ZG9jdXNvZnQ="
        //     });
        //     console.log("Json_CRM_GetOutlookTask",JSON.parse(res.data.d));
        // }
        // Json_CRM_GetOutlookTask();
        // return ()=>{
        //     console.log("Modal is Closed");
        // }
        setTimeout(() => {
            // console.log("Hello 1s")
            Json_Get_CRM_Task_ActivityByTaskId(selectedTask.ID);
        }, 5000);

    }, [selectedTask]);








    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleCloseModal = () => {
        setOpen(false);
    };

    const [anchorElSelect, setAnchorElSelect] = React.useState(null);
    const openDropdown = Boolean(anchorElSelect);

    const handleClickDroppdown = (event) => {
        setAnchorElSelect(event.currentTarget);
    };
    const handleCloseDropdown = () => {
        setAnchorElSelect(null);
    };

    // dropdown add
    // const [userDropdownanchorEl, setuserDropdownAnchorEl] = React.useState(null);
    // const UserDropdownopen = Boolean(userDropdownanchorEl);
    // const handleUserClick = (event) => {
    //     setuserDropdownAnchorEl(event.currentTarget);
    // };

    const handleUserClose = () => {
        setuserDropdownAnchorEl(null);
    };
    // end

    //const [anchorEl, setAnchorEl] = React.useState(null);
    //const open = Boolean(anchorEl);
    // const handleClick = (event) => {
    //   setAnchorEl(event.currentTarget);
    // };
    const handleClose = () => {
        // setAnchorEl(null);
        setOpen(false);
    };

    const handalClickAddUser = (e) => {
        // Check if the object 'e' already exists in the array based on its 'id'
        if (!addUser.some((user) => user.ID === e.ID)) {
            // If it doesn't exist, add it to the 'addUser' array
            setAddUser([...addUser, e]);
        }

        // setTimeout(() => {
        //   console.log(addUser);
        // }, 2000);
    };

    const handleRemoveUser = (id) => {
        // Filter out the object with the specified ID
        const updatedUsers = addUser.filter((user) => user.ID !== id);
        setAddUser(updatedUsers);
    };

    const [anchorEl1, setAnchorEl1] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleClick2 = (event, index) => {
        setAnchorEl1(event.currentTarget);
        setSelectedIndex(index); // Remember the index of the clicked menu
    };

    const handleClose2 = () => {
        setAnchorEl1(null);
        setSelectedIndex(null); // Reset the selected index after closing the menu
    };

    const [anchorElStatus, setanchorElStatus] = useState(null);
    const [selectedIndexStatus, setSelectedIndexStatus] = useState(null);

    const handleClickStatus = (event, index) => {
        setanchorElStatus(event.currentTarget);
        setSelectedIndexStatus(index); // Remember the index of the clicked menu
    };

    const handleCloseStatus = (e) => {
        console.log(e.target.innerText);
        setStatus(e.target.innerText);
        setanchorElStatus(null);
        setSelectedIndexStatus(null); // Reset the selected index after closing the menu
    };

    const [anchorElProfile, setanchorElProfile] = useState(null);
    const [selectedIndexProfile, setSelectedIndexProfile] = useState(null);

    const handleClickProfile = (event, index) => {
        setanchorElProfile(event.currentTarget);
        setSelectedIndexProfile(index); // Remember the index of the clicked menu
    };

    const handleCloseProfile = () => {
        setanchorElStatus(null);
        setSelectedIndexProfile(null); // Reset the selected index after closing the menu
    };

    function dateAndTime(dt) {
        // Create a new Date object
        var date = new Date(dt);

        // Extract individual components
        var year = date.getFullYear();
        var month = date.getMonth() + 1; // Month is 0-indexed
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        // Formatting to ensure double digits
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        // Construct the formatted date and time string
        var formattedDateTime =
            year +
            "/" +
            month +
            "/" +
            day +
            " " +
            hours +
            ":" +
            minutes +
            ":" +
            seconds;

        //  console.log(formattedDateTime);
        return formattedDateTime;
    }

    // const handleKeyDown = (e) => {
    //   if (e.key === 'Enter') {
    //     addActivitySave();
    //   }
    // };

    const addActivitySave = () => {
        Json_AddSupplierActivity();
    };
    const Json_AddSupplierActivity = () => {
        let obj = {};
        obj.OriginatorNo = selectedTask.ClientNo;
        obj.ActionReminder = "";
        obj.Notes = notesMessage;
        obj.Status = "sys"; //selectedTask.Status;
        obj.TaskId = selectedTask.ID;
        obj.TaskName = "";
        obj.ActivityLevelID = "";
        obj.ItemId = "";

        try {
            Cls.Json_AddSupplierActivity(obj, function (sts, data) {
                if (sts && data) {
                    console.log(data);
                    Json_Get_CRM_Task_ActivityByTaskId(selectedTask.ID);
                    setNotesMessage("");
                }
            });
        } catch (error) {
            console.log({ status: false, messages: "Faild Please Try again" });
        }
    };

    const [notesMessage, setNotesMessage] = useState(null);
    const handleChangeNotes = (e) => {
        setNotesMessage(e.target.value);

    };

    // Function to scroll to the bottom of the message container
    const scrollToBottom = () => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop =
                messageContainerRef.current.scrollHeight;
        }
    };
    useEffect(() => {
        scrollToBottom();

    }, [notesMessage]);

    const handleSuccess = (mgsid) => {
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Your task has been created successfully." + mgsid,
        });
    };


    async function Json_CRM_Task_Update() {
        if (addUser.length > 0) {
            const idsString = addUser.map(obj => obj.ID).join(',');
            const attString = attachmentPath.map((obj) => obj.Path).join("|");

            let obj = {
                AssignedToID: idsString,
                TaskID: selectedTask.ID,
                DMSItems: "",
                Attachments: attString ? attString : "",
                Notes: "",
                Details: txtdescription,
                ReminderSet: false,
                ReminderDateTime: dayjs(remiderDate).format("YYYY/MM/DD"),
                StartDateTime: dayjs(currentDate).format("YYYY/MM/DD"),
                OwnerID: selectedTask.OwnerID,
                AssociateWithID: selectedTask.ClientNo,
                FolderId: selectedTask.FolderID,
                Subject: tSubject,
                TypeofTaskID: selectedTask.SectionId,
                EndDateTime: dayjs(nextDate).format("YYYY/MM/DD"),
                Status: status,
                Priority: selectedTask.Priority,
                PercentComplete: "1",
                ActivityMsg: "",
                YEDate: "1900/01/01",
                SubDeadline: "1900/01/01",
                DocRecdate: "1900/01/01",
                ElectronicFile: false,
                PaperFile: false,
            };
            console.log("final save data obj", obj);
            Cls.Json_CRM_Task_Update(obj, function (sts, data) {
                if (sts) {
                    let js = JSON.parse(data);
                    if (js.Status === "success") {

                        setMessageId(js.Message);
                        // setLoading(false);
                        setIsApi(!isApi);
                        // Inside your function or event handler where you want to show the success message
                        //  handleSuccess(js.Message);
                        // setOpen(false);
                        toast.success("Updated Task !");
                        //setIsVisible(false); // Toggle visibility
                        setTimeout(() => {
                            setAttachmentPath([]);
                            Json_Get_CRM_SavedTask_ByTaskId(selectedTask.ID);
                        }, 2000);

                    }
                    else {
                        console.log("Response final", data);
                        toast.error("Task Not Updated Please Try Again");
                    }

                    // setLoading(false);
                }
            });
        }
    }



    // sadik js start


    // dropdown add
    const [userDropdownanchorEl, setuserDropdownAnchorEl] = React.useState(null);
    const UserDropdownopen = Boolean(userDropdownanchorEl);
    const handleUserClick = (event) => {
        setuserDropdownAnchorEl(event.currentTarget);
    };
    // const handleUserClose = () => {
    //     setuserDropdownAnchorEl(null);
    // };
    // end


    // const [anchorEl, setAnchorEl] = React.useState(null);
    // const open = Boolean(anchorEl);
    // const handleClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     // setAnchorEl(null);
    //     setOpen(false)
    // };


    const [documentLis, setOpenDocumentList] = React.useState(false);
    const handleClickOpen = () => {
        setOpenDocumentList(true);
    };
    const handleCloseDocumentList = () => {
        setOpenDocumentList(false);
    };

    // important sadik

    const handleDownloadDoc = (objdata) => {
        console.log(objdata)
        let o = {
            path: window.btoa(objdata.DestinationPath),
        }
        Cls.GetBase64FromFilePath(o, function (sts, data) {
            if (sts && data) {
                let js = JSON.parse(data);
                if (js.Status === "Success") {
                    // var dencodedData = window.atob(Path);
                    // var fileName = dencodedData;
                    var Typest = objdata.FileName.lastIndexOf("\\");
                    let fileName = objdata.FileName.slice(Typest + 1);
                    // console.log('FileName', fileName);
                    // console.log("jsonObj.Status", js.Message);
                    var a = document.createElement("a"); //Create <a>
                    a.href = "data:" + Cls.FileType(fileName) + ";base64," + js.Message; //Image Base64 Goes here
                    a.download = fileName; //File name Here
                    a.click(); //Downloaded file

                }

            }
        })
    }

    const DeleteTasksAttachment = (objdata) => {

        try {
            Swal.fire({
                // title: "Are you sure you want to delete this item?",
                text: "Are you sure you want to delete this item?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    var Typest = objdata.FileName.lastIndexOf("\\");
                    let fileName = objdata.FileName.slice(Typest + 1);
                    let fname = fileName;
                    let o = {
                        agrno: agrno,
                        EmailId: Email,
                        password: password,
                        fileName: fname,
                        TaskId: selectedTask.ID,
                    }
                    Cls.DeleteTasksAttachment(o, function (sts, data) {
                        if (sts && data) {
                            let js = JSON.parse(data);
                            console.log("DeleteTasksAttachment", data)
                            if (js.Status === "Success") {
                                toast.success("Deleted Attachment");
                                Json_Get_CRM_SavedTask_ByTaskId(selectedTask.ID);
                            }

                        }
                    })

                }
            });
        } catch (error) {
            console.log({ Status: false, mgs: "Data not found", Error: error });
        }

    }



    const handleSearchInputChangeSection = (event) => {
        setSearchSectionQuery(event.target.value);
    };

    const filtereSectionList = sectionList.filter((item) =>
        item.Sec.toLowerCase().includes(searchSectionQuery.toLowerCase())
    );

    const handleSearchInputChangeClient = (event) => {
        setSearchClient1Query(event.target.value);
    };

    const filtereClient = clientList.filter((item) =>
        item.Client.toLowerCase().includes(searchClient1Query.toLowerCase())
    );

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    return (
        <React.Fragment>

            <Dialog
                Dialog
                fullScreen={fullScreen}
                open={openModal}
                onClose={handleCloseModal}
                className="custom-modal"
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
            >
                <DialogContent>
                    <DialogContentText>
                        <Box className="d-flex align-items-center justify-content-between">
                            <Box className="d-flex align-items-center">
                                <Box>
                                    <Button
                                        id="fade-button5"
                                        aria-controls={openDropdown ? "fade-menu" : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={openDropdown ? "true" : undefined}
                                        onClick={handleClickDroppdown}
                                        className="min-width-auto"
                                    >
                                        <CheckCircleIcon />
                                    </Button>
                                    <Menu
                                        id="fade-menu"
                                        MenuListProps={{
                                            "aria-labelledby": "fade-button5",
                                        }}
                                        anchorElSelect={anchorElSelect}
                                        open={openDropdown}
                                        onClose={handleCloseDropdown}
                                    >
                                        <MenuItem onClick={handleCloseDropdown}>Profile</MenuItem>
                                        <MenuItem onClick={handleCloseDropdown}>
                                            My account
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseDropdown}>Logout</MenuItem>
                                    </Menu>
                                </Box>

                                {/* <div>
                            <Button
                                id="basic-button-status"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                                <CheckCircleIcon />
                                
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button-status',
                                    
                                }}
                            >
                                <MenuItem onClick={handleClose}>Profile</MenuItem>
                                <MenuItem onClick={handleClose}>My account</MenuItem>
                                <MenuItem onClick={handleClose}>Logout</MenuItem>
                            </Menu>
                        </div> */}

                                <Typography
                                    variant="subtitle1"
                                    className="font-16 sembold mb-0"
                                >
                                    Select Type
                                </Typography>
                            </Box>

                            <Box className="d-flex">
                                <Box>
                                    <Button
                                        id={`fade-button-${selectedTask.ID}`} // Use unique IDs for each button
                                        aria-controls={
                                            anchorElStatus
                                                ? `fade-menu-${selectedTask.ID}`
                                                : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={anchorElStatus ? "true" : undefined}
                                        onClick={(event) =>
                                            handleClickStatus(event, selectedTask.ID)
                                        } // Pass index to handleClick
                                        className="min-width-auto px-0 text-danger"
                                    >
                                        <ListItemIcon className="min-width-auto text-danger me-2">
                                            <PublishedWithChangesIcon fontSize="medium" />
                                        </ListItemIcon>
                                        {status}
                                    </Button>
                                    <Menu
                                        id={`fade-menu-${selectedTask.ID}`} // Use unique IDs for each menu
                                        MenuListProps={{
                                            "aria-labelledby": `fade-button-${selectedTask.ID}`,
                                        }}
                                        anchorEl={anchorElStatus}
                                        open={
                                            selectedIndexStatus === selectedTask.ID &&
                                            Boolean(anchorElStatus)
                                        } // Open menu if selectedIndex matches
                                        onClose={handleCloseStatus}
                                    >

                                        {/*  */}
                                        <MenuItem onClick={handleCloseStatus} className="text-secondary">
                                            <ListItemIcon>
                                                <DoNotDisturbAltIcon fontSize="medium" className="text-secondary" />
                                            </ListItemIcon>
                                            Not Started
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseStatus} className="text-primary">
                                            <ListItemIcon>
                                                <PublishedWithChangesIcon fontSize="medium" className="text-primary" />
                                            </ListItemIcon>
                                            In Progress
                                        </MenuItem>

                                        <MenuItem onClick={handleCloseStatus} className="text-primary">
                                            <ListItemIcon>
                                                <HourglassBottomIcon fontSize="medium" className="text-primary" />
                                            </ListItemIcon>
                                            On Hold
                                        </MenuItem>

                                        {/* <MenuItem onClick={handleCloseStatus} className="text-warning">
                                            <ListItemIcon>
                                                <ErrorOutlineIcon fontSize="medium" className="text-warning" />
                                            </ListItemIcon>
                                            Deferred</MenuItem>

                                        <MenuItem onClick={handleCloseStatus} className="text-success">
                                            <ListItemIcon>
                                                <CheckCircleOutlineIcon fontSize="medium" className="text-success" />
                                            </ListItemIcon>
                                            Done</MenuItem> */}

                                        <MenuItem onClick={handleCloseStatus} className="text-success"><ListItemIcon>
                                            <CheckCircleOutlineIcon fontSize="medium" className="text-success" />
                                        </ListItemIcon>
                                            Completed
                                        </MenuItem>
                                        {/*  */}

                                    </Menu>
                                </Box>

                                <div>
                                    <Button
                                        id={`fade-button-${selectedTask.ID}`} // Use unique IDs for each button
                                        aria-controls={
                                            anchorElProfile
                                                ? `fade-menu-${selectedTask.ID}`
                                                : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={anchorElProfile ? "true" : undefined}
                                        onClick={(event) =>
                                            handleClickProfile(event, selectedTask.ID)
                                        } // Pass index to handleClick
                                        className="min-width-auto px-0 text-gray"
                                    >
                                        <MoreVertIcon />
                                    </Button>
                                    <Menu
                                        id={`fade-menu-${selectedTask.ID}`} // Use unique IDs for each menu
                                        MenuListProps={{
                                            "aria-labelledby": `fade-button-${selectedTask.ID}`,
                                        }}
                                        anchorEl={anchorElProfile}
                                        open={
                                            selectedIndexProfile === selectedTask.ID &&
                                            Boolean(anchorElProfile)
                                        } // Open menu if selectedIndex matches
                                        onClose={handleCloseProfile}
                                    >
                                        <MenuItem onClick={handleCloseProfile}>
                                            <ListItemIcon>
                                                <DoNotDisturbAltIcon fontSize="medium" />
                                            </ListItemIcon>
                                            Profile
                                        </MenuItem>
                                        <MenuItem onClick={handleCloseProfile}>
                                            <ListItemIcon>
                                                <PublishedWithChangesIcon fontSize="medium" />
                                            </ListItemIcon>
                                            My account
                                        </MenuItem>
                                    </Menu>
                                </div>

                                <Button onClick={handleClose} autoFocus sx={{ minWidth: 30 }}>
                                    <span className="material-symbols-outlined text-black">
                                        cancel
                                    </span>
                                </Button>
                            </Box>
                        </Box>

                        <hr />

                        <Box className='mb-2'>
                            <input
                                ariant="h4"
                                className="input-text-title"
                                type="text"
                                onChange={handalChangeSetSubject}
                                onClick={handalClickEditeSubject}
                                value={tSubject}
                            />

                            <Box className="mt-2 mb-3">
                                <textarea
                                    className="form-control textarea textarea-ony-read resize-none"
                                    placeholder="Description"
                                    value={txtdescription} // Bind the value to the state
                                    onChange={(e) => setTxtDescriptin(e.target.value)} // Handle changes to the textarea
                                ></textarea>
                            </Box>

                            {isVisible && ( // Show the box if isVisible is true
                                <Box className='mb-3 mt-2'>
                                    <Stack spacing={2} direction="row">
                                        <Button variant="outlined" onClick={toggleVisibilityCancle}>Cancel</Button>
                                        <Button variant="contained" onClick={Json_CRM_Task_Update}>Save</Button>
                                    </Stack>
                                </Box>
                            )}
                        </Box>

                        <Box className="d-flex flex-wrap justify-content-between">
                            <Box className="d-flex flex-wrap align-items-center">
                                Client:-
                                <Button
                                    id="fade-button"
                                    aria-controls={openClient ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openClient ? 'true' : undefined}
                                    onClick={handleClickClick}
                                >
                                    {txtClient ? txtClient : selectedTask.Client}
                                </Button>
                                <Menu
                                    id="fade-menu11"
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorClsEl}
                                    open={openClient}
                                    onClose={handleCloseClient}
                                    TransitionComponent={Fade}
                                    className="menu-height"
                                >

                                    <TextField
                                        label="Search"
                                        variant="outlined"
                                        // value={searchClient1Query}
                                        // onChange={handleSearchInputChangeClient}
                                        sx={{ width: "100%" }}
                                        size="small"
                                    />

                                    {filtereClient ? filtereClient.map((item, index) => {
                                        return <MenuItem key={index} onClick={() => handleCloseClient(item)}>{item.Client}</MenuItem>
                                    }) : ""}

                                </Menu>


                                Section:-
                                <Button
                                    id="fade-button"
                                    aria-controls={openSection ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={openSection ? 'true' : undefined}
                                    onClick={handleClickSection}
                                >
                                    {txtSection ? txtSection : selectedTask.Section}
                                </Button>
                                <Menu
                                    id="fade-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorElSec}
                                    open={openSection}
                                    onClose={handleCloseSection}
                                    TransitionComponent={Fade}
                                    className="menu-height"
                                >

                                    <TextField
                                        label="Search"
                                        variant="outlined"
                                        value={searchSectionQuery}
                                        onChange={handleSearchInputChangeSection}
                                        sx={{ width: "100%" }}
                                        size="small"
                                    />

                                    {filtereSectionList ? filtereSectionList.map((item, index) => {
                                        return <MenuItem key={index} onClick={() => handleCloseSection(item)}>{item.Sec}</MenuItem>
                                    }) : ""}


                                </Menu>


                            </Box>

                            {/* <Box className="d-flex align-items-center mb-4 flex-wrap">
                        <Box className="user-img-list me-2">
                            <img src={user} />
                        </Box>
                        <Box className="user-img-list me-2">
                            <p>PJ</p>
                        </Box>
                        <Box className="user-img-list user-total-list me-2">
                            <p>14+</p>
                        </Box>
                    </Box> */}

                            <div className="mb-2">
                                <Button
                                    id="basic-button5"
                                    aria-controls={UserDropdownopen ? "basic-menu5" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={UserDropdownopen ? "true" : undefined}
                                    onClick={handleUserClick}
                                    className="p-0 w-auto d-inline-block"
                                >
                                    <Box className="d-flex align-items-center">
                                        {addUser
                                            ? addUser.map((item) => {
                                                const words = item.ForwardTo.split(" ");
                                                // Extract the first letter of each word and concatenate them
                                                let result = "";
                                                for (let i = 0; i < words.length && i < 2; i++) {
                                                    result += words[i].charAt(0);
                                                }

                                                if (item.ID === parseInt(localStorage.getItem("UserId"))) {
                                                    return (
                                                        <>
                                                            <Box
                                                                className="user-img-list ms-2 bg-red"
                                                                title={item.ForwardTo}
                                                                key={item.ID}
                                                            >
                                                                <p>{result}</p>
                                                            </Box>
                                                        </>
                                                    );
                                                } else {
                                                    return (
                                                        <>
                                                            <Box
                                                                className="user-img-list ms-2"
                                                                title={item.ForwardTo}
                                                                key={item.ID}
                                                            >
                                                                <p>{result}</p>
                                                            </Box>
                                                        </>
                                                    );
                                                }
                                            })
                                            : null}

                                        <Box className="d-flex ms-3">
                                            <span class="material-symbols-outlined">person_add</span>
                                        </Box>
                                    </Box>
                                </Button>
                                <Menu
                                    id="basic-menu5"
                                    anchorEl={userDropdownanchorEl}
                                    open={UserDropdownopen}
                                    onClose={handleUserClose}
                                    MenuListProps={{
                                        "aria-labelledby": "basic-button5",
                                    }}
                                    className="user-list-dropdown"
                                >
                                    <Box className="mb-1 mt-2 px-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Type a name or email address"
                                        />
                                    </Box>

                                    <Box className="inner-user-list-dropdown">
                                        <p className="sembold mb-1">Assigned</p>

                                        <Box className="box-user-list-dropdown">
                                            {addUser
                                                ? addUser.map((item, ind) => {
                                                    if (item.ID === parseInt(localStorage.getItem("UserId"))) {
                                                        return (
                                                            <React.Fragment key={ind}>
                                                                <button type="button" id={item.ID}>
                                                                    <Box className="user-img-list me-2">
                                                                        <img src={user} alt="User" />
                                                                    </Box>
                                                                    <p>{item.ForwardTo}</p>
                                                                </button>
                                                            </React.Fragment>
                                                        );
                                                    } else {
                                                        return (
                                                            <React.Fragment key={ind}>
                                                                <button type="button" id={item.ID}>
                                                                    <Box className="user-img-list me-2">
                                                                        <img src={user} alt="User" />
                                                                    </Box>
                                                                    <p>{item.ForwardTo}</p>
                                                                    <span
                                                                        className="close"
                                                                        onClick={() => handleRemoveUser(item.ID)}
                                                                        role="button" // Adding role="button" to indicate this element is clickable
                                                                        tabIndex="0" // Adding tabIndex to make the element focusable
                                                                    >
                                                                        <span className="material-symbols-outlined">
                                                                            close
                                                                        </span>
                                                                    </span>
                                                                </button>
                                                            </React.Fragment>
                                                        );
                                                    }
                                                })
                                                : null}
                                        </Box>
                                    </Box>

                                    <Box
                                        className="inner-user-list-dropdown"
                                        style={{ maxHeight: "200px", overflowY: "auto" }}
                                    >
                                        <p className="sembold mb-1">My Team</p>

                                        <input
                                            type="text"
                                            className="form-control mb-2"
                                            placeholder="Search..."
                                            value={filterText}
                                            onChange={(e) => setFilterText(e.target.value)}
                                        />

                                        <Box className="box-user-list-dropdown">
                                            {

                                                filteredUserList.map((item, ind) => (
                                                    <React.Fragment key={ind}>
                                                        <button
                                                            type="button"
                                                            id={item.ID}
                                                            onClick={() => handalClickAddUser(item)}
                                                        >
                                                            <Box className="user-img-list me-2">
                                                                <img src={user} alt="User" />
                                                            </Box>
                                                            <p>{item.ForwardTo}</p>
                                                            {/* <a href="" className="close">
                                    <span className="material-symbols-outlined">
                                      close
                                    </span>
                                  </a> */}
                                                        </button>
                                                    </React.Fragment>
                                                ))}
                                        </Box>
                                    </Box>
                                </Menu>
                            </div>
                            {/* dropdown end */}
                        </Box>
                        {/*  */}

                        <Box className="d-flex flex-wrap">
                            <label className='text-decoration-none d-flex'
                                onClick={handleClickOpen}
                            ><BallotIcon className='me-1' /> {attachmentFile.length} Documents</label>
                            {/* <AttachmentView attachmentlist={attachmentFile} setAttOpen={setAttOpen} attOpen={attOpen}></AttachmentView> */}


                        </Box>
                        <Box className="d-flex mt-3">
                            <Box className="mb-2 me-3">
                                <label className="font-14 text-black">Start Date</label>
                                <Box className='custom-datepicker'>
                                    <CalendarMonthIcon />
                                    <DatePicker
                                        showIcon
                                        dateFormat="DD/MM/YYYY"
                                        value={currentDate}
                                        onChange={(e) => setCurrentDate(e)} // Handle date changes
                                        timeFormat={false}
                                        isValidDate={disablePastDt}
                                        closeOnSelect={true}
                                        icon="fa fa-calendar"

                                    />
                                </Box>
                            </Box>

                            <Box className="mb-2" sx={{ float: "right" }}>
                                <Box className="mb-2 ">
                                    <label className="font-14 semibold text-black">
                                        Due By
                                    </label>
                                    <Box className='custom-datepicker'>
                                        <CalendarMonthIcon />
                                        <DatePicker
                                            showIcon
                                            dateFormat="DD/MM/YYYY"
                                            value={nextDate}
                                            onChange={(e) => setNextDate(e)} // Handle date changes
                                            timeFormat={false}
                                            isValidDate={disablePastDt}
                                            closeOnSelect={true}
                                            icon="fa fa-calendar"
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>


                        <Box className="d-flex mb-3">
                            <Button variant="text" className="btn-blue-2 me-2">
                                Mark complete
                            </Button>
                            <Button variant="text" className="btn-blue-2">
                                Defer
                            </Button>
                        </Box>

                        <Box className="pb-0 mb-0">
                            <Box className="main-chatbox">
                                {crmTaskAcivity
                                    ? crmTaskAcivity.map((item, index) => {
                                        if (item.username === "Admin") {
                                            return (
                                                <>
                                                    <Box
                                                        className="text-center py-3 file-uploaded"
                                                        style={{
                                                            backgroundColor: "rgb(148 221 255)",
                                                            marginBottom: "10px",
                                                            "border-radius": "8px",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body1"
                                                            className="font-14 sembold"
                                                        >
                                                            {item.Notes}
                                                        </Typography>
                                                        <Typography variant="body1" className="font-12">
                                                            {dateAndTime(item.ActivityDate)}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            );
                                        }
                                        else if (item.username === getUser.ForwardTo) {
                                            return (
                                                <>
                                                    <Box
                                                        className="chat-box d-flex align-items-end mb-2 sender"
                                                        justifyContent="flex-end"
                                                    >
                                                        <Box class="chat-message">
                                                            <Box class="inner-chat-message ms-auto">
                                                                <Typography variant="body1" className="font-14">
                                                                    {item.Notes}
                                                                </Typography>
                                                                <Box className="d-flex align-items-center justify-content-end">
                                                                    <Typography variant="body1" className="font-12">
                                                                        {dateAndTime(item.ActivityDate)}
                                                                    </Typography>

                                                                    <Box className="">
                                                                        <Button
                                                                            id={`fade-button-${index}`} // Use unique IDs for each button
                                                                            aria-controls={
                                                                                anchorEl1
                                                                                    ? `fade-menu-${index}`
                                                                                    : undefined
                                                                            }
                                                                            aria-haspopup="true"
                                                                            aria-expanded={
                                                                                anchorEl1 ? "true" : undefined
                                                                            }
                                                                            onClick={(event) =>
                                                                                handleClick2(event, index)
                                                                            } // Pass index to handleClick
                                                                            className="min-width-auto px-0 text-gray"
                                                                        >
                                                                            <MoreVertIcon />
                                                                        </Button>
                                                                        <Menu
                                                                            id={`fade-menu-${index}`} // Use unique IDs for each menu
                                                                            MenuListProps={{
                                                                                "aria-labelledby": `fade-button-${index}`,
                                                                            }}
                                                                            anchorEl={anchorEl1}
                                                                            open={
                                                                                selectedIndex === index &&
                                                                                Boolean(anchorEl1)
                                                                            } // Open menu if selectedIndex matches
                                                                            onClose={handleClose2}
                                                                        >
                                                                            <MenuItem onClick={handleClose2}>
                                                                                Edit
                                                                            </MenuItem>
                                                                            <MenuItem onClick={handleClose2}>
                                                                                Delete
                                                                            </MenuItem>
                                                                        </Menu>
                                                                    </Box>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </>
                                            );
                                        }
                                        else {
                                            return (
                                                <Box
                                                    className="chat-box d-flex align-items-end mb-2 reciever"
                                                    key={index}
                                                >
                                                    <Box className="client-img me-3 mb-0 ms-0">
                                                        <img src={user} alt="User" />
                                                    </Box>
                                                    <Box className="chat-message me-2">
                                                        <Box className="inner-chat-message me-2">
                                                            <Typography variant="body1" className="font-14">
                                                                {item.Notes}
                                                            </Typography>
                                                            <Box className="d-flex align-items-center justify-content-end">
                                                                <Typography variant="body1" className="font-12">
                                                                    {dateAndTime(item.ActivityDate)}
                                                                </Typography>

                                                                <Box className="">
                                                                    <Button
                                                                        id={`fade-button-${index}`} // Use unique IDs for each button
                                                                        aria-controls={
                                                                            anchorEl1
                                                                                ? `fade-menu-${index}`
                                                                                : undefined
                                                                        }
                                                                        aria-haspopup="true"
                                                                        aria-expanded={
                                                                            anchorEl1 ? "true" : undefined
                                                                        }
                                                                        onClick={(event) =>
                                                                            handleClick2(event, index)
                                                                        } // Pass index to handleClick
                                                                        className="min-width-auto px-0 text-gray"
                                                                    >
                                                                        <MoreVertIcon />
                                                                    </Button>
                                                                    <Menu
                                                                        id={`fade-menu-${index}`} // Use unique IDs for each menu
                                                                        MenuListProps={{
                                                                            "aria-labelledby": `fade-button-${index}`,
                                                                        }}
                                                                        anchorEl={anchorEl1}
                                                                        open={
                                                                            selectedIndex === index &&
                                                                            Boolean(anchorEl1)
                                                                        } // Open menu if selectedIndex matches
                                                                        onClose={handleClose2}
                                                                    >
                                                                        <MenuItem onClick={handleClose2}>
                                                                            Edit
                                                                        </MenuItem>
                                                                        <MenuItem onClick={handleClose2}>
                                                                            Delete
                                                                        </MenuItem>
                                                                    </Menu>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            );

                                        }
                                    })
                                    : null}

                                {/* Reciever Start */}

                                {/* Reciever End */}

                                {/* Sender Start */}

                                {/* Sender End */}

                            </Box>

                            {/* <Box className="text-center py-3 file-uploads">
                                <input
                                    type="file"
                                    id={`file-upload ${selectedTask.ID}`}
                                    multiple
                                    onChange={handleFileSelect}
                                    className="file-input"
                                />

                                <label
                                    className="file-uploads-label"
                                    for={`file-upload ${selectedTask.ID}`}
                                >
                                    <Box className="d-flex align-items-center">
                                        <span className="material-symbols-outlined icon">
                                            cloud_upload
                                        </span>
                                        <Box className="upload-content pe-3">
                                            <Typography variant="h4">
                                                Select a file or drag and drop here
                                            </Typography>
                                            <Typography variant="body1">
                                                JPG, PNG or PDF, file size no more than 10MB
                                            </Typography>
                                        </Box>
                                    </Box>
                                </label>
                            </Box> */}

                            <Box className="d-flex align-items-end main-file-upload  pt-3">
                                <Box className="w-100">
                                    <Stack direction="row" className='pb-3' spacing={1}>
                                        <Chip label="fileName123.Doc" variant="outlined" onDelete={handleDelete} />
                                        <Chip label="fileName123.PDF" variant="outlined" onDelete={handleDelete} />
                                    </Stack>

                                    <Box className='position-relative'>
                                        <Box className='upload-chat-file'>
                                            <input
                                                type="file"
                                                id={`file-upload ${selectedTask.ID}`}
                                                multiple
                                                onChange={handleFileSelect}
                                                className="file-input"
                                            />
                                            <label for={`file-upload ${selectedTask.ID}`} className="pointer"><AttachFileIcon /></label>

                                        </Box>

                                        <textarea
                                            className="textarea"
                                            placeholder="Write message"
                                            value={notesMessage}
                                            onChange={handleChangeNotes}
                                        ></textarea>
                                    </Box>

                                </Box>

                                <Box className="d-flex d-flex align-items-center ms-3">
                                    <Button
                                        className="btn-blue-2 ms-0 mb-2"
                                        size="small"
                                        onClick={addActivitySave}
                                        startIcon={<SendIcon />}
                                    >
                                        Send
                                    </Button>
                                    <ToastContainer></ToastContainer>
                                </Box>
                            </Box>
                        </Box>
                    </DialogContentText>

                    {/* <hr /> */}


                </DialogContent>
            </Dialog>
            {/* end */}


            {/* // document list modal */}

            <Dialog
                open={documentLis}
                onClose={handleCloseDocumentList}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className='custom-modal'
                sx={{
                    maxWidth: 640,
                    margin: '0 auto'
                }}
            >
                {/* <DialogTitle id="alert-dialog-title">
                        {"Use Google's location service?"}
                    </DialogTitle> */}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">

                        <Box className="d-flex align-items-center justify-content-between">
                            <Box className="dropdown-box">
                                <Typography variant="h4" className='font-18 bold mb-2 text-black'>
                                    Document List
                                </Typography>
                                {/* <Box className="btn-Select">
                                    <Button className='btn-white'>Action</Button>
                                    <Button className='btn-white'>Ser</Button>
                                    <Button className='btn-white'>Custom</Button>

                                    <hr />

                                    <Button className='btn-blue-2' size="small">Apply Now</Button>
                                </Box> */}
                            </Box>

                            {/*  */}
                            <Button onClick={handleCloseDocumentList} autoFocus sx={{ minWidth: 30 }}>
                                <span className="material-symbols-outlined text-black">
                                    cancel
                                </span>
                            </Button>
                        </Box>
                        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
                            <Grid item xs={12} md={6}>

                                <Demo>
                                    <List>

                                        {attachmentFile ? attachmentFile.map((item, index) => {
                                            let Typest = item.FileName.lastIndexOf("\\");
                                            let fileName = item.FileName.slice(Typest + 1);
                                            return (<>
                                                <ListItem key={index}
                                                    secondaryAction={
                                                        <IconButton edge="end" aria-label="delete">
                                                            <DeleteIcon onClick={() => DeleteTasksAttachment(item)} />
                                                            <DownloadForOfflineIcon onClick={() => handleDownloadDoc(item)} />
                                                        </IconButton>
                                                    }
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <FolderIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={fileName}
                                                        secondary={secondary ? 'Secondary text' : null}
                                                    />
                                                </ListItem>
                                            </>)
                                        }) : ""}


                                    </List>
                                </Demo>
                            </Grid>
                        </Box>


                        {/* <DocumentDetails></DocumentDetails> */}



                    </DialogContentText>
                </DialogContent>
            </Dialog>




        </React.Fragment>
    );
}

export default TaskDetailModal;