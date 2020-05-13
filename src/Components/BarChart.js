import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default class Barchart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            barChartData: props.data,
            title: props.title,
            yAxisText: props.yAxisText,
            plotLabel: props.plotLabel
        }
    }

    render() {
        let options = {
            colors: ['#00c590'],
            chart: {
                type: 'column',
            },
            title: {
                text: this.state.title
            },
            accessibility: {
                announceNewData: {
                    enabled: true
                }
            },
            xAxis: {
                categories: [this.state.barChartData[0][2], this.state.barChartData[1][2], this.state.barChartData[2][2], this.state.barChartData[3][2], this.state.barChartData[4][2], this.state.barChartData[5][2], this.state.barChartData[6][2], this.state.barChartData[7][2], this.state.barChartData[8][2], this.state.barChartData[9][2]],
            },
            yAxis: {
                title: {
                    text: this.state.yAxisText
                }

            },
            tooltip: {
                headerFormat: '',
                clusterFormat: '',
                pointFormat: 'Alarm Code: {point.name}'
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: this.state.plotLabel
                    }
                },
            },
            series: [
                {
                    name: "Alarm Codes",
                    data: this.state.barChartData,
                },

            ],
        }
        return (
            <div >
                <p>{this.props.name}</p>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                />
            </div>
        )
    }
}

