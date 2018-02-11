function loadMNIST(callback){
	let mnist = {};
	Promise.all([
		loadFile('t10k_images.ubyte',16),
		loadFile('train_images.ubyte',16),
		loadFile('train_labels.ubyte',8),
		loadFile('t10k_labels.ubyte',8)
	]).then(([
		test_images,
		train_images,
		train_labels,
		test_labels
	]) => {
		mnist.test_images = test_images;
		mnist.train_images = train_images;
		mnist.train_labels = train_labels;
		mnist.test_labels = test_labels;
	});
	callback(mnist);
}

async function loadFile(url,len){
	let data = await fetch('data/' + url).then(r => r.arrayBuffer());
	return new Uint8Array(data).slice(len);
}