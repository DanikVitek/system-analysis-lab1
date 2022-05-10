import React from 'react';
import {VStack} from "@chakra-ui/react";
import Task1 from "./components/Task1";
import Task2 from "./components/Task2";

export default function App() {
    return (<>
        <VStack>
            <Task1/>
            <Task2/>
        </VStack>
    </>);
}
