import React, { useEffect, useState } from 'react';
import CommanCLS from '../../services/CommanService';
import DescriptionIcon from '@mui/icons-material/Description';
import DataGrid, {
    Column, FilterRow, Search, SearchPanel, Selection,
    HeaderFilter, Scrolling,
    FilterPanel,
    Pager, Paging, DataGridTypes,
} from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AppsIcon from '@mui/icons-material/Apps';
import ListIcon from '@mui/icons-material/List';


const Layout = styled('div')`  display: flex;
  flex-flow: column nowrap;  gap: 4px;
`;
const AutocompleteWrapper = styled('div')`  position: relative;
`;

const blue = {
    100: '#DAECFF',
    200: '#99CCF3', 400: '#3399FF',
    500: '#007FFF', 600: '#0072E5',
    700: '#0059B2', 900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2', 200: '#DAE2ED',
    300: '#C7D0DD', 400: '#B0B8C4',
    500: '#9DA8B7', 600: '#6B7A90',
    700: '#434D5B', 800: '#303740',
    900: '#1C2025',
};

const AutocompleteRoot = styled('div')(({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;  font-weight: 400;
  border-radius: 8px;  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'};
  display: flex;  gap: 5px;
  padding-right: 5px;  overflow: hidden;
  width: 320px;
  &.Mui-focused {    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};  }
  &:hover {
    border-color: ${blue[400]};  }
  &:focus-visible {
    outline: 0;
  }`,
);
const Input = styled('input')(
    ({ theme }) => `  font-size: 0.875rem;
  font-family: inherit;  font-weight: 400;
  line-height: 1.5;  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: inherit;  border: none;
  border-radius: inherit;  padding: 8px 12px;
  outline: 0;  flex: 1 0 auto;
`,);
const Listbox = styled('ul')(
    ({ theme }) => `  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;  box-sizing: border-box;
  padding: 6px;  margin: 12px 0;
  max-width: 320px;  border-radius: 12px;
  overflow: auto;  outline: 0px;
  max-height: 300px;  z-index: 1;
  position: absolute;  left: 0;
  right: 0;  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  box-shadow: 0px 4px 6px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'};
  `,);
const Option = styled('li')(
    ({ theme }) => `  list-style: none;
  padding: 8px;  border-radius: 8px;
  cursor: default;
  &:last-of-type {    border-bottom: none;
  }
  &:hover {    cursor: pointer;
  }
  &[aria-selected=true] {    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};  }
  &.base--focused,
  &.base--focusVisible {    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};  }
  &.base--focusVisible {
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};  }
  &[aria-selected=true].base--focused,
  &[aria-selected=true].base--focusVisible {    background-color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    color: ${theme.palette.mode === 'dark' ? blue[100] : blue[900]};  }
  `,);

export default function DocumentList({ clientId }) {
    const [agrno, setAgrNo] = useState(localStorage.getItem("agrno"));
    const [password, setPassword] = useState(localStorage.getItem("Password"));
    const [Email, setEmail] = useState(localStorage.getItem("Email"));
    const [folderId, setFolderId] = useState(localStorage.getItem("FolderId"));
    const baseUrl = "https://practicetest.docusoftweb.com/PracticeServices.asmx/";
    let Cls = new CommanCLS(baseUrl, agrno, Email, password);
    const [documents, setDocuments] = useState([]);
    const [groupedOptions, setgroupedOptions] = useState([]);
    const [toggleScreen, setToggleScreen] = useState(false);
    const [filteredDocResult, setFilteredDocResult] = useState([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [advFilteredResult, setAdvFilteredResult] = useState([]);
    const [fromDate, setFormDate] = useState("");
    const [toDate, setToDate] = useState("");

    const handleSearchOpen = (text) => {
        if(text==="InputSearch"){
            setIsSearchOpen(!isSearchOpen);
        }else{
            setIsSearchOpen(false);
        }
    }

    const Json_ExplorerSearchDoc = () => {
        try {
            let obj = {};
            obj.ProjectId = folderId;
            obj.ClientId = clientId;
            obj.sectionId = "-1";
            Cls.Json_ExplorerSearchDoc(obj, function (sts, data) {
                if (sts && data) {
                    console.log("ExplorerSearchDoc", JSON.parse(data));
                    let json = JSON.parse(data);
                    if (json.Table6) {
                        // let docs = json.Table6.length >= 100 ? json.Table6.slice(0, 80) : json.Table6;
                        let docs = json.Table6;
                        docs.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
                        //docs.map((itm)=>console.log("check in map",itm["Item Date"]));
                        setDocuments(docs);
                        let desc = docs.filter((item) => item.Description!=="");
                        // console.log("desc", desc);
                        setgroupedOptions(desc);
                    }
                }
            })
        } catch (error) {
            console.log("ExplorerSearchDoc", error)
        }
    }

    useEffect(() => {
        setAgrNo(localStorage.getItem("agrno"));
        setFolderId(localStorage.getItem("FolderId"));
        setPassword(localStorage.getItem("Password"));
        setEmail(localStorage.getItem("Email"));
        Json_ExplorerSearchDoc();
    }, []);
    const handleSearch = (text) => {
        if (documents.length > 0) {
            let filteredDocuments = documents.filter((item) => {
                return Object.entries(item).join("").toLowerCase().includes(text.toLowerCase());
            });
            setFilteredDocResult(filteredDocuments);
        }
    }
    
    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const month = date.getMonth() + 1; // January is 0, so add 1 to get the correct month
        const year = date.getFullYear();
        const paddedDay = day < 10 ? `0${day}` : day;
        const paddedMonth = month < 10 ? `0${month}` : month;
        return `${paddedDay}/${paddedMonth}/${year}`;
    }
    function getLastMonth() {
        const currentDate = new Date();
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
        const month = lastMonth.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastMonth.getFullYear();
        return month<10 ? `0${month}/${year}` : `${month}/${year}`;
    }
    function getLastSixMonthsDate() {
        const currentDate = new Date();
        const lastSixMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6);
        const month = lastSixMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastSixMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}` : `${month}/${year}`;
    }
    function getLastEighteenMonthsDate() {
        const currentDate = new Date();
        const lastEighteenMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 18);
        const month = lastEighteenMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastEighteenMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}` : `${month}/${year}`;
    }
    function getLastTwelveMonthsDate() {
        const currentDate = new Date();
        const lastTwelveMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 11);
        const month = lastTwelveMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastTwelveMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}` : `${month}/${year}`;
    }
    function getLastThreeMonthsDate() {
        const currentDate = new Date();
        const lastThreeMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3);
        const month = lastThreeMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastThreeMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}` : `${month}/${year}`;
    }
    function getLastDay() {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1);
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = currentDate.getFullYear();

        return day<10 && month<10? `0${day}/0${month}/${year}`: day<10 && month>=10 ? `0${day}/${month}/${year}`: day>=10 && month<10 ? `${day}/0${month}/${year}`: `${day}/${month}/${year}`;
    }

    function getLastWeek() {
        const currentDate = new Date();
        const sevenDaysAgoDate = new Date(currentDate);
        sevenDaysAgoDate.setDate(currentDate.getDate() - 7);

        const day = sevenDaysAgoDate.getDate();
        const month = sevenDaysAgoDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = sevenDaysAgoDate.getFullYear();

        return day<10 && month<10? `0${day}/0${month}/${year}`: day<10 && month>=10 ? `0${day}/${month}/${year}`: day>=10 && month<10 ? `${day}/0${month}/${year}`: `${day}/${month}/${year}`;
    }

    function getLast24Months() {
        const currentDate = new Date();
        const lastTwentyFourMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 24);
        const month = lastTwentyFourMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastTwentyFourMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}`: `${month}/${year}`;
    }
    
    function getLast30Months() {
        const currentDate = new Date();
        const lastTwentyFourMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 30);
        const month = lastTwentyFourMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastTwentyFourMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}`: `${month}/${year}`;
    }

    function getLast36Months() {
        const currentDate = new Date();
        const lastTwentyFourMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 36);
        const month = lastTwentyFourMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastTwentyFourMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}`: `${month}/${year}`;
    }
    
    function getLast42Months() {
        const currentDate = new Date();
        const lastTwentyFourMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 42);
        const month = lastTwentyFourMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastTwentyFourMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}`: `${month}/${year}`;
    }

    function getLast48Months() {
        const currentDate = new Date();
        const lastTwentyFourMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 48);
        const month = lastTwentyFourMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastTwentyFourMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}`: `${month}/${year}`;
    }
    function getLast54Months() {
        const currentDate = new Date();
        const lastTwentyFourMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 54);
        const month = lastTwentyFourMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastTwentyFourMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}`: `${month}/${year}`;
    }
    function getLast60Months() {
        const currentDate = new Date();
        const lastTwentyFourMonthsDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 60);
        const month = lastTwentyFourMonthsDate.getMonth() + 1; // Adding 1 because January is represented as 0
        const year = lastTwentyFourMonthsDate.getFullYear();
        return month<10 ? `0${month}/${year}`: `${month}/${year}`;
    }
      
    const handleDocumentsFilter = (target) => {
        if(target==="LastMonth"){
            // console.log(getLastMonth().split("/"));
            let last = getLastMonth().split("/");
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                if(all[1]>=last[0] && all[2]===last[1]){
                    test.push(itm["Item Date"]);
                    return itm;
                }
            });
            // console.log("last indexed data of Last 3 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            setAdvFilteredResult(fltData);
        }else if(target==="LastSixMonth"){
            let last = getLastSixMonthsDate().split("/");
            // console.log(last);
            // if(isLastSixMonth === false){
            //     documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // }
            // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 6 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            // setIsLastSixMonth(true);
            setAdvFilteredResult(fltData);
        }else if(target==="Last18Month"){
            let last = getLastEighteenMonthsDate().split("/");
            // console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 18 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target==="Last12Month"){
            let last = getLastTwelveMonthsDate().split("/");
            // console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target==="LastThreeMonth"){
            let last = getLastThreeMonthsDate().split("/");
            // console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                // console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>last[1]){
                        //  console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm;
                    }
                }
            });
            // console.log("last indexed data of Last Three Months Filtered Result",test[test.length-1]);
            //console.log(test.length);
            // console.log(fltData.length);
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target==="LastDay"){
            let last = getLastDay().split("/");
            // console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                // console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[2]){
                    // if(all[2]>last[2]){
                    //     //  console.log("populated Data: ", itm["Item Date"]);
                    //      test.push(itm["Item Date"])
                    //     return itm;
                    // }else if(all[1]>=last[1]){
                    //     test.push(itm["Item Date"])
                    //     return itm;
                    // }
                    if(all[1]>=last[1]){
                        if(all[0]>=last[0]){
                            test.push(itm["Item Date"])
                            return itm;
                        }
                    }
                }
            });
            // console.log("last indexed data of Last Three Months Filtered Result",test[test.length-1]);
            //console.log(test.length);
            // console.log(fltData.length);
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target === "LastWeek"){
            let last = getLastWeek().split("/");
            console.log(last);
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                // console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[2]){
                    // if(all[2]>last[2]){
                    //     //  console.log("populated Data: ", itm["Item Date"]);
                    //      test.push(itm["Item Date"])
                    //     return itm;
                    // }else if(all[1]>=last[1]){
                    //     test.push(itm["Item Date"])
                    //     return itm;
                    // }
                    if(all[1]>=last[1]){
                        if(all[0]>=last[0]){
                            test.push(itm["Item Date"])
                            return itm;
                        }
                    }
                }
            });
            // console.log("last indexed data of Last Three Months Filtered Result",test[test.length-1]);
            //console.log(test.length);
            // console.log(fltData.length);
            // fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target === "All"){
            setAdvFilteredResult([]);
        }else if(target === "Last24Months"){
            let last = getLast24Months().split("/");
            // console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>=last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            // fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target === "Last30Months"){
            let last = getLast30Months().split("/");
            // console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>=last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            // fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target === "Last36Months"){
            let last = getLast36Months().split("/");
            // console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>=last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target === "Last42Months"){
            let last = getLast42Months().split("/");
            console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>=last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target === "Last48Months"){
            let last = getLast48Months().split("/");
            console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>=last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target === "Last54Months"){
            let last = getLast54Months().split("/");
            console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>=last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }else if(target === "Last60Months"){
            let last = getLast60Months().split("/");
            console.log(last);
            // documents.map((itm)=>itm["Item Date"]=formatDate(itm["Item Date"]));
            // // documents.map((itm)=>console.log(itm["Item Date"]));
            let test = [];
            let fltData = documents.filter((itm)=>{
                let all = itm["Item Date"].split("/");
                //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
                if(all[2]>=last[1]){
                    if(all[2]>=last[1]){
                        // console.log("populated Data: ", itm["Item Date"]);
                         test.push(itm["Item Date"])
                        return itm;
                    }else if(all[1]>=last[0]){
                        test.push(itm["Item Date"])
                        return itm
                    }
                }
            });
            // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // console.log(test.length);
            // test.map((item)=>console.log(item));
            fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // console.log("fltDatat------",fltData);
            setAdvFilteredResult(fltData);
        }
    }

    const handleFilterByRange=()=>{
        let from = fromDate.split("-");
        let to = toDate.split("-");
        // console.log(from);
        // console.log(to);



        let formatFrom = `${from[2]}/${from[1]}/${from[0]}`;
        let formatTo = `${to[2]}/${to[1]}/${to[0]}`;

        const startDateParts = formatFrom.split('/');
        const endDateParts = formatTo.split('/');

        const startDate = new Date(startDateParts[2], startDateParts[1] - 1, startDateParts[0]); // -1 because months are 0-indexed
  const endDate = new Date(endDateParts[2], endDateParts[1] - 1, endDateParts[0]); // -1 because months are 0-indexed

  // Filter data array
  const filteredData = documents.filter(item => {
    // Parse item's docDate into a Date object
    const docDateParts = item["Item Date"].split('/');
    const docDate = new Date(docDateParts[2], docDateParts[1] - 1, docDateParts[0]); // -1 because months are 0-indexed

    // Return true if the docDate is within the range
    return docDate >= startDate && docDate <= endDate;
  });

   filteredData.map((itm)=>console.log(itm.Description,"---",itm["Item Date"]));
   setAdvFilteredResult(filteredData);




        // if(from[0]===to[0] && from[1]===to[1] && from[2]===to[2]){
        //     let fltData = documents.filter((itm)=>{
        //         let all = itm["Item Date"].split("/");
        //         if(all[0]===from[2] && all[1]===from[1] && all[2]===from[0]){
        //             return itm
        //         }
        //     });
        //     fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));
        // }else if(from[0]===to[0] && from[1]===to[1]){       // when both month and year are same like : 02/2024 and 02/2024
        //     if(from[2]>to[2]){
        //         let fltData = documents.filter((itm)=>{
        //             let all = itm["Item Date"].split("/");
        //             if(all[1]===from[1] && all[2]===from[0]){
        //                 if(all[0]<=from[2] && all[0]>=to[2]){
        //                     return itm;
        //                 }
        //             }
        //         });
        //         fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));
        //     }else if(to[2]>from[2]){
        //         let fltData = documents.filter((itm)=>{
        //             let all = itm["Item Date"].split("/");
        //             if(all[1]===to[1] && all[2]===to[0]){
        //                 if(all[0]<=to[2] && all[0]>=from[2]){
        //                     return itm;
        //                 }
        //             }
        //         });
        //         fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));
        //     }
        // }else if(from[0]===to[0]){              // when both years are same like 2024 and 2024
        //     if(from[1]>to[1] && from[2]>to[2]){
        //         let fltData = documents.filter((itm)=>{
        //             let all = itm["Item Date"].split("/");
        //             if(all[1]<=from[1] && all[1]>=to[1] && all[0]<=from[2] && all[0]>=to[2]){
        //                 return itm;
        //             }
        //         });
        //         fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));
        //     }else if(from[1]<to[1] && from[2]<to[2]){
        //         let fltData = documents.filter((itm)=>{
        //             let all = itm["Item Date"].split("/");
        //             if(all[1]>=from[1] && all[1]<=to[1] && all[0]>=from[2] && all[0]<=to[2]){
        //                 return itm;
        //             }
        //         });
        //         fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));
        //     }
        // }else if(from[0]>to[0]){
        //     if(to[1]>from[1] && to[2]>from[2]){
        //         let fltData = documents.filter((itm)=>{
        //             let all = itm["Item Date"].split("/");
        //             if(all[1]<=to[1] && all[0]<=to[2] && all[1]>=from[1] && all[0]>=from[2]){
        //                 return itm;
        //             }
        //         });
        //         fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));
        //     }
        // }


        
        //  -----  working code starts From : 09/03/2024. To: 08/01/2024
        // if(from[0]===to[0]){
        //     if(from[1]>=to[1]){
        //         if(from[2]>=to[1]){
        //             let fltData = documents.filter((itm)=>{
        //                 let all = itm["Item Date"].split("/");
        //                 if(all[2]===from[0] && from[1]>=all[1] && from[2]>=all[0] && to[2]<=all[0]){
        //                     return itm;
        //                 }
        //             });
        //             fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));
        //         }
        //     }
        // }
        // ------- working code end -------


        // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
        // console.log(test.length);
        // test.map((item)=>console.log(item));
        // fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

        // console.log("fltDatat------",fltData);
        // setAdvFilteredResult(fltData);
        
        // console.log("From : ",fromDate.split("-"));
        // console.log("To : ",toDate.split("-"));
        // let from = `${fromRawFormat[2]}/${fromRawFormat[1]}/${fromRawFormat[0]}`;
        // let to = `${toRawFormat[2]}/${toRawFormat[1]}/${toRawFormat[0]}`;
        // console.log(from,"-----",to);
            // let test = [];
            // let fltData = documents.filter((itm)=>{
            //     let all = itm["Item Date"].split("/");
            //     //console.log(all[1],"--",all[2],"-----",last[0],"--",last[1]);
            //     if(all[2]>=last[1]){
            //         if(all[2]>=last[1]){
            //             // console.log("populated Data: ", itm["Item Date"]);
            //              test.push(itm["Item Date"])
            //             return itm;
            //         }else if(all[1]>=last[0]){
            //             test.push(itm["Item Date"])
            //             return itm
            //         }
            //     }
            // });
            // // console.log("last indexed data of Last 12 Months Filtered Result",test[test.length-1]);
            // // console.log(test.length);
            // // test.map((item)=>console.log(item));
            // fltData.map((item)=>console.log(item.Description,"----",item["Item Date"]));

            // // console.log("fltDatat------",fltData);
            // setAdvFilteredResult(fltData);

    }
    function getRootProps(params) {}
    function getListboxProps(params) {}
    return (
        <>
            <div style={{ textAlign: "end" }}>{toggleScreen ? <AppsIcon onClick={() => setToggleScreen(!toggleScreen)} /> : <ListIcon onClick={() => setToggleScreen(!toggleScreen)} />}</div>

            {toggleScreen ?
                (documents.length > 0 && <DataGrid
                    id="dataGrid"
                    style={{ width: "1600px" }}
                    dataSource={documents}
                    columnAutoWidth={true}
                    showBorders={true}>
                    <Column dataField="Description" dataType="string" caption="Discount" />
                    <Column dataField="Section" dataType="string" caption="Section" />
                    <Column dataField="SubSection" dataType="string" caption="Sub" />
                    <Column dataField="Item Date" dataType="date" caption="Doc. Date" />
                    <Column dataField="Received Date" dataType="date" caption="Received Date" />
                    <Column dataField="Category" dataType="string" caption="Category" />
                    <Column dataField="Client" dataType="string" caption="Reference" />
                    <Column dataField="FileSize" dataType="string" caption="File Size" />
                    <FilterRow visible={true} />
                    <FilterPanel visible={true} />
                    <HeaderFilter visible={true} />
                    <Scrolling mode="standard" />
                    <Selection
                        mode="multiple"
                    />
                    <Paging defaultPageSize={20} />
                    <Pager
                        visible={true} />
                    <SearchPanel
                        visible={true}
                        width={240}
                        placeholder="Search..." />
                </DataGrid>) :
                (<><Layout>
                    <AutocompleteWrapper>
                        <AutocompleteRoot
                            sx={{
                                borderColor: '#D5D5D5',
                                color: 'success.main',
                            }}
                            {...getRootProps()}
                        // className={focused ? 'Mui-focused' : ''}
                        >
                            <span className="material-symbols-outlined search-icon">search</span>

                            <Input onClick={()=>handleSearchOpen("InputSearch")} onChange={(e) => handleSearch(e.target.value)} placeholder='Search' className='ps-0' />
                        </AutocompleteRoot>
                        {isSearchOpen ? (groupedOptions.length > 0 && (
                            <Listbox {...getListboxProps()}>
                                {filteredDocResult.length===0? groupedOptions.map((option, index) => (
                                    <Option onClick={handleSearchOpen}>{option.Description}</Option>
                                )):filteredDocResult.map((option, index) => (
                                    <Option onClick={handleSearchOpen}>{option.Description}</Option>
                                ))}
                            </Listbox>
                        )):""}
                    </AutocompleteWrapper>
                </Layout>

                <div>
                    <button onClick={()=>handleDocumentsFilter("LastMonth")}>LastMonth</button>
                    <button onClick={()=>handleDocumentsFilter("LastSixMonth")}>LastSixMonth</button>
                    <button onClick={()=>handleDocumentsFilter("Last18Month")}>Last18Month</button>
                    <button onClick={()=>handleDocumentsFilter("Last12Month")}>Last12Month</button>
                    <button onClick={()=>handleDocumentsFilter("LastThreeMonth")}>LastThreeMonth</button>
                    <button onClick={()=>handleDocumentsFilter("LastDay")}>LastDay</button>
                    <button onClick={()=>handleDocumentsFilter("LastWeek")}>LastWeek</button>
                    <button onClick={()=>handleDocumentsFilter("All")}>All</button>
                    <select onChange={(e)=>handleDocumentsFilter(e.target.value)}>
                        <option value=""></option>
                        <option value="Last24Months">Last 24 Months</option>
                        <option value="Last30Months">Last 30 Months</option>
                        <option value="Last36Months">Last 36 Months</option>
                        <option value="Last42Months">Last 42 Months</option>
                        <option value="Last48Months">Last 48 Months</option>
                        <option value="Last54Months">Last 54 Months</option>
                        <option value="Last60Months">Last 60 Months</option>
                    </select>
                    <div><input type='date' value={fromDate} onChange={(e)=>setFormDate(e.target.value)}/><input disabled={fromDate===""?true:false} min={fromDate} type='date'value={toDate} onChange={(e)=>setToDate(e.target.value)}/><button onClick={handleFilterByRange}>Search</button></div>
                </div>

                    <Box className='row'>
                        {advFilteredResult.length>0?(advFilteredResult.map((item) => {
                            return <Box className='col-xl-4 col-md-6'>
                                <Box className="file-uploads">
                                    <label className="file-uploads-label file-uploads-document">
                                        <Box className="d-flex align-items-center">
                                            <DescriptionIcon
                                                sx={{
                                                    fontSize: 32,
                                                }}
                                                className='me-2'
                                            />
                                            <Box className="upload-content pe-3">
                                                <Typography variant="h4" >
                                                    {item.Description ? item.Description : "Demo"}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {item["Item Date"] ? item["Item Date"] : ""} | {item["FileSize"] ? item["FileSize"] : ""}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </label>
                                </Box>
                                {/* file upload end */}
                            </Box>
                        })):(documents.length > 0 && documents.map((item) => {
                            return <Box className='col-xl-4 col-md-6'>
                                <Box className="file-uploads">
                                    <label className="file-uploads-label file-uploads-document">
                                        <Box className="d-flex align-items-center">
                                            <DescriptionIcon
                                                sx={{
                                                    fontSize: 32,
                                                }}
                                                className='me-2'
                                            />
                                            <Box className="upload-content pe-3">
                                                <Typography variant="h4" >
                                                    {item.Description ? item.Description : "Demo"}
                                                </Typography>
                                                <Typography variant="body1">
                                                    {item["Item Date"] ? formatDate(item["Item Date"]) : ""} | {item["FileSize"] ? item["FileSize"] : ""}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </label>
                                </Box>
                                {/* file upload end */}
                            </Box>
                        }))}
                    </Box></>)
            }




        </>
    );
}
