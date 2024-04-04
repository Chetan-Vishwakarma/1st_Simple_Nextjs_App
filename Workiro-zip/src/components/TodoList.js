import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Typography, Menu, MenuItem, Dialog, DialogContent, DialogContentText, ListItemIcon, Radio, Checkbox, TextField, Autocomplete, ToggleButton, ToggleButtonGroup, FormControl, Select, InputLabel, } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import user from "../images/user.jpg";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CommanCLS from '../services/CommanService';
import TaskDetailModal from './TaskDetailModal';
import DownloadIcon from '@mui/icons-material/Download';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import moment from 'moment';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import CustomLoader from './CustomLoader';
// import { data } from 'jquery';
import MergeIcon from '@mui/icons-material/Merge';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import PortalDetails from './PortalDetails';
import DataNotFound from './DataNotFound';
import { styled } from '@mui/system';
import { useLocation } from 'react-router-dom';
import ClearIcon from '@mui/icons-material/Clear';
import DvrIcon from '@mui/icons-material/Dvr';
import LanguageIcon from '@mui/icons-material/Language';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CustomBreadCrumbs from './CustomBreadCrumbs';
import SortIcon from '@mui/icons-material/Sort';
import PersonIcon from '@mui/icons-material/Person';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import SubjectIcon from '@mui/icons-material/Subject';
import { toast } from 'react-toastify';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import PeopleIcon from '@mui/icons-material/People';
import ShareIcon from '@mui/icons-material/Share';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import CreateNewModalTask from './CreateNewModal';
import { useDispatch, useSelector } from 'react-redux';
import { setMyTasks } from '../redux/reducers/counterSlice';


const foldersIconList = [<PersonIcon className='me-1 font-20' />, <TipsAndUpdatesIcon className='me-1 font-20' />, <PeopleIcon className='me-1 font-20' />, <ShareIcon className='me-1 font-20' />, <FolderSharedIcon className='me-1 font-20' />, <FolderSharedIcon className='me-1 font-20' />];
const statusIconList = [<DoNotDisturbAltIcon color='secondary' className='me-1 font-20' />, <PublishedWithChangesIcon color='primary' className='me-1 font-20' />, <HourglassBottomIcon color='primary' className='me-1 font-20' />, <CheckCircleOutlineIcon color='success' className='me-1 font-20' />];

function TodoList() {
    const location = useLocation();
    const reduxData = useSelector((data) => data.counter.myTasks);
    console.log("fdjkfhfhsf", reduxData);
    const dispatch = useDispatch();
    let dddd = location.state !== null ? location.state : { globalSearchTask: [] };
    const { globalSearchTask, strGlobal } = dddd;
    const [agrno, setAgrNo] = useState(localStorage.getItem("agrno"));
    const [password, setPassword] = useState(localStorage.getItem("Password"));
    const [Email, setEmail] = useState(localStorage.getItem("Email"));

    const [folderId, setFolderId] = useState(localStorage.getItem("FolderId"));
    const [userId, setUserId] = useState(localStorage.getItem("UserId"));
    const baseUrlPractice = "https://practicetest.docusoftweb.com/PracticeServices.asmx/";

    let Cls = new CommanCLS(baseUrlPractice, agrno, Email, password);
    //let Clsp = new CommanCLS(baseUrlPractice, agrno, Email, password);

    const baseUrl = "https://docusms.uk/dsdesktopwebservice.asmx/";

    let ClsSms = new CommanCLS(baseUrl, agrno, Email, password);


    const [allTask, setAllTask] = useState([...reduxData]);
    const [actualData, setActualData] = useState([...reduxData]);
    const [selectedTask, setSelectedTask] = useState({});

    const [anchorEl, setAnchorEl] = React.useState(null);

    const [loadMore, setLoadMore] = useState(20);

    const [folders, setFolders] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState("Folder");
    const [selectedStatus, setSelectedStatus] = useState("Status");
    const [selectedType, setSelectedType] = useState("Source");
    const [taskFilter, setTaskFilter] = useState({});

    const [selectedSortBy, setSelectedSortBy] = useState("Sort By");
    const [selectedGroupBy, setSelectedGroupBy] = useState("Group By");

    const [dataInGroup, setDataInGroup] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearch, setIsSearch] = useState(false);

    const [suggestionList, setSuggestionList] = useState([]);



    // for date datepicker
    const [state, setState] = useState({
        start: moment().subtract(29, 'days'),
        end: moment(),
    });
    const { start, end } = state;


    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        // setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    function Json_GetFolders() {
        let obj = {
            agrno: agrno,
            Email: Email,
            password: password
        }
        try {
            Cls.Json_GetFolders(obj, function (sts, data) {
                if (sts) {
                    if (data) {
                        let js = JSON.parse(data);
                        let tbl = js.Table;
                        // console.log("Json_GetFolders", tbl);
                        setFolders(tbl);
                    }
                }
            });
        } catch (err) {
            console.log("Error while calling Json_GetFolders", err);
        }
    }
    const Json_CRM_GetOutlookTask = () => {
        if (globalSearchTask.length > 0) {
            const formattedTasks = globalSearchTask.map((task) => {
                let timestamp;
                if (task.EndDateTime) {
                    timestamp = parseInt(task.EndDateTime.slice(6, -2));
                }

                const date = new Date(timestamp);

                return { ...task, EndDateTime: date };
            });

            let myTasks = formattedTasks.filter((item) => item.AssignedToID.split(",").includes(userId) && item.mstatus !== "Completed");

            let hasCreationDate = myTasks.filter((item) => item.CreationDate !== null).map((task) => {
                let timestamp;
                if (task.CreationDate) {
                    timestamp = parseInt(task.CreationDate.slice(6, -2));
                }

                const date = new Date(timestamp);

                return { ...task, CreationDate: date };
            }).sort((a, b) => b.CreationDate - a.CreationDate);

            // dispatch(setMyTasks([...hasCreationDate]));
            setActualData([...hasCreationDate]);
            setAllTask([...hasCreationDate]);

            // setTaskFilter({...taskFilter, "EndDateTime": [start._d, end._d]});  // for initialization of filter
            Json_GetFolders();
            setIsApi(true);
            setIsLoading(false);
            return;
        }
        try {
            Cls.Json_CRM_GetOutlookTask_ForTask((sts, data) => {
                if (sts) {
                    if (data) {
                        let json = JSON.parse(data);
                        console.log("Json_CRM_GetOutlookTask111", json);
                        let result = json.Table.filter((el) => el.Source === "CRM" || el.Source === "Portal");
                        const formattedTasks = result.map((task) => {
                            let timestamp;
                            if (task.EndDateTime) {
                                timestamp = parseInt(task.EndDateTime.slice(6, -2));
                            }

                            const date = new Date(timestamp);

                            return { ...task, EndDateTime: date };
                        });

                        let myTasks = formattedTasks.filter((item) => item.AssignedToID.split(",").includes(userId) && item.mstatus !== "Completed");

                        let hasCreationDate = myTasks.filter((item) => item.CreationDate !== null).map((task) => {
                            let timestamp;
                            if (task.CreationDate) {
                                timestamp = parseInt(task.CreationDate.slice(6, -2));
                            }

                            const date = new Date(timestamp);

                            return { ...task, CreationDate: date };
                        }).sort((a, b) => b.CreationDate - a.CreationDate);

                        dispatch(setMyTasks([...hasCreationDate]));
                        // setActualData([...hasCreationDate]);
                        // setAllTask([...hasCreationDate]);

                        // setTaskFilter({...taskFilter, "EndDateTime": [start._d, end._d]});  // for initialization of filter
                        setIsLoading(false);
                        Json_GetFolders();
                    }
                }
            });
        } catch (err) {
            console.log("Error while calling Json_CRM_GetOutlookTask", err);
        }
    }

    const [isApi, setIsApi] = useState(false);


    const eventHandler = (e) => {
        console.log("Load more data2", e);
        if (window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight) {
            // Check if there's more data to load before updating loadMore

            setLoadMore((prevLoadMore) => prevLoadMore + 50);
        }
    }

    const loaderRef = useRef(null);



    useEffect(() => {

        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.scrollHeight - 200
            ) {
                // Load more items when user scrolls near the bottom
                setLoadMore(prevLoadMore => prevLoadMore + 5);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);



    useEffect(() => {
        Json_CRM_GetOutlookTask();
    }, [isApi])


    function DownLoadAttachment(Path) {
        let OBJ = {};
        OBJ.agrno = agrno;
        OBJ.Email = Email;
        OBJ.password = password;
        OBJ.path = Path;
        Cls.CallNewService('GetBase64FromFilePath', function (status, Data) {
            if (status) {
                var jsonObj = JSON.parse(Data);
                if (jsonObj.Status === "Success") {
                    var dencodedData = window.atob(Path);
                    var fileName = dencodedData;
                    var Typest = fileName.lastIndexOf("\\");
                    fileName = fileName.slice(Typest + 1);
                    console.log('FileName', fileName);
                    console.log("jsonObj.Status", jsonObj.Message);
                    var a = document.createElement("a"); //Create <a>
                    a.href = "data:" + FileType(fileName) + ";base64," + jsonObj.Message; //Image Base64 Goes here
                    a.download = fileName; //File name Here
                    a.click(); //Downloaded file

                }

            }
        });
    }

    function FileType(fileName) {
        // for (var i = 0; i < fileName.length; i++) {
        let Typest = fileName.lastIndexOf(".");
        var Type = fileName.slice(Typest + 1);
        var type = Type.toUpperCase();
        return type;
    }

    const [userList, setUserList] = React.useState([]);

    function Json_GetForwardUserList() {
        try {

            let o = {};
            o.ProjectId = localStorage.getItem("FolderId");
            o.SectionId = "-1";
            ClsSms.Json_GetForwardUserList(o, function (sts, data) {
                if (sts) {
                    if (data) {
                        let js = JSON.parse(data);
                        let dt = js.Table;
                        console.log("Json_GetForwardUserList111", dt)
                        if (dt.length > 0) {
                            let result = dt.filter((el) => {
                                return el.CGroup !== "Yes";
                            });

                            setUserList(result);

                        }
                    }

                }
            });
        } catch (error) {
            console.log("error", error);
        }
    }

    useEffect(() => {
        Json_GetForwardUserList();
        setAgrNo(localStorage.getItem("agrno"));
        setFolderId(localStorage.getItem("FolderId"));
        setPassword(localStorage.getItem("Password"));
        setEmail(localStorage.getItem("Email"));
        Json_CRM_GetOutlookTask();

    }, []);

    function startFormattingDate(dt) {
        //const timestamp = parseInt(/\d+/.exec(dt));
        const date = new Date(dt);
        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        return formattedDate === "Invalid Date" ? " " : formattedDate;
    }

    // modal
    const [openModal, setOpen] = React.useState(false);

    const handleClickOpen = (task = selectedTask) => {
        setSelectedTask(task);

        setOpen(true);

    };

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    useEffect(() => {
        let fltData = actualData.filter(function (obj) {
            return Object.keys(taskFilter).every(function (key) {
                if (taskFilter[key][0].length > 0 || typeof taskFilter[key][0] === "object") {
                    if (obj[key] && obj[key] !== undefined && obj[key] !== "") {
                        if (key === "EndDateTime") {
                            let docDate = obj[key];
                            let sDate = taskFilter[key][0];
                            let eDate = taskFilter[key][1];
                            return docDate >= sDate && docDate <= eDate;
                        } else {
                            return obj[key].toString().toLowerCase().includes(taskFilter[key][0].toString().toLowerCase());
                        }
                    }
                }
            });
        });

        console.log("fltData2222", fltData)

        setAllTask([...fltData]);
        if (Object.keys(dataInGroup).length > 0) {

            let gData = groupByProperty(fltData, selectedGroupBy);

            setDataInGroup(gData);
        }

    }, [taskFilter]);

    function handleFilterDeletion(target) {
        let obj = Object.keys(taskFilter).filter(objKey =>
            objKey !== target).reduce((newObj, key) => {
                newObj[key] = taskFilter[key];
                return newObj;
            }, {}
            );
        setTaskFilter(obj);
    }
    const handleCallback = (start, end) => {
        setTaskFilter({ ...taskFilter, "EndDateTime": [start._d, end._d] });
        setState({ start, end });
    };

    const label =
        start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY');

    const isGroupDataExist = (orderedData) => {
        if (Object.keys(dataInGroup).length > 0) {
            let data = groupByProperty(orderedData, selectedGroupBy);
            setDataInGroup(data);
        }
    }

    const handleDescending = () => {
        switch (selectedSortBy) {
            case "EndDateTime":
                let sotEndDate = [...allTask].sort((a, b) => b.EndDateTime - a.EndDateTime);
                setAllTask(sotEndDate);
                isGroupDataExist(sotEndDate);
                return;
            case "CreationDate":
                let sortStartDate = [...allTask].sort((a, b) => b.CreationDate - a.CreationDate);
                setAllTask(sortStartDate);
                isGroupDataExist(sortStartDate);
                return;
            case "Subject":
                let sortSubject = [...allTask].sort((a, b) => b.Subject.localeCompare(a.Subject));
                setAllTask(sortSubject);
                isGroupDataExist(sortSubject);
                return;
            case "Client":
                let fltData = [...allTask].filter(itm => itm.Client !== null);
                let sortClient = [...fltData].sort((a, b) => b.Client.localeCompare(a.Client));
                setAllTask(sortClient);
                isGroupDataExist(sortClient);
                return;
            case "Priority":
                let sortPriority = [...allTask].sort((a, b) => b.Priority - a.Priority);
                setAllTask(sortPriority);
                isGroupDataExist(sortPriority);
                return;
            case "Section":
                let sortSection = [...allTask].sort((a, b) => b.Section.split(" ")[1] - a.Section.split(" ")[1]);
                setAllTask(sortSection);
                isGroupDataExist(sortSection);
                return;
            default:
                return;
        }
    }

    const handleAscending = () => {
        switch (selectedSortBy) {
            case "EndDateTime":
                let sotEndDate = [...allTask].sort((a, b) => a.EndDateTime - b.EndDateTime);
                setAllTask(sotEndDate);
                isGroupDataExist(sotEndDate);
                return;
            case "CreationDate":
                let sortStartDate = [...allTask].sort((a, b) => a.CreationDate - b.CreationDate);
                setAllTask(sortStartDate);
                isGroupDataExist(sortStartDate);
                return;
            case "Subject":
                let sortSubject = [...allTask].sort((a, b) => a.Subject.localeCompare(b.Subject));
                setAllTask(sortSubject);
                isGroupDataExist(sortSubject);
                return;
            case "Client":
                let fltData = [...allTask].filter(itm => itm.Client !== null);
                let sortClient = [...fltData].sort((a, b) => a.Client.localeCompare(b.Client));
                setAllTask(sortClient);
                isGroupDataExist(sortClient);
                return;
            case "Priority":
                let sortPriority = [...allTask].sort((a, b) => a.Priority - b.Priority);
                setAllTask(sortPriority);
                isGroupDataExist(sortPriority);
                return;
            case "Section":
                let sortSection = [...allTask].sort((a, b) => a.Section.split(" ")[1] - b.Section.split(" ")[1]);
                setAllTask(sortSection);
                isGroupDataExist(sortSection);
                return;
            default:
                return;
        }
    }
    const handleSortBy = (check) => {
        if (check) {
            handleAscending();
        } else {
            handleDescending();
        }
    }
    function groupByProperty(data, property) {
        return data.reduce((acc, obj) => {
            const value = obj[property];
            acc[value] = acc[value] || [];
            acc[value].push(obj);
            return acc;
        }, {});
    }
    const handleGrouping = (val) => {
        setSelectedGroupBy(val);
        if (val !== "Group By") {
            let groupedData = groupByProperty(allTask, val);
            // console.log("Grouped Data: ",groupedData);
            setDataInGroup(groupedData);
        } else if (val === "Group By") {
            setDataInGroup([]);
        }
    }


    // new portal modal
    const [openPortal, setOpenPortal] = React.useState(false);
    const handleClickOpenPortal = () => {
        setOpenPortal(true);
    };
    const handleClosePortal = () => {
        setOpenPortal(false);
    };
    // end


    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const open3 = Boolean(anchorEl3);
    const handleClick3 = (event) => {
        setAnchorEl3(event.currentTarget);
    };
    const handleClose3 = () => {
        setAnchorEl3(null);
    };


    // dropdow 4
    const [anchorEl4, setAnchorEl4] = React.useState(null);
    const open4 = Boolean(anchorEl4);
    const handleClick4 = (event) => {
        setAnchorEl4(event.currentTarget);
    };
    const handleClose4 = () => {
        setAnchorEl4(null);
    };


    const MarkComplete = (e) => {
        console.log("MarkComplete", e)
        Cls.ConfirmMessage("Are you sure you want to complete task", function (res) {
            if (res) {
                Json_UpdateTaskField("Status", "Completed", e);
            }
        })
    }
    function Json_UpdateTaskField(FieldName, FieldValue, e) {
        let o = {
            agrno: agrno,
            strEmail: Email,
            password: password,
            TaskId: e.ID,
            FieldName: FieldName,
            FieldValue: FieldValue
        }

        ClsSms.Json_UpdateTaskField(o, function (sts, data) {
            if (sts && data) {
                if (data === "Success") {
                    toast.success("Completed")
                    Json_AddSupplierActivity(e);
                }
                console.log("Json_UpdateTaskField", data)
            }
        })
    }

    const Json_AddSupplierActivity = (e) => {
        let obj = {};
        obj.OriginatorNo = e.ClientNo;
        obj.ActionReminder = "";
        obj.Notes = "Completed by " + e["Forwarded By"];
        obj.Status = "sys"; //selectedTask.Status;
        obj.TaskId = e.ID;
        obj.TaskName = "";
        obj.ActivityLevelID = "";
        obj.ItemId = "";

        try {
            ClsSms.Json_AddSupplierActivity(obj, function (sts, data) {
                if (sts && data) {
                    console.log({ status: true, messages: "Success", res: data });
                    Json_CRM_GetOutlookTask()
                }
            });
        } catch (error) {
            console.log({ status: false, messages: "Faild Please Try again" });
        }
    };




    const FiterAssinee = (ownerid) => {

        let res = userList.filter((e) => e.ID === ownerid);
        // console.log("userList212121",res);
        if (res.length > 0) {
            return res[0].ForwardTo;
        }

    }

    const FilterAgs = (item) => {
        const arr = item.AssignedToID.split(",").filter(Boolean).map(Number);

        const userId = parseInt(localStorage.getItem("UserId"));

        const filteredIds = arr.filter((k) => k !== item.OwnerID);

        const user = filteredIds.find((u) => u === userId);


        const userToFind = user ? user : filteredIds[0];



        const res = userToFind ? userList.find((e) => e.ID === userToFind) : null;

        return res ? res.ForwardTo : "";
    }

    useEffect(() => {
        setAllTask([...reduxData]);
        setActualData([...reduxData]);
    }, [reduxData]);

    return (
        <>
            <Box className="container-fluid p-0">

                {globalSearchTask.length > 0 && <CustomBreadCrumbs tabs={[{ tabLink: "/dashboard/SearchResult?str=" + strGlobal, tabName: "Search Result" }, { tabLink: "/dashboard/MyTask", tabName: "My Task" }]} />}

                <TaskDetailModal setIsApi={setIsApi} isApi={isApi} selectedTask={selectedTask} setOpen={setOpen} openModal={openModal}></TaskDetailModal>
                {/* <CreateNewModalTask setIsApi={setIsApi} isApi={isApi}></CreateNewModalTask> */}
                <Box className='d-flex main-search-box mb-3 align-items-center justify-content-between'>
                    <Box className='d-flex align-items-center'>
                        <Layout>
                            <AutocompleteWrapper>
                                <AutocompleteRoot
                                    sx={{
                                        borderColor: '#D5D5D5',
                                        color: 'success.main',
                                    }}
                                // className={isSearch ? 'Mui-focused' : ''}
                                >
                                    <span className="material-symbols-outlined search-icon">search</span>

                                    <Input
                                        onClick={(e) => {
                                            if (e.target.value !== "") {
                                                setIsSearch(true);
                                            }
                                        }}
                                        onBlur={(e) => setIsSearch(false)}
                                        onChange={(e) => {
                                            if (e.target.value === "") {
                                                setSuggestionList([]);
                                                handleFilterDeletion("Subject");
                                                return;
                                            }
                                            setIsSearch(true);
                                            let fltData = allTask.filter(itm => itm.Subject.toLowerCase().includes(e.target.value.toLowerCase()));
                                            setSuggestionList(fltData);
                                            setTaskFilter({ ...taskFilter, Subject: [e.target.value] });
                                        }}
                                        placeholder='Search'
                                        className='ps-0' />
                                </AutocompleteRoot>

                                {isSearch && suggestionList.length > 0 && <Listbox sx={{ zIndex: 1 }}>
                                    {suggestionList.map((itm, i) => {
                                        return <Option key={i}>
                                            {/* <ApartmentIcon className='me-1' /> */}
                                            {itm.Subject}</Option>
                                    })}
                                </Listbox>}
                            </AutocompleteWrapper>
                        </Layout>


                        <FormControl size="small" className='select-border ms-3'>
                            {/* <InputLabel id="demo-simple-select-label">Folder</InputLabel> */}
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedFolder}
                                label="Folder"
                                onChange={(e) => {
                                    setSelectedFolder(e.target.value);
                                    if (e.target.value === "Folder") {
                                        handleFilterDeletion("Folder");
                                        return;
                                    } else if (e.target.value === "") {
                                        handleFilterDeletion("Folder");
                                        setSelectedFolder("Folder");
                                        return;
                                    } else {
                                        setTaskFilter({ ...taskFilter, Folder: [e.target.value] })
                                    }
                                }}
                                className='custom-dropdown'
                            >
                                <MenuItem value="Folder" style={{ display: "none" }}>Folders</MenuItem>
                                <MenuItem value="" className='text-danger ps-1'><ClearIcon className="font-20 me-2" /> Clear Filter</MenuItem>
                                {folders.length > 0 && folders.map((fld, i) => <MenuItem key={i} value={fld.Folder} className='ps-1'>{foldersIconList[i]} {fld.Folder}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl size="small" className='select-border ms-3'>
                            {/* <InputLabel id="demo-simple-select-label">Type</InputLabel> */}
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedType}
                                label="Type"
                                onChange={(e) => {
                                    setSelectedType(e.target.value);
                                    if (e.target.value === "Source") {
                                        handleFilterDeletion("Source");
                                        return;
                                    } else if (e.target.value === "") {
                                        handleFilterDeletion("Source");
                                        setSelectedType("Source");
                                        return;
                                    } else {
                                        setTaskFilter({ ...taskFilter, Source: [e.target.value] });
                                    }
                                }}
                                className='custom-dropdown'
                            >
                                <MenuItem value="Source" style={{ display: "none" }}>Type</MenuItem>
                                <MenuItem value="" className='ps-1 text-danger' >
                                    <ClearIcon className="font-20 me-2" />
                                    Clear Filter</MenuItem>
                                <MenuItem className='ps-1' value="CRM">
                                    <DvrIcon className="font-20 me-2" />
                                    CRM</MenuItem>
                                <MenuItem className='ps-1' value="Portal">
                                    <LanguageIcon className="font-20 me-2" />
                                    Portal</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" className='select-border ms-3'>
                            {/* <InputLabel id="demo-simple-select-label">Status</InputLabel> */}
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedStatus}
                                label="Status"
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    if (e.target.value === "Status") {
                                        handleFilterDeletion("Status");
                                        return;
                                    } else if (e.target.value === "") {
                                        handleFilterDeletion("Status");
                                        setSelectedStatus("Status");
                                        return;
                                    } else {
                                        setTaskFilter({ ...taskFilter, Status: [e.target.value] });
                                    }
                                }}
                                className='custom-dropdown'
                            >
                                <MenuItem value={"Status"} style={{ display: "none" }}> Status</MenuItem>
                                <MenuItem className='text-danger ps-1' value={""} ><ClearIcon className="font-20 me-2" /> Clear Filter</MenuItem>
                                {["Not Started", "In Progress", "On Hold", "Completed"].map((itm, i) => <MenuItem key={i} value={itm} className='ps-1'> {statusIconList[i]} {itm}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box className='d-flex align-items-end'>
                        <Box>
                            <DateRangePicker
                                initialSettings={{
                                    startDate: start.toDate(),
                                    endDate: end.toDate(),
                                    ranges: {
                                        'All': [
                                            moment({ year: 1990, month: 0, day: 1 }).toDate(),
                                            moment().toDate()
                                        ],
                                        Today: [moment().toDate(), moment().toDate()],
                                        Yesterday: [
                                            moment().subtract(1, 'days').toDate(),
                                            moment().subtract(1, 'days').toDate(),
                                        ],
                                        'Last 7 Days': [
                                            moment().subtract(6, 'days').toDate(),
                                            moment().toDate(),
                                        ],
                                        'Last 30 Days': [
                                            moment().subtract(29, 'days').toDate(),
                                            moment().toDate(),
                                        ],
                                        'This Month': [
                                            moment().startOf('month').toDate(),
                                            moment().endOf('month').toDate(),
                                        ],
                                        'Last Month': [
                                            moment().subtract(1, 'month').startOf('month').toDate(),
                                            moment().subtract(1, 'month').endOf('month').toDate(),
                                        ],
                                    },
                                }}
                                onCallback={handleCallback}
                            >
                                <div className='pointer me-2 d-flex align-items-center' id="reportrange"
                                >

                                    <i className="fa fa-calendar"></i>
                                    <CalendarMonthIcon className='me-2 text-red' />

                                    <span>{label === "Invalid date - Invalid date" ? "All" : label}</span> <i className="fa fa-caret-down"></i>
                                </div>
                            </DateRangePicker>
                        </Box>

                        <FormControl size="small" className='select-border ms-3'>
                            {/* <InputLabel id="demo-simple-select-label">Group By</InputLabel> */}
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedSortBy}
                                label="Group By"
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        setSelectedSortBy("Sort By");
                                        return;
                                    }
                                    setSelectedSortBy(e.target.value)
                                }}
                                className='custom-dropdown'
                            >
                                <MenuItem className='ps-2' value="Sort By" style={{ display: "none" }}><SortIcon />Sort By</MenuItem>
                                <MenuItem className='ps-2 text-red' value="" onClick={() => setAllTask([...actualData])}><ClearIcon />Clear Sortby</MenuItem>
                                <MenuItem className='ps-2' value="Client"><PersonIcon className='font-20 me-1' />Client Name</MenuItem>
                                <MenuItem className='ps-2' value="EndDateTime"><CalendarMonthIcon className='font-20 me-1' />Due Date</MenuItem>
                                <MenuItem className='ps-2' value="Priority"><PriorityHighIcon className='font-20 me-1' />Priority</MenuItem>
                                <MenuItem className='ps-2' value="Section"><SpaceDashboardIcon className='font-20 me-1' />Section</MenuItem>
                                <MenuItem className='ps-2' value="CreationDate"><CalendarMonthIcon className='font-20 me-1' />Start Date</MenuItem>
                            </Select>
                        </FormControl>
                        {selectedSortBy !== "Sort By" && <Checkbox onClick={(e) => handleSortBy(e.target.checked)} className='p-0' {...label} icon={<UpgradeIcon />} checkedIcon={<VerticalAlignBottomIcon />} />}
                        <FormControl size="small" className='select-border ms-3'>
                            {/* <InputLabel id="demo-simple-select-label">Sort By</InputLabel> */}
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedGroupBy}
                                label="Sort By"
                                onChange={(e) => {
                                    if (e.target.value === "") {
                                        setSelectedGroupBy("Group By");
                                        setDataInGroup([]);
                                        return;
                                    }
                                    handleGrouping(e.target.value)
                                }}
                                className='custom-dropdown'
                            >
                                <MenuItem className='ps-2' value="Group By" style={{ display: "none" }}>Group By</MenuItem>
                                <MenuItem className='ps-2' value=""><ClearIcon className='font-20 me-1' />Clear Groupby</MenuItem>
                                <MenuItem className='ps-2' value="Client"><PersonIcon className='font-20 me-1' />Client Name</MenuItem>
                                <MenuItem className='ps-2' value="EndDateTime"><CalendarMonthIcon className='font-20 me-1' />Due Date</MenuItem>
                                <MenuItem className='ps-2' value="Priority"><PriorityHighIcon className='font-20 me-1' />Priority</MenuItem>
                                <MenuItem className='ps-2' value="Section"><SpaceDashboardIcon className='font-20 me-1' />Section</MenuItem>
                                <MenuItem className='ps-2' value="CreationDate"><CalendarMonthIcon className='font-20 me-1' />Start Date</MenuItem>
                                <MenuItem className='ps-2' value="Subject"><SubjectIcon className='font-20 me-1' />Subject</MenuItem>
                            </Select>
                        </FormControl>

                        <ToggleButtonGroup className='ms-3' size='small'>
                            <ToggleButton value="left" aria-label="left aligned">
                                <DownloadIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>

                    </Box>
                </Box>


                <Box className='main-filter-box'>
                    {/* <Box className='row'> */}
                    {isLoading ? <Box className="custom-loader"><CustomLoader /></Box> : (<Box className='row'>

                        {

                            Object.keys(dataInGroup).length > 0 ? (<>
                                {Object.keys(dataInGroup).map((key) => {

                                    return <>
                                        <h4>{key == 1 ? "High" : key == 2 ? "Medium" : key}</h4>

                                        {dataInGroup[key].length > 0 && dataInGroup[key].map((item, index) => {
                                            const arr = item.AssignedToID.split(",").filter(Boolean).map(Number);
                                            return <Box key={index} className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 d-flex'>
                                                <Box className='todo-list-box white-box relative w-100' onDoubleClick={() => handleClickOpen(item)}>

                                                    <Radio className={item.Priority === 1 ? 'text-red check-todo' : item.Priority === 2 ? 'text-green check-todo' : 'text-grey check-todo'} checked
                                                        sx={{
                                                            '&.Mui-checked': {
                                                                color: "secondary",
                                                            },
                                                        }}
                                                    />

                                                    <Typography variant='subtitle1 mb-4 d-block'><strong>Type:</strong> {item.Source}</Typography>

                                                    <Typography variant='h2' className='mb-2'>{item.Subject}</Typography>

                                                    <Box className='d-flex align-items-center justify-content-between'>
                                                        <Typography variant='subtitle1'><pan className='text-gray'>
                                                            {FiterAssinee(item.OwnerID)} <ArrowForwardIosIcon className='font-14' /> </pan>
                                                            {/* <a href='#'>Patrick</a>, */}
                                                            <a href='#'>{FilterAgs(item)}</a> <a href='#'> {arr.length > 2 && (<>
                                                                + {arr.length - 2}
                                                            </>)}</a></Typography>
                                                        <Typography variant='subtitle1 sembold'>{item["EndDateTime"] && startFormattingDate(item["EndDateTime"])}</Typography>
                                                    </Box>

                                                    <Box className='d-flex align-items-center justify-content-between'>
                                                        <Typography variant='subtitle1'>{item.Client}</Typography>
                                                        <Typography variant='subtitle1'>

                                                            <Box>
                                                                <Button
                                                                    id="basic-button"
                                                                    aria-controls={open ? 'basic-menu' : undefined}
                                                                    aria-haspopup="true"
                                                                    aria-expanded={open ? 'true' : undefined}
                                                                    onClick={handleClick}
                                                                    className='font-14'
                                                                    sx={{
                                                                        color: item.mstatus === "Completed" ? "green" : "primary"
                                                                    }}
                                                                >
                                                                    {item.mstatus}
                                                                </Button>
                                                                <Menu
                                                                    id="basic-menu"
                                                                    className='custom-dropdown'
                                                                    anchorEl={anchorEl}
                                                                    open={open}
                                                                    onClose={handleClose}
                                                                    MenuListProps={{
                                                                        'aria-labelledby': 'basic-button',
                                                                    }}
                                                                >
                                                                    <MenuItem onClick={handleClose}>High</MenuItem>
                                                                    <MenuItem onClick={handleClose}>Medium</MenuItem>
                                                                    <MenuItem onClick={handleClose}>Low</MenuItem>
                                                                </Menu>
                                                            </Box>

                                                        </Typography>
                                                    </Box>

                                                    <Box className='mt-2'>
                                                        <Button variant="text" className='btn-blue-2 me-2' onClick={() => MarkComplete(item)} >Mark Complete</Button>
                                                        <DateRangePicker initialSettings={{
                                                    singleDatePicker: true,
                                                    showDropdowns: true,
                                                    startDate: item["EndDateTime"],
                                                    minYear: 1901,
                                                    maxYear: 2100,
                                                }}
                                                onCallback={(start) => {
                                                    const date = start.format('YYYY/MM/DD');
                                                    Json_UpdateTaskField("EndDateTime",date,item);
                                                }}
                                                >
                                                    <Button variant="outlined" className='btn-outlin-2'>
                                                        Defer
                                                    </Button>
                                                </DateRangePicker>
                                                    </Box>

                                                </Box>
                                            </Box>
                                        })}
                                    </>
                                })}
                            </>) : (allTask.length > 0 ?
                                (allTask.slice(0, loadMore).map((item, index) => {
                                    const arr = item.AssignedToID.split(",").filter(Boolean).map(Number);
                                    return <Box key={index} className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 d-flex'>
                                        <Box className='todo-list-box white-box relative w-100' onDoubleClick={() => handleClickOpen(item)}>

                                            <Radio className={item.Priority === 1 ? 'text-red check-todo' : item.Priority === 2 ? 'text-green check-todo' : 'text-grey check-todo'} checked
                                                sx={{
                                                    '&.Mui-checked': {
                                                        color: "secondary",
                                                    },
                                                }}
                                            />

                                            <Typography variant='subtitle1 mb-4 d-block'><strong>Type:</strong> {item.Source}</Typography>

                                            <Typography variant='h2' className='mb-2'>{item.Subject}</Typography>

                                            <Box className='d-flex align-items-center justify-content-between'>
                                                <Typography variant='subtitle1'><pan className='text-gray'>
                                                    {FiterAssinee(item.OwnerID)} <ArrowForwardIosIcon className='font-14' /> </pan>
                                                    {/* <a href='#'>Patrick</a>, */}
                                                    <a href='#'>{FilterAgs(item)}</a> <a href='#'> {arr.length > 2 && (<>
                                                        +{arr.length - 2}
                                                    </>)}</a></Typography>
                                                <Typography variant='subtitle1 sembold'>{item["EndDateTime"] && startFormattingDate(item["EndDateTime"])}</Typography>
                                            </Box>

                                            <Box className='d-flex align-items-center justify-content-between'>
                                                <Typography variant='subtitle1'>{item.Client}</Typography>
                                                <Typography variant='subtitle1'>

                                                    <Box>
                                                        <Button
                                                            id="basic-button"
                                                            aria-controls={open ? 'basic-menu' : undefined}
                                                            aria-haspopup="true"
                                                            aria-expanded={open ? 'true' : undefined}
                                                            onClick={handleClick}
                                                            className='font-14'
                                                            sx={{
                                                                color: item.mstatus === "Completed" ? "green" : "primary"
                                                            }}
                                                        >
                                                            {item.mstatus}
                                                        </Button>
                                                        <Menu
                                                            id="basic-menu"
                                                            className='custom-dropdown'
                                                            anchorEl={anchorEl}
                                                            open={open}
                                                            onClose={handleClose}
                                                            MenuListProps={{
                                                                'aria-labelledby': 'basic-button',
                                                            }}
                                                        >
                                                            <MenuItem onClick={handleClose}>High</MenuItem>
                                                            <MenuItem onClick={handleClose}>Medium</MenuItem>
                                                            <MenuItem onClick={handleClose}>Low</MenuItem>
                                                        </Menu>
                                                    </Box>

                                                </Typography>
                                            </Box>

                                            

                                            <Box className='mt-2'>
                                                <Button variant="text" className='btn-blue-2 me-2' onClick={() => MarkComplete(item)} >Mark Complete</Button>
                                                <DateRangePicker initialSettings={{
                                                    singleDatePicker: true,
                                                    showDropdowns: true,
                                                    startDate: item["EndDateTime"],
                                                    minYear: 1901,
                                                    maxYear: 2100,
                                                }}
                                                onCallback={(start) => {
                                                    const date = start.format('YYYY/MM/DD');
                                                    Json_UpdateTaskField("EndDateTime",date,item);
                                                }}
                                                >
                                                    <Button variant="outlined" className='btn-outlin-2'>
                                                        Defer
                                                    </Button>
                                                </DateRangePicker>
                                            </Box>

                                        </Box>
                                    </Box>
                                })) : (<DataNotFound />))
                        }

                        {/* statick box */}
                        {/* <Box className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 d-flex' onClick={handleClickOpenPortal}>
                            <Box className='todo-list-box white-box relative w-100'>

                                <Radio className='text-red check-todo' checked
                                    sx={{
                                        '&.Mui-checked': {
                                            color: "secondary",
                                        },
                                    }}
                                />

                                <Typography variant='subtitle1 mb-4 d-block'><strong>Type:</strong> Signature Tast</Typography>

                                <Typography variant='h2' className='mb-2'>Lorem ipsome dolor site</Typography>

                                <Box className='d-flex align-items-center justify-content-between'>
                                    <Typography variant='subtitle1'><pan className='text-gray'>
                                        You <ArrowForwardIosIcon className='font-14' /> </pan>
                                        <a href='#'>Patrick</a>,
                                        <a href='#'>Patrick</a> <a href='#'> +5</a></Typography>
                                    <Typography variant='subtitle1 sembold'>01/05/23</Typography>
                                </Box>

                                <Box className='d-flex align-items-center justify-content-between'>
                                    <Typography variant='subtitle1'>Docusoft india pvt ltd</Typography>
                                    <Typography variant='subtitle1'>

                                        <Box>
                                            <Button
                                                id="basic-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={handleClick}
                                            >
                                                priority
                                            </Button>
                                            <Menu
                                                id="basic-menu"
                                                className='custom-dropdown'
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}
                                            >
                                                <MenuItem onClick={handleClose}>High</MenuItem>
                                                <MenuItem onClick={handleClose}>Medium</MenuItem>
                                                <MenuItem onClick={handleClose}>Low</MenuItem>
                                            </Menu>
                                        </Box>

                                    </Typography>
                                </Box>

                                <Box className='mt-2'>
                                    <Button variant="text" className='btn-blue-2 me-2'>Action</Button>
                                    <Button variant="text" className='btn-blue-2'>Defer</Button>
                                </Box>

                            </Box>
                        </Box> */}
                        {/* col end */}
                    </Box>)}
                </Box>
            </Box >

            {/* modal */}

            <Dialog Dialog
                open={openPortal}
                onClose={handleClosePortal}
                aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className = 'custom-modal'
            sx = {{
                // maxWidth: 640,
                margin: '0 auto'
            }
            }
            >
            <Box className="d-flex align-items-center justify-content-between modal-head">
                <Box className="align-items-center d-flex">
                    <Checkbox
                        {...label}
                        icon={<PanoramaFishEyeIcon />}
                        // onChange={handleChangeStatus}
                        checkedIcon={<CheckCircleIcon />}
                        className="ps-0"
                    />
                    <Typography variant="h4" className='font-18 bold text-black mb-0'>
                        Portal Task
                    </Typography>
                </Box>

                {/*  */}

                <Box className='d-flex'>


                    <Box className='pe-2'>
                        <Button
                            id="basic-button"
                            aria-controls={open4 ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open4 ? 'true' : undefined}
                            onClick={handleClick4}
                            className="min-width-auto px-0 text-danger"
                        >

                            <ListItemIcon className="min-width-auto  me-2 text-secondary">
                                <PublishedWithChangesIcon fontSize="medium" />
                            </ListItemIcon>
                            <span className="text-secondary">Profile</span>

                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl4}
                            open={open4}
                            onClose={handleClose4}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose4} className="text-secondary">
                                <ListItemIcon>
                                    <DoNotDisturbAltIcon fontSize="medium" className="text-secondary" />
                                </ListItemIcon>
                                Not Started
                            </MenuItem>
                            <MenuItem onClick={handleClose4} className="text-primary">
                                <ListItemIcon>
                                    <PublishedWithChangesIcon fontSize="medium" className="text-primary" />
                                </ListItemIcon>
                                In Progress
                            </MenuItem>

                            <MenuItem onClick={handleClose4} className="text-primary">
                                <ListItemIcon>
                                    <HourglassBottomIcon fontSize="medium" className="text-primary" />
                                </ListItemIcon>
                                On Hold
                            </MenuItem>

                            <MenuItem onClick={handleClose4} className="text-success"><ListItemIcon>
                                <CheckCircleOutlineIcon fontSize="medium" className="text-success" />
                            </ListItemIcon>
                                Completed
                            </MenuItem>
                        </Menu>
                    </Box>

                    <Box className='clearfix'>
                        <Button
                            id="basic-button"
                            aria-controls={open3 ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open3 ? 'true' : undefined}
                            onClick={handleClick3}
                            className="min-width-auto px-0 text-gray"
                        >
                            <MoreVertIcon />
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl3}
                            open={open3}
                            onClose={handleClose3}
                            className='custom-dropdown'
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={handleClose3} className='ps-1'>
                                <ListItemIcon>
                                    <ContentCopyIcon fontSize="medium" />
                                </ListItemIcon> Copy Link</MenuItem>

                            <MenuItem onClick={handleClose3} className='ps-1'>
                                <ListItemIcon>
                                    <MergeIcon fontSize="medium" />
                                </ListItemIcon> Merge</MenuItem>

                            <MenuItem onClick={handleClose3} className='ps-1'>
                                <ListItemIcon>
                                    <AttachEmailIcon fontSize="medium" />
                                </ListItemIcon> Retract Message (s)</MenuItem>

                            <MenuItem onClick={handleClose3} className='ps-1'>
                                <ListItemIcon>
                                    <DeleteIcon fontSize="medium" />
                                </ListItemIcon> Delete Message (s)</MenuItem>
                        </Menu>
                    </Box>

                    <Button onClick={handleClosePortal} className='p-0'>
                        <span className="material-symbols-outlined text-black">
                            cancel
                        </span>
                    </Button>
                </Box>
            </Box>

            <DialogContent>
                <DialogContentText id="alert-dialog-description">


                    <PortalDetails></PortalDetails>

                </DialogContentText>
            </DialogContent>

        </Dialog >
        </>
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

const Layout = styled('div')`
  display: flex;
  flex-flow: column nowrap;
  gap: 4px;
`;

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

export default TodoList

// rfce