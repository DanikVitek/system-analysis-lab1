import Plot from "react-plotly.js";
import React, {useState} from "react";
import bisectionRoot from "../utils/bisectionRoot";
import {Data, PlotData} from "plotly.js";
import {makePlot2D} from "../utils/makePlot";
import {paretoSet1D} from "../utils/paretoSet";
import {Box, Heading, Table, TableCaption, Tbody, Td, Text, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import {transpose} from "../utils/arrayUtil";

export default function Task1() {

    const [f1, f2] = [
        (x: number) => 20 + 6 * x - 3 * x * x,
        (x: number) => 9 * Math.log(x) + 9
    ];
    const [f1Str, f2Str] = [
        <>20 + 6x - 3x<sup>2</sup></>,
        '9ln(x) + 9'
    ]
    const [x1, x2] = [1, 5];
    const [f1St, f2St] = [20, 10];

    const [f1MaxX, f2MaxX] = [1, 5];
    const minYMaxY = [-25, Math.max(f1(f1MaxX), f2(f2MaxX))];
    const f1StRoot = bisectionRoot((x) => f1(x) - f1St, x1, x2);
    const f2StRoot = bisectionRoot((x) => f2(x) - f2St, x1, x2);

    const xStep = 0.001;

    const [resultTable, [maxMin, minMax]] = paretoSet1D(Math.min(f1StRoot, f2StRoot), Math.max(f1StRoot, f2StRoot), f1, f2, f1St, f2St, xStep);

    const f1Color = 'red';
    const f1Plot: Partial<PlotData> = {
        ...makePlot2D(x1, x2, f1, xStep),
        marker: {color: f1Color},
        name: 'f1'
    };
    const f2Color = 'green';
    const f2Plot: Partial<PlotData> = {
        ...makePlot2D(x1, x2, f2, xStep),
        marker: {color: f2Color},
        name: 'f2'
    };
    const f1Max: Partial<PlotData>[] = [
        {
            x: [f1MaxX],
            y: [f1(f1MaxX)],
            marker: {color: f1Color},
            mode: 'markers',
            name: 'f1 max'
        },
        {
            x: [f1MaxX, f1MaxX],
            y: minYMaxY,
            marker: {color: f1Color},
            line: {dash: 'dash'},
            mode: 'lines',
            name: 'f1 max'
        }
    ];
    const f2Max: Partial<PlotData>[] = [
        {
            x: [f2MaxX],
            y: [f2(f2MaxX)],
            marker: {color: f2Color},
            mode: 'markers',
            name: 'f2 max'
        },
        {
            x: [f2MaxX, f2MaxX],
            y: minYMaxY,
            marker: {color: f2Color},
            line: {dash: 'dash'},
            mode: 'lines',
            name: 'f2 max'
        }
    ];
    const f1StPlot: Partial<PlotData> = {
        x: [x1, x2],
        y: [f1St, f1St],
        marker: {color: f1Color},
        line: {dash: 'dashdot'},
        mode: 'lines',
        name: 'f1*'
    }
    const f2StPlot: Partial<PlotData> = {
        x: [x1, x2],
        y: [f2St, f2St],
        marker: {color: f2Color},
        line: {dash: 'dashdot'},
        mode: 'lines',
        name: 'f2*'
    }

    const f1StRootPlot: Partial<PlotData>[] = [
        {
            x: [f1StRoot, f1StRoot],
            y: minYMaxY,
            marker: {color: 'blue'},
            line: {dash: 'dash'},
            mode: 'lines',
            name: 'корінь (f1(x) - f1*)'
        },
        {
            x: [f1StRoot],
            y: [f1St],
            marker: {color: 'blue'},
            mode: 'markers',
            name: 'f1(x) перетинає f1*'
        }
    ];
    const f2StRootPlot: Partial<PlotData>[] = [
        {
            x: [f2StRoot, f2StRoot],
            y: minYMaxY,
            marker: {color: 'blue'},
            line: {dash: 'dash'},
            mode: 'lines',
            name: 'корінь (f2(x) - f2*)'
        },
        {
            x: [f2StRoot],
            y: [f2St],
            marker: {color: 'blue'},
            mode: 'markers',
            name: 'f2(x) перетинає f2*'
        }
    ];

    const maxMinMinMaxPlot: Partial<PlotData>[] = [
        {
            x: [maxMin.x, maxMin.x],
            y: minYMaxY,
            marker: {color: 'blue'},
            line: {dash: 'dashdot'},
            mode: 'lines',
            name: 'max min'
        },
        {
            x: [minMax.x, minMax.x],
            y: minYMaxY,
            marker: {color: 'blue'},
            line: {dash: 'dashdot'},
            mode: 'lines',
            name: 'min max'
        }
    ];

    const algResultTable: Data[] = [{
        type: 'table',
        // @ts-ignore
        header: {
            values: [['x'], ['f1/f1*'], ['f2/f2*'], ['min(fi/fi*)'], ['max(fi/fi*)']],
            align: 'center',
            line: {width: 1, color: 'gray'}
        },
        cells: {
            values: transpose(resultTable.map((row) => Object.values(row).map((val) => val.toFixed(4))))
        }
    }];
    const maxMinMinMaxTable: Data[] = [{
        type: 'table',
        // @ts-ignore
        header: {
            values: [[''],['x'], ['f1/f1*'], ['f2/f2*'], ['min(fi/fi*)'], ['max(fi/fi*)']],
            align: 'center',
            line: {width: 1, color: 'gray'}
        },
        cells: {
            values: transpose([
                ['max(min(fi/fi*))', ...Object.values(maxMin).map((val) => val.toFixed(4))],
                ['min(max(fi/fi*))', ...Object.values(minMax).map((val) => val.toFixed(4))]
            ])
        }
    }]

    const [width, setWidth] = useState<number>(window.innerWidth);
    const [height, setHeight] = useState<number>(window.innerHeight);
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    });

    return (<>
        <VStack>
            <Heading>Завдання 1</Heading>
            <Table w={500}>
                <TableCaption placement='top'>Умова</TableCaption>
                <Thead>
                    <Tr>
                        <Th align='left'>f<sub>1</sub>(x)</Th>
                        <Th align='left'>f<sub>2</sub>(x)</Th>
                        <Th align='right'>x<sub>1</sub></Th>
                        <Th align='right'>x<sub>2</sub></Th>
                        <Th align='right'>f<sub>1</sub><sup>*</sup></Th>
                        <Th align='right'>f<sub>2</sub><sup>*</sup></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td align='left'>{f1Str}</Td>
                        <Td align='left'>{f2Str}</Td>
                        <Td align='right'>{x1}</Td>
                        <Td align='right'>{x2}</Td>
                        <Td align='right'>{f1St}</Td>
                        <Td align='right'>{f2St}</Td>
                    </Tr>
                </Tbody>
            </Table>
            <Box w={0.7 * width}>
                <Text>
                    <i>Задано:</i> аналітичні залежності цільових функцій f<sub>1</sub>(x), f<sub>2</sub>(x) і порогові
                    обмеження f<sub>1</sub><sup>*</sup>, f<sub>2</sub><sup>*</sup>.
                </Text>
                <Text>
                    <i>Потрібно:</i> визначити множину Парето на заданому інтервалі [x<sub>1</sub>, x<sub>2</sub>],
                    якщо виконуються умови f<sub>1</sub>(x){'\u2265'}f<sub>1</sub><sup>*</sup>,
                    f<sub>2</sub>(x){'\u2265'}f<sub>2</sub><sup>*</sup>. Звузити множину Парето,
                    використовуючи прийоми (варіанти) технічних обмежень.<br/>
                    Розв'язуючи рівняння, всі обчислення виконати з точністю до 0.0001, у разі звуження інтервалів
                    значення меж округлити до 0.001 і крок сітки брати таким, що дорівнює 0.001.
                </Text>
            </Box>
            <Plot
                data={[
                    f1Plot, ...f1Max, f1StPlot,
                    f2Plot, ...f2Max, f2StPlot,
                    ...f1StRootPlot, ...f2StRootPlot,
                    ...maxMinMinMaxPlot
                ]}
                layout={{
                    width: width * 0.8,
                    height: height * 0.8,
                    title: 'Графіки'
                }}
            />
            <Plot
                data={algResultTable}
                layout={{
                    width: width * 0.8,
                    title: 'Результат алгоритму'
                }}
            />
            <Plot
                data={maxMinMinMaxTable}
                layout={{
                    width: width * 0.8,
                    title: 'Результат алгоритму'
                }}
            />
        </VStack>
    </>);
}