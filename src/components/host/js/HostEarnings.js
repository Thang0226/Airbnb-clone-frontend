import {
    CButton ,
    CContainer ,
    CRow ,
    CCol ,
} from '@coreui/react';
import { useEffect, useState } from 'react'
import { BarChart } from '../../_fragments/BarChart'
import { getStyle } from '@coreui/utils'
import axiosConfig from '../../../services/axiosConfig'

export default function HostEarnings() {
    const hostUsername = localStorage.getItem('username');
    const dataInit = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September'],
        datasets: [
            {
                label: "Total income (VND)",
                backgroundColor: '#f87979',
                borderColor: '#f87979',
                data: [40, 20, 12, 39, 10, 40, 39, 80, 40],
            },
        ],
    }
    const optionsInit = {
        plugins: {
            legend: {
                labels: {
                    color: getStyle('--cui-body-color'),
                },
            },
        },
        scales: {
            x: {
                grid: {
                    color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                    color: "#FF385C",
                },
                type: 'category',
            },
            y: {
                grid: {
                    color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                    color: "#FF385C",
                },
                beginAtZero: true,
            },
        },
    }
    const [data, setData] = useState(dataInit);
    const [options, setOptions] = useState(optionsInit);

    const getLast12Months = () => {
        const months = [];
        const today = new Date();
        for (let i = 0; i < 12; i++) {
            const d = new Date(today);
            d.setMonth(today.getMonth() - i);
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            months.unshift(`${month}/${year}`); // use unshift to have months from past to present
        }
        return months;
    };

    const getLast5Years = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.unshift(currentYear - i);
        }
        return years;
    };

    useEffect(() => {
        document.title = 'Host | Earnings';
        getMonthIncome().catch(err => {console.log(err)});
    }, [hostUsername])

    const getMonthIncome = async () => {
        await axiosConfig.get(`/hosts/${hostUsername}/income-stats`)
          .then(res => {
              let monthValues = res.data;
              setData({
                  labels: getLast12Months(),
                  datasets: [
                      {
                          label: "Total income (VND)",
                          backgroundColor: '#f87979',
                          borderColor: '#f87979',
                          data: monthValues,
                      },
                  ],
                }
              );
          })
          .catch(err => {
              console.log(err);
          })
    }

    const getYearIncome = async () => {
        await axiosConfig.get(`/hosts/${hostUsername}/income-stats?period=year`)
          .then(res => {
              let yearValues = res.data;
              setData({
                    labels: getLast5Years(),
                    datasets: [
                        {
                            label: "Total income (VND)",
                            backgroundColor: '#f87979',
                            borderColor: '#f87979',
                            data: yearValues,
                        },
                    ],
                }
              );
          })
          .catch(err => {
              console.log(err);
          })
    }

    return (
        <>
            <CContainer className="py-2">
                <CRow className={"justify-content-between align-items-center"}>
                    <CCol md={6}>
                        <h3>Total income:</h3>
                    </CCol>
                </CRow>
                <CRow className={"align-items-center my-3"}>
                    <CCol md={2} className="d-grid align-items-center">
                        <CButton color="secondary" variant="outline" className="w-50 mb-4" onClick={() => getMonthIncome()}>
                            By Month
                        </CButton>
                        <CButton color="secondary" variant="outline" className="w-50" onClick={() => getYearIncome()}>
                            By Year
                        </CButton>
                    </CCol>
                    <CCol md={10}>
                        <BarChart data={data} options={options} />
                    </CCol>
                </CRow>
            </CContainer>
        </>
    )
}