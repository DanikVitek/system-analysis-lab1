import {PlotData} from "plotly.js";

export function paretoSet1D(x1: number, x2: number,
                            f1: (x: number) => number,
                            f2: (x: number) => number,
                            f1St: number, f2St: number,
                            xStep: number): [Table, [TableRow, TableRow]] {
    const f1Values: number[] = [];
    const f2Values: number[] = [];
    const fiMin: number[] = [];
    const fiMax: number[] = [];
    const xs: number[] = [];
    let i = 0;
    while (x1 < x2 + 0.0001) {
        f1Values.push(f1(x1) / f1St);
        f2Values.push(f2(x1) / f2St);
        fiMax.push(Math.max(f1Values[i], f2Values[i]));
        fiMin.push(Math.min(f1Values[i], f2Values[i]));
        xs.push(x1);
        x1 += xStep;
        i++;
    }
    if (!xs.includes(x2)) {
        f1Values.push(f1(x2) / f1St);
        f2Values.push(f2(x2) / f2St);
        fiMax.push(Math.max(f1Values[i], f2Values[i]));
        fiMin.push(Math.min(f1Values[i], f2Values[i]));
        xs.push(x2);
    }

    const table: Table = xs.map((x, i): TableRow => ({
        x: x,
        'f1/f1*': f1Values[i],
        'f2/f2*': f2Values[i],
        'min(fi/fi*)': fiMin[i],
        'max(fi/fi*)': fiMax[i],
    }));

    const minMax: TableRow = table.find((row) => row['max(fi/fi*)'] === Math.min(...fiMax))!;
    const maxMin: TableRow = table.find((row) => row['min(fi/fi*)'] === Math.max(...fiMin))!;

    // console.table(table);
    // console.table(minMax);
    // console.table(maxMin);

    return [table, [maxMin, minMax]];
}

export type Table = TableRow[];

export type TableRow = {
    x: number,
    'f1/f1*': number,
    'f2/f2*': number,
    'min(fi/fi*)': number,
    'max(fi/fi*)': number
}

export function paretoSer2D(x1: number, x2: number,
                            y1: number, y2: number,
                            f12: (x: number, y: number) => number,
                            f21: (x: number, y: number) => number,
                            // f12St: number, f21St: number,
                            xStep: number, yStep: number): [Partial<PlotData>, [fSt, fSt]] {
    const maxMin = (f: (x: number, y: number) => number): fSt => {
        const iter: fSt[] = [];
        for (let x = x1, minX = NaN; x < x2 + 0.001; x += xStep) {
            for (let y = y1,
                     minVal = Infinity,
                     minY = NaN;
                 y < y2 + 0.001; y += yStep) {
                const val = f(x, y);
                if (val < minVal) {
                    minX = x;
                    minY = y;
                    minVal = val;
                }
                iter.push({
                    x: minX,
                    y: minY,
                    val: minVal
                });
            }
        }

        let maxMin: fSt;
        let max = -Infinity;
        for (let i = 0; i < iter.length; i++) {
            if (iter[i].val > max) {
                maxMin = iter[i];
                max = maxMin.val;
            }
        }

        return maxMin!;
    }

    const [f12St, f21St] = [maxMin((x, y) => f12(y, x)), maxMin(f21)];

    const xs: number[] = [];
    const ys: number[] = [];
    const zs: number[][] = [];
    for (let i = 0, x = x1; x < x2 + 0.0001; i++, x += xStep) {
        xs[i] = x;
        zs[i] = new Array<number>();
        for (let j = 0, y = y1; y < y2 + 0.0001; j++, y += yStep) {
            ys[j] = y;
            zs[i][j] = f12(x, y) < f12St.val || f21(x, y) < f21St.val ? 0 : 1;
        }
    }

    const pareto: Partial<PlotData> = {
        type: 'heatmap',
        x: xs,
        y: ys,
        z: zs
    };

    return [pareto, [f12St, f21St]];
}

export type fSt = {
    x: number,
    y: number,
    val: number
}