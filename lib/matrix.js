class Matrix {
    constructor(rows=1, cols=1) {
        this.rows = rows;
        this.cols = cols;
        this.data = new Array(rows);

        for (let i = 0; i < rows; i++) {
            this.data[i] = new Array(cols).fill(0);
        }

        return this;
    }

    static fromArray(arr) {
        return Matrix.map(new Matrix(arr.length,1),(_,i) => arr[i]);
    }

    static subtract(a, b) {
        return Matrix.map(new Matrix(a.rows,a.cols),(_,i,j) => a.data[i][j] - b.data[i][j]);
    }

    toArray() {
        return [].concat.apply([],this.data);
    }

    randomize() {
        this.map(() => Math.random() * 2 - 1);
        return this;
    }

    add(n) {
        if (n instanceof Matrix) {
            this.map((data,i,j) => data + n.data[i][j]);
        } else if(typeof n === 'number') {
            this.map((data,i,j) => data + n);
        }
        return this;
    }

    static transpose(matrix) {
        return Matrix.map(new Matrix(matrix.cols, matrix.rows),(_,i,j) => matrix.data[j][i]);
    }

    static multiply(a, b) {
        if (!(a instanceof Matrix && b instanceof Matrix))
            throw new Error('Matrix.multiply : Arguments must be Matrix object');
        if (a.cols !== b.rows)
            throw new Error('Matrix.multiply : Columns of A must match rows of B.');

        let result = new Matrix(a.rows, b.cols);
        result.map((_,i,j) => {
            let sum = 0;
            for(let k=0;k<a.cols;k++) sum += a.data[i][k] * b.data[k][j];
            return sum;
        });
        return result;
    }

    multiply(n) {
        if (n instanceof Matrix) {
            this.map((data,i,j) => data * n.data[i][j]);
        } else {
            this.map((data,i,j) => data * n);
        }
        return this;
    }

    map(func) {
        this.data.forEach((rows,i) => rows.forEach((data,j) => this.data[i][j] = func(data,i,j)));
        return this;
    }

    static map(matrix, func) {
        return new Matrix(matrix.rows, matrix.cols).map((_,i,j)=>func(matrix.data[i][j],i,j));
    }

    print() {
        console.table(this.data);
        return this;
    }
}
