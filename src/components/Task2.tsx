import {
    Box,
    Heading,
    HStack,
    List,
    ListItem,
    Table,
    TableCaption,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr, UnorderedList,
    VStack
} from "@chakra-ui/react";
import Plot from "react-plotly.js";
import {Data, Layout} from "plotly.js";
import {makePlot3D} from "../utils/makePlot";
import {paretoSer2D} from "../utils/paretoSet";
import React, {useEffect, useState} from "react";
import {transpose} from "../utils/arrayUtil";

export default function Task2() { // variant 7
    const f12 = (x: number, y: number) => x * x * x - y * y * y;//(-2 * x * x * x - 4 * x * x - 24 * x + 17) * (2 * y * y - 10 * y + 15);
    const f21 = (x: number, y: number) => x + y;//(3 * y * y - 18 * y * x - 33 * y - 12) * (x * x - 6 * x + 13);

    const f12Str = <>x<sup>3</sup> - y<sup>3</sup></>;
    const f21Str = 'x + y';

    const [xStep, yStep] = [0.01, 0.01];
    const [xMin, xMax] = [0, 4];
    const [yMin, yMax] = [0, 4];

    const [pareto, [f12St, f21St]] = paretoSer2D(xMin, xMax, yMin, yMax, f12, f21, xStep, yStep);

    const data12: Data = {
        ...makePlot3D(xMin, xMax, yMin, yMax, f12, xStep, yStep),
        name: 'f12',
    };
    const data12St: Data = {
        ...makePlot3D(xMin, xMax, yMin, yMax, (_x, _y) => f12St.val, xStep, yStep),
        name: 'f12*',
        showscale: false,
        opacity: 0.5
    };
    const data21: Data = {
        ...makePlot3D(xMin, xMax, yMin, yMax, f21, xStep, yStep),
        name: 'f21'
    };
    const data21St: Data = {
        ...makePlot3D(xMin, xMax, yMin, yMax, (_x, _y) => f21St.val, xStep, yStep),
        name: 'f21*',
        showscale: false,
        opacity: 0.5
    };

    const [width, setWidth] = useState<number>(window.innerWidth);
    window.addEventListener('resize', () => {
        setWidth(window.innerWidth);
    });

    const [layout, setLayout] = useState<Partial<Layout>>({
        scene: {
            aspectmode: 'manual',
            aspectratio: {
                x: (xMax - xMin) / Math.max(xMax - xMin, yMax - yMin),
                y: (yMax - yMin) / Math.max(xMax - xMin, yMax - yMin),
                z: 1
            },
            xaxis: {range: [xMin, xMax]},
            yaxis: {range: [yMin, yMax]},
        }
    });

    useEffect(() => {
        setLayout({
            width: 0.4 * width,
            height: 500,
            scene: {
                aspectmode: 'manual',
                aspectratio: {
                    x: (xMax - xMin) / Math.max(xMax - xMin, yMax - yMin),
                    y: (yMax - yMin) / Math.max(xMax - xMin, yMax - yMin),
                    z: 1
                },
                xaxis: {range: [xMin, xMax]},
                yaxis: {range: [yMin, yMax]},
            }
        })
    }, [width])

    const maxMinTable: Data[] = [{
        type: 'table',
        // @ts-ignore
        header: {
            values: [[''], ['x'], ['y'], ['f(x, y)']],
            align: 'center',
            line: {width: 1, color: 'gray'}
        },
        cells: {
            values: transpose([
                ['f12* = max_y(min_x(f(x, y)))', ...Object.values(f12St).map((val) => val.toFixed(3))],
                ['f21* = max_x(min_y(f(x, y)))', ...Object.values(f21St).map((val) => val.toFixed(3))]
            ])
        }
    }]

    return (<>
        <Heading>???????????????? 2</Heading>
        <VStack>
            <Table w={600}>
                <TableCaption placement='top'>??????????</TableCaption>
                <Thead>
                    <Tr>
                        <Th align='left'>f<sub>12</sub>(x, y)</Th>
                        <Th align='left'>f<sub>21</sub>(x, y)</Th>
                        <Th align='right'>x<sub>1</sub></Th>
                        <Th align='right'>x<sub>2</sub></Th>
                        <Th align='right'>y<sub>1</sub></Th>
                        <Th align='right'>y<sub>2</sub></Th>
                        <Th align='right'>???????? x</Th>
                        <Th align='right'>???????? y</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td align='left'>{f12Str}</Td>
                        <Td align='left'>{f21Str}</Td>
                        <Td align='right'>{xMin}</Td>
                        <Td align='right'>{xMax}</Td>
                        <Td align='right'>{yMin}</Td>
                        <Td align='right'>{yMax}</Td>
                        <Td align='right'>{xStep}</Td>
                        <Td align='right'>{yStep}</Td>
                    </Tr>
                </Tbody>
            </Table>
            <Box w={width * 0.7}>
                <Text>
                    <i>????????????:</i> ???????????? ?????????????????? ?????????????????????????????? ???????????????? ???????? ??????'??????????.
                    ?????????? ?????????????? ?????? ???????????? ?????????????? ??????????????: ??????'?????? 1 - f<sub>12</sub>(x, y),
                    ??????'?????? 2 - f<sub>21</sub>(x, y). ??????'???????? ?????????? ?????????????????? - ???????? ???? ???????????? ???? ???????????????? ??????????????,
                    ???? ???????????????????? ???????? ????????????.
                </Text>
                <Text><i>????????????????:</i> ????????????</Text>
                <UnorderedList alignSelf='left'>
                    <ListItem>
                        ???????????????????????? ?????????????????? f<sub>12</sub><sup>*</sup>, f<sub>21</sub><sup>*</sup> ?????????????? ??????'????????;
                    </ListItem>
                    <ListItem>
                        ?????????????? ???????????? ?? ??????????: f<sub>12</sub>(x, y) {'\u2265'} f<sub>12</sub><sup>*</sup>;
                        f<sub>21</sub>(x, y) {'\u2265'} f<sub>21</sub><sup>*</sup>
                    </ListItem>
                    <ListItem>
                        ???????????????????? ???????????????? x<sup>*</sup> ?? y<sup>*</sup>,
                        ???? ???????? ??<sub>i</sub> =|f<sub>i</sub>(x<sup>*</sup>, y<sup>*</sup>) - f<sub>i</sub><sup>*</sup>|
                        ?????????????? ???????????????????????? ???????????????? ?????0
                    </ListItem>
                </UnorderedList>
            </Box>
            <HStack>
                <Plot
                    data={[data12, data12St]}
                    layout={{
                        ...layout,
                        title: 'f12',
                        scene: {
                            ...layout.scene,
                            // zaxis: {range: [-39285, 0]}
                        }
                    }}
                />
                <Plot
                    data={[data21, data21St]}
                    layout={{
                        ...layout,
                        title: 'f21',
                        scene: {
                            ...layout.scene,
                            // zaxis: {range: [-28014, 0]}
                        }
                    }}
                />
            </HStack>
            <Plot
                data={maxMinTable}
                layout={{
                    width: width * 0.8 < 800 ? 800 : width * 0.8,
                    height: 310,
                    title: '?????????????????? ??????????????????'
                }}
            />
            <Plot
                data={[{
                    ...pareto,
                    colorscale: [[0, 'red'], [1, 'rgb(0,200,0)']]
                }]}
                layout={{
                    ...layout,
                    title: '?????????????? ????????????',
                }}
            />
            <Box w={width * 0.7}>
                <Text>?????????????????? ???????????????? x<sup>*</sup> ???? y<sup>*</sup>:</Text>
                <List>
                    <ListItem>
                        ??<sub>1</sub> = |{f12Str} - 0| = |{f12Str}| {'\u2265'} 0;
                    </ListItem>
                    <ListItem>
                        ??<sub>2</sub> = |{f21Str} - 4| {'\u2265'} 0;
                    </ListItem>
                    <ListItem>
                        max(??<sub>1</sub>, ??<sub>2</sub>) = 0;
                    </ListItem>
                    <ListItem>
                        |{f12Str}| = 0;
                    </ListItem>
                    <ListItem>
                        |{f21Str} - 4| = 0;
                    </ListItem>
                </List>
                <Text>
                    ?????????? ??????????, ???????????????????? ????????????????: x<sup>*</sup> = y<sup>*</sup> = 2
                </Text>
            </Box>
        </VStack>
    </>);
}