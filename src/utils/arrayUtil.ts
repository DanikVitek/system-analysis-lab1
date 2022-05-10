export function transpose<T>(matrix: T[][]) {
    const height = matrix.length;
    const width = matrix[0].length;
    if (!matrix.every((row) => row.length === width))
        throw new Error('matrix must have all rows the same length');
    const transposed = new Array<any[]>(width);
    for (let i = 0; i < width; i++) {
        transposed[i] = new Array<any>(height);
        for (let j = 0; j < height; j++) transposed[i][j] = matrix[j][i];
    }
    return transposed;
}