let mnist;
let train_image;

let train_index = 0;

//testing vars
let test_index = 0;
let total_test = 0;
let total_correct = 0;

let nn;

let user_digit;

function setup() {
    createCanvas(400,200).parent("container");

    user_digit = createGraphics(200,200);
    train_image = createImage(28,28);

    nn = new NeuralNetwork(784,16,16,10);

    loadMNIST((data) => {
        mnist = data;
    });
}

function train(show=false){
    let inputs = [];

    if(show) train_image.loadPixels();
    for(let i=0;i<784;i++){
        let bright = mnist.train_images[i + train_index * 784];
        inputs[i] = bright / 255;
        if(show){
            let index = i * 4;
            train_image.pixels[index + 0] = bright;
            train_image.pixels[index + 1] = bright;
            train_image.pixels[index + 2] = bright;
            train_image.pixels[index + 3] = 255;
        }
    }
    if(show){
        train_image.updatePixels();
        image(train_image,200,0,200,200);
    }

    // Neural network
    let label = mnist.train_labels[train_index];
    let targets = Array(10).fill(0);
    targets[label] = 1;

    let prediction = nn.predict(inputs);
    let guess = findMax(prediction);

    select('#label').html(label);
    select('#guess').html(guess);

    nn.train(inputs,targets);

    train_index = (train_index + 1) % mnist.train_labels.length;

    return train_image;
}

function testing(){
    let inputs = [];
    for(let i=0;i<784;i++){
        let bright = mnist.test_images[i + test_index * 784];
        inputs[i] = bright / 255;
    }
    let label = mnist.test_labels[test_index];

    let prediction = nn.predict(inputs);
    let guess = findMax(prediction);

    total_test++;

    if(guess == label){
        total_correct++;
    }

    let percent = total_correct * 100 / total_test;
    select("#percent").html(nf(percent,2,2));

    test_index++;
    if(test_index >= mnist.test_labels.length){
        test_index = 0;
        total_test = 0;
        total_correct = 0;
    }

}

function guessUserDigit(){
    let img = user_digit.get();
    let inputs = [];

    img.resize(28,28);
    img.loadPixels();
    for(let i=0;i<784;i++){
        inputs[i] = img.pixels[i * 4];
    }

    let prediction = nn.predict(inputs);
    let guess = findMax(prediction);

    select("#user_guess").html(guess);
}

function draw() {
    background(0);

    guessUserDigit();

    if(mnist && mnist.train_images){
        let total1 = 10;
        for(let i=0;i<total1;i++){
            train(i === total1 - 1);
        }
        let total2 = 10;
        for(let i=0;i<total2;i++){
            testing();
        }
    }

    image(user_digit,0,0);

    if(mouseIsPressed){
        user_digit.stroke(255);
        user_digit.strokeWeight(16);
        user_digit.line(mouseX,mouseY,pmouseX,pmouseY);
    }
}

function keyPressed(){
    if(key === ' '){
        clearUserGuess();
    }
}

function clearUserGuess(){
    user_digit.background(0);
}

function findMax(arr){
    let index = 0;
    for(let i=0;i<arr.length;i++){
        if(arr[i] > arr[index]){
            index = i;
        }
    }
    return index;
}
