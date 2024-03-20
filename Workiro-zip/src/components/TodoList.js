import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import user from "../images/user.jpg";
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CommanCLS from '../services/CommanService';

import { Radio } from '@mui/material';
import TaskDetailModal from './TaskDetailModal';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import DownloadIcon from '@mui/icons-material/Download';


function TodoList() {

    const [agrno, setAgrNo] = useState(localStorage.getItem("agrno"));
    const [password, setPassword] = useState(localStorage.getItem("Password"));
    const [Email, setEmail] = useState(localStorage.getItem("Email"));

    const [folderId, setFolderId] = useState(localStorage.getItem("FolderId"));
    const [userId,setUserId] = useState(localStorage.getItem("UserId"));




    const baseUrlPractice = "https://practicetest.docusoftweb.com/PracticeServices.asmx/";

    let Cls = new CommanCLS(baseUrlPractice, agrno, Email, password);
    //let Clsp = new CommanCLS(baseUrlPractice, agrno, Email, password);

    const [allTask, setAllTask] = useState([]);
    const [actualData,setActualData] = useState([]);
    const [selectedTask, setSelectedTask] = useState({});

    const [anchorEl, setAnchorEl] = React.useState(null);

    const [loadMore, setLoadMore] = useState(50);


    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const Json_CRM_GetOutlookTask = () => {
        let obj = {
            agrno: agrno,
            Email: Email,
            password: password
        };
        try {
            Cls.Json_CRM_GetOutlookTask(obj, (sts, data) => {
                if (sts) {
                    if (data) {
                        let json = JSON.parse(data);
                        console.log("Json_CRM_GetOutlookTask", json);
                        // let result = json.Table.filter((el)=>el.Source==="CRM");
                        let result = json.Table;
                        const formattedTasks = result.map((task) => {
                            let timestamp;
                            if (task.EndDateTime) {
                                timestamp = parseInt(task.EndDateTime.slice(6, -2));
                            }

                            const date = new Date(timestamp);

                            return { ...task, EndDateTime: date };
                        });

                        // setAllTask(formattedTasks.sort((a, b) => a.EndDateTime - b.EndDateTime));
                        
                        let tasks = formattedTasks.sort((a, b) => a.EndDateTime - b.EndDateTime);
                        let myTasks = tasks.filter((item)=>item.AssignedToID.split(",").includes(userId));
                        setActualData([...myTasks]);
                        setAllTask([...myTasks]);
                        // console.log("modified tasks: ",myTasks);
                        
                        // console.log("modified tasks",formattedTasks.sort((a, b) => a.EndDateTime - b.EndDateTime));
                        // setAllTask(json.Table);
                    }
                }
            });
        } catch (err) {
            console.log("Error while calling Json_CRM_GetOutlookTask", err);
        }
    }

    const [isApi, setIsApi] = useState(false);


    const eventHandler = (e) => {
        if (window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight) {
            setLoadMore((preValue) => preValue + 50);
        }
    }

    useEffect(() => {
        Json_CRM_GetOutlookTask();
        window.addEventListener('scroll', eventHandler)
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

    useEffect(() => {
        setAgrNo(localStorage.getItem("agrno"));
        setFolderId(localStorage.getItem("FolderId"));
        setPassword(localStorage.getItem("Password"));
        setEmail(localStorage.getItem("Email"));
        setUserId(localStorage.getItem("UserId"));
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



    return (
        <Box className="container-fluid p-0">
            <TaskDetailModal setIsApi={setIsApi} isApi={isApi} selectedTask={selectedTask} setOpen={setOpen} openModal={openModal}></TaskDetailModal>

            <Box className='d-flex main-search-box mb-3 align-items-center justify-content-between'>
                <Box className='d-flex align-items-center'>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={top100Films}
                        sx={{ width: 230 }}
                        size='small'
                        renderInput={(params) => <TextField sx={{ fontSize: 14 }} {...params} label="Subject" className='font-14' />}
                    />

                    <FormControl size="small" className='select-border ms-3'>
                        {/* <InputLabel id="demo-simple-select-label">Folder</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Folder"
                            onChange={handleChange}
                            className='custom-dropdown'
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" className='select-border ms-3'>
                        {/* <InputLabel id="demo-simple-select-label">Type</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Type"
                            onChange={handleChange}
                            className='custom-dropdown'

                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small" className='select-border ms-3'>
                        {/* <InputLabel id="demo-simple-select-label">Status</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Status"
                            onChange={handleChange}
                            className='custom-dropdown'

                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box className='d-flex align-items-center'>
                    <FormControl size="small" className='select-border ms-3'>
                        {/* <InputLabel id="demo-simple-select-label">Group By</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Group By"
                            onChange={handleChange}
                            className='custom-dropdown'

                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl size="small" className='select-border ms-3'>
                        {/* <InputLabel id="demo-simple-select-label">Sort By</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={age}
                            label="Sort By"
                            onChange={handleChange}
                            className='custom-dropdown'

                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>

                    </FormControl>


                    <ToggleButtonGroup className='ms-3' size='small'>
                        <ToggleButton value="left" aria-label="left aligned">
                            <DownloadIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>


                    
                </Box>
            </Box>

            <Box className='main-filter-box mt-1'>
                <Box className='row'>
                    {
                        allTask.length > 0 &&
                        allTask.slice(0, loadMore).map((item, index) => {
                            return <Box key={index} className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 d-flex'>
                                <Box className='todo-list-box white-box relative w-100' onClick={() => handleClickOpen(item)}>

                                    {/* <Checkbox className='text-blue check-todo'
                                    {...label}
                                    icon={<RadioButtonUncheckedIcon />}
                                    checkedIcon={<CheckCircleIcon />}
                                /> */}
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
                                            {item.UserName} <ArrowForwardIosIcon className='font-14' /> </pan>
                                            {/* <a href='#'>Patrick</a>, */}
                                            <a href='#'>{item["Forwarded By"]}</a> <a href='#'> +1</a></Typography>
                                        <Typography variant='subtitle1 sembold'>{startFormattingDate(item["EndDateTime"])}</Typography>
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
                                                >
                                                    {item.Status && item.Status}
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
                                        <Button variant="text" className='btn-blue-2 me-2'>Mark Complete</Button>
                                        <Button variant="outlined">Defer</Button>
                                    </Box>

                                </Box>
                            </Box>
                        })
                    }

                    {/* <Box className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 d-flex'>
                    <Box className='todo-list-box white-box relative w-100'>

                        <Checkbox className='text-blue check-todo'
                            {...label}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                        />

                        <Typography variant='subtitle1 mb-4 d-block'><strong>Type:</strong> Signature Tast</Typography>

                        <Typography variant='h2' className='mb-2'>Lorem ipsome dolor site</Typography>

                        <Box className='d-flex align-items-center justify-content-between'>
                            <Typography variant='subtitle1'><pan className='text-gray'>
                                You <ArrowForwardIosIcon className='font-14' /> </pan>
                                {/* <a href='#'>Patrick</a>, 
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


                    {/* <Box className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 d-flex'>
                    <Box className='todo-list-box white-box relative w-100'>

                        <Checkbox className='text-blue check-todo'
                            {...label}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                        />

                        <Typography variant='subtitle1 mb-4 d-block'><strong>Type:</strong> Signature Tast</Typography>

                        <Typography variant='h2' className='mb-2'>Lorem ipsome dolor site</Typography>

                        <Box className='d-flex align-items-center justify-content-between'>
                            <Typography variant='subtitle1'><pan className='text-gray'>
                                You <ArrowForwardIosIcon className='font-14' /> </pan>
                                {/* <a href='#'>Patrick</a>, 
                                <a href='#'>Patrick</a> <a href='#'> +6</a></Typography>
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


                    {/* <Box className='col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 d-flex'>
                    <Box className='todo-list-box white-box relative w-100'>

                        <Checkbox className='text-blue check-todo'
                            {...label}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleIcon />}
                        />

                        <Typography variant='subtitle1 mb-4 d-block'><strong>Type:</strong> Signature Tast</Typography>

                        <Typography variant='h2' className='mb-2'>Lorem ipsome dolor site</Typography>

                        <Box className='d-flex align-items-center justify-content-between'>
                            <Typography variant='subtitle1'><pan className='text-gray'>
                                You <ArrowForwardIosIcon className='font-14' /> </pan>
                                {/* <a href='#'>Patrick</a>,
                                <a href='#'>Patrick</a> <a href='#'> +2</a></Typography>
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

                </Box>
            </Box>
        </Box>
    )
}

export default TodoList

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { label: 'Subject 1' },
    { label: 'Subject 2' },
    { label: 'Subject 3' },
    { label: 'Subject 4' },
    { label: 'Subject 5' },
    { label: 'Subject 6' },
];

// rfce