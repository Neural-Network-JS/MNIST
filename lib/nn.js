class NeuralNetwork {
    constructor(...nodes) { 
        this.weights = [];
        this.biases = [];
        this.layers = nodes.length-1;

        nodes.forEach((node,i,arr) => {
            if(i === 0) return;
            let weight = new Matrix(node,arr[i-1]).randomize();
            this.weights.push(weight);
            let bias = new Matrix(node,1).randomize();
            this.biases.push(bias);
        });

        this.learning_rate = 0.1;
    }

    predict(input_array) {
        // Convert input into Matrix
        let input = Matrix.fromArray(input_array);

        // Calculate output
        let output;
        this.weights.forEach((weight,i,arr) => {
            output = Matrix.multiply(weight,(i === 0) ? input : output);
            output.add(this.biases[i]);
            output.map(sigmoid);
        });

        // Sending back to the caller!
        return output.toArray();
    }

    train(input_array, target_array) {
        // Generating the Hidden Outputs
        let inputs = Matrix.fromArray(input_array);
        let targets = Matrix.fromArray(target_array);

        // Store all layers output
        let outputs = [];
        this.weights.forEach((weight,i,arr) => {
            let output = Matrix.multiply(weight,(i === 0) ? inputs : outputs[i-1]);
            output.add(this.biases[i]);
            output.map(sigmoid);
            outputs.push(output);
        });

        // Backpropagate and adjust the weights and biases
        let error = Matrix.subtract(targets,outputs[outputs.length-1]);
        for(let i=outputs.length-1;i>=0;i--){
            if(i < outputs.length-1){
                error = Matrix.multiply(Matrix.transpose(this.weights[i+1]),error);
            }

            let gradient = Matrix.map(outputs[i],dsigmoid);
            gradient.multiply(error);
            gradient.multiply(this.learning_rate);

            let delta = Matrix.multiply(gradient,Matrix.transpose((i === 0) ? inputs : outputs[i-1]));

            this.weights[i].add(delta);
            this.biases[i].add(gradient);
        }
    }

    print(){
        this.weights.forEach((weight,i) => {
            let wTable = weight.html();
            let bTable = this.biases[i].html();
            document.body.innerHTML += "<div class='side'>" + wTable + bTable + "</div><br>";
        });
        document.body.innerHTML += "<hr>";
    }
}

function sigmoid(x){
    return 1 / (1 + Math.exp(-x));
}

function dsigmoid(x){
    return x * (1 - x);
}