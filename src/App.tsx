import React from 'react';
import {Heading, Link, VStack} from "@chakra-ui/react";
import Task1 from "./components/Task1";
import Task2 from "./components/Task2";

export default function App() {
    return (<>
        <VStack>
            <Task1/>
            <Task2/>
            <Heading>
                <Link href='https://github.com/DanikVitek/system-analysis-lab1'>
                    Лістинг програми
                </Link>
            </Heading>
        </VStack>
    </>);
}
