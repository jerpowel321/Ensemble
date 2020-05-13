import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

export default class Piechart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            barChartData: props.data,
            title: props.title,
            yAxisText: props.yAxisText,
            plotLabel: props.plotLabel,
            categories: props.categories
        }
        this.getCategories()
    }
    getCategories() {
        let categories = []
        for (let i = 0; i < this.state.barChartData.length; i++) {
            categories.push(this.state.barChartData[i][0])
        }
        this.setState({
            categories: categories
        })
    }
    render() {
        let options = {

            chart: {
                type: 'pie'
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
                categories: this.state.categories
            },
            yAxis: {
                title: {
                    text: this.state.yAxisText
                }

            },
            tooltip: {
                headerFormat: '',
                clusterFormat: '',
                pointFormat: '{point.name}'
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: this.state.plotLabel
                    }
                },
                pie: {
                    showInLegend: true
                }
            },
            series: [
                {
                    name: "Category",
                    data: this.state.barChartData,
                    colorByPoint: true,
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


