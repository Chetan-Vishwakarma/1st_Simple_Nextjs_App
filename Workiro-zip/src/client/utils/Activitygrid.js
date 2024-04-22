import React, { useEffect, useState } from 'react';
import DataGrid, {
  Column, FilterRow, Search, SearchPanel, Selection,
  HeaderFilter, Scrolling,
  FilterPanel,
  Pager, Paging, DataGridTypes, FormGroup,
} from 'devextreme-react/data-grid';
import { Box, Typography, Button, Paper, Grid, TextField, Autocomplete } from '@mui/material';
import 'devextreme/dist/css/dx.light.css';
import CommanCLS from '../../services/CommanService';
export default function Activitygrid({selectedDocument,call_Json_GetAudit,getAudit,tempdatafilter}) {
  console.log('tempselectedDocumentsonam',tempdatafilter,"call_Json_GetAuditsonam",call_Json_GetAudit,"getAuditsonam",getAudit);
  const [dataNotFoundBoolean, setDataNotFoundBoolean] = useState(false);
  const [advFilteredResult, setAdvFilteredResult] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [agrno, setAgrNo] = useState(localStorage.getItem("agrno"));
  const [password, setPassword] = useState(localStorage.getItem("Password"));
  const [Email, setEmail] = useState(localStorage.getItem("Email"));
  const [folderId, setFolderId] = useState(localStorage.getItem("FolderId"));
  const baseUrl = "https://docusms.uk/dsdesktopwebservice.asmx/";// base url for api

  //   let dt = new LoginDetails();
  let cls = new CommanCLS(baseUrl, agrno, Email, password);
  useEffect(() => {
  
   
  }, [])
  return (
    <div><Box className=''>
    <DataGrid
        id="dataGrid"
        className='table-grid'
        // style={{ width: "100%" }}
        dataSource={tempdatafilter.length > 0 ? tempdatafilter : getAudit.length > 0 ? getAudit : []}
        keyExpr="Activity ID"
        columnAutoWidth={true}
        showBorders={true}>
        <Column dataField="Actioned Date" dataType="date" caption="Date"  format="M/d/yyyy, HH:mm" />
        <Column dataField="Comments" dataType="string" caption="Activity" />
        <Column dataField="ForwardedBy" dataType="string" caption="User" />
        {/* <Column dataField="Received Date" dataType="date" caption="Received Date" />
        <Column dataField="Category" dataType="string" caption="Category" />
        <Column dataField="Client" dataType="string" caption="Reference" />
        <Column dataField="FileSize" dataType="string" caption="File Size" /> */}
        {/* <FilterRow visible={true} /> */}
        {/* <FilterPanel visible={true} /> */}
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
    </DataGrid>
</Box></div>
  )
}
