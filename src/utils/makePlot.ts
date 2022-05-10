import {PlotData} from "plotly.js";

export function makePlot2D(xMin: number, xMax: number, f: (x: number) => number, xStep: number): Partial<PlotData> {
    const xs: number[] = [];
    const ys: number[] = [];
    for (let x = xMin; x <= xMax; x += xStep) {
        xs.push(x);
        ys.push(f(x));
    }

    return {
        x: xs,
        y: ys,
        type: 'scatter'
    };
}

export function makePlot3D(xMin: number, xMax: number,
                           yMin: number, yMax: number,
                           f: (x: number, y: number) => number,
                           xStep: number, yStep: number): Partial<PlotData> {
    const xs: number[] = [];
    const ys: number[] = [];
    let zs: number[][];

    let [minXY, minZ]: [[number, number], number] = [[NaN, NaN], Infinity];
    let [maxXY, maxZ]: [[number, number], number] = [[NaN, NaN], -Infinity];

    for (let x = xMin; x <= xMax; x += xStep) xs.push(x);
    for (let y = yMin; y <= yMax; y += yStep) ys.push(y);

    // console.log({
    //     xs: xs,
    //     ys: ys
    // })

    zs = new Array<number[]>(xs.length);
    for (let i = 0; i < xs.length; i++) {
        zs[i] = new Array<number>(ys.length);
        for (let j = 0; j < ys.length; j++) {
            const z = f(xs[i], ys[j]);
            if (z < minZ) {
                minZ = z;
                minXY = [xs[i], ys[j]];
            }
            if (z > maxZ) {
                maxZ = z;
                maxXY = [xs[i], ys[j]];
            }
            zs[i][j] = z;
        }
    }

    // console.log(zs);

    console.log({
        min: {
            x: minXY[0],
            y: minXY[1],
            z: minZ
        },
        max: {
            x: maxXY[0],
            y: maxXY[1],
            z: maxZ
        }
    });

    return {
        x: xs,
        y: ys,
        z: zs,
        type: 'surface'
    };
}