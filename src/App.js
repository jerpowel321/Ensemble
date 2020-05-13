import React from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-enterprise';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { FormControl, Select, MenuItem, Grid, } from '@material-ui/core';
import Navbar from './Components/Navbar';
import Barchart from './Components/BarChart';
import Piechart from './Components/PieChart';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#004159'
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmSelected: true,
      durationSelected: true,
      selectedState: "Minneapolis",
      selectedFilter: "Select Filter",
      device_data: null,
      fault_data: null,
      mergeData: null,
      barChartData: null,
      pieChartData: null,
      updateChart: false,
      chartTitle: "",
      columnDefs: [
        {
          headerName: 'Turbine',
          field: 'device_name',
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['contains', 'notContains'],
            debounceMs: 0,
            caseSensitive: false,
            suppressAndOrCondition: true,
          },
        },
        {
          headerName: 'Date and Time',
          field: 'time_stamp',
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['contains', 'notContains'],
            debounceMs: 0,
            caseSensitive: false,
            suppressAndOrCondition: true,
          },
        },
        {
          headerName: 'Duration of Alarm',
          field: 'duration_string',
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['contains', 'notContains'],
            debounceMs: 0,
            caseSensitive: false,
            suppressAndOrCondition: true,
          },
        },
        {
          headerName: 'Category',
          field: 'category',
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['contains', 'notContains'],
            debounceMs: 0,
            caseSensitive: false,
            suppressAndOrCondition: true,
          },
        },
        {
          headerName: 'Alarm Code',
          field: 'code',
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['contains', 'notContains'],
            debounceMs: 0,
            caseSensitive: false,
            suppressAndOrCondition: true,
          },
        },
        {
          headerName: 'Description',
          field: 'description',
          sortable: true,
          filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['contains', 'notContains'],
            debounceMs: 0,
            caseSensitive: false,
            suppressAndOrCondition: true,
          },
        },
        {
          headerName: 'Notes', field: 'notes', sortable: true, filter: 'agTextColumnFilter',
          filterParams: {
            filterOptions: ['contains', 'notContains'],
            debounceMs: 0,
            caseSensitive: false,
            suppressAndOrCondition: true,
          },
        },
      ],
      defaultColDef: {
        flex: 1,
        sortable: true,
        filter: true,
        floatingFilter: true,
      },
      rowData: null,

    }
    this.handleChange = this.handleChange.bind(this);
  }

  buttonClick = (event) => {
    let { name } = event.target;
    this.setState({
      [name]: !this.state[name],
      updateChart: false,
    }, () => {
      this.showData(this.state.mergeData, this.state.selectedState)
    });
  }

  componentDidMount() {
    fetch('./data/device.json')
      .then(res => res.json())
      .then(device => this.setState({ device_data: device }))
      .catch(err => console.log(err));
    fetch('./data/fault.json')
      .then((res) => res.json())
      .then((faultData) => {
        this.setState(
          { fault_data: faultData },
          () => this.decorateData())
      })
      .catch(err => console.log(err));
  }

  decorateData = () => {
    let mergeData = [];
    for (let i = 0; i < this.state.fault_data.length; i++) {
      for (let j = 0; j < this.state.device_data.length; j++) {
        mergeData[i] = this.state.fault_data[i];
        mergeData[i]['duration_string'] = this.getDurationString(this.state.fault_data[i]['duration_seconds'])
        let device_id = this.state.fault_data[i]['device_id'];
        if (this.state.device_data[j]['id'] === device_id) {
          mergeData[i]['asset'] = this.state.device_data[j]['asset'];
          mergeData[i]['device_name'] = this.state.device_data[j]['device_name'];
        }
      }
    }
    this.setState({
      mergeData: mergeData
    })
    this.showData(mergeData, this.state.selectedState)
  }

  showData(data, state) {
    let filteredData = []
    for (let i = 0; i < data.length; i++) {
      if (state === "All") {
        filteredData.push(data[i])
      }
      else if (data[i]['asset'] === state) {
        filteredData.push(data[i])
      }
    }
    this.setState({
      rowData: filteredData
    }, () => {
      if (this.state.alarmSelected === true && this.state.durationSelected === true) {
        this.showAlarmCodesDuration();
      }
      else if (this.state.alarmSelected === true && this.state.durationSelected === false) {
        this.showAlarmCodesFrequency();
      }
      else if (this.state.alarmSelected === false && this.state.durationSelected === true) {
        this.showCategoryDuration();
      }
      else if (this.state.alarmSelected === false && this.state.durationSelected === false) {
        this.showCategoryFrequency();
      }
    });

  }

  showCategoryFrequency() {
    let dataPoints = new Map();
    for (let i = 0; i < this.state.rowData.length; i++) {
      let category = "";
      if (this.state.rowData[i]["category"] === "") {
        category = "Other";
      } else {
        category = this.state.rowData[i]["category"];
      }
      if (dataPoints.has(category) === false) {
        dataPoints.set(category, 1)
      } else {
        // Otherwise sum the values for the time 
        let curVal = dataPoints.get(category)
        let newVal = curVal + 1
        dataPoints.set(category, newVal)
      }
    }
    let dataPoints2 = Array.from(dataPoints);
    this.setState({
      pieChartData: dataPoints2,
      updateChart: true,
      chartTitle: "Category by Frequency"
    })
  }
  showCategoryDuration() {
    let dataPoints = new Map();
    for (let i = 0; i < this.state.rowData.length; i++) {
      let category = "";
      if (this.state.rowData[i]["category"] === "") {
        category = "Other";
      } else {
        category = this.state.rowData[i]["category"];
      }
      if (dataPoints.has(category) === false) {
        dataPoints.set(category, (this.state.rowData[i]["duration_seconds"] / 3600))
      } else {
        // Otherwise sum the values for the time 
        let curVal = dataPoints.get(category)
        let newVal = curVal + (this.state.rowData[i]["duration_seconds"] / 3600)
        dataPoints.set(category, newVal)
      }
    }
    let dataPoints2 = Array.from(dataPoints);
    this.setState({
      pieChartData: dataPoints2,
      updateChart: true,
      chartTitle: "Category by Duration (hrs) "
    })
  }

  showAlarmCodesFrequency() {
    let dataPoints = new Map();
    for (let i = 0; i < this.state.rowData.length; i++) {
      let code = this.state.rowData[i]["code"]
      if (dataPoints.has(code) === false) {
        dataPoints.set(code, 1)
      } else {
        // Otherwise sum the values for the time 
        let curVal = dataPoints.get(code)
        let newVal = curVal + 1
        dataPoints.set(code, newVal)
      }
    }
    dataPoints = new Map([...dataPoints.entries()].sort((a, b) => b[1] - a[1]));
    let truncatedDataPoints = [];
    let mapIter = dataPoints.entries()
    for (let j = 0; j < 10; j++) {
      let data = mapIter.next();
      let code = data.value[0];
      let description = "";
      for (let i = 0; i < this.state.rowData.length; i++) {
        if (code === this.state.rowData[i]["code"]) {
          description = this.state.rowData[i]["description"]
        }
      }
      truncatedDataPoints.push([code.toString(), data.value[1], description]);
    }
    this.setState({
      barChartData: truncatedDataPoints,
      updateChart: true,
      chartTitle: "Top 10 Alarms Codes by Frequency"
    })
  }

  showAlarmCodesDuration() {
    let dataPoints = new Map();
    for (let i = 0; i < this.state.rowData.length; i++) {
      let code = this.state.rowData[i]["code"]
      if (dataPoints.has(code) === false) {
        dataPoints.set(code, this.state.rowData[i]["duration_seconds"])
      } else {
        // Otherwise sum the values for the time 
        let curVal = dataPoints.get(code)
        let newVal = curVal + this.state.rowData[i]["duration_seconds"]
        dataPoints.set(code, newVal)
      }
    }
    dataPoints = new Map([...dataPoints.entries()].sort((a, b) => b[1] - a[1]));
    let truncatedDataPoints = [];
    let mapIter = dataPoints.entries()
    for (let j = 0; j < 10; j++) {
      let data = mapIter.next();
      let code = data.value[0];
      let description = "";
      for (let i = 0; i < this.state.rowData.length; i++) {
        if (code === this.state.rowData[i]["code"]) {
          description = this.state.rowData[i]["description"]
        }
      }
      truncatedDataPoints.push([code.toString(), (data.value[1] / 3600), description]);
    }
    this.setState({
      barChartData: truncatedDataPoints,
      updateChart: true,
      chartTitle: "Top 10 Alarms Codes by Duration (hrs) "
    })
  }

  getDurationString(seconds) {
    let hours, minutes, sec;
    let message = ""
    hours = Math.floor(seconds / 3600)
    minutes = Math.floor(seconds / 60) - (hours * 60);
    sec = (seconds - (hours * 3600) - (minutes * 60)).toFixed(2)
    if (hours > 0) {
      message += ` ${hours} hr,`
    }
    if (minutes > 0) {
      message += ` ${minutes} min,`
    }
    if (sec > 0) {
      message += ` ${sec} sec`
    }
    return message
  }

  handleChange = (event) => {
    this.setState({
      selectedState: event.target.value,
      updateChart: false
    });
    this.showData(this.state.mergeData, event.target.value)
  };

  getMenuItem() {
    let i
    return (
      <MenuItem value={i}>{i}</MenuItem>
    )
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Navbar />
        <h1 style={{ paddingTop: '40px', paddingBottom: '40px' }} align="center">{this.state.selectedState}{this.state.alarmSelected ? " Alarms" : " Alarm Categories"}{this.state.durationSelected ? " by Duration" : " by Frequency"}
        </h1>
        <div className="container">
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <span id="label"  >Location</span>
              <FormControl style={{ paddingRight: 10 }}>
                <Select
                  style={{ minWidth: 160 }}
                  id="select"
                  value={this.state.selectedState}
                  onChange={this.handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value="Minneapolis" >
                    <img style={{ width: '25px', verticalAlign: 'middle', paddingRight: '2px' }} src="https://img.icons8.com/color/48/000000/minnesota.png" alt="Minesota State" /> <span style={{ verticalAlign: 'middle' }}>Minneapolis</span>
                  </MenuItem>
                  <MenuItem value="All" >
                    <img style={{ width: '25px', verticalAlign: 'middle', paddingRight: '5px' }} src="https://img.icons8.com/dusk/64/000000/country.png" alt="Map with Location Pinpoint" /><span span style={{ verticalAlign: 'middle' }}>All Locations</span>
                  </MenuItem>
                  <MenuItem value="Colorado">
                    <img style={{ width: '25px', verticalAlign: 'middle', paddingRight: '5px' }} src="https://img.icons8.com/doodle/48/000000/grand-canyon.png" alt="Grand Canyon" /><span style={{ verticalAlign: 'middle' }}>Colorado</span>
                  </MenuItem>
                </Select>
              </FormControl>
              <button name="alarmSelected" value={!this.state.alarmSelected} className={this.state.alarmSelected ? "active hvr-icon-pulse" : "inactive hvr-icon-pulse"} onClick={(event) => this.buttonClick(event)}>Alarms<img className="hvr-icon" src="https://img.icons8.com/color/48/000000/alarm.png" alt="Alarm Clock" /></button>
              <button name="alarmSelected" value={this.state.alarmSelected} className={this.state.alarmSelected ? "inactive hvr-icon-pulse" : "active hvr-icon-pulse"} onClick={(event) => this.buttonClick(event)}>By Category <img className="hvr-icon" src="https://img.icons8.com/color/48/000000/tuning-fork.png" alt="Turning Fork" /></button>
              <button name="durationSelected" className={this.state.durationSelected ? "active hvr-icon-pulse" : "inactive hvr-icon-pulse"} onClick={(event) => this.buttonClick(event)}>Duration <img className="hvr-icon" src="https://img.icons8.com/dusk/64/000000/date-to.png" alt="Calendar" /></button>
              <button name="durationSelected" className={this.state.durationSelected ? "inactive hvr-icon-pulse" : "active hvr-icon-pulse"} onClick={(event) => this.buttonClick(event)}>Frequency<img className="hvr-icon" src="https://img.icons8.com/flat_round/64/000000/audio-wave-1.png" alt="Frequency Line Chart" /></button>
            </Grid>
          </Grid>
          <div id="chartContainer">
            {this.state.updateChart === true && this.state.alarmSelected === true && this.state.durationSelected === true ?
              <Barchart
                data={this.state.barChartData}
                title={this.state.chartTitle}
                yAxisText='Total Hours'
                plotLabel="{point.y:.1f} Hours" />
              : null
            }
            {this.state.updateChart === true && this.state.alarmSelected === false && this.state.durationSelected === true ?
              <Piechart
                data={this.state.pieChartData}
                title={this.state.chartTitle}
                yAxisText='Total Hours'
                plotLabel="{point.y:.1f} Hours"
              />
              : null
            }
            {this.state.updateChart === true && this.state.alarmSelected === true && this.state.durationSelected === false ?
              <Barchart
                data={this.state.barChartData}
                title={this.state.chartTitle}
                yAxisText='Total Frequency'
                plotLabel="{point.y} Occurrences" />
              :
              null}
            {this.state.updateChart === true && this.state.alarmSelected === false && this.state.durationSelected === false ?
              <Piechart
                data={this.state.pieChartData}
                title={this.state.chartTitle}
                yAxisText='Total Frequency'
                plotLabel="{point.y} Occurances"
              />
              : null
            }
          </div>
          <div className="ag-theme-balham"
            style={{
              width: '100%',
              height: 400
            }}>
            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              rowData={this.state.rowData}
              rowSelection='multiple'
            />
          </div>
        </div>
      </ThemeProvider >
    );
  }
}

export default App;
